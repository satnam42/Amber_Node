"use strict";
const imageUrl = require('config').get('image').url

exports.toModel = entity => {

    const model = {
        id: entity._id,
        msgFrom: entity.sender,
        msg: entity.content,
        gift: {
            title: entity.gift.title,
            icon: entity.gift.icon ? `${imageUrl}${entity.gift.icon}` : "",
            coin: entity.gift.coin,
            id: entity.gift._id
        },
        date: entity.createdAt
    };

    return model;

};


exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity);
    });
};