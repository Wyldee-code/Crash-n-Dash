'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Define schema in options object for Postgres
}

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'Bookings',
      [
        {
          startDate: '2024-01-15',
          endDate: '2024-01-20',
          spotId: 1, // Assuming spotId 1 exists in your Spots table
          userId: 1, // Assuming userId 1 exists in your Users table
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          startDate: '2024-02-10',
          endDate: '2024-02-15',
          spotId: 2,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          startDate: '2024-03-05',
          endDate: '2024-03-10',
          spotId: 3,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      options
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    return queryInterface.bulkDelete(options, null, {});
  }
};
