/**
 * Created by luke- on 11/9/2017.
 * Authors: Luke Lo Presti 18482494
 * Version: 3.0
 */
public class TeamPlay implements Comparable<TeamPlay> {
   private String team1;
   private String team2;
   private int gamesToPlay;   // number of games yet to be played between the 2

   public TeamPlay(String team1, String team2) {
      this.team1 = team1;
      this.team2 = team2;
      this.gamesToPlay = 1;   // upon creation, set games to be played to 1
   }

   // accessor methods
   public String getTeam1() {
      return team1;
   }

   public String getTeam2() {
      return team2;
   }

   public int getGamesToPlay() {
      return gamesToPlay;
   }

   // mutator methods
   public void incrementGamesToPlay() {
      this.gamesToPlay++;
   }

   public void decrementGamesToPlay() {
      this.gamesToPlay--;
   }

   // toString method
   @Override
   public String toString() {
      return team1.charAt(0) + "" + team2.charAt(0) + "" + gamesToPlay;
   }

   // compareTo, for sorting in alphabetical order
   public int compareTo(TeamPlay t) {
      if(this.team1.equals(t.team1)) {
         return this.team2.compareTo(t.team2);
      }
      return this.team1.compareTo(t.team1);
   }

   // equals method
   @Override
   public boolean equals(Object o) {
      if (this == o) return true;
      if (o == null || getClass() != o.getClass()) return false;

      TeamPlay teamPlay = (TeamPlay) o;

      if (team1 != null ? !team1.equals(teamPlay.team1) : teamPlay.team1 != null) return false;
      return team2 != null ? team2.equals(teamPlay.team2) : teamPlay.team2 == null;

   }

   // hashcode for equals method
   @Override
   public int hashCode() {
      int result = team1 != null ? team1.hashCode() : 0;
      result = 31 * result + (team2 != null ? team2.hashCode() : 0);
      return result;
   }
}
