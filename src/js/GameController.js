import GamePlay from "./GamePlay.js";
import themes from "./themes.js";
import GameState from "./GameState.js";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.themes = themes.prairie;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    this.gamePlay.drawUi(this.themes);
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
