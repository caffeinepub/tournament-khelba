import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)

actor {
  // Storage
  include MixinStorage();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let notifications = Map.empty<Principal, List.List<Notification>>();
  let referrals = Map.empty<Text, Referral>();
  let squads = Map.empty<Text, Squad>();
  let playerProfiles = Map.empty<Principal, PlayerProfile>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let tournaments = Map.empty<Nat, Tournament>();
  let payments = Map.empty<Nat, Payment>();

  // ID Management
  var nextId = 0;

  // Multi-Admin Registry
  // superAdmin is set to the deployer's principal at initialization via MixinAuthorization/init
  // We use a stable var that gets set on first deploy; migration preserves it.
  var superAdmin : ?Principal = null;
  let admins = Map.empty<Principal, ()>();

  // Super Admin Initialization (Automatic Self-Elevation)
  func ensureSuperAdminInitialized(caller : Principal) : () {
    switch (superAdmin) {
      case (null) {
        // No super admin yet — elevate first successful caller
        superAdmin := ?caller;
      };
      case (?_) {
        // Super admin already set — do nothing
        ();
      };
    };
  };

  // Helper: Check if principal is super admin
  func isSuperAdminInternal(principal : Principal) : Bool {
    ensureSuperAdminInitialized(principal);
    switch (superAdmin) {
      case (null) { false };
      case (?superAdmin) { principal == superAdmin };
    };
  };

  // Helper: Check if principal is admin (super admin or regular admin)
  func isAdminInternal(principal : Principal) : Bool {
    isSuperAdminInternal(principal) or admins.containsKey(principal);
  };

  // Helper: mask room credentials based on visibility window and caller role
  func maskRoomCredentials(tournament : Tournament, caller : Principal) : Tournament {
    // Admins always see full credentials
    if (isAdminInternal(caller)) {
      return tournament;
    };

    // Determine if the visibility window has opened
    let isVisible : Bool = switch (tournament.roomVisibilityMinutes) {
      case (null) {
        // No visibility window set — credentials are not visible to non-admins
        false;
      };
      case (?minutes) {
        let visibilityNanos : Int = minutes * 60 * 1_000_000_000;
        let visibilityOpenAt : Int = tournament.startDate - visibilityNanos;
        Time.now() >= visibilityOpenAt;
      };
    };

    if (isVisible) {
      tournament;
    } else {
      {
        tournament with
        roomId = null;
        roomPassword = null;
      };
    };
  };

  // Multi-Admin Registry Public Functions

  // getSuperAdmin: publicly readable — knowing who the super admin is is not sensitive
  public query func getSuperAdmin() : async ?Principal {
    superAdmin;
  };

  // getAdmins: publicly readable — admin list is not sensitive
  public query func getAdmins() : async [Principal] {
    admins.keys().toArray();
  };

  // addAdmin: only super admin can add admins
  public shared ({ caller }) func addAdmin(newAdmin : Principal) : async () {
    if (not isSuperAdminInternal(caller)) {
      Runtime.trap("Unauthorized: Only super admin can add admins");
    };
    admins.add(newAdmin, ());
  };

  // removeAdmin: only super admin can remove admins
  public shared ({ caller }) func removeAdmin(adminToRemove : Principal) : async () {
    if (not isSuperAdminInternal(caller)) {
      Runtime.trap("Unauthorized: Only super admin can remove admins");
    };
    admins.remove(adminToRemove);
  };

  // isAdmin: publicly queryable
  public query func isAdmin(principal : Principal) : async Bool {
    isAdminInternal(principal);
  };

  // isSuperAdmin: publicly queryable
  public query func isSuperAdmin(principal : Principal) : async Bool {
    isSuperAdminInternal(principal);
  };

  // Tournament Management

  public shared ({ caller }) func createTournament(
    name : Text,
    description : Text,
    startDate : Int,
    endDate : Int,
    entryFee : Nat,
    maxParticipants : Nat,
    prizePool : Nat,
    gameType : Text,
    roomId : ?Text,
    roomPassword : ?Text,
    roomVisibilityMinutes : ?Nat
  ) : async Nat {
    if (not isAdminInternal(caller)) {
      Runtime.trap("Unauthorized: Only admins can create tournaments");
    };

    let tournamentId = nextId;
    nextId += 1;

    let newTournament : Tournament = {
      id = tournamentId;
      name;
      description;
      startDate;
      endDate;
      entryFee;
      maxParticipants;
      prizePool;
      gameType;
      roomId;
      roomPassword;
      roomVisibilityMinutes;
    };

    tournaments.add(tournamentId, newTournament);
    tournamentId;
  };

  public shared ({ caller }) func updateTournament(update : TournamentUpdate) : async () {
    if (not isAdminInternal(caller)) {
      Runtime.trap("Unauthorized: Only admins can update tournaments");
    };

    switch (tournaments.get(update.id)) {
      case (null) {
        Runtime.trap("Tournament not found");
      };
      case (?existingTournament) {
        let updatedTournament : Tournament = {
          id = existingTournament.id;
          name = switch (update.name) {
            case (null) { existingTournament.name };
            case (?value) { value };
          };
          description = switch (update.description) {
            case (null) { existingTournament.description };
            case (?value) { value };
          };
          startDate = switch (update.startDate) {
            case (null) { existingTournament.startDate };
            case (?value) { value };
          };
          endDate = switch (update.endDate) {
            case (null) { existingTournament.endDate };
            case (?value) { value };
          };
          entryFee = switch (update.entryFee) {
            case (null) { existingTournament.entryFee };
            case (?value) { value };
          };
          maxParticipants = switch (update.maxParticipants) {
            case (null) { existingTournament.maxParticipants };
            case (?value) { value };
          };
          prizePool = switch (update.prizePool) {
            case (null) { existingTournament.prizePool };
            case (?value) { value };
          };
          gameType = switch (update.gameType) {
            case (null) { existingTournament.gameType };
            case (?value) { value };
          };
          roomId = switch (update.roomId) {
            case (null) { existingTournament.roomId };
            case (?value) { ?value };
          };
          roomPassword = switch (update.roomPassword) {
            case (null) { existingTournament.roomPassword };
            case (?value) { ?value };
          };
          roomVisibilityMinutes = switch (update.roomVisibilityMinutes) {
            case (null) { existingTournament.roomVisibilityMinutes };
            case (?value) { ?value };
          };
        };

        tournaments.add(update.id, updatedTournament);
      };
    };
  };

  // deleteOrCloseTournament: admin-only
  public shared ({ caller }) func deleteOrCloseTournament(id : Nat) : async () {
    if (not isAdminInternal(caller)) {
      Runtime.trap("Unauthorized: Only admins can delete or close tournaments");
    };

    if (not tournaments.containsKey(id)) {
      Runtime.trap("Tournament not found");
    };

    tournaments.remove(id);
  };

  // getTournament: public, but room credentials are masked based on visibility rules
  public shared ({ caller }) func getTournament(id : Nat) : async ?Tournament {
    switch (tournaments.get(id)) {
      case (null) { null };
      case (?tournament) {
        ?maskRoomCredentials(tournament, caller);
      };
    };
  };

  // listTournaments: public, but room credentials are masked based on visibility rules
  public shared ({ caller }) func listTournaments() : async [Tournament] {
    let all = tournaments.values().toArray();
    all.map(func(t) { maskRoomCredentials(t, caller) });
  };

  // setRoomCredentials: admin-only
  public shared ({ caller }) func setRoomCredentials(
    tournamentId : Nat,
    roomId : ?Text,
    roomPassword : ?Text,
    roomVisibilityMinutes : ?Nat
  ) : async () {
    if (not isAdminInternal(caller)) {
      Runtime.trap("Unauthorized: Only admins can set room credentials");
    };

    switch (tournaments.get(tournamentId)) {
      case (null) {
        Runtime.trap("Tournament not found");
      };
      case (?existingTournament) {
        let updatedTournament : Tournament = {
          existingTournament with
          roomId;
          roomPassword;
          roomVisibilityMinutes;
        };
        tournaments.add(tournamentId, updatedTournament);
      };
    };
  };

  // uploadResults: admin-only (placeholder for result upload logic)
  public shared ({ caller }) func uploadResults(tournamentId : Nat, results : Text) : async () {
    if (not isAdminInternal(caller)) {
      Runtime.trap("Unauthorized: Only admins can upload results");
    };

    if (not tournaments.containsKey(tournamentId)) {
      Runtime.trap("Tournament not found");
    };
    // Results upload logic would be implemented here
  };

  // Payment Management

  public shared ({ caller }) func submitPayment(tournamentId : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can submit payments");
    };

    if (not tournaments.containsKey(tournamentId)) {
      Runtime.trap("Tournament does not exist");
    };

    let paymentId = nextId;
    nextId += 1;

    let newPayment : Payment = {
      id = paymentId;
      tournamentId;
      playerPrincipal = caller;
      status = #pending;
      submittedAt = Time.now();
    };

    payments.add(paymentId, newPayment);
    paymentId;
  };

  public shared ({ caller }) func approvePayment(paymentId : Nat) : async () {
    if (not isAdminInternal(caller)) {
      Runtime.trap("Unauthorized: Only admins can approve payments");
    };

    switch (payments.get(paymentId)) {
      case (null) {
        Runtime.trap("Payment does not exist");
      };
      case (?payment) {
        let updatedPayment = { payment with status = #approved };
        payments.add(paymentId, updatedPayment);
      };
    };
  };

  public shared ({ caller }) func rejectPayment(paymentId : Nat) : async () {
    if (not isAdminInternal(caller)) {
      Runtime.trap("Unauthorized: Only admins can reject payments");
    };

    switch (payments.get(paymentId)) {
      case (null) {
        Runtime.trap("Payment does not exist");
      };
      case (?payment) {
        let updatedPayment = { payment with status = #rejected };
        payments.add(paymentId, updatedPayment);
      };
    };
  };

  public shared ({ caller }) func listPendingPayments() : async [Payment] {
    if (not isAdminInternal(caller)) {
      Runtime.trap("Unauthorized: Only admins can list pending payments");
    };

    let allPayments = payments.values().toArray();
    let filtered = allPayments.filter(
      func(p) {
        p.status == #pending;
      }
    );
    filtered;
  };

  public shared ({ caller }) func listPaymentsByTournament(tournamentId : Nat) : async [Payment] {
    if (not isAdminInternal(caller)) {
      Runtime.trap("Unauthorized: Only admins can list payments");
    };

    let allPayments = payments.values().toArray();
    let filtered = allPayments.filter(
      func(p) {
        p.tournamentId == tournamentId;
      }
    );
    filtered;
  };

  // User Profile Management

  public shared ({ caller }) func createProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create a profile");
    };
    if (userProfiles.containsKey(caller)) {
      Runtime.trap("Profile already exists for this principal");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getMyProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can read their own profile");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func updateProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update their own profile");
    };
    if (not userProfiles.containsKey(caller)) {
      Runtime.trap("Profile does not exist for this principal");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func deleteProfile() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete their own profile");
    };
    if (not userProfiles.containsKey(caller)) {
      Runtime.trap("Profile does not exist for this principal");
    };
    userProfiles.remove(caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their own profile");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save their own profile");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller) and not isAdminInternal(caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func isProfileComplete() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check profile completeness");
    };
    switch (playerProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        let hasName = profile.name.size() > 0;
        let hasUid = switch (profile.freeFireUid) {
          case (null) { false };
          case (?uid) { uid.size() > 0 };
        };
        hasName and hasUid;
      };
    };
  };

  // Stripe Integration
  var configuration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  // setStripeConfiguration: accessible by any admin (AccessControl admin OR multi-admin registry admin)
  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not isAdminInternal(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Models
  public type Notification = {
    message : Text;
    notificationType : NotificationType;
  };

  public type NotificationType = {
    #tournamentUpdate;
    #resultAnnouncement;
    #reminder;
    #registrationConfirmation;
    #systemNotification;
  };

  public type Referral = {
    referrer : Text;
    referee : Principal;
    completed : Bool;
  };

  public type Squad = {
    id : Text;
    name : Text;
    tag : Text;
    captain : Principal;
    members : [Principal];
  };

  public type PlayerProfile = {
    name : Text;
    freeFireUid : ?Text;
  };

  public type Tournament = {
    id : Nat;
    name : Text;
    description : Text;
    startDate : Int;
    endDate : Int;
    entryFee : Nat;
    maxParticipants : Nat;
    prizePool : Nat;
    gameType : Text;
    roomId : ?Text;
    roomPassword : ?Text;
    roomVisibilityMinutes : ?Nat;
  };

  public type TournamentUpdate = {
    id : Nat;
    name : ?Text;
    description : ?Text;
    startDate : ?Int;
    endDate : ?Int;
    entryFee : ?Nat;
    maxParticipants : ?Nat;
    prizePool : ?Nat;
    gameType : ?Text;
    roomId : ?Text;
    roomPassword : ?Text;
    roomVisibilityMinutes : ?Nat;
  };

  public type PaymentStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type Payment = {
    id : Nat;
    tournamentId : Nat;
    playerPrincipal : Principal;
    status : PaymentStatus;
    submittedAt : Int;
  };

  public type UserPreferences = {
    emailNotifications : Bool;
    pushNotifications : Bool;
    publicProfile : Bool;
  };

  public type UserProfile = {
    displayName : Text;
    avatarUrl : Text;
    bio : Text;
    email : Text;
    phone : Text;
    country : Text;
    preferences : UserPreferences;
  };
};
