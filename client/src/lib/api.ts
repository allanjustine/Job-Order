import pathsToPrevent from "@/data/paths-to-prevent.json";
import axios from "axios";
import Swal from "sweetalert2";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": undefined,
  },
});

let isAlertShown = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const pathname = window.location.pathname;

    const isExpiredOrUnauthorized = pathsToPrevent.some((path) =>
      pathname.startsWith(path)
    );

    if (error.code === "ECONNABORTED") {
      console.error("Timeout error");
    }

    if (
      error.response.status === 401 &&
      isExpiredOrUnauthorized &&
      !isAlertShown
    ) {
      isAlertShown = true;
      Swal.fire({
        icon: "error",
        title: "Ops!",
        text: "Unauthorized or session expired. Please login again.",
        cancelButtonText: "Close",
        showCancelButton: true,
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Back to login",
        confirmButtonColor: "#007bff",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
        isAlertShown = false;
      });
    }

    return Promise.reject(error);
  }
);

const sanctum = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SANCTUM_BASE_URL,
  withCredentials: true,
});

export { api, sanctum };
