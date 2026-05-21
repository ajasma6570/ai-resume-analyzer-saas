export const formatResumeTitle =
    (fileName: string) => {

        return fileName

            // remove extension
            .replace(/\.[^/.]+$/, "")

            // replace _ and -
            .replace(/[-_]/g, " ")

            // capitalize words
            .replace(
                /\b\w/g,
                c => c.toUpperCase()
            );
    };