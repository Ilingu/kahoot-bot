import { LogColors } from "../interfaces/enums";

/**
 * Check if a string is empty or not
 * @param {string} content string to check
 * @returns {boolean} `true` if the string is empty
 */
export const EmptyContent = (content: string): boolean =>
  !content || content.trim().length <= 0;

export const log = (msg: string, color?: LogColors) => {
  console.log(color || LogColors.FgBlue, msg);
};

export const logBot = (msg: string, color?: LogColors) => {
  console.log(color || LogColors.FgMagenta, msg);
};

export const logError = (msg: string | Error, color?: LogColors) => {
  console.error(color || LogColors.FgRed, msg);
};

export const logWarn = (msg: string, color?: LogColors) => {
  console.warn(color || LogColors.FgYellow, msg);
};
