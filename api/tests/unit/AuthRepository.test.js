import { jest } from '@jest/globals';

jest.mock('../../src/db/index.js', () => ({
	__esModule: true,
	default: {
		query: jest.fn(),
	},
}));

jest.mock('nanoid', () => ({
	__esModule: true,
	nanoid: jest.fn(() => 'fixed-test-id'),
}));

import { nanoid } from 'nanoid';
import db from '../../src/db/index.js';
import { authRepository } from '../../src/repositories/authRepository.js';

describe('Testing AuthRespository', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('createUser should insert a new user into the database', async () => {
		const mockUser = { id: 'fixed-test-id', username: 'testuser', email: 'test@user.com', password: 'hashedpassword' };
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
});
