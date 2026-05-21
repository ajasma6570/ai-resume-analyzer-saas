import mongoose, {
    Schema
} from "mongoose";

const atsAnalysisSchema =
    new Schema({

        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },

        resumeId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },

        atsScore: {
            type: Number,
            default: 0,
        },

        matchedSkills: [{
            type: String,
        }],

        missingSkills: [{
            type: String,
        }],

        strengths: [{
            type: String,
        }],

        weaknesses: [{
            type: String,
        }],

        suggestions: [{
            type: String,
        }],

        aiFeedback: {
            type: String,
        },

        jobDescription: {
            type: String,
        },

        analyzedText: {
            type: String,
        },

        aiProvider: {
            type: String,
            enum: [
                "gemini",
                "openai"
            ],
            default: "gemini",
        },

    }, {
        timestamps: true,
    });

export default mongoose.model(
    "ATSAnalysis",
    atsAnalysisSchema
);