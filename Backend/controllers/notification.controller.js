import Notification from "../models/Notification.model.js";


export const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (err) {
        next(err);
    }
};
