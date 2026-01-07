const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PaymentMethod = sequelize.define(
    "PaymentMethod",
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
      tableName: "payment_methods",
      timestamps: true,
      underscored: true,
    }
  );
  PaymentMethod.associate = (models) => {
    PaymentMethod.belongsToMany(models.Firm, {
      through: "firm_payment_methods",
      foreignKey: "payment_method_id",
      otherKey: "firm_id",
      as: "firms",
    });
  };

  return PaymentMethod;
};
