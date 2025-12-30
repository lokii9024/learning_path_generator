import { toast } from "sonner";

/* Base Polaris style */
const baseStyle = {
  borderRadius: "16px",
  boxShadow: "0 8px 28px rgba(26,83,92,0.12)",
  fontSize: "14px",
};

/* Success */
export const toastSuccess = (message) =>
  toast.success(message, {
    style: {
      ...baseStyle,
      background: "#E6F2EF",
      color: "#0F3D40",
      border: "1px solid #BFE3DC",
    },
  });

/* Error */
export const toastError = (message) =>
  toast.error(message, {
    style: {
      ...baseStyle,
      background: "#FFF1F1",
      color: "#7A1F1F",
      border: "1px solid #FFD6D6",
    },
  });

/* Info */
export const toastInfo = (message) =>
  toast(message, {
    style: {
      ...baseStyle,
      background: "#FFFFFF",
      color: "#2D3436",
      border: "1px solid rgba(26,83,92,0.08)",
    },
  });

/* Loading → Success / Error */
export const toastLoading = (message) =>
  toast.loading(message, {
    style: {
      ...baseStyle,
      background: "#FFFFFF",
      color: "#2D3436",
      border: "1px solid rgba(26,83,92,0.08)",
    },
  });
