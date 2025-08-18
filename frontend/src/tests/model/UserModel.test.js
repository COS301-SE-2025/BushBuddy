import { User, LoginRequest, RegisterRequest } from "../../models/UserModel";

describe("UserModel classes", () => {
  describe("User", () => {
    it("should set the token property from constructor args", () => {
      const user = new User({ token: "very_secure_token" });

      expect(user.token).toBe("very_secure_token");
    });

    it("should have undefined token if not provided", () => {
      const user = new User({});
      expect(user.token).toBeUndefined();
    });
  });

  describe("LoginRequest", () => {
    it("should set username and password from constructor args", () => {
      const req = new LoginRequest({ username: "kooskombuis", password: "qwerty" });

      expect(req.username).toBe("kooskombuis");
      expect(req.password).toBe("qwerty");
    });

    it("should have undefined fields if not provided", () => {
      const req = new LoginRequest({});
      expect(req.username).toBeUndefined();
      expect(req.password).toBeUndefined();
    });
  });

  describe("RegisterRequest", () => {
    it("should set username, email, and password from constructor args", () => {
      const req = new RegisterRequest({
        username: "newUser",
        email: "test@example.com",
        password: "securePass",
      });

      expect(req.username).toBe("newUser");
      expect(req.email).toBe("test@example.com");
      expect(req.password).toBe("securePass");
    });

    it("should have undefined fields if not provided", () => {
      const req = new RegisterRequest({});
      expect(req.username).toBeUndefined();
      expect(req.email).toBeUndefined();
      expect(req.password).toBeUndefined();
    });
  });
});
