import Swordsman from "./characters/Swordsman.js";
import Bowman from "./characters/Bowman.js";
import Magician from "./characters/Magician.js";
import Daemon from "./characters/Daemon.js";
import Undead from "./characters/Undead.js";
import Vampire from "./characters/Vampire.js";

export default class Team {
  getStartUserTeam() {
    return [new Swordsman(1), new Bowman(1)];
  }

  getUserTeam() {
    return [Swordsman, Bowman, Magician];
  }

  getEnemyTeam() {
    return [Undead, Vampire, Daemon];
  }
}
