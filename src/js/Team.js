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

// if (another) {
//   if (
//     itemRow + i + 1 < 8 &&
//     itemColumn + i < 8 &&
//     i + 1 <= distance &&
//     i + 1 < 4
//   ) {
//     allowedPositionsArray.push((itemRow + i + 1) * 8 + (itemColumn + i));
//   }
//   if (
//     itemRow + i + 2 < 8 &&
//     itemColumn + i < 8 &&
//     i + 2 <= distance &&
//     i + 2 < 4
//   ) {
//     allowedPositionsArray.push((itemRow + i + 2) * 8 + (itemColumn + i));
//   }

//   if (
//     itemRow + i < 8 &&
//     itemColumn + i + 1 < 8 &&
//     i + 1 <= distance &&
//     i + 1 < 4
//   ) {
//     allowedPositionsArray.push((itemRow + i) * 8 + (itemColumn + i + 1));
//   }
//   if (
//     itemRow + i < 8 &&
//     itemColumn + i + 2 < 8 &&
//     i + 2 <= distance &&
//     i + 2 < 4
//   ) {
//     allowedPositionsArray.push((itemRow + i) * 8 + (itemColumn + i + 2));
//   }

//   if (
//     itemRow - i - 1 >= 0 &&
//     itemColumn - i >= 0 &&
//     i + 1 <= distance &&
//     i + 1 < 4
//   ) {
//     allowedPositionsArray.push((itemRow - i - 1) * 8 + (itemColumn - i));
//   }
//   if (
//     itemRow - i - 2 >= 0 &&
//     itemColumn - i >= 0 &&
//     i + 2 <= distance &&
//     i + 2 < 4
//   ) {
//     allowedPositionsArray.push((itemRow - i - 2) * 8 + (itemColumn - i));
//   }

//   if (
//     itemRow - i >= 0 &&
//     itemColumn - i - 1 >= 0 &&
//     i + 1 <= distance &&
//     i + 1 < 4
//   ) {
//     allowedPositionsArray.push((itemRow - i) * 8 + (itemColumn - i - 1));
//   }
//   if (
//     itemRow - i >= 0 &&
//     itemColumn - i - 2 >= 0 &&
//     i + 2 <= distance &&
//     i + 2 < 4
//   ) {
//     allowedPositionsArray.push((itemRow - i) * 8 + (itemColumn - i - 2));
//   }

//   if (
//     itemRow + i + 1 < 8 &&
//     itemColumn - i >= 0 &&
//     i + 1 <= distance &&
//     i + 1 < 4
//   ) {
//     allowedPositionsArray.push((itemRow + i + 1) * 8 + (itemColumn - i));
//   }
//   if (
//     itemRow + i + 2 < 8 &&
//     itemColumn - i >= 0 &&
//     i + 2 <= distance &&
//     i + 2 < 4
//   ) {
//     allowedPositionsArray.push((itemRow + i + 2) * 8 + (itemColumn - i));
//   }

//   if (
//     itemRow + i < 8 &&
//     itemColumn - i - 1 >= 0 &&
//     i + 1 <= distance &&
//     i + 1 < 4
//   ) {
//     allowedPositionsArray.push((itemRow + i) * 8 + (itemColumn - i - 1));
//   }
//   if (
//     itemRow + i < 8 &&
//     itemColumn - i - 2 >= 0 &&
//     i + 2 <= distance &&
//     i + 2 < 4
//   ) {
//     allowedPositionsArray.push((itemRow + i) * 8 + (itemColumn - i - 2));
//   }

//   if (
//     itemRow - i - 1 >= 0 &&
//     itemColumn + i < 8 &&
//     i + 1 <= distance &&
//     i + 1 < 4
//   ) {
//     allowedPositionsArray.push((itemRow - i - 1) * 8 + (itemColumn + i));
//   }
//   if (
//     itemRow - i - 2 >= 0 &&
//     itemColumn + i < 8 &&
//     i + 2 <= distance &&
//     i + 2 < 4
//   ) {
//     allowedPositionsArray.push((itemRow - i - 2) * 8 + (itemColumn + i));
//   }

//   if (
//     itemRow - i >= 0 &&
//     itemColumn + i + 1 < 8 &&
//     i + 1 <= distance &&
//     i + 1 < 4
//   ) {
//     allowedPositionsArray.push((itemRow - i) * 8 + (itemColumn + i + 1));
//   }
//   if (
//     itemRow - i >= 0 &&
//     itemColumn + i + 2 < 8 &&
//     i + 2 <= distance &&
//     i + 2 < 4
//   ) {
//     allowedPositionsArray.push((itemRow - i) * 8 + (itemColumn + i + 2));
//   }
// }
