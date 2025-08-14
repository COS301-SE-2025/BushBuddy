import { loginUser, registerUser } from "../services/userService";
import { LoginRequest, RegisterRequest } from "../models/UserModel";

export async function handleLogin(username, password) {
    try {
        const loginRequest = new LoginRequest({ username, password });
        const user = await loginUser(loginRequest);

        return { success: true, user };
    } catch(error) {
        return {
            success: false,
            message: error.response?.data?.message || "Login Failed",
        };
    }
}

export async function handleRegister(username, email, password) {
    try {
        const registerRequest = new RegisterRequest({ username, email, password});
        const user = await registerUser(registerRequest);

        return { success:true, user };
    } catch(error) {
        return {
            success: false,
            message: error.response?.data?.message || "Register User Failed",
        };
    }
}