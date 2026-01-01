require("dotenv").config();

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage, registerFont } = require("canvas");

const STATE_DIR = path.join(__dirname, "data");
const STATE_FILE = path.join(STATE_DIR, "state.json");
const ASSETS_DIR = path.join(__dirname, "assets");

function clampInt(value, fallback, min, max) {
    const n = parseInt(String(value ?? ""), 10);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
}

const CFG = {
    timerMinutes: clampInt(process.env.TIMER_MINUTES, 10, 1, 1440),
    targetChatId: (process.env.TARGET_CHAT_ID || "").trim(),
    symbolMain: (process.env.SYMBOL_MAIN || "MTXUSDT").trim().toUpperCase(),
    symbolMini1: (process.env.SYMBOL_MINI_1 || "BTCUSDT").trim().toUpperCase(),
    symbolMini2: (process.env.SYMBOL_MINI_2 || "ETHUSDT").trim().toUpperCase(),
    coinstoreBaseUrl: (process.env.COINSTORE_BASE_URL || "https://api.coinstore.com/api").trim(),

    // Branding
    brandName: "MediTechX",
    headerTagline: "Live Market Dashboard",
    logoPath: path.join(ASSETS_DIR, "v2.png"),
    logoPath2: path.join(ASSETS_DIR, "Vector.png"),
    logoPath3: path.join(ASSETS_DIR, "Group 427319448.png"),




    // UI colors
    cBg1: "#020617",
    cBg2: "#0b1b3a",
    cBg3: "#06122a",
    cText: "rgba(226,232,240,0.95)",
    cSub: "rgba(148,163,184,0.9)",
    cYellow: "rgba(250,204,21,0.95)",
    cBlue: "rgba(96,165,250,0.90)",
};

// -------------------- State --------------------
function ensureState() {
    if (!fs.existsSync(STATE_DIR)) fs.mkdirSync(STATE_DIR, { recursive: true });
    if (!fs.existsSync(STATE_FILE)) fs.writeFileSync(STATE_FILE, JSON.stringify({}), "utf8");
}
function loadState() {
    ensureState();
    try {
        return JSON.parse(fs.readFileSync(STATE_FILE, "utf8") || "{}");
    } catch {
        return {};
    }
}
function saveState(obj) {
    ensureState();
    fs.writeFileSync(STATE_FILE, JSON.stringify(obj, null, 2), "utf8");
}

// -------------------- Fonts & Brand Assets --------------------
const BRAND = {
    logoImg: null,
    logoImg2: null,
    logoImg3: null,
    fontsReady: false,
};

function safeRegisterFont(filePath, family, weight = "normal") {
    try {
        if (fs.existsSync(filePath)) {
            registerFont(filePath, { family, weight });
            return true;
        }
    } catch { }
    return false;
}

async function initBrandAssets() {
    // Fonts (numeric weights = safest)
    const ok1 = safeRegisterFont(
        path.join(ASSETS_DIR, "Orbitron-Regular.ttf"),
        "Orbitron",
        "400"
    );

    const ok2 = safeRegisterFont(
        path.join(ASSETS_DIR, "Orbitron-Bold.ttf"),
        "Orbitron",
        "800"
    );

    const ok3 = safeRegisterFont(
        path.join(ASSETS_DIR, "Inter-Regular.ttf"),
        "Inter",
        "400"
    );

    const ok4 = safeRegisterFont(
        path.join(ASSETS_DIR, "Inter-SemiBold.ttf"),
        "Inter",
        "600"
    );

    const ok5 = safeRegisterFont(
        path.join(ASSETS_DIR, "Inter-Bold.ttf"),
        "Inter",
        "700"
    );

    BRAND.fontsReady = ok1 || ok2 || ok3 || ok4 || ok5;

    // Logo
    try {
        if (fs.existsSync(CFG.logoPath)) {
            BRAND.logoImg = await loadImage(CFG.logoPath);
            BRAND.logoImg2 = await loadImage(CFG.logoPath2);
            BRAND.logoImg3 = await loadImage(CFG.logoPath3);


        }
    } catch {
        BRAND.logoImg = null;
        BRAND.logoImg2 = null;
        BRAND.logoImg3 = null;

    }
}


