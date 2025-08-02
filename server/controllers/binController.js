const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { Bins } = require('../models');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

function getUserIdFromRequest(req) {
    const { token } = req.cookies;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.id;
    } catch (err) {
        console.error('Invalid token:', err);
        return null;
    }
}

const testUserID = null; // hardcoded test user ID for now

exports.getBins = async (req, res) => {
    const userID = getUserIdFromRequest(req);
    if (!userID) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const bins = await Bins.findAll({ where: { userID }});
        res.json(bins);
    } catch (error) {
        console.error('Error in getBins:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.addBin = async (req, res) => {
    const userID = getUserIdFromRequest(req);
    if (!userID) return res.status(401).json({ error: 'Unauthorized' });
    try {
        console.log('POST /api/bins called with:', req.body);
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

exports.removeBin = async (req, res) => {
    const userID = getUserIdFromRequest(req);
    if (!userID) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const { name, percentage } = req.query;
        if (!name || percentage === undefined) {
          return res.status(400).json({ error: 'Name and percentage are required' });
        }

        const bin = await Bins.findOne({ where: { name, percentage, userID } });
        if (!bin) {
          return res.status(404).json({ error: 'Bin not found' });
        }
        await bin.destroy();
        res.json({ message: 'Bin removed' });
    } catch (error) {
        console.error('Error in removeBin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};