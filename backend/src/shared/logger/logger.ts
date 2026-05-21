import winston from "winston";

const { combine, printf, colorize } =
    winston.format;

const logFormat = printf(
    ({ level, message }) => {

        const time = new Date().toLocaleString(
            "en-IN",
            {
                timeZone: "Asia/Kolkata",

                year: "numeric",
                month: "2-digit",
                day: "2-digit",

                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",

                hour12: true,
            }
        );

        return `${time} [${level}]: ${message}`;
    }
);

export const logger =
    winston.createLogger({

        level: "info",

        format: combine(
            colorize(),
            logFormat
        ),

        transports: [
            new winston.transports.Console(),
        ],
    });