"use strict";
const user = require('../models/user');
const imageUrl = require('config').get('image').url

exports.toModel = entity => {

    if (entity.friendId) {
        entity = entity.friendId
    }

    const model = {
        id: entity._id,
        username: entity.username,
        firstName: entity.firstName,
        lastName: entity.lastName,
        email: entity.email,
        password: entity.password,
        gender: entity.gender,
        avatar: entity.avatar ? `${imageUrl}${entity.avatar}` : "",
        phoneNo: entity.phoneNo,
        location: entity.location,
        status: entity.status,
        bio: entity.bio,
        website: entity.website,
        country: entity.country,
        token: entity.token
    };
    // if (entity.gallery && entity.gallery.length > 0) {
    //     for (let index = 0; index < entity.gallery.length; index++) {
    //         entity.gallery[index].image = `${imageUrl}${entity.gallery[index].image}`;
    //     }
    //     model.gallery = entity.gallery
    // }
    return model;

};


exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity);
    });
};