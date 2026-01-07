const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Rule = sequelize.define(
    "Rule",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      category: {
        type: DataTypes.ENUM("trading", "risk", "consistency", "payout"),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "rules",
      timestamps: true,
      underscored: true,
    }
  );

  Rule.associate = (models) => {
    Rule.belongsTo(models.Firm, {
      foreignKey: "firm_id",
      as: "firm",
    });
  };

  return Rule;
};
