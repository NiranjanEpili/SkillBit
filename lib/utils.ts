import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkAuthState() {
  if (typeof window === "undefined") return null;

  try {
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    return JSON.parse(userData);
  } catch (e) {
    console.error("Error parsing user data:", e);
    localStorage.removeItem("user");
    return null;
  }
}

export function getExamTrack() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("examTrack");
}

export function requireAuth(router: any, pathname: string) {
  const user = checkAuthState();

  if (!user && !["/", "/signin", "/signup"].includes(pathname)) {
    router.push("/signin");
    return false;
  }

  return !!user;
}
