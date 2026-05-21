import { Request, Response } from "express";

import { AuthRequest }
    from "@/shared/middleware/auth.middleware";

import {
    getUserProfile,
    updateUserProfile,
    getAllUsersService,
    getUserByIdService,
    deleteUserService,
} from "../services/user.service";

import { logger }
    from "@/shared/logger";


// PROFILE
export const getProfile = async (
    req: AuthRequest,
    res: Response
) => {

    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized: User not found in request",
            });
        }

        const user =
            await getUserProfile(
                req.user.id
            );

        logger.info(
            "Profile fetched successfully"
        );

        return res.json({
            user,
        });

    } catch (error: any) {

        logger.error(
            "Error fetching profile",
            error
        );

        return res.status(500).json({
            message: error.message,
        });
    }
};


// UPDATE PROFILE
export const updateProfile = async (
    req: AuthRequest,
    res: Response
) => {

    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized: User not found in request",
            });
        }

        const updatedUser =
            await updateUserProfile(
                req.user.id,
                req.body
            );

        logger.info(
            "Profile updated successfully"
        );

        return res.json({
            message: "Profile updated",
            user: updatedUser,
        });

    } catch (error: any) {

        logger.error(
            "Error updating profile",
            error
        );

        return res.status(500).json({
            message: error.message,
        });
    }
};


// GET ALL USERS
export const getAllUsers = async (
    req: Request,
    res: Response
) => {

    try {

        const users =
            await getAllUsersService();

        return res.json({
            users,
        });

    } catch (error: any) {

        return res.status(500).json({
            message: error.message,
        });
    }
};


// GET USER BY ID
export const getUserById = async (
    req: Request,
    res: Response
) => {

    try {

        const user =
            await getUserByIdService(
                req.params.id as string
            );

        return res.json({
            user,
        });

    } catch (error: any) {

        return res.status(500).json({
            message: error.message,
        });
    }
};


// DELETE USER
export const deleteUser = async (
    req: Request,
    res: Response
) => {

    try {

        await deleteUserService(
            req.params.id as string
        );

        return res.json({
            message: "User deleted",
        });

    } catch (error: any) {

        return res.status(500).json({
            message: error.message,
        });
    }
};