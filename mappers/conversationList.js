"use strict";
const user = require('../models/user');
const imageUrl = require('config').get('image').url

exports.toModel = entity => {
    const model = {
        receiver: entity.receiver,
        receiverId: entity.receiverId,
        sender: entity.sender,
        lastMsg: entity.lastMessage,
        profileImageName: entity.profileImageName ? `${imageUrl}${entity.profileImageName}` : "",
        status: entity.status,
        convertedId: entity.convertedId,
    };
    return model;
};


exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity);
    });
};