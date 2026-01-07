const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const InstrumentType = sequelize.define(
    "InstrumentType",
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "instrument_types",
      timestamps: true,
      underscored: true,
    }
  );

  InstrumentType.associate = () => {};

  return InstrumentType;
};
