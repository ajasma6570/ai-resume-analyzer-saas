import ATSAnalysis
    from "../models/ATSAnalysis.models";


// CREATE ANALYSIS
export const createATSAnalysis =
    async (data: any) => {

        return await ATSAnalysis.create(data);
    };


// GET ANALYSIS BY RESUME ID
export const getAnalysisByResumeIdService =
    async (resumeId: string) => {

        return await ATSAnalysis.findOne({
            resumeId,
        });
    };


// GET USER ANALYSES
export const getUserAnalysesService =
    async (userId: string) => {

        return await ATSAnalysis.find({
            userId,
        });
    };


// DELETE ANALYSIS
export const deleteAnalysisService =
    async (id: string) => {

        return await ATSAnalysis.findByIdAndDelete(id);
    };