// What the Library Game Hub shows about YOUR game (Hub Contract, rule 1).
// Lab Step 6: replace every CHANGE_ME value with your own.
const pkg = require('../../package.json');

module.exports = {
  slug: 'campus-escape',            // your group's game, lower case with hyphens, for example shelf-climb
  name: 'Campus Escape',            // the name players will see
  team: 'Team 6 (3-2)',            // your group's name and section, for example Bookworms (3-1)
  developer: 'gianreyes068-cyber',       // YOUR GitHub username: this build is yours
  description: 'A fun and educational game where players must escape the campus while answering a question.',     // one sentence about how the game is played
  min_players: 1,               // change to the limits your game is designed for
  max_players: 30,
  version: pkg.version,         // read from package.json, do not edit here
};
