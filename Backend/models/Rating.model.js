import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    freelancer:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    client:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    stars:
    {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
}, {
    timestamps: true
});

ratingSchema.index({                       // Each client can only rate each freelancer once.
    freelancer: 1,                         // because rating the freelancer multiple times could akew the average and allow spam
    client: 1
},
    {
        unique: true
    }
);

export default mongoose.model("Rating", ratingSchema);
