'use strict';
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'user1@user.io',
        username: 'Demo-lition',
        firstName: "Martin",
        lastName: "Smith",
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        firstName: "Sarah",
        lastName: "Miller",
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user3@user.io',
        username: 'FakeUser3',
        firstName: "Mike",
        lastName: "Jones",
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'user4@user.io',
        username: 'FakeUser4',
        firstName: "Amy",
        lastName: "Gillespie",
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'user5@user.io',
        username: 'FakeUser5',
        firstName: "Hugh",
        lastName: "Diaz",
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'user6@user.io',
        username: 'FakeUser6',
        firstName: "Elise",
        lastName: "Poole",
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'user7@user.io',
        username: 'FakeUser7',
        firstName: "Cloe",
        lastName: "Ballard",
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'user8@user.io',
        username: 'FakeUser8',
        firstName: "Shawn",
        lastName: "Bryant",
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'user9@user.io',
        username: 'FakeUser9',
        firstName: "Lina",
        lastName: "Hayes",
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'user10@user.io',
        username: 'FakeUser10',
        firstName: "Keith",
        lastName: "Hayes",
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'user11@user.io',
        username: 'FakeUser11',
        firstName: "Andrew",
        lastName: "Hayes",
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'user12@user.io',
        username: 'FakeUser12',
        firstName: "Denise",
        lastName: "Hayes",
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
