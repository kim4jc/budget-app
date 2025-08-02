// Bins table
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bins = sequelize.define('Bins', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    percentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }, 
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Reference to the User model
            key: 'id', // Foreign key in the Bins table
        },
    }
  });

  //Associate Bins with User
  Bins.associate = (models) => {
    Bins.belongsTo(models.User, { foreignKey: 'userID' }); 
  }

  return Bins;
};
