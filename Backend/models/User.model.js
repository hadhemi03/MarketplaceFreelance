import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  img: {
    type: String,
  },

  country: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: false,
  },
  desc: {
    type: String,
    required: false,
  },

  role: {
    type: String,
    enum: ["admin", "client", "freelancer"],
    required: true,
  },

  occupation: {
    type: String
  },

  // freelancers only 
  skills: {
    type: [String], 
    default: [],
  },

  certificates: {
    type: [String], // URLs ou noms de certificats
    default: [],
  },

  languages: {
    type: [String], // anglais , arabe ..
    default: [],
  },

  experiences: {
    type: [
      {
        company: String,
        position: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    default: [],
  },

  posts: {
    type: [
      {
        title: String,
        description: String,
        images: [String], // URLs des images des projets travaillés
        createdAt: { 
          type: Date, 
          default: Date.now },
      },
    ],
    default: [],
  },


},
  { timestamps: true }

);

export default mongoose.model("User", UserSchema);