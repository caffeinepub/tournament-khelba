import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public func run(old : {
    notifications : Map.Map<Principal, List.List<{
      message : Text;
      notificationType : {
        #tournamentUpdate;
        #resultAnnouncement;
        #reminder;
        #registrationConfirmation;
        #systemNotification;
      };
    }>>;
    referrals : Map.Map<Text, {
      referrer : Text;
      referee : Principal;
      completed : Bool;
    }>;
    squads : Map.Map<Text, {
      id : Text;
      name : Text;
      tag : Text;
      captain : Principal;
      members : [Principal];
    }>;
    playerProfiles : Map.Map<Principal, {
      name : Text;
      freeFireUid : ?Text;
    }>;
    userProfiles : Map.Map<Principal, {
      displayName : Text;
      avatarUrl : Text;
      bio : Text;
      email : Text;
      phone : Text;
      country : Text;
      preferences : {
        emailNotifications : Bool;
        pushNotifications : Bool;
        publicProfile : Bool;
      };
    }>;
    tournaments : Map.Map<Nat, {
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
    }>;
    payments : Map.Map<Nat, {
      id : Nat;
      tournamentId : Nat;
      playerPrincipal : Principal;
      status : {
        #pending;
        #approved;
        #rejected;
      };
      submittedAt : Int;
    }>;
    nextId : Nat;
    admins : Map.Map<Principal, ()>;
    configuration : ?{
      secretKey : Text;
      allowedCountries : [Text];
    };
    superAdmin : ?Principal;
  }) : {
    notifications : Map.Map<Principal, List.List<{
      message : Text;
      notificationType : {
        #tournamentUpdate;
        #resultAnnouncement;
        #reminder;
        #registrationConfirmation;
        #systemNotification;
      };
    }>>;
    referrals : Map.Map<Text, {
      referrer : Text;
      referee : Principal;
      completed : Bool;
    }>;
    squads : Map.Map<Text, {
      id : Text;
      name : Text;
      tag : Text;
      captain : Principal;
      members : [Principal];
    }>;
    playerProfiles : Map.Map<Principal, {
      name : Text;
      freeFireUid : ?Text;
    }>;
    userProfiles : Map.Map<Principal, {
      displayName : Text;
      avatarUrl : Text;
      bio : Text;
      email : Text;
      phone : Text;
      country : Text;
      preferences : {
        emailNotifications : Bool;
        pushNotifications : Bool;
        publicProfile : Bool;
      };
    }>;
    tournaments : Map.Map<Nat, {
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
    }>;
    payments : Map.Map<Nat, {
      id : Nat;
      tournamentId : Nat;
      playerPrincipal : Principal;
      status : {
        #pending;
        #approved;
        #rejected;
      };
      submittedAt : Int;
    }>;
    nextId : Nat;
    admins : Map.Map<Principal, ()>;
    configuration : ?{
      secretKey : Text;
      allowedCountries : [Text];
    };
    superAdmin : ?Principal;
  } {
    old;
  };
};
