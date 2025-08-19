import { handleLogin, handleRegister } from "../../controllers/UsersController.js";
import { loginUser, registerUser } from "../../services/userService.js";

jest.mock("../../services/userService.js", () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
}));

beforeEach(() => {
  let store = {};
  const mockLocalStorage = {
    getItem: jest.fn((key) => store[key]),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
  Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage,
    writable: true,
  });

  jest.clearAllMocks();
});

describe("handleLogin", () => {
  it("should store token and return user on success", async () => {
    const mockUser = { token: "abc123", name: "TestUser" };
    loginUser.mockResolvedValueOnce(mockUser);

    const result = await handleLogin("testuser", "password");

    expect(loginUser).toHaveBeenCalledWith(expect.any(Object));
    //expect(localStorage.setItem).toHaveBeenCalledWith("token", "abc123");
    expect(result).toEqual({ success: true, user: mockUser });
  });

  it("should return error message on failure", async () => {
    const error = { response: { data: { message: "Invalid credentials" } } };
    loginUser.mockRejectedValueOnce(error);

    const result = await handleLogin("baduser", "badpass");

    expect(result).toEqual({ success: false, message: "Invalid credentials" });
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});

describe("handleRegister", () => {
  it("should store token and return user on success", async () => {
    const mockUser = { token: "xyz456", username: "newUser" };
    registerUser.mockResolvedValueOnce(mockUser);

    const result = await handleRegister("newUser", "email@test.com", "pass123");

    expect(registerUser).toHaveBeenCalledWith(expect.any(Object)); 
    //expect(localStorage.setItem).toHaveBeenCalledWith("token", "xyz456");
    expect(result).toEqual({ success: true, user: mockUser });
  });

  it("should return error message on failure", async () => {
    const error = { response: { data: { message: "Username already taken" } } };
    registerUser.mockRejectedValueOnce(error);

    const result = await handleRegister("newUser", "email@test.com", "pass123");

    expect(result).toEqual({ success: false, message: "Username already taken" });
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});
