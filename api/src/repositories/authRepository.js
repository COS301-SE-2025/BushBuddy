import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/index.js';

const collectionName = 'users';

async function createUser(user) {
	const userId = uuidv4();
	user.id = userId;
	db.save(collectionName, userId, user);
	return user;
}

async function getUserById(userId) {
	return db.get(collectionName, userId);
}

async function getUserByUsername(username) {
	const users = db.getAll(collectionName);
	return users.find((user) => user.username === username) || null;
}

async function updateUser(userId, updatedData) {
	const user = await getUserById(userId);
	if (!user) {
		throw new Error('User not found');
	}
	const updatedUser = { ...user, ...updatedData };
	db.save(collectionName, userId, updatedUser);
	return updatedUser;
}

async function deleteUser(userId) {
	const user = await getUserById(userId);
	if (!user) {
		throw new Error('User not found');
	}
	db.delete(collectionName, userId);
	return user;
}

async function getAllUsers() {
	return db.getAll(collectionName);
}

async function userExists(username) {
	const user = await getUserByUsername(username);
	return user !== null;
}

export const authRepository = {
	createUser,
	getUserById,
	getUserByUsername,
	updateUser,
	deleteUser,
	getAllUsers,
	userExists,
};