// -------------------- Utils --------------------
function fmtNum(x, d = 4) {
    const n = Number(x);
    if (!Number.isFinite(n)) return "-";
    return n.toLocaleString("en-US", { maximumFractionDigits: d });
}
function fmtUSD(x, d = 8) {
    const n = Number(x);
    if (!Number.isFinite(n)) return "-";
    return n.toLocaleString("en-US", { maximumFractionDigits: d });
}
function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}
async function withRetry(fn, { tries = 3, baseDelay = 350 } = {}) {
    let lastErr;
    for (let i = 0; i < tries; i++) {
        try {
            return await fn();
        } catch (e) {
            lastErr = e;
            await sleep(baseDelay * Math.pow(2, i));
        }
    }
    throw lastErr;
}
function formatAxiosError(e) {
    const status = e?.response?.status;
    const data = e?.response?.data;
    const desc = data?.description || data?.message || data?.msg || "";
    if (status) {
        let body = "";
        try {
            body = data ? JSON.stringify(data).slice(0, 900) : "";
        } catch { }
        return `HTTP ${status}${desc ? ` • ${desc}` : ""}${body ? `\n${body}` : ""}`;
    }
    return e?.message || String(e);
}

function fontStack(preferred, fallback = "Arial") {
    return BRAND.fontsReady ? `${preferred}, ${fallback}, sans-serif` : `${fallback}, sans-serif`;
}

// -------------------- Coinstore Public REST --------------------
const http = axios.create({ timeout: 15000 });

async function csGet(pathname, params) {
    const url = `${CFG.coinstoreBaseUrl}${pathname}`;
    return withRetry(async () => {
        const res = await http.get(url, { params });
        const payload = res.data;

        if (payload && typeof payload === "object" && "code" in payload) {
            if (payload.code !== 0) {
                throw new Error(`Coinstore API error: code=${payload.code} msg=${payload.message || ""}`);
            }
            return payload.data;
        }
        return payload;
    });
}

async function fetchCoinstoreTicker(symbol) {
    const list = await csGet("/v1/market/tickers");
    if (!Array.isArray(list)) throw new Error("Unexpected ticker format from Coinstore.");
    const t = list.find((x) => String(x.symbol).toUpperCase() === symbol.toUpperCase());
    if (!t) throw new Error(`Symbol not found in Coinstore tickers: ${symbol}`);
    return t;
}

async function fetchCoinstoreDepth(symbol, depth = 50) {
    return csGet(`/v1/market/depth/${encodeURIComponent(symbol)}`, { depth });
}

async function fetchCoinstoreTrades(symbol, size = 20) {
    const data = await csGet(`/v1/market/trade/${encodeURIComponent(symbol)}`, { size });
    if (!Array.isArray(data)) return [];
    return data;
}

async function fetchCoinstoreKlines(symbol, period = "15min", size = 120) {
    const data = await csGet(`/v1/market/kline/${encodeURIComponent(symbol)}`, { period, size });
    const items = data?.item;
    if (!Array.isArray(items)) return [];
    return items
        .map((k) => ({
            t: Number(k.startTime) * 1000,
            o: Number(k.open),
            h: Number(k.high),
            l: Number(k.low),
            c: Number(k.close),
            v: Number(k.volume),
        }))
        .filter((p) => [p.t, p.o, p.h, p.l, p.c].every(Number.isFinite));
}

async function fetchSymbolBundle(symbol) {
    const [ticker, depth, trades, ohlc] = await Promise.all([
        fetchCoinstoreTicker(symbol),
        fetchCoinstoreDepth(symbol, 50),
        fetchCoinstoreTrades(symbol, 20),
        fetchCoinstoreKlines(symbol, "15min", 120),
    ]);

    const open = Number(ticker.open);
    const close = Number(ticker.close);
    const changePct =
        Number.isFinite(open) && open !== 0 && Number.isFinite(close) ? ((close - open) / open) * 100 : NaN;

    return { symbol, ticker, changePct, depth, trades, ohlc };
}

