'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,  // Assuming we have a User with id 1
        address: '123 Main Street',
        city: 'Los Angeles',
        state: 'California',
        country: 'USA',
        lat: 34.0522,
        lng: -118.2437,
        name: 'Cozy Apartment',
        description: 'A cozy apartment in the heart of the city.',
        price: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 2,
        address: '456 Ocean Drive',
        city: 'Miami',
        state: 'Florida',
        country: 'USA',
        lat: 25.7617,
        lng: -80.1918,
        name: 'Beach House',
        description: 'A beautiful beach house with ocean view.',
        price: 300,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Spots', null, {});
  }
};
