import Rating from "../models/Rating.model.js";
import User from "../models/User.model.js";
import mongoose from "mongoose";

export const rateFreelancer = async (req, res) => {
    try {
        const { freelancerId } = req.params;
        const { stars } = req.body;
        const clientId = req.user._id;

        console.log("Authenticated user:", req.user);


        // Submit or update the rating
        const rating = await Rating.findOneAndUpdate(
            { freelancer: freelancerId, client: clientId },
            { stars },
            { new: true, upsert: true }
        );
        console.log("Saved rating:", rating);

        // Calculate the average rating
        const allRatings = await Rating.find({ freelancer: freelancerId });
        const averageStars = allRatings.reduce((sum, r) => sum + r.stars, 0) / allRatings.length;

        // Update the freelancer's average rating
        await User.findByIdAndUpdate(freelancerId, {
            averageRating: averageStars
        });

        // Send back the response with the updated average
        res.status(200).json({ message: "Rating submitted", averageStars });
    } catch (err) {
        console.error("Error rating freelancer:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getFreelancerRating = async (req, res) => {
    try {
        const { freelancerId } = req.params;

        const result = await Rating.aggregate([
            { $match: { freelancer: new mongoose.Types.ObjectId(freelancerId) } },
            {
                $group: {
                    _id: "$freelancer",
                    averageStars: { $avg: "$stars" },
                    totalRatings: { $sum: 1 }
                }
            }
        ]);

        const ratingInfo = result[0] || { averageStars: 0, totalRatings: 0 };

        res.status(200).json(ratingInfo);
    } catch (err) {
        console.error("Error fetching rating:", err);
        res.status(500).json({ message: "Server error" });
    }
};