// -------------------- Drawing --------------------
function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
}

function glassPanel(ctx, x, y, w, h, r) {
    // shadow base
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 26;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    roundRect(ctx, x, y, w, h, r);
    ctx.fill();
    ctx.restore();

    // glass
    ctx.save();
    roundRect(ctx, x, y, w, h, r);
    ctx.clip();

    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, "rgba(255,255,255,0.12)");
    g.addColorStop(1, "rgba(255,255,255,0.05)");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);

    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgba(255,255,255,0.20)";
    roundRect(ctx, x, y, w, h, r);
    ctx.stroke();

    const shine = ctx.createLinearGradient(x, y, x, y + h);
    shine.addColorStop(0, "rgba(0, 0, 0, 0.1)");
    shine.addColorStop(0.40, "rgba(255,255,255,0.03)");
    shine.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = shine;
    ctx.fillRect(x, y, w, h);

    ctx.restore();
}

function drawLogo(ctx, x, y, size, st) {
    // nice container
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;

    roundRect(ctx, x, y, 70, 70, Math.round(size * 0.28));
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    ctx.fill();

    // logo inside
    if (BRAND.logoImg) {
        ctx.save();
        roundRect(ctx, x + 10, y + 11, 50, 50, Math.round(size * 0.22));
        ctx.clip();
        ctx.drawImage(st == "coin" ? BRAND.logoImg2 : BRAND.logoImg, x + 10, y + 11, 50, 50);
        ctx.restore();
    } else {
        // fallback icon
        ctx.fillStyle = CFG.cYellow;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size * 0.22, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

function drawLogoCoin(ctx, x, y, size, st) {
    // nice container
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;

    // roundRect(ctx, x, y, 70, 70, Math.round(size * 0.28));
    // ctx.fillStyle = "rgba(255,255,255,0.10)";
    // ctx.fill();

    // logo inside
    if (BRAND.logoImg) {
        ctx.save();
        roundRect(ctx, x + 10, y + 11, size, size, Math.round(size * 0.22));
        ctx.clip();
        ctx.drawImage(st == "coin" ? BRAND.logoImg3 : BRAND.logoImg, x + 10, y + 11, size, size);
        ctx.restore();
    } else {
        // fallback icon
        ctx.fillStyle = CFG.cYellow;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size * 0.22, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}


function drawHeader(ctx, mainSymbol, lastPrice) {
    const titleFont = fontStack("Orbitron", "Arial");
    const bodyFont = fontStack("Inter", "Arial");

    // left: logo + brand
    drawLogo(ctx, 44, 28, 56);

    // drawLogo(ctx, 1280, 28, 56,"coin");
    drawLogoCoin(ctx, 780, 78, 117, "coin");


    ctx.save();
    ctx.fillStyle = CFG.cText;
    ctx.font = `800 28px Orbitron`;
    ctx.fillText(CFG.brandName, 130, 60);

    ctx.fillStyle = CFG.cSub;
    ctx.font = `600 14px ${bodyFont}`;
    ctx.fillText(CFG.headerTagline, 130, 82);

    // right: live chip
    const chipW = 360;
    const chipH = 54;
    const chipX = 1400 - 56 - chipW;
    const chipY = 32;

    roundRect(ctx, chipX, chipY, chipW, chipH, 18);
    ctx.fillStyle = "rgba(2,6,23,0.35)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = "rgba(34,197,94,0.95)";
    ctx.beginPath();
    ctx.arc(chipX + 18, chipY + chipH / 2, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = CFG.cText;
    ctx.font = `700 14px ${bodyFont}`;
    ctx.fillText("LIVE", chipX + 40, chipY + 22);

    ctx.fillStyle = CFG.cSub;
    ctx.font = `700 12px ${bodyFont}`;
    ctx.fillText(`${mainSymbol}`, chipX + 40, chipY + 42);

    ctx.fillStyle = CFG.cYellow;
    ctx.font = `800 16px ${bodyFont}`;
    ctx.fillText(`${fmtUSD(lastPrice, 8)}`, chipX + 270, chipY + 32);

    ctx.restore();
}

function drawKV(ctx, x, y, k, v, accent = false) {
    const bodyFont = fontStack("Inter", "Arial");
    ctx.save();
    ctx.fillStyle = CFG.cSub;
    ctx.font = `600 12px ${bodyFont}`;
    ctx.fillText(k, x, y);

    ctx.fillStyle = accent ? CFG.cYellow : CFG.cText;
    ctx.font = `800 14px ${bodyFont}`;
    ctx.fillText(v, x, y + 18);
    ctx.restore();
}

function drawChartGrid(ctx, x, y, w, h) {
    ctx.save();
    ctx.strokeStyle = "rgba(148,163,184,0.12)";
    ctx.lineWidth = 1;

    const rows = 5;
    for (let i = 0; i <= rows; i++) {
        const yy = y + (h * i) / rows;
        ctx.beginPath();
        ctx.moveTo(x, yy);
        ctx.lineTo(x + w, yy);
        ctx.stroke();
    }
    const cols = 6;
    for (let i = 0; i <= cols; i++) {
        const xx = x + (w * i) / cols;
        ctx.beginPath();
        ctx.moveTo(xx, y);
        ctx.lineTo(xx, y + h);
        ctx.stroke();
    }
    ctx.restore();
}

function drawCandles(ctx, x, y, w, h, ohlc) {
    const bodyFont = fontStack("Inter", "Arial");
    if (!ohlc || ohlc.length < 5) {
        ctx.save();
        ctx.fillStyle = CFG.cText;
        ctx.font = `700 16px ${bodyFont}`;
        ctx.fillText("No candle data", x + 20, y + 30);
        ctx.restore();
        return;
    }

    const lows = ohlc.map((p) => p.l);
    const highs = ohlc.map((p) => p.h);
    let minY = Math.min(...lows);
    let maxY = Math.max(...highs);
    if (!Number.isFinite(minY) || !Number.isFinite(maxY) || minY === maxY) {
        minY = minY || 0;
        maxY = minY + 1;
    }
    const yLabelPad = 95;
    const pad = (maxY - minY) * 0.06;
    minY -= pad;
    maxY += pad;
    const chartX = x + yLabelPad;
    const chartW = w - yLabelPad;

    const n = ohlc.length;
    const step = chartW / n;
    const bodyW = Math.max(2, Math.min(12, step * 0.62));
    const mapY = (v) => y + ((maxY - v) / (maxY - minY)) * h;


    drawChartGrid(ctx, chartX, y, chartW, h);

    // y labels
    ctx.save();
    ctx.fillStyle = CFG.cSub;
    ctx.font = `600 12px ${bodyFont}`;
    for (let i = 0; i <= 4; i++) {
        const vv = minY + ((maxY - minY) * (4 - i)) / 4;
        const yy = y + (h * i) / 4;
        ctx.fillText(fmtUSD(vv, 8), x + 8, yy + 4);
    }
    ctx.restore();

    for (let i = 0; i < n; i++) {
        const p = ohlc[i];
        const cx = chartX + i * step + step / 2;

        const yo = mapY(p.o);
        const yc = mapY(p.c);
        const yh = mapY(p.h);
        const yl = mapY(p.l);

        const up = p.c >= p.o;

        // wick
        ctx.save();
        ctx.strokeStyle = up ? "rgba(253,230,138,0.95)" : "rgba(191,219,254,0.95)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, yh);
        ctx.lineTo(cx, yl);
        ctx.stroke();
        ctx.restore();

        // body
        const top = Math.min(yo, yc);
        const bottom = Math.max(yo, yc);
        const bh = Math.max(1.5, bottom - top);

        ctx.save();
        ctx.fillStyle = up ? CFG.cYellow : "rgba(96,165,250,0.85)";
        ctx.strokeStyle = up ? "rgba(253,230,138,1)" : "rgba(191,219,254,1)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(cx - bodyW / 2, top, bodyW, bh);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}

function drawSparkline(ctx, x, y, w, h, ohlc, color) {
    if (!ohlc || ohlc.length < 2) return;
    const closes = ohlc.map((p) => p.c);
    let min = Math.min(...closes);
    let max = Math.max(...closes);
    if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
        min = min || 0;
        max = min + 1;
    }
    const pad = (max - min) * 0.08;
    min -= pad;
    max += pad;

    const n = closes.length;
    const step = w / (n - 1);
    const mapY = (v) => y + ((max - v) / (max - min)) * h;

    ctx.save();
    ctx.strokeStyle = "rgba(148,163,184,0.12)";
    for (let i = 1; i <= 3; i++) {
        const yy = y + (h * i) / 4;
        ctx.beginPath();
        ctx.moveTo(x, yy);
        ctx.lineTo(x + w, yy);
        ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
        const xx = x + i * step;
        const yy = mapY(closes[i]);
        if (i === 0) ctx.moveTo(xx, yy);
        else ctx.lineTo(xx, yy);
    }
    ctx.stroke();
    ctx.restore();
}

async function buildDashboardPng(main, mini1, mini2) {
    const W = 1400,
        H = 850;
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#2F2F2F");
    bg.addColorStop(0.55, "#020202");
    // bg.addColorStop(1, CFG.cBg3);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Subtle grid
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = "rgba(148,163,184,0)";
    for (let x = 0; x < W; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
    }
    for (let y = 0; y < H; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
    }
    ctx.restore();
    // ctx.drawImage(BRAND.logoImg, 10, 11, 500, 500);


    // Panels
    glassPanel(ctx, 28, 18, W - 56, 94, 22);
    const lastPrice = main?.ticker?.close ?? main?.ticker?.last ?? main?.ticker?.price;
    drawHeader(ctx, main.symbol, lastPrice);

    glassPanel(ctx, 28, 128, 900, 520, 26);
    glassPanel(ctx, 946, 128, 426, 520, 26);
    glassPanel(ctx, 28, 664, 670, 168, 26);
    glassPanel(ctx, 714, 664, 658, 168, 26);

    // Main chart title
    const bodyFont = fontStack("Inter", "Arial");
    ctx.save();
    ctx.fillStyle = CFG.cText;
    ctx.font = `900 16px ${bodyFont}`;
    ctx.fillText(`${main.symbol} • 15m Candles`, 52, 154);
    ctx.restore();

    // Candles
    drawCandles(ctx, 48, 170, 860, 448, main.ohlc);

    // Mini labels + sparklines
    ctx.save();
    ctx.fillStyle = CFG.cText;
    ctx.font = `800 14px ${bodyFont}`;
    ctx.fillText(`${mini1.symbol}`, 60, 700);
    ctx.fillText(`${mini2.symbol}`, 376, 700);
    ctx.restore();

    drawSparkline(ctx, 54, 700, 300, 92, mini1.ohlc, "#f79622");
    drawSparkline(ctx, 370, 720, 300, 92, mini2.ohlc, "#7d8ace");

    // Bottom-right stats
    const t = main.ticker || {};
    const last = t.close;
    const hi = t.high;
    const lo = t.low;
    const volQuote = t.volume;
    const bid = t.bid;
    const ask = t.ask;
    const spread = Number(ask) && Number(bid) ? Number(ask) - Number(bid) : NaN;
    const updated = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";

    ctx.save();
    ctx.fillStyle = CFG.cText;
    ctx.font = `900 18px ${bodyFont}`;
    ctx.fillText(`${main.symbol}`, 736, 694);

    ctx.fillStyle = CFG.cSub;
    ctx.font = `600 12px ${bodyFont}`;
    ctx.fillText(`Updated: ${updated}`, 736, 716);

    drawKV(ctx, 736, 742, "Last", fmtUSD(last, 8), true);
    drawKV(ctx, 870, 742, "24h %", Number.isFinite(main.changePct) ? `${fmtNum(main.changePct, 2)}%` : "-");
    drawKV(ctx, 1004, 742, "High", fmtUSD(hi, 8));
    drawKV(ctx, 1128, 742, "Low", fmtUSD(lo, 8));
    drawKV(ctx, 1252, 742, "Vol(q)", fmtNum(volQuote, 2));

    drawKV(ctx, 736, 786, "Bid", fmtUSD(bid, 8));
    drawKV(ctx, 870, 786, "Ask", fmtUSD(ask, 8));
    drawKV(ctx, 1004, 786, "Spread", Number.isFinite(spread) ? fmtUSD(spread, 8) : "-");
    ctx.restore();

    // Right panel: Order book + trades
    ctx.save();
    ctx.fillStyle = CFG.cText;
    ctx.font = `900 16px ${bodyFont}`;
    ctx.fillText("Order Book (Top 10)", 966, 156);

    const bids = (main.depth?.b || []).slice(0, 10).map(([p, q]) => ({ p: Number(p), q: Number(q) }));
    const asks = (main.depth?.a || []).slice(0, 10).map(([p, q]) => ({ p: Number(p), q: Number(q) }));

    ctx.fillStyle = CFG.cSub;
    ctx.font = `700 12px ${bodyFont}`;
    ctx.fillText("BID (Price / Qty)", 966, 178);
    ctx.fillText("ASK (Price / Qty)", 1175, 178);

    let yy = 200;
    ctx.font = `650 12px ${bodyFont}`;
    for (let i = 0; i < 10; i++) {
        const b = bids[i];
        const a = asks[i];

        ctx.fillStyle = "rgba(250,204,21,0.9)";
        ctx.fillText(b ? `${fmtUSD(b.p, 8)}  •  ${fmtNum(b.q, 2)}` : "-", 966, yy);

        ctx.fillStyle = "rgba(96,165,250,0.9)";
        ctx.fillText(a ? `${fmtUSD(a.p, 8)}  •  ${fmtNum(a.q, 2)}` : "-", 1175, yy);

        yy += 18;
    }

    yy += 16;
    ctx.fillStyle = CFG.cText;
    ctx.font = `900 16px ${bodyFont}`;
    ctx.fillText("Recent Trades", 966, yy);
    yy += 20;

    const trades = (main.trades || []).slice(0, 12).map((x) => ({
        price: Number(x.price),
        qty: Number(x.volume),
        ts: Number(x.ts) || (Number(x.time) * 1000),
        side: String(x.takerSide || "").toUpperCase(),
    }));

    ctx.fillStyle = CFG.cSub;
    ctx.font = `700 12px ${bodyFont}`;
    ctx.fillText("Side", 966, yy);
    ctx.fillText("Price", 1020, yy);
    ctx.fillText("Qty", 1125, yy);
    ctx.fillText("Time", 1210, yy);
    yy += 18;

    ctx.font = `650 12px ${bodyFont}`;
    for (const tr of trades) {
        const isSell = tr.side === "SELL";
        ctx.fillStyle = isSell ? CFG.cBlue : CFG.cYellow;
        ctx.fillText(isSell ? "SELL" : "BUY", 966, yy);

        ctx.fillStyle = CFG.cText;
        ctx.fillText(fmtUSD(tr.price, 8), 1020, yy);
        ctx.fillText(fmtNum(tr.qty, 2), 1125, yy);

        const d = new Date(tr.ts);
        const hh = String(d.getUTCHours()).padStart(2, "0");
        const mm = String(d.getUTCMinutes()).padStart(2, "0");
        const ss = String(d.getUTCSeconds()).padStart(2, "0");
        ctx.fillText(`${hh}:${mm}:${ss}`, 1210, yy);

        yy += 16;
        if (yy > 630) break;
    }
    ctx.restore();

    return canvas.toBuffer("image/png");
}

// -------------------- Telegram Bot --------------------
const bot = new Telegraf(BOT_TOKEN);

let intervalHandle = null;
const runtimeState = loadState();

function getChatId() {
    return CFG.targetChatId || runtimeState.targetChatId || "";
}
function setChatId(id) {
    runtimeState.targetChatId = String(id);
    saveState(runtimeState);
}
function setTimerMinutes(m) {
    CFG.timerMinutes = clampInt(m, CFG.timerMinutes, 1, 1440);
    if (intervalHandle) clearInterval(intervalHandle);
    intervalHandle = setInterval(() => tickSend().catch(() => { }), CFG.timerMinutes * 60 * 1000);
}

async function sendDashboard(chatId, reason = "scheduled") {
    const chat = String(chatId || "");
    if (!chat) throw new Error("No chatId set.");

    const [main, mini1, mini2] = await Promise.all([
        fetchSymbolBundle(CFG.symbolMain),
        fetchSymbolBundle(CFG.symbolMini1),
        fetchSymbolBundle(CFG.symbolMini2),
    ]);

    const png = await buildDashboardPng(main, mini1, mini2);

    const caption = `
<b>🟡 ${CFG.symbolMain} Dashboard</b>
<i>Live Market Snapshot</i>

<b>Price:</b> <code>${fmtUSD(main?.ticker?.close, 8)}</code>
<b>24h Change:</b> <code>${fmtNum(main.changePct, 2)}%</code>
`;
    await bot.telegram.sendPhoto(
        chat,
        { source: png },
        {
            caption,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "🚀 Open Coinstore Launchpad",
                            url: "https://www.coinstore.com/spot/MTXUSDT?ts=1765786599850"
                        }
                    ],
                ]
            }
        }
    );

}

async function tickSend() {
    const chatId = getChatId();
    if (!chatId) {
        console.log("⚠️ No chatId set. Use /setchat in your group once.");
        return;
    }
    try {
        await sendDashboard(chatId, "auto");
        console.log("✅ Dashboard sent to", chatId, "at", new Date().toISOString());
    } catch (e) {
        console.error("❌ Send failed:", formatAxiosError(e));
    }
}

bot.start(async (ctx) => {
    const chatId = ctx.chat?.id;
    await ctx.reply(
        "Hello! ✅\n" +
        "This bot sends a dashboard image every few minutes.\n\n" +
        "Commands:\n" +
        "• /setchat  (use this in a group to save that group)\n" +
        "• /shot     (send dashboard instantly)\n" +
        "• /timer 10 (change timer interval in minutes)\n\n" +
        `Symbol: ${CFG.symbolMain}\n` +
        `Current ChatId: ${getChatId() || "(not set)"}\n` +
        `Timer: ${CFG.timerMinutes} min\n` +
        `This chat: ${chatId}`
    );
});


bot.command("setchat", async (ctx) => {
    const id = ctx.chat?.id;
    if (!id) return ctx.reply("❌ Unable to retrieve chat ID.");
    setChatId(id);
    await ctx.reply(`✅ This chat has been saved successfully:\n${id}`);
});

bot.command("shot", async (ctx) => {
    const id = ctx.chat?.id;
    console.log(id);
    try {
        await ctx.reply("📸 Generating dashboard...");
        await sendDashboard(id, "manual");
    } catch (e) {
        await ctx.reply("❌ Error:\n" + formatAxiosError(e));
    }
});

bot.command("timer", async (ctx) => {
    const parts = (ctx.message?.text || "").trim().split(/\s+/);
    const m = parseInt(parts[1], 10);
    if (!Number.isFinite(m) || m < 1 || m > 1440) {
        return ctx.reply("❌ Correct usage: /timer 10  (between 1 and 1440 minutes)");
    }
    setTimerMinutes(m);
    await ctx.reply(`✅ Timer set to ${CFG.timerMinutes} minutes`);
});

bot.catch((err) => console.error("BOT ERROR:", err));

(async () => {
    await initBrandAssets();

    await bot.launch();
    setTimerMinutes(CFG.timerMinutes);

    console.log("🤖 Bot running.");
    console.log("Brand:", CFG.brandName, "| Fonts:", BRAND.fontsReady ? "OK" : "fallback");
    console.log("Logo:", BRAND.logoImg ? "loaded" : "missing (fallback)");
    console.log("Coinstore:", CFG.coinstoreBaseUrl);
    console.log("Symbols:", CFG.symbolMain, CFG.symbolMini1, CFG.symbolMini2);
    console.log("ChatId:", getChatId() || "(not set yet)");
    console.log("Timer:", CFG.timerMinutes, "minutes");

    if (getChatId()) tickSend().catch(() => { });
})();
