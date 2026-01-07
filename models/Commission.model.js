const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Commission = sequelize.define(
    "Commission",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      account_type_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "account_types",
          key: "id",
        },
      },
      futures_program_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "futures_programs",
          key: "id",
        },
      },
      asset_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      commission_type: {
        type: DataTypes.ENUM("per_lot", "percentage", "fixed", "none"),
        allowNull: false,
        defaultValue: "none",
      },
      commission_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      commission_text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "commissions",
      timestamps: true,
      underscored: true,
    }
  );

  Commission.associate = (models) => {
    Commission.belongsTo(models.AccountType, {
      foreignKey: "account_type_id",
      as: "account_type",
    });

    Commission.belongsTo(models.FuturesProgram, {
      foreignKey: "futures_program_id",
      as: "futures_program",
    });
  };

  return Commission;
};
