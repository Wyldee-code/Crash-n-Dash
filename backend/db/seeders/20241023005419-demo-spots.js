'use strict';

const spots = [
  {
    ownerId: 1, // assuming user with id 1 exists
    address: '123 Main St',
    city: 'San Francisco',
    state: 'California',
    country: 'United States',
    lat: 37.7749,
    lng: -122.4194,
    name: 'Beautiful Spot',
    description: 'A cozy spot in San Francisco',
    price: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    ownerId: 2, // assuming user with id 2 exists
    address: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'California',
    country: 'United States',
    lat: 34.0522,
    lng: -118.2437,
    name: 'Luxury Spot',
    description: 'A luxurious spot in Los Angeles',
    price: 250,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Spots', spots, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Spots', null, {});
  },
};
