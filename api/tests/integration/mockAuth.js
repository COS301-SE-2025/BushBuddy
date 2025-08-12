/**
 * A simple mock authentication middleware for testing.
 * It attaches a hardcoded user object to the request,
 * allowing protected routes to be tested without a real login.
 */
function mockAuth(req, res, next) {

    req.user = { id: 'test-user-123' };
    next();
}

export { mockAuth };