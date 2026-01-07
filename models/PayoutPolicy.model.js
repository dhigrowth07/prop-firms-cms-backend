const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PayoutPolicy = sequelize.define(
    "PayoutPolicy",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      payout_frequency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      first_payout_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      profit_split_initial: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      profit_split_max: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      program_type: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Program type/variant for grouping (e.g., '1-Step', '2-Step', '3-Step', 'FundingPips Pro', 'FundingPips Zero', 'Scaling Hot Seat')",
      },
    },
    {
      tableName: "payout_policies",
      timestamps: true,
      underscored: true,
    }
  );

  PayoutPolicy.associate = (models) => {
    PayoutPolicy.belongsTo(models.Firm, {
      foreignKey: "firm_id",
      as: "firm",
    });
  };

  return PayoutPolicy;
};
