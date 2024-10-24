'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Define schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        name: 'Cozy Beach House',
        description: 'A lovely house by the beach, perfect for a weekend getaway.',
        price: 250,
        ownerId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mountain Cabin',
        description: 'A quiet cabin in the mountains with a stunning view.',
        price: 300,
        ownerId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'City Loft',
        description: 'A modern loft in the heart of the city.',
        price: 200,
        ownerId: 3, 
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options, null, {});
  }
};
