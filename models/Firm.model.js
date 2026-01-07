const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Firm = sequelize.define(
    "Firm",
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
      firm_type: {
        type: DataTypes.ENUM("prop_firm", "futures_firm"),
        allowNull: false,
      },
      logo_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      founded_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
      },
      review_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      max_allocation: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      guide_video_url: {
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
      tableName: "firms",
      timestamps: true,
      underscored: true,
    }
  );

  Firm.associate = (models) => {
    // Many-to-many with global references
    Firm.belongsToMany(models.TradingPlatform, {
      through: "firm_trading_platforms",
      foreignKey: "firm_id",
      otherKey: "trading_platform_id",
      as: "trading_platforms",
    });

    Firm.belongsToMany(models.Broker, {
      through: "firm_brokers",
      foreignKey: "firm_id",
      otherKey: "broker_id",
      as: "brokers",
    });

    Firm.belongsToMany(models.PayoutMethod, {
      through: "firm_payout_methods",
      foreignKey: "firm_id",
      otherKey: "payout_method_id",
      as: "payout_methods",
    });

    Firm.belongsToMany(models.PaymentMethod, {
      through: "firm_payment_methods",
      foreignKey: "firm_id",
      otherKey: "payment_method_id",
      as: "payment_methods",
    });

    // Futures-specific
    Firm.belongsToMany(models.FuturesExchange, {
      through: "firm_futures_exchanges",
      foreignKey: "firm_id",
      otherKey: "futures_exchange_id",
      as: "futures_exchanges",
    });

    Firm.hasMany(models.FuturesProgram, {
      foreignKey: "firm_id",
      as: "futures_programs",
    });

    // Prop-specific
    Firm.belongsToMany(models.Asset, {
      through: "firm_assets",
      foreignKey: "firm_id",
      otherKey: "asset_id",
      as: "assets",
    });

    Firm.hasMany(models.AccountType, {
      foreignKey: "firm_id",
      as: "account_types",
    });

    // Rules & policies
    Firm.hasMany(models.Rule, {
      foreignKey: "firm_id",
      as: "rules",
    });

    Firm.hasMany(models.PayoutPolicy, {
      foreignKey: "firm_id",
      as: "payout_policies",
    });

    // Coupons
    Firm.belongsToMany(models.Coupon, {
      through: models.FirmCoupon,
      foreignKey: "firm_id",
      otherKey: "coupon_id",
      as: "coupons",
    });

    // Restricted Countries
    Firm.belongsToMany(models.Country, {
      through: "firm_restricted_countries",
      foreignKey: "firm_id",
      otherKey: "country_id",
      as: "restricted_countries",
    });
  };

  return Firm;
};
