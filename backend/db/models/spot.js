'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      // Association to User model (Spot belongs to User)
      Spot.belongsTo(models.User, { foreignKey: 'ownerId' });

      // Association to SpotImages model (Spot has many SpotImages)
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId', onDelete: 'CASCADE' });

      // Other associations such as reviews, bookings can be added here later if needed
    }
  }

  Spot.init({
    name: {
      type: DataTypes.STRING(50),
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
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Spot',
  });

  return Spot;
};
