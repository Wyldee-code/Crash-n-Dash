'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SpotImages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spotId: {
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.TEXT
      },
      preview: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });

    await queryInterface.addIndex(
      'SpotImages',
      ['spotId', 'preview'],
      {
        name: 'at-most-one-preview-per-spot',
        where: { preview: true },
        unique: true
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SpotImages');

    await queryInterface.removeIndex('SpotImages', 'at-most-one-preview-per-spot')
  }
};
