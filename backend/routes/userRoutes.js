import express from 'express';
import User from './../models/user.js';
import { jwtAuthMiddleware, generateToken } from './../jwt.js'; // Adjust path/filename as needed

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const data = req.body; // Assuming the request body contains the User data

        // Check if there is already an admin user
        const adminUser = await User.findOne({ role: 'admin' });
        if (data.role === 'admin' && adminUser) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }

        // Validate Aadhaar Card Number must have exactly 12 digits
        if (!/^\d{12}$/.test(data.aadharCardNumber)) {
            return res.status(400).json({ error: 'Aadhaar Card Number must be exactly 12 digits' });
        }

        // Check if a user with the same Aadhaar Card Number already exists
        const existingUser = await User.findOne({ aadharCardNumber: data.aadharCardNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same Aadhaar Card Number already exists' });
        }

        // Create a new User document using the Mongoose model
        const newUser = new User(data);

        // Save the new user to the database
        const response = await newUser.save();
        console.log('Data saved');

        // Pass the full user document for JWT (not just an object with id)
        const token = generateToken(response);

        res.status(200).json({ response, token });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        // Extract Aadhaar Card Number and password from request body
        const { aadharCardNumber, password } = req.body;

        // Check if Aadhaar Card Number or password is missing
        if (!aadharCardNumber || !password) {
            return res.status(400).json({ error: 'Aadhaar Card Number and password are required' });
        }

        // Find the user by Aadhaar Card Number
        const user = await User.findOne({ aadharCardNumber });

        // Validate user existence and password
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid Aadhaar Card Number or Password' });
        }

        console.log("User logined successfully");

        // Pass the full user object to generateToken
        const token = generateToken(user);

        // Send token AND basic user info for frontend
        res.status(200).json({
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                role: user.role,
                aadharCardNumber: user.aadharCardNumber,
                email: user.email,
                isVoted: user.isVoted
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the id from the token
        const { currentPassword, newPassword } = req.body; // Extract current and new passwords from request body

        // Check if currentPassword and newPassword are present in the request body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
        }

        // Find the user by userID
        const user = await User.findById(userId);

        // If user does not exist or password does not match, return error
        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid current password' });
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({ message: 'Password updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




export default router;
