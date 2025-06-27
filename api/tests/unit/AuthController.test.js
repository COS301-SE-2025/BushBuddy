import { jest } from '@jest/globals';

jest.unstable_mockModule('../../src/services/authService', () => ({
	__esModule: true,
	authService: {
		registerUser: jest.fn(),
		loginUser: jest.fn(),
		logoutUser: jest.fn(),
	},
}));

const { authController } = await import('../../src/controllers/authController');
const { authService } = await import('../../src/services/authService');

describe('AuthController', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('registerUser', () => {
		test('should register a new user successfully', async () => {
			const req = {
				body: {
					username: 'testuser',
					email: 'test@user.com',
					password: 'password',
				},
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
				cookie: jest.fn(),
			};
			authService.registerUser.mockResolvedValueOnce(req.body);

			await authController.registerUser(req, res);

			expect(authService.registerUser).toHaveBeenCalledWith(req.body);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
			expect(res.cookie).toHaveBeenCalledWith('token', expect.any(Object), {
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 24 * 60 * 60 * 1000, // 24 hours
			});
		});

		test('should return an error if registration fails', async () => {
			const req = {
				body: {
					username: 'testuser',
					email: 'test@user.com',
					password: 'password',
				},
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};
			authService.registerUser.mockRejectedValueOnce(new Error('Registration failed'));

			await authController.registerUser(req, res);

			expect(authService.registerUser).toHaveBeenCalledWith(req.body);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: 'Registration failed' });
		});

		test('should return an error if returned user is null', async () => {
			const req = {
				body: {
					username: 'testuser',
					email: 'test@user.com',
					password: 'password',
				},
			};

			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};
			authService.registerUser.mockResolvedValueOnce(null);
			await authController.registerUser(req, res);
			expect(authService.registerUser).toHaveBeenCalledWith(req.body);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: 'User registration failed' });
		});
	});

	describe('loginUser', () => {
		test('should log in a user successfully', async () => {
			const req = {
				body: {
					username: 'testuser',
					password: 'password',
				},
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
				cookie: jest.fn(),
			};
			authService.loginUser.mockResolvedValueOnce({ id: '1', username: 'testuser', email: 'test@user.com' });

			await authController.loginUser(req, res);

			expect(authService.loginUser).toHaveBeenCalledWith(req.body);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ message: 'User logged in successfully' });
			expect(res.cookie).toHaveBeenCalledWith('token', expect.any(Object), {
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 24 * 60 * 60 * 1000, // 24 hours
			});
		});

		test('should return an error if login fails', async () => {
			const req = {
				body: {
					username: 'testuser',
					password: 'password',
				},
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};
			authService.loginUser.mockRejectedValueOnce(new Error('Login failed'));

			await authController.loginUser(req, res);

			expect(authService.loginUser).toHaveBeenCalledWith(req.body);
			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ error: 'Login failed' });
		});

		test('should return an error if user not found', async () => {
			const req = {
				body: {
					username: 'testuser',
					password: 'password',
				},
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			};
			authService.loginUser.mockResolvedValueOnce(null);

			await authController.loginUser(req, res);

			expect(authService.loginUser).toHaveBeenCalledWith(req.body);
			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ error: 'Invalid username or password' });
		});
	});

	describe('logoutUser', () => {
		test('should log out a user successfully', async () => {
			const req = {
				body: {
					userId: '1',
				},
				cookies: {
					token: 'mockedToken',
				},
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
				clearCookie: jest.fn(),
			};
			// authService.logoutUser.mockResolvedValueOnce({ message: 'User logged out successfully' });

			await authController.logoutUser(req, res);

			// expect(authService.logoutUser).toHaveBeenCalledWith(req.body.userId);
			expect(res.clearCookie).toHaveBeenCalledWith('token');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ message: 'User logged out successfully' });
		});

		test('should return an error if logout fails', async () => {
			const req = {
				body: {
					userId: '1',
				},
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
				clearCookie: jest.fn().mockImplementationOnce(() => {
					throw new Error('Logout failed');
				}),
			};
			// authService.logoutUser.mockRejectedValueOnce(new Error('Logout failed'));

			await authController.logoutUser(req, res);

			// expect(authService.logoutUser).toHaveBeenCalledWith(req.body.userId);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ error: 'Logout failed' });
		});
	});
});
