const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Coupon = sequelize.define(
    "Coupon",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      discount_text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      discount_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      discount_type: {
        type: DataTypes.ENUM("percentage", "fixed"),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "coupons",
      timestamps: true,
      underscored: true,
    }
  );

  Coupon.associate = (models) => {
    Coupon.belongsToMany(models.Firm, {
      through: models.FirmCoupon,
      foreignKey: "coupon_id",
      otherKey: "firm_id",
      as: "firms",
    });

    Coupon.belongsToMany(models.AccountType, {
      through: models.CouponAccountType,
      foreignKey: "coupon_id",
      otherKey: "account_type_id",
      as: "account_types",
    });
  };

  return Coupon;
};
