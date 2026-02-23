import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public type PlayerProfile = {
    name : Text;
    freeFireUid : ?Text;
  };

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

  public func run(old : { playerProfiles : Map.Map<Principal, PlayerProfile> }) : {
    playerProfiles : Map.Map<Principal, PlayerProfile>;
    notifications : Map.Map<Principal, List.List<Notification>>;
    referrals : Map.Map<Text, Referral>;
    squads : Map.Map<Text, Squad>;
  } {
    {
      old with
      notifications = Map.empty<Principal, List.List<Notification>>();
      referrals = Map.empty<Text, Referral>();
      squads = Map.empty<Text, Squad>();
    };
  };
};
