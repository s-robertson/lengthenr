'use strict';

module.exports = function (sequelize, DataTypes) {

    return sequelize.define('Url', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        original: { type: DataTypes.TEXT('long') },
        originalHash: { type: DataTypes.STRING(32) },
        lengthened: { type: DataTypes.TEXT('long') },
        lengthenedHash: { type: DataTypes.STRING(32) }
    }, {
        indexes: [
            {
                fields: ['originalHash'],
                method: 'BTREE'
            },
            {
                fields: ['lengthenedHash'],
                method: 'BTREE'
            }
        ]
    });
};
