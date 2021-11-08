import { calcTileType } from "../utils.js";

test("calcTileType: top-left", () => {
  const received = calcTileType(0, 8);
  const expected = "top-left";
  expect(received).toBe(expected);
});

test("calcTileType: top-right", () => {
  const received = calcTileType(7, 8);
  const expected = "top-right";
  expect(received).toBe(expected);
});

test("calcTileType: top 1", () => {
  const received = calcTileType(1, 8);
  const expected = "top";
  expect(received).toBe(expected);
});

test("calcTileType: top 2", () => {
  const received = calcTileType(6, 8);
  const expected = "top";
  expect(received).toBe(expected);
});

test("calcTileType: bottom-left", () => {
  const received = calcTileType(56, 8);
  const expected = "bottom-left";
  expect(received).toBe(expected);
});

test("calcTileType: bottom-right", () => {
  const received = calcTileType(63, 8);
  const expected = "bottom-right";
  expect(received).toBe(expected);
});

test("calcTileType: bottom 1", () => {
  const received = calcTileType(57, 8);
  const expected = "bottom";
  expect(received).toBe(expected);
});

test("calcTileType: bottom 2", () => {
  const received = calcTileType(62, 8);
  const expected = "bottom";
  expect(received).toBe(expected);
});

test("calcTileType: left 1", () => {
  const received = calcTileType(8, 8);
  const expected = "left";
  expect(received).toBe(expected);
});

test("calcTileType: left 2", () => {
  const received = calcTileType(48, 8);
  const expected = "left";
  expect(received).toBe(expected);
});

test("calcTileType: right 1", () => {
  const received = calcTileType(15, 8);
  const expected = "right";
  expect(received).toBe(expected);
});

test("calcTileType: right 2", () => {
  const received = calcTileType(55, 8);
  const expected = "right";
  expect(received).toBe(expected);
});

test("calcTileType: center 1", () => {
  const received = calcTileType(9, 8);
  const expected = "center";
  expect(received).toBe(expected);
});

test("calcTileType: center 2", () => {
  const received = calcTileType(54, 8);
  const expected = "center";
  expect(received).toBe(expected);
});
