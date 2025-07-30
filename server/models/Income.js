// Income table
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Income = sequelize.define('Income', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }, 
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Reference to the User model
            key: 'id', // Foreign key in the Income table
        },
    }
  });

  //Associate Income with User
  Income.associate = (models) => {
    Income.belongsTo(models.User, { foreignKey: 'userID' }); 
  }

  return Income;
};
