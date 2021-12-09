import GamePlay from "./GamePlay.js";
import themes from "./themes.js";
import Team from "./Team.js";
import { generateTeam } from "./generators.js";
import PositionedCharacter from "./PositionedCharacter.js";
import GameState from "./GameState.js";
import cursors from "./cursors.js";
import GameStateService from "./GameStateService.js";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.themes = themes.prairie;
    this.blockedBoard = false;
    this.index = null;
    this.level = 1;
    this.points = 0;
    this.userTeam = [];
    this.enemyTeam = [];
    this.userPositions = [];
    this.enemyPositions = [];
    this.boardSize = gamePlay.boardSize;
    this.selectedCharacterIndex = 0;
    this.selected = false;
    this.selectedCharacter = {};
    this.currentMove = "user";
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    //
    this.gamePlay.drawUi(this.themes);
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
    //
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }

  async onCellClick(index) {
    // TODO: react to click
    this.index = index;
    // console.log(this.stateService);
    // console.log(JSON.parse(this.stateService.storage.state));

    if (!this.blockedBoard) {
      if (this.gamePlay.boardEl.style.cursor === "not-allowed") {
        GamePlay.showError("This is too far for action!");
      } else if (this.getIndex([...this.userPositions]) !== -1) {
        // если персонаж не враг
        // снимаем выделение с ранее отмеченного персонажа
        this.gamePlay.deselectCell(this.selectedCharacterIndex);
        // отмечаем кликнутого персонажа
        this.gamePlay.selectCell(index);
        // присваиваем индекс кликнутому персонажу
        this.selectedCharacterIndex = index;
        // находим кликнутого персонажа по индексу
        this.selectedCharacter = [...this.userPositions].find(
          (item) => item.position === index,
        );
        // персонаж выбран
        this.selected = true;
      } else if (
        !this.selected
        && this.getIndex([...this.enemyPositions]) !== -1
      ) {
        // если персонаж не выбран и он враг
        GamePlay.showError("You cannot choose enemy");
      } else if (
        this.selected
        && this.gamePlay.boardEl.style.cursor === "pointer"
      ) {
        // если персонаж выбран и курсор pointer
        this.selectedCharacter.position = index;
        this.gamePlay.deselectCell(this.selectedCharacterIndex);
        this.gamePlay.deselectCell(index);

        this.gamePlay.redrawPositions([
          ...this.userPositions,
          ...this.enemyPositions,
        ]);
        this.currentMove = "enemy";
        this.enemyStratagy();
      } else if (
        this.selected
        && this.gamePlay.boardEl.style.cursor === "crosshair"
      ) {
        // если персонаж выбран и курсор crosshair
        const thisAttackEnemy = [...this.enemyPositions].find(
          (item) => item.position === index,
        );
        this.gamePlay.deselectCell(this.selectedCharacterIndex);
        this.gamePlay.deselectCell(index);
        this.gamePlay.setCursor(cursors.auto);
        //
        await this.characterAttacking(this.selectedCharacter, thisAttackEnemy);
        //
        if (
          this.enemyPositions.length > 0
          && thisAttackEnemy.character.health > 0
        ) {
          this.currentMove = "enemy";
          this.EnemyCounterAttack(thisAttackEnemy, this.selectedCharacter);
        } else {
          this.currentMove = "enemy";
          this.enemyStratagy();
        }
      }
    }
  }

  // атака
  async characterAttacking(attacker, target) {
    // считаем урон
    const damage = Math.floor(
      Math.max(
        attacker.character.attack - target.character.defence,
        attacker.character.attack * 0.1,
      ),
    );

    await this.gamePlay.showDamage(target.position, damage);

    const targetedCharacter = target.character;
    // уменьшаем здоровье на полученный урон
    if (targetedCharacter.health - damage > 0) {
      targetedCharacter.health -= damage;
    } else {
      targetedCharacter.health = 0;
    }

    // переход хода
    this.currentMove = this.currentMove === "enemy" ? "user" : "enemy";

    // проверяем здоровье после атаки
    if (targetedCharacter.health <= 0) {
      this.userPositions = this.userPositions.filter(
        (item) => item.position !== target.position,
      );
      this.enemyPositions = this.enemyPositions.filter(
        (item) => item.position !== target.position,
      );
    }

    this.selected = !(this.selectedCharacter.character.health <= 0);

    // проверяем сколько игроков осталось после атаки
    if (this.userPositions.length === 0) {
      GamePlay.showMessage("Game over!");
      this.blockedBoard = true;
    }
    // если врагов не осталось: считаем очки, повышаем уровень, переходим на следующий уровень
    if (this.enemyPositions.length === 0) {
      this.level += 1;
      for (const userPosition of this.userPositions) {
        this.points += userPosition.character.health;
        userPosition.character.levelUp();
      }
      this.nextLevel();
    }
    // перерисовываем поле
    this.gamePlay.redrawPositions([
      ...this.userPositions,
      ...this.enemyPositions,
    ]);
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    this.index = index;

    const icons = {
      level: `\u{1F396}`,
      attack: `\u{2694}`,
      defence: `\u{1F6E1}`,
      health: `\u{2764}`,
    };
    if (!this.blockedBoard) {
      for (const item of [...this.userPositions, ...this.enemyPositions]) {
        if (item.position === index) {
          const message = `${icons.level}${item.character.level} ${icons.attack}${item.character.attack} ${icons.defence}${item.character.defence} ${icons.health}${item.character.health}`;
          this.gamePlay.showCellTooltip(message, index);
        }
      }
    }

    if (this.selected) {
      const characterPosition = this.selectedCharacter.position;
      const characterDistance = this.selectedCharacter.character.distance;
      const characterDistanceAttack = this.selectedCharacter.character.distanceAttack;

      const allowedAttacks = this.getAllowedPositions(
        characterPosition,
        characterDistanceAttack,
      );

      const allowedPositions = this.getAllowedPositions(
        characterPosition,
        characterDistance,
        true,
      );

      if (this.getIndex(this.userPositions) !== -1) {
        this.gamePlay.setCursor(cursors.pointer);
      } else if (
        this.getIndex(this.enemyPositions) !== -1
        && allowedAttacks.includes(index)
      ) {
        // проверяем радиус атаки, и что персонаж не враг
        this.gamePlay.selectCell(index, "red");
        this.gamePlay.setCursor(cursors.crosshair);
      } else if (
        this.getIndex([...this.userPositions, ...this.enemyPositions]) === -1
        && allowedPositions.includes(index)
      ) {
        // проверяем входит ли в радиус атаки и никого нет в клетке
        this.gamePlay.selectCell(index, "green");
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.selectedCharacter.position !== index) {
      this.gamePlay.deselectCell(index);
    }
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursors.auto);
  }

  //
  getIndex(array) {
    return array.findIndex((item) => item.position === this.index);
  }

  newGame() {
    const maxPoint = this.getMaxPoint();
    const gameState = this.stateService.load();
    if (gameState) {
      gameState.maxPoint = maxPoint;
      this.stateService.save(GameState.from(this));
    }

    this.userPositions = [];
    this.enemyPositions = [];
    this.blockedBoard = false;
    this.level = 1;
    this.points = 0;
    this.themes = themes.prairie;
    this.nextLevel();
  }

  saveGame() {
    this.maxPoint = this.getMaxPoint();
    this.stateService.save(GameState.from(this));
  }

  loadGame() {
    try {
      const loadGameState = this.stateService.load();
      if (loadGameState) {
        this.point = loadGameState.point;
        this.level = loadGameState.level;
        this.currentTheme = loadGameState.currentTheme;
        this.userPositions = loadGameState.userPositions;
        this.enemyPositions = loadGameState.enemyPositions;
        this.blockedBoard = false;
        this.gamePlay.drawUi(this.currentTheme);
        this.gamePlay.redrawPositions([
          ...this.userPositions,
          ...this.enemyPositions,
        ]);
      }
    } catch (error) {
      GamePlay.showMessage("Failed!");
      this.newGame();
    }
  }

  // переход по уровням, генерация команд, персонажей, и тем фона
  nextLevel() {
    if (this.level === 1) {
      this.userTeam = Team.getStartUserTeam();
      this.enemyTeam = generateTeam(Team.getEnemyTeam(), 1, 2);
      this.addPositionedCharacter(this.userTeam, this.enemyTeam);
    } else if (this.level === 2) {
      this.themes = themes.desert;
      this.userTeam = generateTeam(Team.getUserTeam(), 1, 1);
      this.enemyTeam = generateTeam(
        Team.getEnemyTeam(),
        2,
        this.userPositions.length + this.userTeam.length,
      );
      this.addPositionedCharacter(this.userTeam, this.enemyTeam);
    } else if (this.level === 3) {
      this.themes = themes.arctic;
      this.userTeam = generateTeam(Team.getUserTeam(), 2, 2);
      this.enemyTeam = generateTeam(
        Team.getEnemyTeam(),
        3,
        this.userPositions.length + this.userTeam.length,
      );
      this.addPositionedCharacter(this.userTeam, this.enemyTeam);
    } else if (this.level === 4) {
      this.themes = themes.mountain;
      this.userTeam = generateTeam(Team.getUserTeam(), 3, 2);
      this.enemyTeam = generateTeam(
        Team.getEnemyTeam(),
        4,
        this.userPositions.length + this.userTeam.length,
      );
      this.addPositionedCharacter(this.userTeam, this.enemyTeam);
    } else {
      this.blockedBoard = true;
      GamePlay.showMessage(`You get ${this.points} points`);
      this.newGame();
      return;
    }

    // задаем списки возможных стартовых позиций
    const startUser = this.startUserPositions();
    const startEnemy = this.startEnemyPositions();

    // добавляем стартовые позиции игрокам
    for (let i = 0; i < this.userPositions.length; i++) {
      this.userPositions[i].position = this.getRandom(startUser);
      this.enemyPositions[i].position = this.getRandom(startEnemy);
    }

    this.gamePlay.drawUi(this.themes);
    this.gamePlay.redrawPositions([
      ...this.userPositions,
      ...this.enemyPositions,
    ]);
  }

  // создаем команды персонажей
  addPositionedCharacter(userTeam, enemyTeam) {
    userTeam.forEach((item) => {
      this.userPositions.push(new PositionedCharacter(item, 0));
    });

    enemyTeam.forEach((item) => {
      this.enemyPositions.push(new PositionedCharacter(item, 0));
    });
  }

  // возможные стартовые позиции игрока
  startUserPositions() {
    const positions = [];
    for (let i = 0; i < this.boardSize ** 2; i++) {
      if (i % this.boardSize === 0 || i % this.boardSize === 1) {
        positions.push(i);
      }
    }
    return positions;
  }

  // возможные стартовые позиции врага
  startEnemyPositions() {
    const positions = [];
    for (let i = 0; i < this.boardSize ** 2; i++) {
      if (
        i % this.boardSize === this.boardSize - 1
        || i % this.boardSize === this.boardSize - 2
      ) {
        positions.push(i);
      }
    }
    return positions;
  }

  // выбираем рандомно позицию из списка возможных
  getRandom(positions) {
    const num = Math.floor(Math.random() * positions.length);
    const random = positions.splice(num, 1);
    return random[0];
  }

  // считаем максимальное количество очков
  getMaxPoint() {
    let maxPoint = 0;
    try {
      const gameStateLoad = this.stateService.load();
      if (gameStateLoad) {
        maxPoint = Math.max(gameStateLoad.maxPoint, this.points);
      }
    } catch (error) {
      maxPoint = this.points;
      console.log(error);
    }
    return maxPoint;
  }

  // вернет массив с допустимыми вариантами передвижения и атаки
  getAllowedPositions(position, distance, isEnemy = false) {
    const allowedPositionsArray = [];

    // номер строки
    const itemRow = Math.floor(position / this.boardSize);
    // номер колонки
    const itemColumn = position % this.boardSize;

    for (let i = 1; i <= distance; i++) {
      if (itemColumn + i < 8) {
        allowedPositionsArray.push(itemRow * 8 + (itemColumn + i));
      }
      if (itemColumn - i >= 0) {
        allowedPositionsArray.push(itemRow * 8 + (itemColumn - i));
      }
      if (itemRow + i < 8) {
        allowedPositionsArray.push((itemRow + i) * 8 + itemColumn);
      }
      if (itemRow - i >= 0) {
        allowedPositionsArray.push((itemRow - i) * 8 + itemColumn);
      }
      if (itemRow + i < 8 && itemColumn + i < 8) {
        allowedPositionsArray.push((itemRow + i) * 8 + (itemColumn + i));
      }
      if (itemRow - i >= 0 && itemColumn - i >= 0) {
        allowedPositionsArray.push((itemRow - i) * 8 + (itemColumn - i));
      }
      if (itemRow + i < 8 && itemColumn - i >= 0) {
        allowedPositionsArray.push((itemRow + i) * 8 + (itemColumn - i));
      }
      if (itemRow - i >= 0 && itemColumn + i < 8) {
        allowedPositionsArray.push((itemRow - i) * 8 + (itemColumn + i));
      }
      if (
        itemRow + i + 1 < 8
        && itemColumn + i < 8
        && i + 1 <= distance
        && i + 1 <= 4
      ) {
        allowedPositionsArray.push((itemRow + i + 1) * 8 + (itemColumn + i));
      }
      if (itemRow + i + 2 < 8 && itemColumn + i < 8 && i + 2 <= distance) {
        allowedPositionsArray.push((itemRow + i + 2) * 8 + (itemColumn + i));
      }
      if (itemRow + i + 3 < 8 && itemColumn + i < 8 && i + 3 <= distance) {
        allowedPositionsArray.push((itemRow + i + 3) * 8 + (itemColumn + i));
      }
      if (
        itemRow + i < 8
        && itemColumn + i + 1 < 8
        && i + 1 <= distance
        && i + 1 <= 4
      ) {
        allowedPositionsArray.push((itemRow + i) * 8 + (itemColumn + i + 1));
      }
      if (itemRow + i < 8 && itemColumn + i + 2 < 8 && i + 2 <= distance) {
        allowedPositionsArray.push((itemRow + i) * 8 + (itemColumn + i + 2));
      }
      if (itemRow + i < 8 && itemColumn + i + 3 < 8 && i + 3 <= distance) {
        allowedPositionsArray.push((itemRow + i) * 8 + (itemColumn + i + 3));
      }

      if (
        itemRow - i - 1 >= 0
        && itemColumn - i >= 0
        && i + 1 <= distance
        && i + 1 <= 4
      ) {
        allowedPositionsArray.push((itemRow - i - 1) * 8 + (itemColumn - i));
      }
      if (itemRow - i - 2 >= 0 && itemColumn - i >= 0 && i + 2 <= distance) {
        allowedPositionsArray.push((itemRow - i - 2) * 8 + (itemColumn - i));
      }
      if (itemRow - i - 3 >= 0 && itemColumn - i >= 0 && i + 3 <= distance) {
        allowedPositionsArray.push((itemRow - i - 3) * 8 + (itemColumn - i));
      }

      if (
        itemRow - i >= 0
        && itemColumn - i - 1 >= 0
        && i + 1 <= distance
        && i + 1 <= 4
      ) {
        allowedPositionsArray.push((itemRow - i) * 8 + (itemColumn - i - 1));
      }
      if (itemRow - i >= 0 && itemColumn - i - 2 >= 0 && i + 2 <= distance) {
        allowedPositionsArray.push((itemRow - i) * 8 + (itemColumn - i - 2));
      }
      if (itemRow - i >= 0 && itemColumn - i - 3 >= 0 && i + 3 <= distance) {
        allowedPositionsArray.push((itemRow - i) * 8 + (itemColumn - i - 3));
      }

      if (
        itemRow + i + 1 < 8
        && itemColumn - i >= 0
        && i + 1 <= distance
        && i + 1 <= 4
      ) {
        allowedPositionsArray.push((itemRow + i + 1) * 8 + (itemColumn - i));
      }
      if (itemRow + i + 2 < 8 && itemColumn - i >= 0 && i + 2 <= distance) {
        allowedPositionsArray.push((itemRow + i + 2) * 8 + (itemColumn - i));
      }
      if (itemRow + i + 3 < 8 && itemColumn - i >= 0 && i + 3 <= distance) {
        allowedPositionsArray.push((itemRow + i + 3) * 8 + (itemColumn - i));
      }

      if (
        itemRow + i < 8
        && itemColumn - i - 1 >= 0
        && i + 1 <= distance
        && i + 1 <= 4
      ) {
        allowedPositionsArray.push((itemRow + i) * 8 + (itemColumn - i - 1));
      }
      if (itemRow + i < 8 && itemColumn - i - 2 >= 0 && i + 2 <= distance) {
        allowedPositionsArray.push((itemRow + i) * 8 + (itemColumn - i - 2));
      }
      if (itemRow + i < 8 && itemColumn - i - 3 >= 0 && i + 3 <= distance) {
        allowedPositionsArray.push((itemRow + i) * 8 + (itemColumn - i - 3));
      }

      if (
        itemRow - i - 1 >= 0
        && itemColumn + i < 8
        && i + 1 <= distance
        && i + 1 <= 4
      ) {
        allowedPositionsArray.push((itemRow - i - 1) * 8 + (itemColumn + i));
      }
      if (itemRow - i - 2 >= 0 && itemColumn + i < 8 && i + 2 <= distance) {
        allowedPositionsArray.push((itemRow - i - 2) * 8 + (itemColumn + i));
      }
      if (itemRow - i - 3 >= 0 && itemColumn + i < 8 && i + 3 <= distance) {
        allowedPositionsArray.push((itemRow - i - 3) * 8 + (itemColumn + i));
      }

      if (
        itemRow - i >= 0
        && itemColumn + i + 1 < 8
        && i + 1 <= distance
        && i + 1 <= 4
      ) {
        allowedPositionsArray.push((itemRow - i) * 8 + (itemColumn + i + 1));
      }
      if (itemRow - i >= 0 && itemColumn + i + 2 < 8 && i + 2 <= distance) {
        allowedPositionsArray.push((itemRow - i) * 8 + (itemColumn + i + 2));
      }
      if (itemRow - i >= 0 && itemColumn + i + 3 < 8 && i + 3 <= distance) {
        allowedPositionsArray.push((itemRow - i) * 8 + (itemColumn + i + 3));
      }
    }

    if (isEnemy === true) {
      // если ход врага
      // позиция не должна совпадать с позицией персонажа

      const selectedPositions = [];
      for (const item of [...this.userPositions, ...this.enemyPositions]) {
        selectedPositions.push(item.position);
      }
      //
      return allowedPositionsArray.filter(
        (item) => selectedPositions.indexOf(item) === -1,
      );
    }
    return allowedPositionsArray;
  }

  // стратегия врага
  enemyStratagy() {
    if (this.currentMove === "enemy") {
      // выбираем врага с самой сильной защитой врага
      const activeEnemy = [...this.enemyPositions].sort(
        (a, b) => a.character.attack - b.character.attack,
      )[0];
      // получаем возможные позиции для атаки
      const allowedEnemyDistanceAttacks = this.getAllowedPositions(
        activeEnemy.position,
        activeEnemy.character.distanceAttack,
      );
      // выбираем рандомно новую позицию врага
      const allowedEnemyPosition = this.getRandom(
        this.getAllowedPositions(
          activeEnemy.position,
          activeEnemy.character.distance,
          true,
        ),
      );
      const attackPerspective = [];
      // если персонаж игрока находится в области позиций для атаки
      for (const userPosition of [...this.userPositions]) {
        if (allowedEnemyDistanceAttacks.includes(userPosition.position)) {
          attackPerspective.push(userPosition);
        }
      }
      if (attackPerspective.length === 0) {
        // рандомно переставляем врага
        activeEnemy.position = allowedEnemyPosition;
        this.gamePlay.redrawPositions([
          ...this.userPositions,
          ...this.enemyPositions,
        ]);
        this.currentMove = "user";
      } else {
        // или атакуем врага
        const victim = [...attackPerspective].sort(
          (a, b) => a.character.defence - b.character.defence,
        )[0];
        this.characterAttacking(activeEnemy, victim);
      }
    }
  }

  EnemyCounterAttack(enemy, user) {
    if (this.currentMove === "enemy") {
      const attackedEnemy = enemy;
      // после атаки прсонажа получаем варианты атаки врага
      const allowedEnemyDistanceAttacks = this.getAllowedPositions(
        attackedEnemy.position,
        attackedEnemy.character.distanceAttack,
      );
      const allowedEnemyPosition = this.getRandom(
        this.getAllowedPositions(
          attackedEnemy.position,
          attackedEnemy.character.distance,
          true,
        ),
      );
      // если позиция персонажа есть среди вариантов атаки врага: контратакуем персонажа
      if (
        allowedEnemyDistanceAttacks.includes(user.position)
        && attackedEnemy.character.health > 0
        && attackedEnemy.character.defence > user.character.defence
      ) {
        this.characterAttacking(enemy, user);
        if (this.userPositions.length === 0) {
          this.blockedBoard = true;
        }
      } else {
        // если не можем контратаковать
        const attackPerspective = [];
        for (const userPosition of [...this.userPositions]) {
          if (allowedEnemyDistanceAttacks.includes(userPosition.position)) {
            attackPerspective.push(userPosition);
          }
        }
        if (attackPerspective.length === 0) {
          // рандомно переставляем врага
          attackedEnemy.position = allowedEnemyPosition;
          this.gamePlay.redrawPositions([
            ...this.userPositions,
            ...this.enemyPositions,
          ]);
          this.currentMove = "user";
        } else {
          // или атакуем врага
          const victim = [...attackPerspective].sort(
            (a, b) => a.character.defence - b.character.defence,
          )[0];
          this.characterAttacking(attackedEnemy, victim);
        }
      }
    }
  }
}
