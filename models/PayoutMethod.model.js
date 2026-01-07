const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PayoutMethod = sequelize.define(
    "PayoutMethod",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      logo_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "payout_methods",
      timestamps: true,
      underscored: true,
    }
  );
  PayoutMethod.associate = (models) => {
    PayoutMethod.belongsToMany(models.Firm, {
      through: "firm_payout_methods",
      foreignKey: "payout_method_id",
      otherKey: "firm_id",
      as: "firms",
    });
  };

  return PayoutMethod;
};
