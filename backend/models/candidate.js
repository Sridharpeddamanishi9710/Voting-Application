import mongoose from 'mongoose';
// const bcrypt = require('bcrypt');

// Define the Person schema
const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            votedAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    voteCount: {
        type: Number,
        default: 0
    },
    adminId: { // <-- ADD THIS FIELD!
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Candidate = mongoose.model('Candidate', candidateSchema);
export default Candidate;