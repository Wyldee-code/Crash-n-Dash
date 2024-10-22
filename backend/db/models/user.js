'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here if any
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      },
      firstName: {  // Add firstName field
        type: DataTypes.STRING(50),
        allowNull: false
      },
      lastName: {  // Add lastName field
        type: DataTypes.STRING(50),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: { exclude: ['hashedPassword'] }
      },
      scopes: {
        currentUser: {
          attributes: { include: ['firstName', 'lastName', 'email', 'createdAt', 'updatedAt'] }
        },
      }
    }
  );

  return User;
};
