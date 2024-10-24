'use strict';

module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Spots', key: 'id' }, // Foreign key to Spots
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' }, // Foreign key to Users
    },
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.Spot, { foreignKey: 'spotId' });
    Booking.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Booking;
};
