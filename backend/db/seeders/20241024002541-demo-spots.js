'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: "101 Pine Hill Rd",
        city: "Sedona",
        state: "Arizona",
        country: "United States",
        lat: 34.8697,
        lng: -111.7609,
        name: "Luxury Desert Retreat with Stunning Red Rock Views",
        description: "A peaceful desert retreat with incredible views of the Red Rocks. Perfect for relaxing and exploring the beautiful surroundings of Sedona. Enjoy the outdoor hot tub and spacious deck, perfect for stargazing at night.",
        price: 350,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 2,
        address: "202 Riverwalk Blvd",
        city: "Charleston",
        state: "South Carolina",
        country: "United States",
        lat: 32.7765,
        lng: -79.9311,
        name: "Charming Waterfront Home in Historic Charleston",
        description: "Nestled along the waterfront, this home offers Southern charm with modern amenities. Relax on the wraparound porch or take a boat ride to explore Charleston's rich history and vibrant culture.",
        price: 475,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 3,
        address: "303 Oceanview Dr",
        city: "Malibu",
        state: "California",
        country: "United States",
        lat: 34.0259,
        lng: -118.7798,
        name: "Contemporary Beach House with Private Access",
        description: "Wake up to the sound of waves in this modern beachfront home. Enjoy private access to the beach, outdoor dining with ocean views, and a peaceful setting for a perfect coastal getaway.",
        price: 800,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 4,
        address: "404 Mountain View Ln",
        city: "Aspen",
        state: "Colorado",
        country: "United States",
        lat: 39.1911,
        lng: -106.8175,
        name: "Ski Chalet with Cozy Fireplace and Mountain Views",
        description: "This luxury ski chalet is located in the heart of Aspen, offering breathtaking mountain views, a cozy fireplace, and easy access to world-class ski slopes. Perfect for winter adventures and relaxation.",
        price: 600,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 5,
        address: "505 Lakeshore Ave",
        city: "Burlington",
        state: "Vermont",
        country: "United States",
        lat: 44.4759,
        lng: -73.2121,
        name: "Lakefront Cottage with Private Dock and Kayaks",
        description: "A charming lakefront cottage with private dock access, ideal for kayaking, fishing, and enjoying the peaceful surroundings of Lake Champlain. The perfect summer escape with beautiful sunset views.",
        price: 300,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 6,
        address: "606 Forest Glen",
        city: "Gatlinburg",
        state: "Tennessee",
        country: "United States",
        lat: 35.7143,
        lng: -83.5102,
        name: "Mountain Cabin with Hot Tub and Scenic Trails",
        description: "Tucked away in the Smoky Mountains, this cozy cabin offers a private hot tub and access to scenic hiking trails. Perfect for nature lovers looking for a quiet retreat with modern comforts.",
        price: 220,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Spots', {
      address: {
        [Op.in]: [
          "101 Pine Hill Rd",
          "202 Riverwalk Blvd",
          "303 Oceanview Dr",
          "404 Mountain View Ln",
          "505 Lakeshore Ave",
          "606 Forest Glen"
        ]
      }
    }, {});
  }
};
