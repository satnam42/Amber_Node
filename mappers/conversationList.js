"use strict";
const user = require('../models/user');
const imageUrl = require('config').get('image').url

exports.toModel = entity => {

    const model = {
        user1: entity.user1,
        user1Id: entity.user1Id,
        user1Image: entity.user1Image ? `${imageUrl}${entity.user1Image}` : "",
        user2: entity.user2,
        user2Id: entity.user2Id,
        user2Image: entity.user2Image ? `${imageUrl}${entity.user2Image}` : "",
        // sender: entity.sender,
        // lastMsg: entity.lastMessage,
        // profileImageName: entity.profileImageName ? `${imageUrl}${entity.profileImageName}` : "",
        status: entity.status,
        conversationId: entity.conversationId,
    };
    return model;
};

exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity);
    });
};