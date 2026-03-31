import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import List "mo:core/List";
import Set "mo:core/Set";
import Authorization "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Type Definitions
  type Macronutrients = {
    protein : Nat; // grams
    carbs : Nat; // grams
    fat : Nat; // grams
  };

  type Meal = {
    name : Text;
    calories : Nat;
    protein : Nat;
    carbs : Nat;
    fat : Nat;
  };

  type GymSession = {
    exercises : [Text];
    durationMinutes : Nat;
    caloriesBurned : Nat;
  };

  public type DailyGoals = {
    calories : Nat;
    macros : Macronutrients;
    waterGoal : Nat; // cups per day
  };

  type DailyLog = {
    meals : [Meal];
    waterIntake : Nat; // cups
    gymSession : ?GymSession;
    date : Text; // YYYY-MM-DD
  };

  type UserData = {
    dailyGoals : DailyGoals;
    logs : Map.Map<Text, DailyLog>;
    gymStreak : Nat;
    lastGymDate : ?Text;
  };

  public type UserProfile = {
    name : Text;
  };

  module Meal {
    public func compare(meal1 : Meal, meal2 : Meal) : Order.Order {
      Text.compare(meal1.name, meal2.name);
    };
  };

  module GymSession {
    public func compare(session1 : GymSession, session2 : GymSession) : Order.Order {
      Nat.compare(session1.durationMinutes, session2.durationMinutes);
    };
  };

  let userData = Map.empty<Principal, UserData>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization state and mixin
  let accessControlState = Authorization.initState();
  include MixinAuthorization(accessControlState);

  // Helper Functions

  func assertAuthorizedAsUserOrAdmin(caller : Principal) : () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  func getDayDifference(date1 : Text, date2 : Text) : ?Nat {
    let day1 = Nat.fromText(date1);
    let day2 = Nat.fromText(date2);

    switch (day1, day2) {
      case (?d1, ?d2) {
        if (d1 > d2) { ?(d1 - d2) } else {
          ?(d2 - d1);
        };
      };
      case (_) { null };
    };
  };

  // User Profile Functions

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not Authorization.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Public Functions

  public shared ({ caller }) func setDailyGoals(goals : DailyGoals) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    let existingData = switch (userData.get(caller)) {
      case (?data) { data };
      case (null) {
        {
          dailyGoals = goals;
          logs = Map.empty<Text, DailyLog>();
          gymStreak = 0;
          lastGymDate = null;
        };
      };
    };

    let updatedData : UserData = {
      dailyGoals = goals;
      logs = existingData.logs;
      gymStreak = existingData.gymStreak;
      lastGymDate = existingData.lastGymDate;
    };

    userData.add(caller, updatedData);
  };

  public shared ({ caller }) func logMeal(meal : Meal, date : Text) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    func updateInternalLogCurrMeals(currMeals : [Meal]) : [Meal] {
      let newMeal = [meal];
      newMeal.concat(currMeals);
    };

    updateUserDailyLog(caller, date, updateInternalLogCurrMeals);
  };

  public shared ({ caller }) func logWaterIntake(cups : Nat, date : Text) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    func updateInternalLogWater(existingWater : Nat) : Nat {
      existingWater + cups;
    };

    updateUserDailyLogWater(caller, date, updateInternalLogWater);
  };

  func updateUserDailyLog(caller : Principal, date : Text, updateMeals : ([Meal] -> [Meal])) : () {
    let userExistingData = switch (userData.get(caller)) {
      case (?data) { data };
      case (null) { Runtime.trap("User not found") };
    };

    let existingLog = switch (userExistingData.logs.get(date)) {
      case (?log) { log };
      case (null) {
        {
          meals = [];
          waterIntake = 0;
          gymSession = null;
          date;
        };
      };
    };

    let updatedLog : DailyLog = {
      meals = updateMeals(existingLog.meals);
      waterIntake = existingLog.waterIntake;
      gymSession = existingLog.gymSession;
      date = existingLog.date;
    };

    userExistingData.logs.add(date, updatedLog);
  };

  func updateUserDailyLogWater(caller : Principal, date : Text, updateWater : (Nat -> Nat)) : () {
    let userExistingData = switch (userData.get(caller)) {
      case (?data) { data };
      case (null) { Runtime.trap("User not found") };
    };

    let existingLog = switch (userExistingData.logs.get(date)) {
      case (?log) { log };
      case (null) {
        {
          meals = [];
          waterIntake = 0;
          gymSession = null;
          date;
        };
      };
    };

    let updatedLog : DailyLog = {
      meals = existingLog.meals;
      waterIntake = updateWater(existingLog.waterIntake);
      gymSession = existingLog.gymSession;
      date = existingLog.date;
    };

    userExistingData.logs.add(date, updatedLog);
  };

  public shared ({ caller }) func logGymSession(session : GymSession, date : Text) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    let userExistingData = switch (userData.get(caller)) {
      case (?data) { data };
      case (null) { Runtime.trap("User not found") };
    };

    let streakUpdate = switch (userExistingData.lastGymDate) {
      case (null) { 1 };
      case (?lastDate) {
        switch (getDayDifference(date, lastDate)) {
          case (?1) { userExistingData.gymStreak + 1 };
          case (_) { 1 };
        };
      };
    };

    let existingLog = switch (userExistingData.logs.get(date)) {
      case (?log) { log };
      case (null) {
        {
          meals = [];
          waterIntake = 0;
          gymSession = null;
          date;
        };
      };
    };

    let updatedLog : DailyLog = {
      meals = existingLog.meals;
      waterIntake = existingLog.waterIntake;
      gymSession = ?session;
      date = existingLog.date;
    };

    userExistingData.logs.add(date, updatedLog);

    let updatedData : UserData = {
      dailyGoals = userExistingData.dailyGoals;
      logs = userExistingData.logs;
      gymStreak = streakUpdate;
      lastGymDate = ?date;
    };

    userData.add(caller, updatedData);
  };

  public query ({ caller }) func getDailySummary(date : Text) : async DailyLog {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    switch (userData.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?data) {
        switch (data.logs.get(date)) {
          case (null) { Runtime.trap("No log found for this date") };
          case (?log) { log };
        };
      };
    };
  };

  public query ({ caller }) func getUserHistory(user : Principal) : async [DailyLog] {
    if (caller != user and not Authorization.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own history");
    };
    getUserHistoryInternal(user);
  };

  func getUserHistoryInternal(user : Principal) : [DailyLog] {
    switch (userData.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?data) { data.logs.values().toArray() };
    };
  };

  public query ({ caller }) func getGymStreak() : async Nat {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    switch (userData.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?data) { data.gymStreak };
    };
  };

  public query ({ caller }) func getDailyGoals() : async DailyGoals {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    switch (userData.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?data) { data.dailyGoals };
    };
  };
};
