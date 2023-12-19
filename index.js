import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { prisma } from "./src/prisma/index.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.post("/students", async (req, res) => {
    const {
        body: { firstName, lastName, email, className }
    } = req;
    if (!firstName || !lastName || !email || !className) {
        res.status(400).json({
            message: "All fields are required!"
        });
        return;
    }

    try {
        const student = await prisma.student.create({
            data: {
                firstName,
                lastName,
                email,
                className
            }
        });

        res.status(201).json({
            data: student
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log("Server is running on ", PORT);
});
