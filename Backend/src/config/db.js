import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// console.log(process.env.DB_USER, process.env.DB_PASS);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true
});

//! change to test that only tests once on startup for production
// async function testconnection() {
//     try{
//         const [rows] = await pool.query('SELECT 1 + 1 AS result');
//         console.log('Connected to the database. Test query result:', rows[0].result);
//     } catch (error) {
//         console.error('Error connecting to the database:', error);
//     }
// }

// testconnection();

export default pool;