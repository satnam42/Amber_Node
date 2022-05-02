"use strict";
const imageUrl = require('config').get('image').url

exports.toModel = entity => {
    const model = {
        userId: entity.userId,
        name: entity.firstName,
        image: entity.image ? `${imageUrl}${entity.image}` : "",
        conversationId: entity.conversationId,
    };
    if (entity.isBlocked == true || entity.isBlocked == false) {
        model.isBlocked = entity.isBlocked
    }
    return model;
};


exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity);
    });
};