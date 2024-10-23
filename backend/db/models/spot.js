'use strict';
module.exports = (sequelize, DataTypes) => {
  const Spot = sequelize.define('Spot', {
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  }, {});

  Spot.associate = function(models) {
    // Associations for Spots, such as:
    Spot.belongsTo(models.User, { foreignKey: 'ownerId', as: 'Owner' });
    Spot.hasMany(models.SpotImage, { foreignKey: 'spotId', as: 'SpotImages' });
    Spot.hasMany(models.Review, { foreignKey: 'spotId', as: 'Reviews' });
  };

  return Spot;
};
