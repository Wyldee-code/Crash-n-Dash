'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      username: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true, 
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error('Cannot be an email.');
            }
          }
        }
      },
      email: {
        type: Sequelize.STRING(256),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      hashedPassword: {
        type: Sequelize.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    return queryInterface.dropTable(options);
  }
};
