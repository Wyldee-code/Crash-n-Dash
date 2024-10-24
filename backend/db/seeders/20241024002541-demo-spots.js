'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: "101 Pine Hill Rd",
        city: "Sedona",
        state: "Arizona",
        country: "United States",
        name: "Luxury Desert Retreat with Stunning Red Rock Views",
        description: "A peaceful desert retreat with incredible views of the Red Rocks. Perfect for relaxing and exploring the beautiful surroundings of Sedona. Enjoy the outdoor hot tub and spacious deck, perfect for stargazing at night.",
        price: 350
      },
      {
        ownerId: 2,
        address: "202 Riverwalk Blvd",
        city: "Charleston",
        state: "South Carolina",
        country: "United States",
        name: "Charming Waterfront Home in Historic Charleston",
        description: "Nestled along the waterfront, this home offers Southern charm with modern amenities. Relax on the wraparound porch or take a boat ride to explore Charleston's rich history and vibrant culture.",
        price: 475
      },
      {
        ownerId: 3,
        address: "303 Oceanview Dr",
        city: "Malibu",
        state: "California",
        country: "United States",
        name: "Contemporary Beach House with Private Access",
        description: "Wake up to the sound of waves in this modern beachfront home. Enjoy private access to the beach, outdoor dining with ocean views, and a peaceful setting for a perfect coastal getaway.",
        price: 800
      },
      {
        ownerId: 4,
        address: "404 Mountain View Ln",
        city: "Aspen",
        state: "Colorado",
        country: "United States",
        name: "Ski Chalet with Cozy Fireplace and Mountain Views",
        description: "This luxury ski chalet is located in the heart of Aspen, offering breathtaking mountain views, a cozy fireplace, and easy access to world-class ski slopes. Perfect for winter adventures and relaxation.",
        price: 600
      },
      {
        ownerId: 5,
        address: "505 Lakeshore Ave",
        city: "Burlington",
        state: "Vermont",
        country: "United States",
        name: "Lakefront Cottage with Private Dock and Kayaks",
        description: "A charming lakefront cottage with private dock access, ideal for kayaking, fishing, and enjoying the peaceful surroundings of Lake Champlain. The perfect summer escape with beautiful sunset views.",
        price: 300
      },
      {
        ownerId: 6,
        address: "606 Forest Glen",
        city: "Gatlinburg",
        state: "Tennessee",
        country: "United States",
        name: "Mountain Cabin with Hot Tub and Scenic Trails",
        description: "Tucked away in the Smoky Mountains, this cozy cabin offers a private hot tub and access to scenic hiking trails. Perfect for nature lovers looking for a quiet retreat with modern comforts.",
        price: 220
      },
      {
        ownerId: 7,
        address: "707 Seaside Rd",
        city: "Cape May",
        state: "New Jersey",
        country: "United States",
        name: "Victorian Seaside House with Ocean Views",
        description: "Step back in time in this Victorian seaside house with panoramic ocean views. Enjoy the charm of Cape May's historic district, just steps away from the beach and local attractions.",
        price: 400
      },
      {
        ownerId: 8,
        address: "808 Riverbend Way",
        city: "Bozeman",
        state: "Montana",
        country: "United States",
        name: "Rustic Riverfront Lodge with Fishing and Hiking",
        description: "This spacious riverfront lodge offers direct access to some of the best fishing and hiking in Montana. Enjoy the rustic charm with modern amenities, perfect for outdoor enthusiasts.",
        price: 350
      },
      {
        ownerId: 9,
        address: "909 Garden Grove",
        city: "Savannah",
        state: "Georgia",
        country: "United States",
        name: "Charming Garden Cottage in Historic Savannah",
        description: "A delightful garden cottage located in the heart of Savannah's historic district. Ideal for those looking to explore the city's rich history while enjoying the comfort of a private, serene setting.",
        price: 275
      },
      {
        ownerId: 10,
        address: "1010 Hilltop Dr",
        city: "Stowe",
        state: "Vermont",
        country: "United States",
        name: "Hilltop Retreat with Stunning Mountain Views",
        description: "This hilltop retreat offers unparalleled mountain views and is located just minutes from Stowe's ski resorts. Perfect for a relaxing getaway with family or friends in any season.",
        price: 450
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Spots', {
      address: { [Op.in]: ["101 Pine Hill Rd", "202 Riverwalk Blvd", "303 Oceanview Dr", "404 Mountain View Ln", "505 Lakeshore Ave", "606 Forest Glen", "707 Seaside Rd", "808 Riverbend Way", "909 Garden Grove", "1010 Hilltop Dr"] }
    }, {});
  }
};
