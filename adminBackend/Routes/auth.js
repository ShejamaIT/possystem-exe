const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../utils/db.js');

const router = express.Router();
const saltRounds = 10;
// Login Route
router.post('/login', async (req, res) => {
    const { email, password} = req.body;

    try {
        if (!email || !password ) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.' });
        }

        const [rows] = await db.query(`SELECT * FROM customer_log WHERE email = ?`, [email]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User Not found",  });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }

        // Set expiration time manually
        const expTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour
        const token = jwt.sign(
            { id: user.id, exp: expTime },
            process.env.JWT_SECRET
        );

        await db.query(
            `INSERT INTO SessionLogs (email, Token) VALUES (?, ?)`,
            [user.email, token]
        );

        res.status(200).json({
            success: true,
            message: "Customer found successfully",
            data: {
                name: user.name,
                email: user.email,
                token : token,
            },
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

//customer create account
router.post('/sign-in', async (req, res) => {
    const { fname,lname,email, password} = req.body;

    try {
        if (!email || !password  || !fname || !lname) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.' });
        }

        const [rows] = await db.query(`SELECT * FROM customer_log WHERE email = ?`, [email]);

        if (rows.length === 1) {
            return res.status(404).json({
                success: false,
                message: "This Username is currently inuse",  });
        }
        const Cust_id = await generateNewId("Customer", "c_ID", "Cus");
        await db.query(
            `INSERT INTO Customer (c_ID, FtName, SrName) VALUES (?, ? , ?)`,
            [Cust_id, fname,lname]
        );
        await db.query(
            `INSERT INTO customer_log (name, email, password) VALUES (?, ? , ?)`,
            [Cust_id, email,password]
        );

        res.status(200).json({
            success: true,
            message: "Account create successfully ",
            
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Logout Route
router.post('/logout', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'Token is required.' });
    }

    try {
        // Invalidate the token by setting the LogoutTime
        const result = await db.query(
            `UPDATE SessionLogs SET LogoutTime = CURRENT_TIMESTAMP WHERE Token = ?`,
            [token]
        );

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: 'Session not found.' });
        }

        res.status(200).json({ message: 'Logout successful.' });
    } catch (err) {
        console.error('Error during logout:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Employee Sign up
router.post('/emp/signup', async (req, res) => {
    const { password, role, contactNumber } = req.body;

    try {
        // 1️⃣ Validate input
        if (!password || !role || !contactNumber) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.'
            });
        }

        // 2️⃣ Check if employee exists with contact number
        const [empRows] = await db.query(
            `SELECT * FROM Employee WHERE contact = ?`,
            [contactNumber]
        );

        if (empRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found with the given contact number.'
            });
        }

        const employee = empRows[0];

        // 3️⃣ Check if user already registered
        const [userExists] = await db.query(
            `SELECT * FROM user WHERE E_Id = ?`,
            [employee.E_Id]
        );

        if (userExists.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'User already registered for this employee.'
            });
        }

        // 4️⃣ Insert new user
        await db.query(
            `INSERT INTO user (contact, password, type, E_Id)
             VALUES (?, ?, ?, ?)`,
            [contactNumber, password, role, employee.E_Id]
        );

        return res.status(201).json({
            success: true,
            message: 'User registered successfully.'
        });

    } catch (err) {
        console.error("Error during sign-up:", err.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

// Employee Sign in
router.post('/emp/login', async (req, res) => {
    const { contact, password } = req.body;

    try {
        // 1️⃣ Validate input
        if (!contact || !password) {
            return res.status(400).json({
                success: false,
                message: 'Both contact and password are required.'
            });
        }

        // 2️⃣ Find user by contact
        const [userRows] = await db.query(
            `SELECT * FROM user WHERE contact = ?`,
            [contact]
        );

        if (userRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        const user = userRows[0];

        // 3️⃣ Compare password
        const isMatch = password === user.password;
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password.'
            });
        }

        // 4️⃣ Generate JWT token
        const expTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour expiry
        const token = jwt.sign(
            { id: user.id, role: user.type, exp: expTime },
            process.env.JWT_SECRET
        );

        // 5️⃣ Insert session log
        await db.query(
            `INSERT INTO sessionlogs (user, LoginTime, Token)
             VALUES (?, ?, ?)`,
            [user.id, new Date(), token]
        );

        // 6️⃣ Return token and user info
        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            data: {
                token,
                role: user.type,
                E_Id: user.E_Id,
                contact: user.contact,
            }
        });

    } catch (err) {
        console.error("Error during login:", err.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

const generateNewId = async (table, column, prefix) => {
    const [rows] = await db.query(`SELECT ${column} FROM ${table} ORDER BY ${column} DESC LIMIT 1`);
    if (rows.length === 0) return `${prefix}_001`; // First entry
    const lastId = rows[0][column]; // Get last ID
    const lastNum = parseInt(lastId.split("_")[1],10) + 1; // Extract number and increment
    return `${prefix}_${String(lastNum).padStart(3, "0")}`;
};


module.exports = router;
