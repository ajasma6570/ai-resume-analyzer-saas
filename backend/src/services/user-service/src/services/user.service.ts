import User from "@auth/models/User.models";

//GET PROFILE
export const getUserProfile =
    async (userId: string) => {
        const user = await User.findById(userId).select("-password -refreshToken");

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    };


// UPDATE PROFILE
export const updateUserProfile =
    async (
        userId: string,
        data: any
    ) => {

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            data,
            { new: true }
        ).select(
            "-password -refreshToken"
        );

        return updatedUser;
    };

export const getAllUsersService =
    async () => {

        return await User.find().select("-password");
    };


// GET USER BY ID
export const getUserByIdService =
    async (id: string) => {

        return await User.findById(id).select("-password");
    };


// DELETE USER
export const deleteUserService =
    async (id: string) => {

        return await User.findByIdAndDelete(id);
    };