// Expenses table
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define('Expense', {
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
            key: 'id', // Foreign key in the Expenses table
        },
    }
  });

  //Associate Expense with User
  Expense.associate = (models) => {
    Expense.belongsTo(models.User, { foreignKey: 'userID' }); 
  }

  return Expense;
};
