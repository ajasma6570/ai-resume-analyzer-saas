import mongoose, {
    Schema
} from "mongoose";

const resumeSchema = new Schema({

    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    },

    title: {
        type: String,
        required: true,
    },

    originalFileName: {
        type: String,
        required: true,
    },

    fileUrl: {
        type: String,
        required: true,
    },

    extractedText: {
        type: String,
        default: "",
    },

    atsScore: {
        type: Number,
        default: 0,
    },

    skills: [{
        type: String,
    }],

    status: {
        type: String,

        enum: [
            "uploaded",
            "processing",
            "analyzed"
        ],

        default: "uploaded",
    },

}, {
    timestamps: true,
});

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;