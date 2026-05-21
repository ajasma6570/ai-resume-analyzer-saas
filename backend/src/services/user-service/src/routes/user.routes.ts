import express from "express";
import {
    getProfile,
    updateProfile,
    getAllUsers,
    getUserById,
    deleteUser,
} from "@user/controllers/user.controller";
import { verifyAccessToken } from "@/shared/middleware/auth.middleware";

const router = express.Router();

router.get("/ping", (req, res) => {
    res.json({
        message: "User service is running"
    });
});

router.get("/profile", verifyAccessToken, getProfile);
router.put("/profile", verifyAccessToken, updateProfile);
router.get("/all-users", verifyAccessToken, getAllUsers);
router.get("/:id", verifyAccessToken, getUserById);
router.delete("/:id", verifyAccessToken, deleteUser);


export default router;