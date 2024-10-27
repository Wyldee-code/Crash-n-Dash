'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Reviews', [
      {
        userId: 1,
        spotId: 1,
        review: 'Beautiful place, enjoyed my stay!',
        stars: 5
      },
      {
        userId: 2,
        spotId: 1,
        review: 'Good experience, but could be cleaner.',
        stars: 4
      },
      // Additional review entries as needed
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Reviews', null, {});
  }
};
