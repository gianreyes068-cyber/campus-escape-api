module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'QuestionSet',
    {
      question_set_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING(80), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      subject: { type: DataTypes.STRING(80), allowNull: false },
      grade_level: { type: DataTypes.STRING(40), allowNull: false },
    },
    {
      tableName: 'question_sets',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );