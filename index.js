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

app.get("/students", async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                className: true
            }
        });

        res.status(200).json({
            data: students
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/students/:id", async (req, res) => {
    try {
        const {
            params: { id }
        } = req;
        const student = await prisma.student.findUnique({
            where: {
                id: id
            }
        });

        if (!student) {
            res.status(404).json({
                message: `Student with ID ${id} not found.`
            });
            return;
        }

        res.status(201).json({
            data: student
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

app.patch("/students/:id", async (req, res) => {
    const {
        params: { id },
        body: { firstName, lastName, email, className }
    } = req;

    try {
        const student = await prisma.student.findUnique({
            where: {
                id: id
            }
        });

        if (!student) {
            res.status(404).json({
                message: "Student is not found"
            });
            return;
        }
        await prisma.student.update({
            where: {
                id: id
            },
            data: {
                firstName,
                lastName,
                email,
                className
            }
        });

        res.status(203).send();
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

app.delete("/students/:id", async (req, res) => {
    const {
        params: { id }
    } = req;

    try {
        const student = await prisma.student.findUnique({
            where: {
                id: id
            }
        });
        if (!student) {
            res.status(404).json({
                message: "Student is not found"
            });
            return;
        }

        await prisma.student.delete({
            where: {
                id: id
            }
        });

        res.status(203).send();
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

app.listen(PORT, () => {
    console.log("Server is running on ", PORT);
});
