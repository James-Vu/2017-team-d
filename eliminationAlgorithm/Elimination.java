// import statements
import java.util.*;
import java.io.*;

/**
 * Created by luke- on 11/9/2017.
 * Authors: Luke Lo Presti 18482494
 * Version: 3.0
 */
public class Elimination {

   // The current round within the season, starts at 1 and increments up to 23
   private static int currentRoundNo = 1;

   // AFL teams doesn't change
   private static final String[] TEAMS =  { "ADE", "BRI", "CAR", "COL", "ESS", "FRE", "GEE", "GOL", "GRE", "HAW", "MEL", "NOR", "POR", "RIC", "STK", "SYD", "WCE", "WES" };

   // Used to show algorithm calculations for testing.
   // false = hide, true = show
   private static boolean showMsgs = false;

   public static void main(String[] args) {

      // Maps to store matrix and ladder
      Map<String, ArrayList<TeamPlay>> matrix = new TreeMap<String, ArrayList<TeamPlay>>();
      Map<String, Integer> ladder = new LinkedHashMap<String, Integer>();

      try {
         // load the initial matrix
         loadInitialMatrix(matrix);

         // print the initial matrix
         System.out.println("Initial matrix...");
         printMatrix(TEAMS, matrix);
         System.out.println();

         // loop through all played rounds
         loopRounds(matrix, ladder);
         System.out.println();

         // print final matrix to ensure all games were considered
         printMatrix(TEAMS, matrix);
      }
      catch(Exception e) {
         // catche and print any and all exceptions
         System.out.println("Exception: " + e.getMessage());
         e.printStackTrace();
      }
   }

   /**
    * loadInitialMatrix Create the initial matrix of all games to play throughout the season
    * @param {Map<String, ArrayList<TeamPlay>>} matrix The matrix containing the number of times
    * a team plays another team
    * @throws IOException For file calls, caught in main
    */
   private static void loadInitialMatrix(Map<String, ArrayList<TeamPlay>> matrix) throws IOException {
      Scanner in = new Scanner(new File("aflSimple.csv"));

      // while there is another game
      while(in.hasNextLine()) {
         String line = in.nextLine().toUpperCase();
         String team1 = line.split(",")[2];     // get team 1
         String team2 = line.split(",")[3];     // get team 2

         // create a TeamPlay
         TeamPlay t = new TeamPlay(team1, team2);

         // if team is not in the map
         if (!matrix.containsKey(team1)) {

            // insert K, V - team1, ArrayList of TeamPlays
            matrix.put(team1, new ArrayList<TeamPlay>() {{

               // add a blank TeamPlay against themselves (0 diagonal)
               add(new TeamPlay(team1, team1) {{
                  decrementGamesToPlay(); // set to 0 as team never plays themself
               }});

               // add created TeamPlay
               add(t);
            }});
         }
         // if team is already in the map
         else {
            // get the ArrayList
            ArrayList<TeamPlay> list = matrix.get(team1);
            // if the list already contains the TeamPlay, increment games to play, else add it
            if (list.contains(t)) {
               list.get(list.indexOf(t)).incrementGamesToPlay();
            }
            else {
               list.add(t);
            }

            // sort the list alphabetically, add it to the matrix of games
            Collections.sort(list);
            matrix.put(team1, list);
         }
      }
   }

   /**
    * printMatrix Prints the matrix to the console in a formatted way
    * @param {String[]} teams The list of teams being printed
    * @param {Map<String, ArrayList<TeamPlay>>} matrix The matrix containing the number of times
    * a team plays another team
    */
   private static void printMatrix(String[] teams, Map<String, ArrayList<TeamPlay>> matrix) {
      // print top row (team names)
      System.out.print("\t");
      for(String team: teams) {
            System.out.print(team + "\t");
      }
      System.out.println();

      // print out each key (team names)
      for (Map.Entry<String, ArrayList<TeamPlay>> entry : matrix.entrySet()) {
         System.out.print(entry.getKey() + "\t");

         // for each key, print out all their games
         for(TeamPlay t: entry.getValue()) {
            System.out.print(t + "\t");
         }
         System.out.println();
      }
   }

   /**
    * loopRounds Loop through all rounds and simulate games being played per round
    * @param {Map<String, ArrayList<TeamPlay>>} matrix The matrix containing the number of times
    * a team plays another team
    * @param {Map<String, Integer>} ladder Each team and their respective points
    * @throws IOException For file calls, caught in main
    */
   private static void loopRounds(Map<String, ArrayList<TeamPlay>> matrix, Map<String, Integer> ladder) throws IOException {
      Scanner inGames = new Scanner(new File("aflSimple.csv"));

      ArrayList<TeamPlay> gamesPlayedInRound = new ArrayList<TeamPlay>();

      // while there are more games
      while(inGames.hasNext()) {

         // get the roundNo
         String line = inGames.nextLine().toUpperCase();
         int roundNo = Integer.parseInt(line.split(",")[1]);

         // if the roundNo is greater than the currentRoundNo, print the summary for that round
         // ie all games in a round have been considered
         if(roundNo > currentRoundNo) {
            printRoundSummary(matrix, ladder, gamesPlayedInRound);
            System.out.println();
            gamesPlayedInRound.clear();
            currentRoundNo++;    // inc currentRoundNo
         }

         String team1 = line.split(",")[2];     // get team 1
         String team2 = line.split(",")[3];     // get team 2

         TeamPlay t = new TeamPlay(team1, team2);
         gamesPlayedInRound.add(t);

         // find the matching game, decrement games to play (simulate game played)
         ArrayList<TeamPlay> list = matrix.get(team1);
         list.get(list.indexOf(t)).decrementGamesToPlay();
         matrix.put(team1, list);
      }

      // print final round summary
      printRoundSummary(matrix, ladder, gamesPlayedInRound);
   }

