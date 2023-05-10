const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('guidepress', 'root', '@Dark980', {
    host: 'localhost',
    port:3306,
    dialect: 'mysql',
    timezone: '-03:00',
    logging: false
});

// CONNECT DATABASE
sequelize.authenticate().then(() => {
    console.log('Connect with database, sucess!');
}).catch(() => {
    console.log('Error: Database not connect!');
});

module.exports = sequelize;