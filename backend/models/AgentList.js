// backend/models/AgentList.js
const mongoose = require('mongoose');

const AgentListSchema = new mongoose.Schema({
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true,
    },
    items: [
        {
            firstName: { type: String, required: true },
            phone: { type: String, required: true },
            notes: { type: String }, // notes can be optional
        }
    ],
});

module.exports = mongoose.model('AgentList', AgentListSchema);