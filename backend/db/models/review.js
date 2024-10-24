'use strict';
const { Model } = require('sequelize'); // Ensure sequelize is properly imported

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // associations can be defined here
      Review.belongsTo(models.Spot, { foreignKey: 'spotId' });
      Review.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Review.init(
    {
      review: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Spots', key: 'id' },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
      },
    },
    {
      sequelize,
      modelName: 'Review',
    }
  );
  return Review;
};
