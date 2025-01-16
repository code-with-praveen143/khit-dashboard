export const role = typeof window !== "undefined" && sessionStorage.getItem('role');
export const storedUsername = typeof window !== "undefined" && sessionStorage.getItem("username");
export const storedEmail = typeof window !== "undefined" && sessionStorage.getItem("email");
export const auth_token = typeof window !== "undefined" && sessionStorage.getItem("auth_token");