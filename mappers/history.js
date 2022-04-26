"use strict";
const imageUrl = require('config').get('image').url

exports.toModel = entity => {

    const model = {
        toUser: entity.toUser.firstName,
        fromUser: entity.fromUser.firstName,
        toUserId: entity.toUser._id,
        fromUserId: entity.fromUser._id,
        toUserAvatar: entity.toUser.avatar ? `${imageUrl}${entity.toUser.avatar}` : "",
        fromUserAvatar: entity.fromUser.avatar ? `${imageUrl}${entity.fromUser.avatar}` : "",
        duration: entity.duration,
        time: entity.time,
        createdAt: entity.createdAt
    };

    return model;

};


exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity);
    });
};