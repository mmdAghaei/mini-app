// // const { MongoClient } = require('mongodb');

// // const url = "mongodb://46.249.99.77:27017";
// // const client = new MongoClient(url);

// // async function run() {
// //     try {
// //         await client.connect();
// //         console.log("Connected to MongoDB");

// //         const db = client.db("testdb");
// //         const users = db.collection("users");

// //         const result = await users.insertOne({
// //             name: "Mohammad",
// //             age: 25,
// //             createdAt: new Date()
// //         });

// //         console.log("Inserted ID:", result.insertedId);

// //     } catch (err) {
// //         console.error(err);
// //     } finally {
// //         await client.close();
// //     }
// // }

// // run();

// // save.js (node script) - run: node save.js
// import mongoose from "mongoose";

// // 1) اتصال
// const MONGO_URI = "mongodb://mmd:mmdAghaei1385@127.0.0.1:27017/miniapp?authSource=admin";

// const taskSchema = new mongoose.Schema(
//     {
//         category: { type: String, required: true, index: true },
//         title: { type: String, required: true },
//         xp: { type: Number, required: true },
//         icon: { type: String, required: true }, // telegram | youtube | x
//         link: { type: String, required: true },
//         is_active: { type: Boolean, default: true, index: true },
//     },
//     { timestamps: true }
// );

// const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

// async function run() {
//     await mongoose.connect(MONGO_URI);

//     const tasks = [
//         { category: "Telegram", title: "Join Telegram Channel #1", xp: 100, icon: "telegram", link: "https://t.me/mtxto" },
//         { category: "Telegram", title: "Join Telegram Channel #2", xp: 100, icon: "telegram", link: "https://t.me/MediTechX" },
//         { category: "Telegram", title: "Join Telegram Group", xp: 150, icon: "telegram", link: "https://t.me/meditechxtoken" },
//         { category: "Social", title: "Subscribe on YouTube", xp: 100, icon: "youtube", link: "https://www.youtube.com/@MediTechX-l1t" },
//         { category: "Social", title: "Follow on X", xp: 100, icon: "x", link: "https://x.com/meditechxinc" },
//     ];

//     for (const t of tasks) {
//         const exists = await Task.findOne({ title: t.title, link: t.link }).lean();
//         if (!exists) {
//             await Task.create(t);
//             console.log("Inserted:", t.title);
//         } else {
//             console.log("Exists:", t.title);
//         }
//     }

//     await mongoose.disconnect();
//     console.log("Done ✅");
// }

// run().catch(async (e) => {
//     console.error(e);
//     try { await mongoose.disconnect(); } catch { }
//     process.exit(1);
// });


import "dotenv/config";
import { connectMongo, Event } from "/home/ubuntu/miniapp/mini-app/src/api/Schema/Schemas.js";

async function main() {


    await connectMongo("mongodb://mmd:mmdAghaei1385@127.0.0.1:27017/miniapp?authSource=admin");

    const items = [
        {
            text: "🎁 Weekly Giveaway — Claim your rewards!",
            image: "/Page/bg-1.png",
            logo: "/icons/mtxPageOne.svg",
            isFullWidth: true,
            href: "/task",
            isActive: true,
            order: 1,
        },
        {
            text: "🚀 Join our Telegram community",
            image: "",
            logo: "",
            isFullWidth: false,
            href: "https://t.me/YOUR_CHANNEL",
            isActive: true,
            order: 2,
        },
        {
            text: "🎥 Subscribe on YouTube",
            image: "",
            logo: "",
            isFullWidth: false,
            href: "https://youtube.com/@YOUR_CHANNEL",
            isActive: true,
            order: 3,
        },
    ];

    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Seed data is empty");
    }

    // (اختیاری) اگر میخوای هر بار از نو بسازه:
    // await Event.deleteMany({});

    // جلوگیری از تکراری شدن با order یا text+href
    for (const ev of items) {
        const exists = await Event.findOne({ text: ev.text, href: ev.href }).lean();
        if (!exists) {
            await Event.create(ev);
            console.log("Inserted:", ev.text);
        } else {
            console.log("Exists:", ev.text);
        }
    }

    console.log("Done ✅");
    process.exit(0);
}

main().catch((e) => {
    console.error("❌ Seed failed:", e.message);
    process.exit(1);
});