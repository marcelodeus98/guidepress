const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('guidepress', 'root', '@Dark980', {
    host: 'localhost',
    port:3306,
    dialect: 'mysql'
});

// CONNECT DATABASE
sequelize.authenticate().then(() => {
    console.log('Connect with database, sucess!');
}).catch(() => {
    console.log('Error: Database not connect!');
});

module.exports = sequelize;