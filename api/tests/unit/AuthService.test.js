jest.mock('../../src/repositories/authRepository.js', () => ({
	__esModule: true,
	authRepository: {
		createUser: jest.fn(),
		userExists: jest.fn(),
		getUserByUsername: jest.fn(),
		getUserById: jest.fn(),
	},
}));
jest.mock('bcrypt', () => ({
	__esModule: true,
	hash: jest.fn(),
	compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';
import { authRepository } from '../../src/repositories/authRepository.js';
import { authService } from '../../src/services/authService.js';

describe('AuthService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('registerUser', () => {
		test('should register a new user successfully', async () => {
			const mockUser = { username: 'testuser', email: 'test@user.com', password: 'hashedpassword' };
			authRepository.userExists.mockResolvedValueOnce(false);
			authRepository.createUser.mockResolvedValueOnce(mockUser);
			bcrypt.hash.mockResolvedValueOnce('hashedpassword');

			const result = await authService.registerUser({
				username: 'testuser',
				email: 'test@user.com',
				password: 'password',
			});

			expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
			expect(authRepository.userExists).toHaveBeenCalledWith('testuser');
			expect(authRepository.createUser).toHaveBeenCalledWith({
				username: 'testuser',
				email: 'test@user.com',
				password: 'hashedpassword', // Ensure hashed password is used
			});
			expect(result).toEqual(mockUser);
		});

		test('should throw an error if username already exists', async () => {
			authRepository.userExists.mockResolvedValueOnce(true);

			await expect(
				authService.registerUser({
					username: 'testuser',
					email: 'test@user.com',
					password: 'password',
				})
			).rejects.toThrow('Username already exists');

			expect(authRepository.userExists).toHaveBeenCalledWith('testuser');
		});

		test('should throw an error if required fields are missing', async () => {
			await expect(
				authService.registerUser({
					username: '',
					email: '',
					password: '',
				})
			).rejects.toThrow('Username, password, and email are required');

			expect(authRepository.userExists).not.toHaveBeenCalled();
		});

		test('should throw an error if user creation fails', async () => {
			authRepository.createUser.mockRejectedValueOnce(new Error('User creation failed'));
			authRepository.userExists.mockResolvedValueOnce(false);
			bcrypt.hash.mockResolvedValueOnce('hashedpassword');

			await expect(
				authService.registerUser({
					username: 'testuser',
					email: 'test@user.com',
					password: 'password',
				})
			).rejects.toThrow('Error registering user: User creation failed');

			expect(authRepository.createUser).toHaveBeenCalledWith({
				username: 'testuser',
				email: 'test@user.com',
				password: 'hashedpassword',
			});
		});
	});

	describe('loginUser', () => {
		test('should log in a user successfully', async () => {
			const mockUser = { id: 1, username: 'testuser', email: 'test@user.com', password: 'hashedpassword' };
			authRepository.getUserByUsername.mockResolvedValueOnce(mockUser);
			bcrypt.compare.mockResolvedValueOnce(true);

			const result = await authService.loginUser({
				username: 'testuser',
				password: 'password',
			});

			expect(authRepository.getUserByUsername).toHaveBeenCalledWith('testuser');
			expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');
			expect(result).toEqual({ id: 1, username: 'testuser', email: 'test@user.com' });
		});

		test('should throw an error if required fields are missing', async () => {
			await expect(
				authService.loginUser({
					username: '',
					password: '',
				})
			).rejects.toThrow('Username and password are required');

			expect(authRepository.userExists).not.toHaveBeenCalled();
		});

		test('should throw an error if username is invalid', async () => {
			authRepository.getUserByUsername.mockResolvedValueOnce(null);
			await expect(
				authService.loginUser({
					username: 'invaliduser',
					password: 'password',
				})
			).rejects.toThrow('Invalid username or password');

			expect(authRepository.getUserByUsername).toHaveBeenCalledWith('invaliduser');
			expect(bcrypt.compare).not.toHaveBeenCalled();
		});

		test('should throw an error if password is invalid', async () => {
			const mockUser = { id: 1, username: 'testuser', email: 'test@user.com', password: 'hashedpassword' };
			authRepository.getUserByUsername.mockResolvedValueOnce(mockUser);
			bcrypt.compare.mockResolvedValueOnce(false);

			await expect(
				authService.loginUser({
					username: 'testuser',
					password: 'wrongpassword',
				})
			).rejects.toThrow('Invalid username or password');

			expect(authRepository.getUserByUsername).toHaveBeenCalledWith('testuser');
			expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
		});

		test('should throw an error if login fails', async () => {
			authRepository.getUserByUsername.mockRejectedValueOnce(new Error('Login failed'));

			await expect(
				authService.loginUser({
					username: 'testuser',
					password: 'password',
				})
			).rejects.toThrow('Error logging in user: Login failed');

			expect(authRepository.getUserByUsername).toHaveBeenCalledWith('testuser');
			expect(bcrypt.compare).not.toHaveBeenCalled();
		});
	});

	describe('logoutUser', () => {
		test('should log out a user successfully', async () => {
			const mockUser = { id: 1, username: 'testuser', email: 'test@user.com' };
			authRepository.getUserById.mockResolvedValueOnce(mockUser);
			const result = await authService.logoutUser(1);

			expect(result).toEqual({ message: 'User logged out successfully' });
		});

		test('should throw an error if user ID is missing', async () => {
			await expect(authService.logoutUser()).rejects.toThrow('User ID is required');
		});

		test('should throw an error if logout fails', async () => {
			authRepository.getUserById.mockRejectedValueOnce(new Error('User not found'));

			await expect(authService.logoutUser(999)).rejects.toThrow('Error logging out user: User not found');

			expect(authRepository.getUserById).toHaveBeenCalledWith(999);
		});

		test('should throw an error if user does not exist', async () => {
			authRepository.getUserById.mockResolvedValueOnce(null);

			await expect(authService.logoutUser(999)).rejects.toThrow('User not found');

			expect(authRepository.getUserById).toHaveBeenCalledWith(999);
		});
	});
});
