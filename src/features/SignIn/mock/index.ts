export const getMockData = (otp: string) => {
    if (otp.startsWith("1")) {
        return {
            errorContent: {
                Errors: [
                    {
                        ErrorId: "0030",
                    },
                ],
            },
        };
    } else if (otp.startsWith("2")) {
        return {
            errorContent: {
                Errors: [
                    {
                        ErrorId: "0031",
                    },
                ],
            },
        };
    } else if (otp.startsWith("3")) {
        return {
            errorContent: {
                Errors: [
                    {
                        ErrorId: "0032",
                    },
                ],
            },
        };
    }
    return { Status: true };
};
