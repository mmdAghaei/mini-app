// models.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

/* -----------------------------
   Mongo Connection Helper
------------------------------ */
async function connectMongo(uri) {
    if (!uri) throw new Error("mongodb://46.249.99.77:27017");

    // جلوگیری از چندبار کانکت در محیط‌های dev/hot-reload
    if (mongoose.connection.readyState === 1) return mongoose;

    await mongoose.connect(uri, {
        // این آپشن‌ها در نسخه‌های جدید لازم نیست ولی مشکلی هم ندارن
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    });

    return mongoose;
}

/* -----------------------------
   User
------------------------------ */
// models/User.js

const userSchema = new Schema(
    {
        // --- Telegram user info (از Context تو)
        telegram: {
            id: { type: String, required: true, unique: true, index: true }, // همون userData.id
            username: { type: String, default: "" }, // userData.username
            first_name: { type: String, default: "" }, // userData.firstName
            last_name: { type: String, default: "" }, // userData.lastName
            language_code: { type: String, default: "" }, // userData.languageCode
            photo_url: { type: String, default: "" }, // userData.photoUrl
        },

        // --- Wallet (بعداً که وصل کرد)
        wallet_address: { type: String, unique: true, sparse: true, index: true },

        // --- UI friendly fields (اختیاری، برای راحتی نمایش)
        username: { type: String, default: "" },          // می‌تونی از telegram.username پرش کنی
        profile_picture: { type: String, default: "" },  // می‌تونی از telegram.photo_url پرش کنی

        // --- Balances
        points_balance: { type: Number, default: 0 },
        token_balance: { type: Number, default: 0 },

        // --- Referral
        referral_code: { type: String, unique: true, sparse: true, index: true },
        referred_by: { type: Schema.Types.ObjectId, ref: "User", default: null }, // اگر خواستی مستقیم ذخیره کنی
        session: {
            tokenHash: { type: String, default: null, index: true },
            createdAt: { type: Date, default: null },
        },
        // --- Admin / Flags (اختیاری)
        is_banned: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
);




/* -----------------------------
   Task (تعریف تسک‌ها)
------------------------------ */

const taskSchema = new Schema(
    {
        category: { type: String, required: true, index: true },
        title: { type: String, required: true },
        xp: { type: Number, required: true },
        icon: { type: String, required: true }, // telegram | youtube | x
        link: { type: String, required: true },
        is_active: { type: Boolean, default: true, index: true },
    },
    { timestamps: true }
);

/* -----------------------------
   TaskCompletion (کاربر کدام تسک را انجام داده)
------------------------------ */
const taskCompletionSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        task_id: { type: Schema.Types.ObjectId, ref: "Task", required: true, index: true },
        xp_earned: { type: Number, required: true },
    },
    { timestamps: true }
);

// جلوگیری از دوبار انجام دادن یک تسک توسط یک کاربر
taskCompletionSchema.index({ user_id: 1, task_id: 1 }, { unique: true });

/* -----------------------------
   Referral (یک منبع حقیقت)
------------------------------ */
const referralSchema = new Schema(
    {
        referrer_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        referred_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

        points_awarded: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// جلوگیری از رفرال تکراری
referralSchema.index({ referrer_id: 1, referred_id: 1 }, { unique: true });

/* -----------------------------
   Ledger (لاگ تغییرات امتیاز/توکن)
------------------------------ */
const ledgerSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

        kind: { type: String, enum: ["points", "token"], required: true, index: true },
        action: {
            type: String,
            enum: ["earn", "spend", "exchange", "withdraw", "admin_adjust"],
            required: true,
            index: true,
        },

        amount: { type: Number, required: true }, // مثبت/منفی
        balance_after: { type: Number, required: true },

        ref: { type: Schema.Types.Mixed }, // {task_id} یا {referral_id} یا {transaction_id}
    },
    { timestamps: true }
);

/* -----------------------------
   Transaction (تبدیل/برداشت)
------------------------------ */
const transactionSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

        type: {
            type: String,
            enum: ["exchange_points_to_token", "withdraw_token"],
            required: true,
            index: true,
        },

        status: {
            type: String,
            enum: ["pending", "success", "failed"],
            default: "pending",
            index: true,
        },

        points_amount: { type: Number, default: 0 },
        token_amount: { type: Number, default: 0 },

        tx_hash: { type: String, index: true }, // اگر برداشت on-chain باشد
        meta: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

/* -----------------------------
   Post (News + Event یکی شده)
------------------------------ */
const postSchema = new Schema(
    {
        type: { type: String, enum: ["news", "event"], default: "news", index: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String },
        link: { type: String },

        is_published: { type: Boolean, default: true, index: true },
        published_at: { type: Date, default: Date.now, index: true },
    },
    { timestamps: true }
);

/* -----------------------------
   Model Registration (safe for hot reload)
------------------------------ */
const User = mongoose.models.User || mongoose.model("User", userSchema);
const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
const TaskCompletion =
    mongoose.models.TaskCompletion || mongoose.model("TaskCompletion", taskCompletionSchema);
const Referral = mongoose.models.Referral || mongoose.model("Referral", referralSchema);
const Ledger = mongoose.models.Ledger || mongoose.model("Ledger", ledgerSchema);
const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

/* -----------------------------
   Exports
------------------------------ */
module.exports = {
    connectMongo,
    User,
    Task,
    TaskCompletion,
    Referral,
    Ledger,
    Transaction,
    Post,
};