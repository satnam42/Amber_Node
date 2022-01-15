
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

exports.join = join;
exports.leave = leave;