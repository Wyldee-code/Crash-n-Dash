// 'use strict';
// const { Model, Validator } = require('sequelize');
// const bcrypt = require('bcryptjs');

// module.exports = (sequelize, DataTypes) => {
//   class User extends Model {
//     toSafeObject() {
//       const { id, username, email, firstName, lastName } = this; // context will be the User instance
//       return { id, username, email, firstName, lastName };
//     }
//     validatePassword(password) {
//       return bcrypt.compareSync(password, this.hashedPassword.toString());
//     }

//     static getCurrentUserById(id) {
//       return User.scope("currentUser").findByPk(id);
//     }
//     static async login({ credential, password }) {
//       const { Op } = require('sequelize');
//       const user = await User.scope('loginUser').findOne({
//         where: {
//           [Op.or]: {
//             username: credential,
//             email: credential
//           }
//         }
//       });
//       if (user && user.validatePassword(password)) {
//         return await User.scope('currentUser').findByPk(user.id);
//       }
//     }
//     static async signup({ username, email, password, firstName, lastName }) {
//       const hashedPassword = bcrypt.hashSync(password);
//       const user = await User.create({
//         username,
//         email,
//         hashedPassword,
//         firstName,
//         lastName
//       });
//       return await User.scope('currentUser').findByPk(user.id);
//     }
//     static associate(models) {
//       User.hasMany(models.Spot, { foreignKey: "ownerId" });
//       User.hasMany(models.Booking, { foreignKey: "userId" });
//       User.hasMany(models.Review, { foreignKey: "userId" });
//     }
//   };

//   User.init(
//     {
//       username: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//           len: [4, 30],
//           isNotEmail(value) {
//             if (Validator.isEmail(value)) {
//               throw new Error("Cannot be an email.");
//             }
//           }
//         }
//       },
//       firstName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//           len: [1, 30],
//         }
//       },
//       lastName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//           len: [1, 30],
//         }
//       },
//       email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//           len: [3, 256],
//           isEmail: true
//         }
//       },
//       hashedPassword: {
//         type: DataTypes.STRING.BINARY,
//         allowNull: false,
//         validate: {
//           len: [60, 60]
//         }
//       }
//     },
//     {
//       sequelize,
//       modelName: "User",
//       defaultScope: {
//         attributes: {
//           exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
//         }
//       },
//       scopes: {
//         currentUser: {
//           attributes: { exclude: ["hashedPassword", "createdAt", "updatedAt"] }
//         },
//         loginUser: {
//           attributes: {}
//         }
//       }
//     }
//   );
//   return User;
// };


'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Returns a safe, limited set of user fields for response objects.
     */
    toSafeObject() {
      const { id, username, email, firstName, lastName } = this;
      return { id, username, email, firstName, lastName };
    }

    /**
     * Validates a password against the hashed password in the database.
     */
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }

    /**
     * Retrieves a user by ID with restricted scope to exclude sensitive fields.
     */
    static getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
    }

    /**
     * Authenticates a user with a given credential and password.
     */
    static async login({ credential, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
      if (user && user.validatePassword(password)) {
        return User.scope('currentUser').findByPk(user.id);
      }
      throw new Error('Invalid username or password');
    }

    /**
     * Registers a new user with provided details and hashes their password.
     */
    static async signup({ username, email, password, firstName, lastName }) {
      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      const user = await User.create({
        username,
        email,
        hashedPassword,
        firstName,
        lastName
      });
      return User.scope('currentUser').findByPk(user.id);
    }

    /**
     * Defines model associations.
     */
    static associate(models) {
      // Checks if associated models are loaded before setting up associations
      if (!models.Spot || !models.Booking || !models.Review) {
        throw new Error('Model associations failed due to missing models');
      }
      User.hasMany(models.Spot, { foreignKey: 'ownerId' });
      User.hasMany(models.Booking, { foreignKey: 'userId' });
      User.hasMany(models.Review, { foreignKey: 'userId' });
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Username cannot be an email.");
          }
        }
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 30],
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 30],
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
        len: [60, 60] // Ensures hashed password is the correct length
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
      }
    },
    scopes: {
      currentUser: {
        attributes: { exclude: ['hashedPassword', 'createdAt', 'updatedAt'] }
      },
      loginUser: {
        attributes: {}
      }
    }
  });

  return User;
};

