'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Users' }
      },
      spotId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Spots' }
      },
      review: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      stars: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Reviews');
  }
};
