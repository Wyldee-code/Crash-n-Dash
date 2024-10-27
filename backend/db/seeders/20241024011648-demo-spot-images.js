'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('SpotImages', [
      {
        spotId: 1,
        url: 'https://photos.zillowstatic.com/fp/20d4b85a362856401d33e5e428e1f29b-p_e.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2,
        url: 'https://lirp.cdn-website.com/898ba33d/dms3rep/multi/opt/ext2-430w.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3,
        url: 'https://media.architecturaldigest.com/photos/6542bb677d8a4f7231a90adc/1:1/w_3000,h_3000,c_limit/29%2026808MalibuCoveColony-MLS-virtuallyherestudios-88.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 4,
        url: 'https://www.cuvee.com/files/2024/05/One-Aspen-29.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 5,
        url: 'https://media.vrbo.com/lodging/96000000/95380000/95373900/95373893/48bd32d7.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 6,
        url: 'https://media.vrbo.com/lodging/61000000/60540000/60536200/60536124/166f1ac2.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('SpotImages', {
      url: {
        [Op.in]: [
          'https://photos.zillowstatic.com/fp/20d4b85a362856401d33e5e428e1f29b-p_e.jpg',
          'https://lirp.cdn-website.com/898ba33d/dms3rep/multi/opt/ext2-430w.jpg',
          'https://media.architecturaldigest.com/photos/6542bb677d8a4f7231a90adc/1:1/w_3000,h_3000,c_limit/29%2026808MalibuCoveColony-MLS-virtuallyherestudios-88.jpg',
          'https://www.cuvee.com/files/2024/05/One-Aspen-29.jpg',
          'https://media.vrbo.com/lodging/96000000/95380000/95373900/95373893/48bd32d7.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill',
          'https://media.vrbo.com/lodging/61000000/60540000/60536200/60536124/166f1ac2.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill',
        ]
      }
    }, {});
  }
};
