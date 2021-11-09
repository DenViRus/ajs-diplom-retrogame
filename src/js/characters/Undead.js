import Character from "../Character.js";

export default class Undead extends Character {
  constructor(level) {
    super(level);
    this.type = "undead";
    this.level = level;
    this.attack = 40;
    this.defence = 10;
    this.distance = 4;
    this.distanceAttack = 1;
  }
}
