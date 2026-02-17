import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { username, password, age, gender, bloodGroup } = await req.json();

        if (!username || !password || !age || !gender || !bloodGroup) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const existingUser = await prisma.patient.findUnique({
            where: { username },
        });

        if (existingUser) {
            return NextResponse.json({ error: "Username already exists" }, { status: 409 });
        }

        const newUser = await prisma.patient.create({
            data: {
                username,
                password, // In a real app, hash this password!
                age,
                gender,
                bloodGroup,
            },
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Signup failed" }, { status: 500 });
    }
}
