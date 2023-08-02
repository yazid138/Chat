const sequelize = require('./db')

const databaseSync = async () => {
    await sequelize.sync({force: true});
    console.log("All models were synchronized successfully.");
}

module.exports = databaseSync