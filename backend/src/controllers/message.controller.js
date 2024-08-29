if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const MessageModel = require('../models/message.schema');

const send_message = async (req, res) => {
    const { firstName, lastName, email, phone, message } = req.body;

    try {
        await MessageModel.create({
            firstName,
            lastName,
            email,
            phone,
            message,
        });

        return res.status(201).json({
            message: 'Message sent successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_all_messages = async (req, res) => {
    try {
        const messages = await MessageModel.find();

        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    send_message,
    get_all_messages,
};
