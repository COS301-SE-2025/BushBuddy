import { nanoid } from 'nanoid';
import { db } from '../../src/db/index.js';
import { authRepository } from '../../src/repositories/authRepository.js';

jest.mock('../../src/db/index.js', () => ({
	__esmodule: true,
	default: {
		query: jest.fn(),
	},
}));

jest.mock('nanoid', () => ({
	nanoid: jest.fn(() => 'fixed-test-id'),
}));

describe('Testing AuthRespository', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('createUser should insert a new user into the database', async () => {
		const mockUser = { id: 'fixed-test-id', username: 'testuser', email: 'test@user.com', password: 'hashedpassword' };
		db.query.mockResolvedValue({ rows: [mockUser] });

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
