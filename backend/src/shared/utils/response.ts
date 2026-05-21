export const successResponse = (
    data: any,
    message = "Success"
) => {
    return {
        success: true,
        message,
        data,
    };
};

export const errorResponse = (
    message = "Error"
) => {
    return {
        success: false,
        message,
    };
};