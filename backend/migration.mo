import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type OldTournament = {
    id : Nat;
    name : Text;
    description : Text;
    startDate : Int;
    endDate : Int;
    entryFee : Nat;
    maxParticipants : Nat;
    prizePool : Nat;
    gameType : Text;
  };

  type OldActor = {
    tournaments : Map.Map<Nat, OldTournament>;
  };

  type NewTournament = {
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

  type NewActor = {
    tournaments : Map.Map<Nat, NewTournament>;
  };

  public func run(old : OldActor) : NewActor {
    let newTournaments = old.tournaments.map<Nat, OldTournament, NewTournament>(
      func(_id, oldTournament) {
        { oldTournament with
          roomId = null;
          roomPassword = null;
          roomVisibilityMinutes = null;
        };
      }
    );
    { tournaments = newTournaments };
  };
};
