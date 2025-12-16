const pool = require ('../config/db.js');

(async () => {
  try {
    console.log('--- Setting up test data ---');

    // Insert a test customer
    const [customerResult] = await pool.query(
      `INSERT INTO customers (full_name, email, phone, address)
      VALUES (?, ?, ?, ?)`,
      ['Test Customer', 'testcustomer@example.com', '0123456789', 'Test Address']
    );

    // Insert a test cleaner
    const [cleanerResult] = await pool.query(
      `INSERT INTO cleaners (full_name, phone, tier)
      VALUES (?, ?, ?)`,
      ['Test Cleaner', '0987654321', 1]
    );

    console.log('Inserted customer ID:', customerResult.insertId);
    console.log('Inserted cleaner ID:', cleanerResult.insertId);

  } catch (err) {
    console.error('Test setup error:', err);
  } finally {
    process.exit();
  }
})();
