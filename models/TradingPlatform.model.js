const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const TradingPlatform = sequelize.define(
    "TradingPlatform",
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
      category: {
        type: DataTypes.ENUM("prop", "futures", "both"),
        allowNull: false,
        defaultValue: "both",
      },
      logo_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      website_url: {
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
      tableName: "trading_platforms",
      timestamps: true,
      underscored: true,
    }
  );
  TradingPlatform.associate = (models) => {
    TradingPlatform.belongsToMany(models.Firm, {
      through: "firm_trading_platforms",
      foreignKey: "trading_platform_id",
      otherKey: "firm_id",
      as: "firms",
    });
  };

  return TradingPlatform;
};
