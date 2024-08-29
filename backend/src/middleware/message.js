const check_name = (req, res, next) => {
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName) {
        return res.status(400).json({
            message: 'First name and last name are required',
        });
    }
    next();
};

const check_email = (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            message: 'Email is required',
        });
    }
    next();
};

const check_message = (req, res, next) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({
            message: 'Message is required',
        });
    }
    next();
};

module.exports = {
    check_name,
    check_email,
    check_message,
};
