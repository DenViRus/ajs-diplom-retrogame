export default class Character {
  constructor(level, type = "generic") {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    // TODO: throw error if user use "new Character()"
    if (new.target.name === "Character") {
      throw new Error("You cannot create objects of class Character");
    }
  }

  levelUp() {
    if (this.health <= 0) {
      throw new Error("You cannot level up a deceased character");
    } else {
      this.level += 1;
      this.attack = Math.floor(
        Math.max(this.attack, (this.attack * (180 - this.health)) / 100),
      );
      this.defence = Math.floor(
        Math.max(this.defence, (this.defence * (180 - this.health)) / 100),
      );
      this.health = this.health + 80 < 100 ? this.health + 80 : 100;
    }
  }
}
