"use client";

import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "../../context/ToastContext";

/**
 * Global handler for expired/invalid sessions. When any API call comes back
 * 401 (e.g. the login token has expired after 7 days), we clear the dead
 * session and send the user to sign in — instead of leaving them stuck on a
 * cryptic "Not authorized" toast. Login endpoints are excluded so a failed
 * login on the sign-in page doesn't trigger a redirect loop.
 */
export default function SessionGuard() {
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status;
        const url: string = error?.config?.url || "";
        const isAuthEndpoint = url.includes("/auth/");

        if (status === 401 && !isAuthEndpoint && typeof window !== "undefined") {
          const hadSession = !!localStorage.getItem("heedy_user");
          // Only react if the user believed they were logged in — call sites
          // already handle the "no token at all" case themselves.
          if (hadSession) {
            localStorage.removeItem("heedy_user");
            showToast("Your session has expired. Please log in again.", "warning");

            if (!window.location.pathname.startsWith("/sign-in")) {
              const next = window.location.pathname + window.location.search;
              router.push(`/sign-in?next=${encodeURIComponent(next)}`);
            }
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptorId);
  }, [router, showToast]);

  return null;
}
