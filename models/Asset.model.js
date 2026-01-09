const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Asset = sequelize.define(
    "Asset",
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
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "assets",
      timestamps: true,
      underscored: true,
    }
  );

  Asset.associate = (models) => {
    Asset.belongsToMany(models.Firm, {
      through: "firm_assets",
      foreignKey: "asset_id",
      otherKey: "firm_id",
      as: "firms",
    });
  };

  return Asset;
};
