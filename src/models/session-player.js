module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'SessionPlayer',
    {
      player_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      session_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      nickname: { type: DataTypes.STRING(20), allowNull: false },
      score: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      current_stage: {
        type: DataTypes.STRING(24),
        allowNull: false,
        defaultValue: 'campus',
      },
      time_penalty_sec: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      token_expires_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: 'session_players', timestamps: false }
  );