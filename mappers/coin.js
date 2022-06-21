"use strict";
const imageUrl = require('config').get('image').url

exports.toModel = entity => {
    const model = {
        _id: entity._id,
        coins: entity.coins,
        price: entity.price,
        isFree: entity.isFree,
        isPopular: entity?.isPopular,
        isOnDailyOffer: entity?.isOnDailyOffer,
        category: entity.category,
        status: entity.status,
        iconUrl: entity.icon ? `${imageUrl}${entity.icon}` : "",
    };
    return model;
};


exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity);
    });
};

