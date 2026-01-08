// pages/api/saveUserData.js

import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// بارگذاری متغیرهای محیطی از فایل .env
dotenv.config();

let client;
let db;

// تابع اتصال به MongoDB
const connectToDatabase = async () => {
    if (client && db) return { client, db };

    try {
        // استفاده از کانکشن استرینگ از متغیر محیطی
        client = new MongoClient("mongodb://mmd:mmdAghaei1385@185.110.190.64:27017/airdropDB?authSource=admin", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await client.connect();
        db = client.db("airdropDB"); // نام دیتابیس را مشخص کنید
        console.log("MongoDB connected successfully!");
        return { client, db };
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw new Error("Failed to connect to database");
    }
};

// تابع API برای ذخیره اطلاعات کاربر
export default async function handler(req, res) {
    if (req.method === "POST") {
        const { photoUrl, firstName, lastName, id, username, languageCode, walletAddress } = req.body;

        try {
            const { db } = await connectToDatabase(); // اتصال به دیتابیس
            const usersCollection = db.collection("users");

            // ذخیره اطلاعات کاربر در دیتابیس
            const result = await usersCollection.insertOne({
                photoUrl,
                firstName,
                lastName,
                id,
                username,
                languageCode,
                walletAddress,
            });

            res.status(200).json({ message: "User data saved successfully", data: result });
        } catch (error) {
            res.status(500).json({ message: "Error saving user data", error });
        }
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
