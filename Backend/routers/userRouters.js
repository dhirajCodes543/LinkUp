import { Router } from "express";
import USER from "../models/user.js"
import authenticateFirebaseToken from "../middlewares/authMiddleware.js";

const router = Router()


router.get("/userdata", async (req, res) => {
  try {
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(400).json({ error: "Email not found in request" });
    }

    const user = await USER.findOne({ email: userEmail });

    console.log(user)

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/signup",async(req,res)=>{
    console.log(req.body)
    const firebaseUid = req.user.uid;
    const fullName = req.user.name;
    const email = req.user.email;
    const { avatar,college,interests,year } = req.body;
    try{
        const newUser = await USER.create({
            firebaseUid,
            fullName,
            email,
            avatar,
            college,
            interests,
            year
        })
        console.log(newUser)
        res.status(201).json({message:"User Created,",user:newUser})

    } catch(err){

        console.error("Error",err)
        res.status(400).json({error:err.message})
    }
});

export default router;