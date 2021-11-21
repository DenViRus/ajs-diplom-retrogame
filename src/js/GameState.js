export default class GameState {
  static from(object) {
    // TODO: create object
    return typeof object === "object" ? object : null;
  }
}
