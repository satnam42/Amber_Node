
const join = async (req, res) => {
    const log = req.context.logger.start(`api:club:block ${req.params.id}`);
    try {
        const club = await service.join(req.body, req.context);
        const msg = 'club joined successfully'
        log.end();
        return response.success(res, msg, club);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const leave = async (req, res) => {
    const log = req.context.logger.start(`api:club:leave `);
    try {
        const club = await service.leave(req.body, req.context);
        const msg = 'leave successfully'
        log.end();
        return response.success(res, msg, club);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};
const getMembersByClubName = async (req, res) => {
    const log = req.context.logger.start(`api:club:getMembersByClubName `);
    try {
        const members = await service.memberList(req.params.name, req.context);
        const msg = 'list fetched successfully'
        log.end();
        return response.success(res, msg, members);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

exports.join = join;
exports.leave = leave;
exports.getMembersByClubName = getMembersByClubName;