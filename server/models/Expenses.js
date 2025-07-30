// Expenses table
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Expenses = sequelize.define('Expenses', {
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
        allowNull: true, // Should be false when authenication is implemented
        references: {
            model: 'Users', // Reference to the User model
            key: 'id', // Foreign key in the Expenses table
        },
    }
  });

  //Associate Expenses with User
  Expenses.associate = (models) => {
    Expenses.belongsTo(models.User, { foreignKey: 'userID' }); 
  }

  return Expenses;
};
