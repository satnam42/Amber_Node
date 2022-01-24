

const join = async (model, context) => {
    const log = context.logger.start(`services:club:join`);
    const query = {
        name: model.clubName,
        members: { $elemMatch: { $eq: model.userId, } }
    }

    const isMember = await db.user.find(query)

    if (isMember) {
        return isMember
        // throw new Error('user already clubed')
    }

    const Update = {
        $addToSet: { members: model.userId }
    }

    const joined = await db.club.findOneAndUpdate(query, Update)
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

const membersByFilter = async (name, context) => {
    const log = context.logger.start(`services:club:membersByFilter`);

    // if (!name) {
    //     throw new Error('club name is required')
    // }

    // const query = {
    //     name: name
    // }

    const club = await db.club.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "members",
                foreignField: "userId",
                as: "users"
            }
        },
    ])
    return club
};


exports.join = join;
exports.leave = leave;
exports.memberList = memberList;
exports.membersByFilter = membersByFilter;