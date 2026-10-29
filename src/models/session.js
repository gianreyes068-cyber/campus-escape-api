module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Session',
    {
      session_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question_set_id: { type: DataTypes.INTEGER, allowNull: false },
      join_code: { type: DataTypes.STRING(6), allowNull: false, unique: true },
      status: {
        type: DataTypes.STRING(16),
        allowNull: false,
        defaultValue: 'waiting',
      },
      duration_sec: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 360,
      },
      started_at: { type: DataTypes.DATE, allowNull: true },
      ended_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: 'sessions', timestamps: false }
  );