import { describe, expect, jest, test } from '@jest/globals';

jest.unstable_mockModule('../../src/db/index.js', () => ({
	__esModule: true,
	default: {
		query: jest.fn(),
	},
}));

jest.unstable_mockModule('nanoid', () => ({
	__esModule: true,
	nanoid: jest.fn(() => 'fixed-test-id'),
}));

const { nanoid } = await import('nanoid');
const db = (await import('../../src/db/index.js')).default;
const { authRepository } = await import('../../src/repositories/authRepository.js');

describe('Testing AuthRespository', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('createUser', () => {
		test('createUser should insert a new user into the database', async () => {
			const mockUser = {
				id: 'fixed-test-id',
				username: 'testuser',
				email: 'test@user.com',
				password: 'hashedpassword',
			};
			db.query.mockResolvedValueOnce({ rows: [mockUser] });

			const result = await authRepository.createUser({
				username: 'testuser',
				email: 'test@user.com',
				password: 'hashedpassword',
			});

			expect(nanoid).toHaveBeenCalled();
			expect(db.query).toHaveBeenCalledWith(expect.any(String), [
				'fixed-test-id',
				'testuser',
				'test@user.com',
				'hashedpassword',
			]);
			expect(result).toEqual({
				id: 'fixed-test-id',
				username: 'testuser',
				email: 'test@user.com',
			});
		});

		test('createUser should throw an error if user creation fails', async () => {
			db.query.mockRejectedValueOnce(new Error('Database error'));

			await expect(
				authRepository.createUser({
					username: 'testuser',
					email: 'testemail',
					password: 'testpassword',
				})
			).rejects.toThrow('Error creating user: Database error');

			expect(db.query).toHaveBeenCalledWith(expect.any(String), [
				'fixed-test-id',
				'testuser',
				'testemail',
				'testpassword',
			]);
		});
	});

	describe('getUserById', () => {
		test('getUserById should return user data for a valid user ID', async () => {
			const mockUser = {
				username: 'testuser',
				email: 'test@user.com',
			};
			db.query.mockResolvedValueOnce({ rows: [mockUser] });

			const result = await authRepository.getUserById('fixed-test-id');

			expect(db.query).toHaveBeenCalledWith(expect.any(String), ['fixed-test-id']);
			expect(result).toEqual(mockUser);
		});

		test('getUserById should return null for an invalid user ID', async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const result = await authRepository.getUserById('invalid-id');

			expect(db.query).toHaveBeenCalledWith(expect.any(String), ['invalid-id']);
			expect(result).toBeNull();
		});

		test('getUserById should throw an error if database query fails', async () => {
			db.query.mockRejectedValueOnce(new Error('Database error'));

			await expect(authRepository.getUserById('fixed-test-id')).rejects.toThrow('Error fetching user: Database error');
			expect(db.query).toHaveBeenCalledWith(expect.any(String), ['fixed-test-id']);
		});
	});

	describe('getUserByUsername', () => {
		test('getUserByUsername should return user data for a valid username', async () => {
			const mockUser = {
				id: 'fixed-test-id',
				email: 'test@user.com',
			};
			db.query.mockResolvedValueOnce({ rows: [mockUser] });

			const result = await authRepository.getUserByUsername('testuser');

			expect(db.query).toHaveBeenCalledWith(expect.any(String), ['testuser']);
			expect(result).toEqual(mockUser);
		});

		test('getUserByUsername should return null for an invalid username', async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const result = await authRepository.getUserByUsername('invalid-user');

			expect(db.query).toHaveBeenCalledWith(expect.any(String), ['invalid-user']);
			expect(result).toBeNull();
		});

		test('getUserByUsername should throw an error if database query fails', async () => {
			db.query.mockRejectedValueOnce(new Error('Database error'));

			await expect(authRepository.getUserByUsername('testuser')).rejects.toThrow('Error fetching user: Database error');
			expect(db.query).toHaveBeenCalledWith(expect.any(String), ['testuser']);
		});
	});

	describe('updateUserPreferences', () => {
		test('updateUserPreferences should update user preferences and return updated user data', async () => {
			const mockUpdatedUser = {
				id: 'fixed-test-id',
				username: 'testuser',
				email: 'testemail',
			};
			db.query.mockResolvedValueOnce({ rows: [mockUpdatedUser] });

			const result = await authRepository.updateUserPreferences('fixed-test-id', {
				isPrivate: true,
				useGeolocation: false,
			});
			expect(db.query).toHaveBeenCalledWith(expect.any(String), [true, false, 'fixed-test-id']);
			expect(result).toEqual(mockUpdatedUser);
		});

		test('updateUserPreferences should throw an error if update fails', async () => {
			db.query.mockRejectedValueOnce(new Error('Database error'));

			await expect(
				authRepository.updateUserPreferences('fixed-test-id', {
					isPrivate: true,
					useGeolocation: false,
				})
			).rejects.toThrow('Error updating user preferences: Database error');

			expect(db.query).toHaveBeenCalledWith(expect.any(String), [true, false, 'fixed-test-id']);
		});

		test('updateUserPreferences should return null if user does not exist', async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const result = await authRepository.updateUserPreferences('invalid-id', {
				isPrivate: true,
				useGeolocation: false,
			});

			expect(db.query).toHaveBeenCalledWith(expect.any(String), [true, false, 'invalid-id']);
			expect(result).toBeNull();
		});
	});

	describe('deleteUser', () => {
		test('deleteUser should delete a user and return success message', async () => {
			db.query.mockResolvedValueOnce({ rowCount: 1 });

			const result = await authRepository.deleteUser('fixed-test-id');

			expect(db.query).toHaveBeenCalledWith(expect.any(String), ['fixed-test-id']);
			expect(result).toEqual({ message: 'User deleted successfully' });
		});

		test('deleteUser should throw an error if deletion fails', async () => {
			db.query.mockRejectedValueOnce(new Error('Database error'));

			await expect(authRepository.deleteUser('fixed-test-id')).rejects.toThrow('Error deleting user: Database error');
			expect(db.query).toHaveBeenCalledWith(expect.any(String), ['fixed-test-id']);
		});
	});

	describe('getAllUsers', () => {
		test('getAllUsers should return an array of all users', async () => {
			const mockUsers = [
				{ id: '1', username: 'user1', email: 'user1email' },
				{ id: '2', username: 'user2', email: 'user2email' },
			];
			db.query.mockResolvedValueOnce({ rows: mockUsers });

			const result = await authRepository.getAllUsers();

			expect(db.query).toHaveBeenCalledWith(expect.any(String));
			expect(result).toEqual(mockUsers);
		});

		test('getAllUsers should return an empty array if no users exist', async () => {
			db.query.mockResolvedValueOnce({ rows: [] });
			const result = await authRepository.getAllUsers();
			expect(db.query).toHaveBeenCalledWith(expect.any(String));
			expect(result).toEqual([]);
		});

		test('getAllUsers should throw an error if database query fails', async () => {
			db.query.mockRejectedValueOnce(new Error('Database error'));
			await expect(authRepository.getAllUsers()).rejects.toThrow('Error fetching all users: Database error');
			expect(db.query).toHaveBeenCalledWith(expect.any(String));
		});
	});

	describe('userExists', () => {
		test('userExists should return true if user exists', async () => {
			db.query.mockResolvedValueOnce({ rows: [{ count: '1' }] });
			const result = await authRepository.userExists('testuser');
			expect(db.query).toHaveBeenCalledWith(expect.any(String), ['testuser']);
			expect(result).toBe(true);
		});

		test('userExists should return false if user does not exist', async () => {
			db.query.mockResolvedValueOnce({ rows: [{ count: '0' }] });
			const result = await authRepository.userExists('testuser');
			expect(db.query).toHaveBeenCalledWith(expect.any(String), ['testuser']);
			expect(result).toBe(false);
		});

		test('userExists should throw an error if database query fails', async () => {
			db.query.mockRejectedValueOnce(new Error('Database error'));
			await expect(authRepository.userExists('testuser')).rejects.toThrow(
				'Error checking if user exists: Database error'
			);
			expect(db.query).toHaveBeenCalledWith(expect.any(String), ['testuser']);
		});
	});
});
