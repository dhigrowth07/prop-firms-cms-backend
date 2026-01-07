const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Broker = sequelize.define(
    "Broker",
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
      broker_type: {
        type: DataTypes.ENUM("broker", "data_feed", "both"),
        allowNull: false,
        defaultValue: "broker",
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
      tableName: "brokers",
      timestamps: true,
      underscored: true,
    }
  );
  Broker.associate = (models) => {
    Broker.belongsToMany(models.Firm, {
      through: "firm_brokers",
      foreignKey: "broker_id",
      otherKey: "firm_id",
      as: "firms",
    });
  };

  return Broker;
};