   /**
    * print a summary after each round outlining details including which teams were eliminated
    * @param {Map<String, ArrayList<TeamPlay>>} matrix The matrix containing the number of times
    * a team plays another team
    * @param {Map<String, Integer>} ladder Each team and their respective points
    * @param {ArrayList<TeamPlay>} gamesPlayedInRound All games played with a round
    * @throws IOException For file calls, caught in main
    */
   private static void printRoundSummary(Map<String, ArrayList<TeamPlay>> matrix, Map<String, Integer> ladder, ArrayList<TeamPlay> gamesPlayedInRound) throws IOException {
      Scanner inLadders = new Scanner(new File("ladder.txt"));

      // go through ladders file and find the current round ladder
      String roundNo = inLadders.nextLine().trim();
      while(!roundNo.equals("Rd " + currentRoundNo + " Ladder")) {
         roundNo = inLadders.nextLine().trim();
      }

      // create the current round ladder
      String line = "";
      ladder.clear();
      while(inLadders.hasNext() && !( line = inLadders.next()).equals("Rd")) {
         ladder.put(line, inLadders.nextInt());
      }

      // print summary
      System.out.println("Round " + currentRoundNo + " has been played! " + (gamesPlayedInRound.size() / 2) + " games were played this round...");
      System.out.print("(");
      for(int i = 0; i < gamesPlayedInRound.size(); i++) {
         System.out.print(gamesPlayedInRound.get(i));
         if(i != gamesPlayedInRound.size() - 1) {
            if (i % 2 == 1) {
               System.out.print(") (");
            } else {
               System.out.print(" ");
            }
         }
      }
      System.out.println(")");

      // decide if messages should be shown
      boolean temp = false;
      if(showMsgs) {
         temp = showMsgs;
         showMsgs = false;
      }

      // print ladder - Position, Team name, Plays, Points, Elimination Status
      System.out.println("Round " + currentRoundNo + " Ladder");
      System.out.println("#\tTm\tP\tPts\tElimination Status");
      int i = 1;
      for (Map.Entry<String, Integer> entry : ladder.entrySet()) {
         System.out.print(i++ + "\t" + entry.getKey() + "\t" + (22 - calculateGamesLeft(entry.getKey(), matrix)) + "\t" + entry.getValue());
         Boolean isEliminated = isEliminated(entry.getKey(), matrix, ladder);    // check if team isEliminated
         if(isEliminated) {
            System.out.println("\t" + "ELIMINATED");
         }
         else {
            System.out.println("\t" + "NOT ELIMINATED");
         }
      }

      // decide if messages should be shown
      if(temp) {
         showMsgs = true;
         System.out.println();
         System.out.println("Calculations");
         for (Map.Entry<String, Integer> entry : ladder.entrySet()) {
            System.out.println(entry.getKey() + " is eliminated? " + isEliminated(entry.getKey(), matrix, ladder));    // check if team isEliminated
            System.out.println();
         }
      }


   }

