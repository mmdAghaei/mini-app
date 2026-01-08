const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    wallet_address: { type: String, required: true, unique: true }, // آدرس ولت
    username: { type: String, required: true }, // نام کاربر
    profile_picture: { type: String, required: false }, // عکس پروفایل
    total_points: { type: Number, default: 0 }, // تعداد کل امتیازات
    referrals: [{
        referral_user_id: { type: Schema.Types.ObjectId, ref: 'User' },
        referral_points: { type: Number, default: 0 },
    }], // لیست رفرال‌ها
    tokens: { type: Number, default: 0 }, // تعداد توکن‌ها
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);


const taskSchema = new Schema({
    category: { type: String, required: true }, // دسته‌بندی تسک
    title: { type: String, required: true }, // عنوان تسک
    xp: { type: Number, required: true }, // امتیاز دریافتی از انجام تسک
    icon: { type: String, required: true }, // آیکون تسک
    link: { type: String, required: true }, // لینک تسک
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);


const eventSchema = new Schema({
    title: { type: String, required: true }, // عنوان ایونت
    description: { type: String, required: true }, // توضیحات ایونت
    image: { type: String, required: true }, // تصویر ایونت
    link: { type: String, required: true }, // لینک ایونت
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);


const referralSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // شناسه کاربری که ارجاع داده
    referral_user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // شناسه کاربری که ارجاع شده است
    referral_points: { type: Number, default: 0 }, // امتیازات ارجاع
}, { timestamps: true });

module.exports = mongoose.model('Referral', referralSchema);

const transactionSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // شناسه کاربر
    transaction_type: { type: String, required: true }, // نوع تراکنش (مثال: "withdraw" یا "exchange")
    amount: { type: Number, required: true }, // مقدار تراکنش
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);


const friendSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // شناسه کاربر
    friend_user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // شناسه دوست
    friend_points: { type: Number, default: 0 }, // امتیاز دوست
}, { timestamps: true });

module.exports = mongoose.model('Friend', friendSchema);
