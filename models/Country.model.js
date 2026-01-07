const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Country = sequelize.define(
    "Country",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      code: {
        type: DataTypes.STRING(2),
        allowNull: false,
        unique: true,
        validate: {
          len: [2, 2],
        },
      },
      flag_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "countries",
      timestamps: true,
      underscored: true,
    }
  );

  Country.associate = (models) => {
    Country.belongsToMany(models.Firm, {
      through: "firm_restricted_countries",
      foreignKey: "country_id",
      otherKey: "firm_id",
      as: "firms",
    });
  };

  return Country;
};
