const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const FuturesExchange = sequelize.define(
    "FuturesExchange",
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
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "futures_exchanges",
      timestamps: true,
      underscored: true,
    }
  );
  FuturesExchange.associate = (models) => {
    FuturesExchange.belongsToMany(models.Firm, {
      through: "firm_futures_exchanges",
      foreignKey: "futures_exchange_id",
      otherKey: "firm_id",
      as: "firms",
    });
  };

  return FuturesExchange;
};
