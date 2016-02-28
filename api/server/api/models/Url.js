'use strict';

module.exports = function (sequelize, DataTypes) {
    let Url = sequelize.define('Url', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        original: { type: DataTypes.STRING(500) },
        lengthened: { type: DataTypes.STRING(1000) }
    });

    return Url;
};
