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