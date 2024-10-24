'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Bookings', [
      // Forbidden: Not owned
      {
        spotId: 1,
        userId: 2,
        startDate: "2024-10-25", // Updated to current/future dates
        endDate: "2024-10-28"
      },
      // Forbidden: Can't change past bookings
      {
        spotId: 1,
        userId: 1,
        startDate: "2023-12-19", // Updated
        endDate: "2023-12-20",
      },
      // Use these to cause overlaps
      {
        spotId: 1,
        userId: 1,
        startDate: "2025-01-01", // Future booking
        endDate: "2025-01-10",
      },
      {
        spotId: 1,
        userId: 1,
        startDate: "2025-01-20",
        endDate: "2025-01-26",
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Bookings', {
      spotId: { [Op.in]: [1, 2] }
    }, {});
  }
};
