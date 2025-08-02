// Bins Controller

const { Bins } = require('../models');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to get the user ID from the JWT token
const getUserIdFromToken = (token, res) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.id;
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
        return null;
    }
};

// GET /api/bins
exports.getBins = async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const userID = getUserIdFromToken(token, res);
        if (!userID) return;

        const bins = await Bins.findAll({ where: { userID } });
        res.status(200).json(bins);
    } catch (error) {
        console.error('Error in getBins:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// POST /api/bins
exports.addBin = async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const userID = getUserIdFromToken(token, res);
        if (!userID) return;

        const { name, percentage } = req.body;
        if (!name || percentage === undefined) {
            return res.status(400).json({ error: 'Name and percentage are required' });
        }

        const newBin = await Bins.create({ name, percentage, userID });
        res.status(201).json(newBin);
    } catch (error) {
        console.error('Error in addBin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// DELETE /api/bins/:id
exports.removeBin = async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const userID = getUserIdFromToken(token, res);
        if (!userID) return;

        const binID = req.params.id;

        const bin = await Bins.findOne({ where: { id: binID, userID } });
        if (!bin) {
            return res.status(404).json({ error: 'Bin not found or unauthorized' });
        }

        await bin.destroy();
        res.status(200).json({ message: 'Bin removed successfully' });
    } catch (error) {
        console.error('Error in removeBin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
