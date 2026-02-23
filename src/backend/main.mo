import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  // Authorization system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Admin management via access control system
  public shared ({ caller }) func addAdmin(principalText : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add other admins");
    };

    let newAdminPrincipal = Principal.fromText(principalText);
    AccessControl.assignRole(accessControlState, caller, newAdminPrincipal, #admin);
  };

  public shared ({ caller }) func removeAdmin(principalText : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can remove other admins");
    };

    let adminToRemove = Principal.fromText(principalText);
    AccessControl.assignRole(accessControlState, caller, adminToRemove, #user);
  };

  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getMyPrincipal() : async Text {
    caller.toText();
  };

  // Classic notification system state
  let notifications = Map.empty<Principal, List.List<Notification>>();

  // Classic referral state
  let referrals = Map.empty<Text, Referral>();

  // Classic squad state
  let squads = Map.empty<Text, Squad>();

  // Extended player profile type from old version
  public type PlayerProfile = {
    name : Text;
    freeFireUid : ?Text;
  };

  let playerProfiles = Map.empty<Principal, PlayerProfile>();

  // Tournament registration check (old function kept for compatibility until frontend adapts)
  public shared ({ caller }) func registerForTournament(_tournamentId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can register for tournaments");
    };

    if (not checkProfileComplete(caller)) {
      Runtime.trap("Profile incomplete: Please fill out both Free Fire UID and player name.");
    };
  };

  // Profile completeness check from old version
  public query ({ caller }) func isProfileComplete() : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
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

  // Internal profile completeness check (old function kept for compatibility until frontend adapts)
  private func checkProfileComplete(user : Principal) : Bool {
    switch (playerProfiles.get(user)) {
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

  // New types for notification system and new features
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
};
