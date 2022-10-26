'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Games', {
      id: {
        type: Sequelize.BIGINT(11),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      Title: {
        type: Sequelize.STRING(250),
        allowNull: false
      },
      Md5: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      Description: {
        type: Sequelize.STRING(1500),
        allowNull: false
      },
      Instructions: {
        type: Sequelize.STRING(1500),
        allowNull: false
      },
      Type: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      Type: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      SubType: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      Mobile: {
        type: Sequelize.BOOLEAN,
            defaultValue: false,
      },
      MobileMode: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      Height: {
        type: Sequelize.BIGINT(11),
        allowNull: false
      },
        Width: {
        type: Sequelize.BIGINT(11),
        allowNull: false
      },
      Url: {
        type: Sequelize.STRING(250),
        defaultValue: false,
        unique: true
      },
      Asset: {
        type: Sequelize.JSON,
            allowNull: false
      },
      Category: {
        type: Sequelize.JSON,
            allowNull: false
      },
        Tag: {
        type: Sequelize.JSON,
            allowNull: false
      },
        Bundle: {
        type: Sequelize.JSON,
            allowNull: false
      },
      Company: {
        type: Sequelize.STRING(250),
            defaultValue: false,
      },
      TubiaUrl: {
        type: Sequelize.STRING(250),
            defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Games');
  }
};