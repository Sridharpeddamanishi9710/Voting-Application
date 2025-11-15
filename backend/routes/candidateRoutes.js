import express from 'express';
import User from './../models/user.js';
import Candidate from './../models/candidate.js';
import { jwtAuthMiddleware, generateToken } from './../jwt.js'; // Adjust path/filename as needed

const router = express.Router();

console.log("Loaded candidateRoutes.js!");

const checkAdminRole = async (userID) => {
   try{
        const user = await User.findById(userID);
        if(user.role === 'admin'){
            return true;
        }
   }catch(err){
        return false;
   }
}

// POST route to add a candidate
router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        // Only allow admin users to add a candidate
        if (!(await checkAdminRole(req.user.id)))
            return res.status(403).json({ message: 'user does not have admin role' });

        // Add adminId from logged-in admin to candidate data
        const data = {
            ...req.body,
            adminId: req.user.id // <-- CRITICAL! This fixes the validation error
        };

        const newCandidate = new Candidate(data);

        // Save candidate to database
        const response = await newCandidate.save();
        console.log('Candidate data saved');
        res.status(200).json({ response });
    } catch (err) {
        console.log(err); // Will show validation errors if missing fields
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// vote count 
router.get('/vote/count', async (req, res) => {
  try {
    const candidateList = await Candidate.find().sort({ voteCount: -1 });
    console.log(candidateList); // Debug: Print full candidate list
    const voteRecord = candidateList.map((data) => ({
      name: data.name,
      party: data.party,
      count: typeof data.voteCount === "number" ? data.voteCount : 0,
    }));
    res.status(200).json(voteRecord);
  } catch (err) {
    console.error("Error in /vote/count:", err); // <-- Will show real error here!
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:candidateID', jwtAuthMiddleware, async (req, res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not have admin role'});
        
        const candidateID = req.params.candidateID; // Extract the id from the URL parameter
        const updatedCandidateData = req.body; // Updated data for the person

        const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation
        })

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('candidate data updated');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.delete('/:candidateID', jwtAuthMiddleware, async (req, res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not have admin role'});
        
        const candidateID = req.params.candidateID; // Extract the id from the URL parameter

        const response = await Candidate.findByIdAndDelete(candidateID);

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('candidate deleted');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

// let's start voting
router.get('/vote/:candidateID', jwtAuthMiddleware, async (req, res)=>{
    const candidateID = req.params.candidateID;
    const userId = req.user.id;
    console.log("Voting API called. candidateID:", candidateID, "userId:", userId);

    try{
        const candidate = await Candidate.findById(candidateID);
        console.log("Candidate found:", candidate);
        if(!candidate){
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const user = await User.findById(userId);
        console.log("User found:", user);
        if(!user){
            return res.status(404).json({ message: 'user not found' });
        }
        if(user.role == 'admin'){
            return res.status(403).json({ message: 'admin is not allowed'});
        }
        if(user.isVoted){
            return res.status(400).json({ message: 'You have already voted' });
        }

        candidate.votes.push({user: userId})
        candidate.voteCount++;
        await candidate.save();

        user.isVoted = true
        await user.save();

        return res.status(200).json({ message: 'Vote recorded successfully' });
    }catch(err){
        console.log("Vote error:", err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
});





// Get List of all candidates with only name and party fields
router.get('/', async (req, res) => {
    try {
        // Find all candidates and include name, party, and _id (remove '-_id')
        const candidates = await Candidate.find({}, 'name party _id');
        // Or simply: const candidates = await Candidate.find(); // includes all fields

        // Return the list of candidates
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { aadharCardNumber, password } = req.body;

  // Find user by Aadhaar Number
  const user = await User.findOne({ aadharCardNumber });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token with full user info!
  const token = generateToken(user);

  // Respond with token AND full user info for frontend!
  res.status(200).json({
    token: token,
    user: {
      _id: user._id,
      name: user.name,
      role: user.role,
      aadharCardNumber: user.aadharCardNumber,
      email: user.email,
    }
  });
});



export default router;