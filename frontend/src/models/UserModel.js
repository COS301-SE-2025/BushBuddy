export class User {
    constructor({ token }) {
        this.token = token;
    }
}

export class LoginRequest {
    constructor({ username, password }) {
        this.username = username;
        this.password = password;
    }
}

export class RegisterRequest {
    constructor({ username, email, password }) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}