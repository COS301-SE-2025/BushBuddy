import { loginUser } from "../services/userService";
import { LoginRequest } from "../models/UserModel";

export async function handleLogin(username, password) {
    try {
        const loginRequest = new LoginRequest({ username, password });
        const user = await loginUser(loginRequest);

        localStorage.setItem("token", user.token);

        return { success: true, user };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Login Failed",
        };
    }
}