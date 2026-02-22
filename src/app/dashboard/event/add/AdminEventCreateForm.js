"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function toIsoOrNull(localDateTimeValue) {
    if (!localDateTimeValue) return null;
    const d = new Date(localDateTimeValue);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString();
}

async function fetchCsrf() {
    const res = await fetch("/api/admin/csrf", { cache: "no-store" });
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
        const t = await res.text();
        throw new Error(`CSRF non-json: ${t.slice(0, 80)}`);
    }
    const json = await res.json();
    if (!res.ok || !json?.success) throw new Error(json?.message || "CSRF fetch failed");
    return json.csrf;
}

async function uploadImage(file, csrfToken) {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
        cache: "no-store",
        credentials: "same-origin",
        headers: {
            "x-csrf-token": csrfToken,
            "Cache-Control": "no-store",
        },
    });

    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
        const t = await res.text();
        throw new Error(`Upload non-json (${res.status}): ${t.slice(0, 120)}`);
    }

    const json = await res.json();
    if (!res.ok || !json?.success) throw new Error(json?.message || "upload failed");
    return json.url;
}

export default function AdminEventCreateForm() {
    const [csrfToken, setCsrfToken] = useState("");
    const [csrfError, setCsrfError] = useState("");
    const router = useRouter();
    const [form, setForm] = useState({
        text: "",
        image: "",
        logo: "",
        href: "",
        isFullWidth: false,
        isActive: true,
        order: 1000,
        startsAtLocal: "",
        endsAtLocal: "",
    });

    const [pending, setPending] = useState(false);
    const [uploading, setUploading] = useState({ image: false, logo: false });
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [createdEvent, setCreatedEvent] = useState(null);

    const [preview, setPreview] = useState({ image: "", logo: "" });

    const textLength = useMemo(() => (form.text || "").trim().length, [form.text]);

    useEffect(() => {
        (async () => {
            try {
                const t = await fetchCsrf();
                setCsrfToken(t);
            } catch (e) {
                setCsrfError(e?.message || "CSRF error");
            }
        })();
    }, []);

    function updateField(name, value) {
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function onPickFile(kind, file) {
        if (!file) return;
        if (!csrfToken) {
            setError("CSRF آماده نیست. صفحه را رفرش کنید.");
            return;
        }

        // preview محلی
        const localUrl = URL.createObjectURL(file);
        setPreview((p) => ({ ...p, [kind]: localUrl }));

        try {
            setError("");
            setSuccessMsg("");
            setUploading((u) => ({ ...u, [kind]: true }));

            const url = await uploadImage(file, csrfToken);

            // url نهایی را ذخیره کن
            updateField(kind, url);
            setSuccessMsg(kind === "image" ? "تصویر بک‌گراند آپلود شد ✅" : "لوگو آپلود شد ✅");
        } catch (e) {
            setError(e?.message || "خطا در آپلود");
            // preview را پاک نکن تا کاربر تصویر را ببیند
        } finally {
            setUploading((u) => ({ ...u, [kind]: false }));
            try {
                URL.revokeObjectURL(localUrl);
            } catch { }
        }
    }

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setCreatedEvent(null);

        if (!csrfToken) return setError("CSRF آماده نیست. صفحه را رفرش کنید.");
        if (!form.text.trim()) return setError("متن کارت الزامی است.");
        if (form.text.trim().length > 140) return setError("متن کارت نباید بیشتر از 140 کاراکتر باشد.");

        setPending(true);
        try {
            const payload = {
                text: form.text.trim(),
                image: form.image.trim(),
                logo: form.logo.trim(),
                href: form.href.trim(),
                isFullWidth: Boolean(form.isFullWidth),
                isActive: Boolean(form.isActive),
                order: Number(form.order),
                startsAt: toIsoOrNull(form.startsAtLocal),
                endsAt: toIsoOrNull(form.endsAtLocal),
            };

            const res = await fetch("/api/admin/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": csrfToken,
                    "Cache-Control": "no-store",
                },
                cache: "no-store",
                credentials: "same-origin",
                body: JSON.stringify(payload),
            });

            const ct = res.headers.get("content-type") || "";
            if (!ct.includes("application/json")) {
                const t = await res.text();
                throw new Error(`Create non-json (${res.status}): ${t.slice(0, 120)}`);
            }

            const json = await res.json();
            if (!res.ok || !json?.success) throw new Error(json?.message || "خطا در ثبت ایونت");

            setCreatedEvent(json.event);
            setSuccessMsg("ایونت با موفقیت ثبت شد ✅");
            setForm((prev) => ({ ...prev, text: "", startsAtLocal: "", endsAtLocal: "" }));
        } catch (e) {
            setError(e?.message || "خطای ناشناخته");
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
            {csrfError && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {csrfError}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
                {/* text */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-white/90">
                        متن کارت <span className="text-red-300">*</span>
                    </label>
                    <textarea
                        value={form.text}
                        onChange={(e) => updateField("text", e.target.value)}
                        maxLength={140}
                        rows={3}
                        required
                        className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-white outline-none focus:border-white/30"
                    />
                    <div className="mt-1 text-xs text-white/50">{textLength}/140</div>
                </div>

                {/* image upload */}
                <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-3">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-medium text-white/90">تصویر بک‌گراند (گالری)</div>
                            <div className="text-xs text-white/50">حداکثر 5MB</div>
                        </div>

                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15">
                            {uploading.image ? "درحال آپلود..." : "انتخاب عکس"}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={pending || uploading.image || !csrfToken}
                                onChange={(e) => onPickFile("image", e.target.files?.[0])}
                            />
                        </label>
                    </div>

                    {(preview.image || form.image) && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                            <div className="relative aspect-[16/7] w-full">
                                <Image
                                    src={preview.image || form.image}
                                    alt="preview"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 700px"
                                />
                            </div>
                            <div className="px-3 py-2 text-xs text-white/60 break-words">
                                URL: {form.image || "—"}
                            </div>
                        </div>
                    )}
                </div>

                {/* logo upload */}
                <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-3">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-medium text-white/90">لوگو (گالری)</div>
                            <div className="text-xs text-white/50">بهتره PNG شفاف</div>
                        </div>

                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15">
                            {uploading.logo ? "درحال آپلود..." : "انتخاب لوگو"}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={pending || uploading.logo || !csrfToken}
                                onChange={(e) => onPickFile("logo", e.target.files?.[0])}
                            />
                        </label>
                    </div>

                    {(preview.logo || form.logo) && (
                        <div className="mt-3 flex items-center gap-3">
                            <div className="relative h-14 w-28 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                                <Image
                                    src={preview.logo || form.logo}
                                    alt="logo preview"
                                    fill
                                    className="object-contain p-2"
                                    sizes="112px"
                                />
                            </div>
                            <div className="text-xs text-white/60 break-words">
                                URL: {form.logo || "—"}
                            </div>
                        </div>
                    )}
                </div>

                {/* href */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-white/90">لینک مقصد (اختیاری)</label>
                    <input
                        type="text"
                        value={form.href}
                        onChange={(e) => updateField("href", e.target.value)}
                        placeholder="/event/123 یا https://example.com"
                        className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-white outline-none focus:border-white/30"
                    />
                </div>

                {/* order + flags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-white/90">order</label>
                        <input
                            type="number"
                            step="1"
                            value={form.order}
                            onChange={(e) => updateField("order", e.target.value)}
                            className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-white outline-none focus:border-white/30"
                        />
                    </div>

                    <div className="flex items-end gap-4 rounded-xl border border-white/10 bg-slate-900/40 px-3 py-3">
                        <label className="inline-flex items-center gap-2 text-sm text-white/90">
                            <input
                                type="checkbox"
                                checked={form.isActive}
                                onChange={(e) => updateField("isActive", e.target.checked)}
                            />
                            فعال
                        </label>

                        <label className="inline-flex items-center gap-2 text-sm text-white/90">
                            <input
                                type="checkbox"
                                checked={form.isFullWidth}
                                onChange={(e) => updateField("isFullWidth", e.target.checked)}
                            />
                            فول‌ویدث
                        </label>
                    </div>
                </div>

                {/* schedule */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-white/90">زمان شروع (اختیاری)</label>
                        <input
                            type="datetime-local"
                            value={form.startsAtLocal}
                            onChange={(e) => updateField("startsAtLocal", e.target.value)}
                            className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-white outline-none focus:border-white/30"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-white/90">زمان پایان (اختیاری)</label>
                        <input
                            type="datetime-local"
                            value={form.endsAtLocal}
                            onChange={(e) => updateField("endsAtLocal", e.target.value)}
                            className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-white outline-none focus:border-white/30"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={pending || uploading.image || uploading.logo || !csrfToken}
                    className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 disabled:opacity-50"
                >
                    {pending ? "در حال ثبت..." : "ثبت ایونت"}
                </button>
                <div className="mb-4 flex items-center">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 transition"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        بازگشت
                    </button>
                </div>
                {error && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {error}
                    </div>
                )}
                {successMsg && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                        {successMsg}
                    </div>
                )}

                {createdEvent && (
                    <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 text-sm text-white/85">
                        <div className="font-semibold mb-2">ایونت ثبت شد:</div>
                        <pre className="whitespace-pre-wrap break-words text-xs text-white/75">
                            {JSON.stringify(createdEvent, null, 2)}
                        </pre>
                    </div>
                )}
            </form>
        </div>
    );
}