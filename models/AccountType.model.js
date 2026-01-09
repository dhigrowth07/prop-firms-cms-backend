const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const AccountType = sequelize.define(
    "AccountType",
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
      starting_balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      profit_target: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      daily_drawdown: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      max_drawdown: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      profit_split: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      evaluation_required: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      program_variant: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      program_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "account_types",
      timestamps: true,
      underscored: true,
    }
  );

  AccountType.associate = (models) => {
    AccountType.belongsTo(models.Firm, {
      foreignKey: "firm_id",
      as: "firm",
    });

    AccountType.hasMany(models.EvaluationStage, {
      foreignKey: "account_type_id",
      as: "evaluation_stages",
    });

    AccountType.belongsToMany(models.Coupon, {
      through: models.CouponAccountType,
      foreignKey: "account_type_id",
      otherKey: "coupon_id",
      as: "coupons",
    });

    AccountType.hasMany(models.Commission, {
      foreignKey: "account_type_id",
      as: "commissions",
    });
  };

  return AccountType;
};