   /**
    *
    * @param {String} team The team to check if eliminated
    * @param {Map<String, ArrayList<TeamPlay>>} matrix The matrix containing the number of times
    * a team plays another team
    * @param {Map<String, Integer>} ladder Each team and their respective points
    * @return {boolean} true if team is eliminated, false if not eiliminated
    */
   private static boolean isEliminated(String team, Map<String, ArrayList<TeamPlay>> matrix, Map<String, Integer> ladder) {
      ArrayList<String> ladderTeams = new ArrayList<String>(ladder.keySet());       // ladderTeam names in order
      ArrayList<Integer> ladderPoints = new ArrayList<Integer>(ladder.values());    // ladderTeam points in order

      int pos = 8 - 1;                                      // eight position index
      int eightPoints = ladderPoints.get(pos);              // eight position points
      int teamPoints = ladder.get(team);                    // points of team
      int gamesLeft = calculateGamesLeft(team, matrix);     // gamesLeft for the team
      int maxPoints = gamesLeft * 4;                        // maximum points team can still earn

      // show messages
      if(showMsgs) {
         System.out.println("Points required to reach eighth: " + eightPoints);
         System.out.println("Current points " + team + " has achieved " + teamPoints + " in " + (22 - gamesLeft) + " games");
         System.out.println("Max points " + team + " can achieve is " + maxPoints + " in " + gamesLeft + " more games");
      }


      // if team's points are currently greater than or equal to eighth place's points AND their position is eighth or higher
      // OR team's points are currently equal to eighth place's points AND there is at least 1 more game to be played
      // THEN team is not eliminated
      if ((teamPoints >= eightPoints && ladderTeams.indexOf(team) <= pos) || (teamPoints == eightPoints && gamesLeft > 0)) {
         if(showMsgs) System.out.println(team + ", have enough points");
         return false;  // not eliminated
      }
      // if team's max points are less than eighth place's points
      // OR there no games left (can't gain points, since failed first case they should be eliminated)
      // THEN team is eliminated
      else if (teamPoints + maxPoints < eightPoints || gamesLeft == 0) {
         if(showMsgs) System.out.println(team + ", not possible due to points");
         return true;   // eliminated
      }
      else {
         // list of teams to compare to
         ArrayList<String> teamsToCheckList = new ArrayList<String>();

         // stack of teams to compare to (equal to eighth)
         Stack<String> teamsToCheckStack = new Stack<String>();

         // add teams to list and stack
         for (int i = 0; i <= ladderTeams.indexOf(team) - 1; i++) {
           if(i <= pos) {
              if(ladderPoints.get(i) == eightPoints) {
                 teamsToCheckStack.add(ladderTeams.get(i));
              }
           }
           else {
              if(i == 8 || ladderPoints.get(i) != teamPoints) {
                 teamsToCheckList.add(ladderTeams.get(i));
              }
           }
         }

         boolean repeat = true;  // if the algorithm should be run again

         while (repeat && !teamsToCheckStack.isEmpty()) {

            // list of teams to compare to
            ArrayList<String> teamsToCheck = new ArrayList<String>(teamsToCheckList);
            teamsToCheck.add(0, teamsToCheckStack.pop());

            // create the smaller matrix
            Map<String, ArrayList<TeamPlay>> m = new LinkedHashMap<String, ArrayList<TeamPlay>>();
            for (String s : teamsToCheck) {
               ArrayList<TeamPlay> list = matrix.get(s);
               ArrayList<TeamPlay> newList = new ArrayList<TeamPlay>();
               for (String st : teamsToCheck) {
                  for (TeamPlay t : list) {
                     if (t.getTeam2().equals(st)) {
                        newList.add(t);
                     }
                  }
               }
               m.put(s, newList);
            }

            // calculate the max points for each pair of teams
            int[] max = new int[teamsToCheck.size() - 1];
            int diff = 2;
            for (int i = 0; i < teamsToCheck.size() - 1; i++) {
               int sum = 0;
               for (int j = pos; j < pos + diff; j++) {
                  sum += ladderPoints.get(j);
               }
               max[i] = (diff * (maxPoints + teamPoints)) - sum;
               diff++;
            }

            // calculate the actual cumulative points for each pair of teams
            int[] act = new int[teamsToCheck.size() - 1];
            int index = 1;
            for (int i = 0; i < teamsToCheck.size() - 1; i++) {
               int sum = 0;
               int temp = index;
               for (Map.Entry<String, ArrayList<TeamPlay>> entry : m.entrySet()) {
                  if (index > 0) {
                     sum = sum + entry.getValue().get(i + 1).getGamesToPlay();
                     index--;
                  }
               }

               index = temp + 1;
               if (i == 0) {
                  act[i] = sum * 4;
               } else {
                  act[i] = act[i - 1] + (sum * 4);
               }
            }

            if(showMsgs) {
               System.out.println(team + ", seeing if can make 8th place");
               System.out.println();
               String[] teamsToCheckArr = new String[teamsToCheck.size()];
               printMatrix(teamsToCheck.toArray(teamsToCheckArr), m);

               System.out.print("\tMAX\t");
               for (int i : max) {
                  System.out.print(i + "\t");
               }

               System.out.println();
               System.out.print("\tACT\t");
               for (int i : act) {
                  System.out.print(i + "\t");
               }
               System.out.println();
            }

            repeat = false;

            // if actual is ever higher than max at each index, then eliminated
            for (int i = 0; i < max.length; i++) {
               if (act[i] > max[i]) {
                  repeat = true;
               }
            }

            // if no more repeats, team is not eliminated
            if(repeat == false) {
               return false;  // team is not eliminated
            }
            // if stack is not empty and team is assumed eliminated, repeat algorithm with next team
            else if(!teamsToCheckStack.isEmpty() && showMsgs){
               System.out.println("POTENTIALLY ELIMINATED, RUNNING EXTENDED CHECK!");
            }
         }
         // if while loop exits, all repeated algorithms ahve been run, assume team is eliminated
         return true;
      }
   }

   /**
    * calculates how many games a team still has to play
    * @param {String} team The team to check how many games are left to play
    * @param {Map<String, ArrayList<TeamPlay>>} matrix The matrix containing the number of times
    * a team plays another team
    * @return number of games left to play for team
    */
   private static int calculateGamesLeft(String team, Map<String, ArrayList<TeamPlay>> matrix) {
      int gamesLeft = 0;
      ArrayList<TeamPlay> teamPlays = matrix.get(team);
      for (TeamPlay t: teamPlays) {
         gamesLeft += t.getGamesToPlay();
      }
      return gamesLeft;
   }
}

