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

        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null, // initially null because the project is not yet assigned
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
        image: {
            type: String, // URL de l'image
            default: "",  // Optionnel si le client ne met pas d’image
        }, 
        sharedCalendar: [
            {
              title: String,
              description: String,
              date: Date,
              createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
              completed: { type: Boolean, default: false },
              createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            }
          ]


    },
    { timestamps: true }
);


export default mongoose.model("Project", ProjectSchema);
