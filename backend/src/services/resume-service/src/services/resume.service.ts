import Resume from "../models/Resume.models";


export const createResume =
    async (data: any) => {

        return await Resume.create(data);
    };


// GET USER RESUMES
export const getUserResumesService =
    async (userId: string) => {

        return await Resume.find({
            userId,
        });
    };


// GET RESUME BY ID
export const getResumeByIdService =
    async (id: string) => {

        return await Resume.findById(id);
    };


// DELETE RESUME
export const deleteResumeService =
    async (id: string) => {

        return await Resume.findByIdAndDelete(id);
    };