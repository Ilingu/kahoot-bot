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
