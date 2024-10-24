'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('SpotImages', [
      {
        spotId: 1,
        url: "/images/sedona_01.webp",
        preview: true
      },
      {
        spotId: 1,
        url: "/images/sedona_02.webp",
        preview: false
      },
      {
        spotId: 1,
        url: "/images/sedona_03.webp",
        preview: false
      },
      {
        spotId: 2,
        url: "/images/charleston_01.webp",
        preview: true
      },
      {
        spotId: 2,
        url: "/images/charleston_02.webp",
        preview: false
      },
      {
        spotId: 3,
        url: "/images/malibu_01.webp",
        preview: true
      },
      {
        spotId: 3,
        url: "/images/malibu_02.webp",
        preview: false
      },
      {
        spotId: 4,
        url: "/images/aspen_01.webp",
        preview: true
      },
      {
        spotId: 5,
        url: "/images/burlington_01.webp",
        preview: true
      },
      {
        spotId: 6,
        url: "/images/gatlinburg_01.webp",
        preview: true
      },
      {
        spotId: 7,
        url: "/images/capemay_01.webp",
        preview: true
      },
      {
        spotId: 8,
        url: "/images/bozeman_01.webp",
        preview: true
      },
      {
        spotId: 9,
        url: "/images/savannah_01.webp",
        preview: true
      },
      {
        spotId: 10,
        url: "/images/stowe_01.webp",
        preview: true
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('SpotImages', {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    }, {});
  }
};
