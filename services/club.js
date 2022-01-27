

const join = async (model, context) => {
    const log = context.logger.start(`services:club:join`);
    const query = {
        name: model.clubName,
        members: { $elemMatch: { $eq: model.userId, } }
    }

    const members = await db.club.find(query)

    if (members && members.length > 0) {
        return members
        // throw new Error('user already clubed')
    }

    const query2 = {
        name: model.clubName,
        // members: {  $ne: model.userId, } }
        members: { $not: { $elemMatch: { $eq: model.userId } } }
    }

    const Update = {
        $addToSet: { members: model.userId }
    }

    const joined = await db.club.findOneAndUpdate(query2, Update)
    log.end();
    return joined
};


const leave = async (model, context) => {
    const log = context.logger.start(`services:club:leave`);
    const query = {
        name: model.clubName,
        members: { $elemMatch: { $eq: model.userId, } }
    }
    let leave
    const isMember = await db.user.find(query)
    if (isMember) {
        const Update = {
            $pull: { members: model.userId }
        }
        leave = await db.club.findOneAndUpdate(query, Update)
        // throw new Error('user already clubed')
    }

    log.end();
    return leave
};

const memberList = async (name, context) => {
    const log = context.logger.start(`services:club:memberList`);

    if (!name) {
        throw new Error('club name is required')
    }

    const query = {
        name: name
    }

    const club = await db.club.find(query).populate('members')
    log.end();
    return members
};

const membersByFilter = async (query, context) => {
    const log = context.logger.start(`services:club:membersByFilter`);

    let filter = {}
    // ===============================================for you=================================================

    if (query.gander.trim() !== "" && query.gander == undefined) {
        filter = {
            $lookup: {
                from: "users",
                localField: "members",
                pipeline: [
                    { $match: { gender: context.user.gender == 'male' ? 'female' : 'male' } },],
                foreignField: "_id",
                as: "users"
            },
        }
    }

    // ================================================= nearBy ==================================================

    else if (query.lat & query.long) {
        filter = {
            "location": {
                $near: {
                    $geometry:
                        { type: "Point", coordinates: [query.lat, query.long] }, $maxDistance: 10000 // 10 kilometer
                }
            }
        }
    }

    // ========================================== popular ========================================================

    else if (query.popular) {
        filter = {
            $lookup: {
                from: "users",
                localField: "members",
                foreignField: "_id",
                as: "users"
            },
        },
            { $unwind: "$users" },
        {
            $project: {
                name: "$users.firstName",
                followers: { $cond: { if: { $isArray: "$users.followers" }, then: { $size: "$users.followers" }, else: 0 } }
            }
        },
            { $sort: { followers: -1 } }
    }

    else {
        throw new Error('At least one filter is required')
    }

    const club = await db.club.aggregate([filter])
    log.end()
    return club

};




exports.join = join;
exports.leave = leave;
exports.memberList = memberList;
exports.membersByFilter = membersByFilter;
