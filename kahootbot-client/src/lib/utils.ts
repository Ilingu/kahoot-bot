import { toast } from "@zerodevx/svelte-toast";

type PushType = "success" | "error";
export const PushToast = (msg: string, type: PushType, duration?: number) => {
  toast.push(msg, {
    theme: {
      "--toastBackground": type === "success" ? "green" : "red",
      "--toastColor": "white",
      "--toastBarBackground": type === "success" ? "olive" : "#6a0000",
    },
    duration: duration || undefined,
  });
};

/**
 * Check if a string is empty or not
 * @param {string} content string to check
 * @returns {boolean} `true` if the string is empty
 */
export const EmptyContent = (content: string): boolean =>
  !content || content.trim().length <= 0;
