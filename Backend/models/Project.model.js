import mongoose from "mongoose";


const ProjectSchema = new mongoose.Schema(
    {
        projectName: {
            type: String,
            required: true,
            unique: true,
        },

        description: {
            type: String,
            required: true,
        },

        skillsRequired: {
            type: [String],  // Array of strings to store skills required for the project
            required: true,
        },

        clientId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },

        clientName: { 
            type: String, 
            required: true 
        }, 

        price: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: ["Waiting", "In Progress", "Completed"],
            default: "Waiting",
        },

        category: {
            type: String,
            enum: [
              "Graphics & Designs",
              "Digital Marketing",
              "Writing & Translation",
              "Video & Animation",
              "Music & Audio",
              "Programming & Tech",
              "Business",
              "Legal & Compliance",
              "Data",
              "Photography",
            ],
            required: true,
          },

    },
    { timestamps: true }
);


export default mongoose.model("Project", ProjectSchema);
