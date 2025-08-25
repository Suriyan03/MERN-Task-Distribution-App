const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');
const Agent = require('../models/Agent');
const AgentList = require('../models/AgentList');
const auth = require('../middleware/auth');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    // Accept only csv, xls, and xlsx files
    if (
        file.mimetype === 'text/csv' ||
        file.mimetype === 'application/vnd.ms-excel' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only CSV, XLS, and XLSX are allowed.'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// @route    POST api/lists/upload
// @desc     Upload a file and distribute items to agents
// @access   Private (Admin only)
router.post('/upload', auth, upload.single('listFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded.' });
    }

    try {
        // Read the uploaded CSV file
        const stream = fs.createReadStream(req.file.path);
        const csvData = [];
        const csvStream = csv.parseStream(stream, { headers: true })
            .on('data', (data) => {
                // Map the parsed data to match your Mongoose schema
                csvData.push({
                    firstName: data.FirstName,
                    phone: data.Phone,
                    notes: data.Notes,
                });
            })
            .on('end', async () => {
                // Get all agents
                const agents = await Agent.find().select('-password');
                if (agents.length === 0) {
                    // Clean up the uploaded file if there are no agents
                    fs.unlinkSync(req.file.path);
                    return res.status(400).json({ msg: 'No agents found to distribute lists to.' });
                }

                // Prepare an array for each agent's list
                const distributedLists = agents.map(agent => ({
                    agentId: agent._id,
                    items: [],
                }));

                // Distribute items in a round-robin fashion
                csvData.forEach((item, index) => {
                    const agentIndex = index % agents.length;
                    if (distributedLists[agentIndex]) {
                        distributedLists[agentIndex].items.push(item);
                    }
                });

                // Save distributed lists to the database
                await Promise.all(
                    distributedLists.map(async (list) => {
                        if (list.items.length > 0) {
                            await AgentList.create({
                                agent: list.agentId,
                                items: list.items,
                            });
                        }
                    })
                );

                // Clean up the uploaded file
                fs.unlinkSync(req.file.path);

                res.status(200).json({ msg: 'File uploaded and lists distributed successfully!' });
            });
    } catch (err) {
        console.error(err.message);
        // Clean up the uploaded file in case of error
        if (req.file) {
             fs.unlinkSync(req.file.path);
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;