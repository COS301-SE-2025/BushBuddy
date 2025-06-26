jest.mock('../../src/services/authService', () => ({
	__esModule: true,
	authService: {
		registerUser: jest.fn(),
		loginUser: jest.fn(),
	},
}));

import { authController } from '../../src/controllers/authController';
import { authService } from '../../src/services/authService';

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
			};
			authService.registerUser.mockResolvedValueOnce(req.body);

			await authController.registerUser(req, res);

			expect(authService.registerUser).toHaveBeenCalledWith(req.body);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(req.body);
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
			};
			authService.loginUser.mockResolvedValueOnce({ id: '1', username: 'testuser', email: 'test@user.com' });

			await authController.loginUser(req, res);

			expect(authService.loginUser).toHaveBeenCalledWith(req.body);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ id: '1', username: 'testuser', email: 'test@user.com' });
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
});
