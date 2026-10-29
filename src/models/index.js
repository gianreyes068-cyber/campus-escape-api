// Every other file imports this one Sequelize instance.
const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.nodeEnv];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Load all models after creating the Sequelize instance.
const User = require('./user')(sequelize, DataTypes);
const QuestionSet = require('./question-set')(sequelize, DataTypes);
const Session = require('./session')(sequelize, DataTypes);
const SessionPlayer = require('./session-player')(sequelize, DataTypes);

// Define the table relationships.
User.hasMany(QuestionSet, { foreignKey: 'user_id' });
QuestionSet.belongsTo(User, { foreignKey: 'user_id' });

QuestionSet.hasMany(Session, { foreignKey: 'question_set_id' });
Session.belongsTo(QuestionSet, { foreignKey: 'question_set_id' });

Session.hasMany(SessionPlayer, { foreignKey: 'session_id' });
SessionPlayer.belongsTo(Session, { foreignKey: 'session_id' });

User.hasMany(SessionPlayer, { foreignKey: 'user_id' });
SessionPlayer.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  User,
  QuestionSet,
  Session,
  SessionPlayer,
};