const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const EvaluationStage = sequelize.define(
    "EvaluationStage",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      stage_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      profit_target: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      max_daily_loss: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      max_total_loss: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      min_trading_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "evaluation_stages",
      timestamps: true,
      underscored: true,
    }
  );

  EvaluationStage.associate = (models) => {
    EvaluationStage.belongsTo(models.AccountType, {
      foreignKey: "account_type_id",
      as: "account_type",
    });
  };

  return EvaluationStage;
};
