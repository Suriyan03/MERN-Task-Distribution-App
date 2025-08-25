const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');
const auth = require('../middleware/auth'); // We will create this middleware next

// @route    POST api/agents
// @desc     Create a new agent
// @access   Private (Admin only)
router.post('/', auth, async (req, res) => {
    const { name, email, mobile, password } = req.body;
    try {
        const newAgent = new Agent({
            name,
            email,
            mobile,
            password,
        });

        const agent = await newAgent.save();
        res.json(agent);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/agents
// @desc     Get all agents
// @access   Private (Admin only)
router.get('/', auth, async (req, res) => {
    try {
        const agents = await Agent.find().select('-password'); // Exclude password from the response
        res.json(agents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;