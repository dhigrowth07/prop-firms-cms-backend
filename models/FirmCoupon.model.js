const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const FirmCoupon = sequelize.define(
    "FirmCoupon",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    },
    {
      tableName: "firm_coupons",
      timestamps: true,
      underscored: true,
    }
  );

  FirmCoupon.associate = (models) => {
    FirmCoupon.belongsTo(models.Firm, {
      foreignKey: "firm_id",
      as: "firm",
    });
    FirmCoupon.belongsTo(models.Coupon, {
      foreignKey: "coupon_id",
      as: "coupon",
    });
  };

  return FirmCoupon;
};
