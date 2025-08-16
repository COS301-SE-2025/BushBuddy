import apiClient from "./apiClient";
import { User } from "../models/UserModel";

export async function loginUser(loginRequest) {
    const response = await apiClient.post("/auth/login", loginRequest);
    return new User();
}

export async function registerUser(registerRequest) {
    const response = await apiClient.post("/auth/register",registerRequest);
    return new User();
}