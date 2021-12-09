export default class GameState {
  static from(object) {
    // TODO: create object
    if (typeof object === "object") {
      return {
        point: object.points,
        maxPoint: object.maxPoint,
        level: object.level,
        currentTheme: object.themes,
        userPositions: object.userPositions,
        enemyPositions: object.enemyPositions,
      };
    }
    return null;
  }
}
