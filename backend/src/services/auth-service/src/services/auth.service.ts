import bcrypt from "bcryptjs";

import User from "@auth/models/User.models";

export const registerUser = async (
    name: string,
    email: string,
    password: string
) => {

    const existingUser =
        await User.findOne({ email });

    if (existingUser) {
        throw new Error(
            "User already exists"
        );
    }

    const hashedPassword =
        await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    return user;
};




export const loginUser = async (
    email: string,
    password: string
) => {

    const user =
        await User.findOne({ email });

    if (!user) {
        throw new Error(
            "User does not exist"
        );
    }

    const isPasswordMatch =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isPasswordMatch) {

        throw new Error(
            "Password did not match"
        );
    }

    return user;
};