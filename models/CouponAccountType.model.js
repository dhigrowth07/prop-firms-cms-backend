const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CouponAccountType = sequelize.define(
    "CouponAccountType",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    },
    {
      tableName: "coupon_account_types",
      timestamps: true,
      underscored: true,
    }
  );

  CouponAccountType.associate = (models) => {
    CouponAccountType.belongsTo(models.Coupon, {
      foreignKey: "coupon_id",
      as: "coupon",
    });
    CouponAccountType.belongsTo(models.AccountType, {
      foreignKey: "account_type_id",
      as: "account_type",
    });
  };

  return CouponAccountType;
};
