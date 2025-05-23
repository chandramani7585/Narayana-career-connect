import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: "localhost", //'srv1752.hstgr.io',
    user: "root",  //'u607585719_test',
    password: "", //'Test@879',
    database : "career"//'u607585719_test',
    /* 
    waitForConnections: true,
     connectionLimit: 10, // Adjust based on your needs
    queueLimit: 0
    */
});

const connectToDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection successful');
        connection.release(); // Release the connection back to the pool
    } catch (error) {
        console.error('Database connection failed:', error);
    }
};

connectToDatabase();
