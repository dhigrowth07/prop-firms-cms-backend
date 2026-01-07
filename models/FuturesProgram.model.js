const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const FuturesProgram = sequelize.define(
    "FuturesProgram",
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
      account_size: {
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
      max_drawdown: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      trailing_drawdown: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      reset_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "futures_programs",
      timestamps: true,
      underscored: true,
    }
  );

  FuturesProgram.associate = (models) => {
    FuturesProgram.belongsTo(models.Firm, {
      foreignKey: "firm_id",
      as: "firm",
    });

    FuturesProgram.hasMany(models.Commission, {
      foreignKey: "futures_program_id",
      as: "commissions",
    });
  };

  return FuturesProgram;
};
