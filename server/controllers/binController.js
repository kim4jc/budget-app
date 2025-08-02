const { Bins } = require('../models');

const testUserID = null; // hardcoded test user ID for now

exports.getBins = async (req, res) => {
    try {
        const bins = await Bins.findAll({ where: { userID: testUserID }});
        res.json(bins);
    } catch (error) {
        console.error('Error in getBins:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.addBin = async (req, res) => {
    try {
        console.log('POST /api/bins called with:', req.body);
        const { name, percentage } = req.body;
        if (!name || percentage === undefined) {
            return res.status(400).json({ error: 'Name and percentage are required' });
        }

        const newBin = await Bins.create({ name, percentage, userID: testUserID });
        res.status(201).json(newBin);
    } catch (error) {
        console.error('Error in addBin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.removeBin = async (req, res) => {
    try {
        const { name, percentage } = req.query;
        if (!name || percentage === undefined) {
          return res.status(400).json({ error: 'Name and percentage are required' });
        }

        const bin = await Bins.findOne({ where: { name, percentage, userID: testUserID } });
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