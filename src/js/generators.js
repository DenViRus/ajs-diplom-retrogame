/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  const characterLevel = Math.ceil(Math.random() * maxLevel);
  const characterType = Math.floor(Math.random() * allowedTypes.length);
  yield new allowedTypes[characterType](characterLevel);
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const team = [];
  for (let i = 0; i < characterCount; i++) {
    const character = characterGenerator(allowedTypes, maxLevel);
    team.push(character.next().value);
  }
  team.forEach((item) => {
    const character = item;
    character.attack += Math.floor(
      (character.level - 1) * (character.attack / 4),
    );
    character.defence += Math.floor(
      (character.level - 1) * (character.defence / 4),
    );
    character.health += Math.floor(
      (character.level - 1) * (character.health / 4),
    );
  });
  return team;
}
