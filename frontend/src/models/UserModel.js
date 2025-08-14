export class User {
    // empty user object because token is no longer stored
    constructor({ id = null, username = null, email = null, roles = [] } = {}) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
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