let db;

if (process.env.USE_FIRESTORE === 'true') {
	throw new Error('Firestore integration is not implemented yet.');
} else {
	const { db: localDB } = await import('./localDB.js');
	db = localDB;
}

export { db };
