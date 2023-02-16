const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const DownloadedFiles =  sequelize.define('downloadedfile',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull: false,
        primaryKey: true
    },
    download:{
        type:Sequelize.STRING,
        allowNull: false
    }
});

module.exports = DownloadedFiles;