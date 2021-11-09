import Character from "../Character.js";
import Swordsman from "../characters/Swordsman.js";
import Vampire from "../characters/Vampire.js";

test("new Character: Error", () => {
  expect(() => new Character().toThrow());
});

test("new Swordsman", () => {
  const received = new Swordsman(1);
  const expected = {
    type: "swordsman",
    level: 1,
    health: 50,
    attack: 40,
    defence: 10,
    distance: 4,
    distanceAttack: 1,
  };
  expect(received).toEqual(expected);
});

test("new Vampire", () => {
  const received = new Vampire(1);
  const expected = {
    type: "vampire",
    level: 1,
    health: 50,
    attack: 25,
    defence: 25,
    distance: 2,
    distanceAttack: 2,
  };
  expect(received).toEqual(expected);
});
