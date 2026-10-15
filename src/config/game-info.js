// What the Library Game Hub shows about YOUR game (Hub Contract, rule 1).
// Lab Step 6: replace every CHANGE_ME value with your own.
const pkg = require('../../package.json');

module.exports = {
  slug: 'campus-escape',            // your group's game, lower case with hyphens, for example shelf-climb
  name: 'Campus Escape',            // the name players will see
  team: 'BSCS 3-2',            // your group's name and section, for example Bookworms (3-1)
  developer: 'gianreyes068-cyber',       // YOUR GitHub username: this build is yours
  description: 'The game is all about educational purpose and content that build in fun ways',     // one sentence about how the game is played
  min_players: 1,               // change to the limits your game is designed for
  max_players: 40,
  version: pkg.version,         // read from package.json, do not edit here
};
