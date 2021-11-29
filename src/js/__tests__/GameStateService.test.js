import GameStateService from "../GameStateService.js";

test("load gamestate Error", () => {
  const stateServis = new GameStateService();
  const received = () => stateServis.load();
  const expected = "Invalid state";
  expect(received).toThrow(expected);
});
