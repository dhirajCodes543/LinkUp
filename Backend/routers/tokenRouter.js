import { Router } from "express"
import generateZegoToken from "../services/generateZegoToken.js";

const router = Router();

router.post("/token", (req, res) => {
    const { roomId, userId ,userName } = req.body;

    console.log("phunch gya mai");
    

    if (!roomId || !userId) {
        return res.status(400).json({ error: "Missing roomId or userId" });
    }

    try {
        const token = generateZegoToken({roomId,userId,userName});
        res.json({ token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate token" });
    }
})

export default router