import dotenv from 'dotenv';
import { Pool } from 'pg';
dotenv.config();

class Database {
	constructor() {
		if (Database.instance) {
			return Database.instance;
		}

		this.pool = new Pool({
			connectionString:
				process.env.ENVIRONMENT === 'dev' ? process.env.DATABASE_URL_DEV : process.env.DATABASE_URL_PROD,
			ssl: {
				rejectUnauthorized: false,
			},
		});

		this.pool
			.connect()
			.then((client) => {
				console.log('Database connected successfully');
				client.release();
			})
			.catch((err) => console.error('Database connection error:', err));

		Database.instance = this;
	}

	async query(text, params) {
		const start = Date.now();
		const res = await this.pool.query(text, params);
		const duration = Date.now() - start;
		console.log('executed query', { text, duration, rows: res.rowCount });
		return res;
	}

	async close() {
		await this.pool.end();
	}
}

const db = new Database();
export default db;
