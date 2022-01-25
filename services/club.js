

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
    const club = await db.club.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "members",
                foreignField: "_id",
                as: "users"
            },
            // },
        },
        { $unwind: "$users" },
        {
            $project: {
                name: "$users.firstName",
                followers: { $cond: { if: { $isArray: "$users.following" }, then: { $size: "$users.following" }, else: 0 } }
            }
        },
        { $sort: { followers: -1 } }
        // {
        //     $group: {
        //         _id: "$users._id",
        //         size: { $sum: "users.following" }
        //     }
        // },
        // {
        //     $group: {
        //         _id: { $size: users.following },
        //         total: { $sum: 1 },
        //     }
        // }
        // {}
        //     $group: {
        //         _id: "$size",
        //         frequency: {
        //              1
        //         }
        //     }
        // },
        // {
        //     $project: {
        //         size: "$_id",
        //         frequency: 1,
        //         _id: 0
        //     }

    ])
    return club
};


exports.join = join;
exports.leave = leave;
exports.memberList = memberList;
exports.membersByFilter = membersByFilter;