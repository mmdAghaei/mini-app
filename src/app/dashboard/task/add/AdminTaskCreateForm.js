"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

async function fetchCsrf() {
    const res = await fetch("/api/admin/csrf", { cache: "no-store" });
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) throw new Error("CSRF non-json");
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

export default function AdminTaskCreateForm() {
    const router = useRouter();

    const [csrfToken, setCsrfToken] = useState("");
    const [csrfError, setCsrfError] = useState("");

    const [form, setForm] = useState({
        category: "",
        title: "",
        xp: 100,
        link: "",
        is_active: true,

        icon_type: "preset", // preset | upload
        icon: "telegram",    // preset value
        icon_image: "",      // upload value

        verify_type: "simple", // simple | email_meditechx
        input_label: "",
        input_placeholder: "",
    });

    const [uploadingIcon, setUploadingIcon] = useState(false);
    const [previewIcon, setPreviewIcon] = useState("");

    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [createdTask, setCreatedTask] = useState(null);

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

    const canSubmit = useMemo(() => {
        if (!csrfToken || pending || uploadingIcon) return false;
        if (!form.category.trim() || !form.title.trim() || !form.link.trim()) return false;
        if (form.icon_type === "upload" && !form.icon_image.trim()) return false;
        return true;
    }, [csrfToken, pending, uploadingIcon, form]);

    function updateField(name, value) {
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function onPickIcon(file) {
        if (!file) return;
        if (!csrfToken) return setError("CSRF آماده نیست");

        const localUrl = URL.createObjectURL(file);
        setPreviewIcon(localUrl);

        try {
            setError("");
            setSuccessMsg("");
            setUploadingIcon(true);

            const url = await uploadImage(file, csrfToken);
            updateField("icon_image", url);
            setSuccessMsg("آیکن آپلود شد ✅");
        } catch (e) {
            setError(e?.message || "خطا در آپلود آیکن");
            // preview را پاک نکن
        } finally {
            setUploadingIcon(false);
            try { URL.revokeObjectURL(localUrl); } catch { }
        }
    }

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setCreatedTask(null);

        if (!csrfToken) return setError("CSRF آماده نیست");
        if (!form.category.trim()) return setError("category الزامی است");
        if (!form.title.trim()) return setError("title الزامی است");
        if (!form.link.trim()) return setError("link الزامی است");

        let link = form.link.trim();
        if (link.startsWith("www.")) link = "https://" + link;

        const payload = {
            category: form.category.trim(),
            title: form.title.trim(),
            xp: Number(form.xp),
            link,
            is_active: Boolean(form.is_active),

            icon_type: form.icon_type,
            icon: form.icon,
            icon_image: form.icon_image.trim(),

            verify_type: form.verify_type,
            input_label: form.input_label.trim(),
            input_placeholder: form.input_placeholder.trim(),
        };

        setPending(true);
        try {
            const res = await fetch("/api/admin/tasks", {
                method: "POST",
                cache: "no-store",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": csrfToken,
                    "Cache-Control": "no-store",
                },
                body: JSON.stringify(payload),
            });

            const ct = res.headers.get("content-type") || "";
            if (!ct.includes("application/json")) {
                const t = await res.text();
                throw new Error(`Create non-json (${res.status}): ${t.slice(0, 120)}`);
            }

            const json = await res.json();
            if (!res.ok || !json?.success) throw new Error(json?.message || "create task failed");

            setCreatedTask(json.task);
            setSuccessMsg("تسک با موفقیت ساخته شد ✅");

            setForm((prev) => ({
                ...prev,
                title: "",
                link: "",
                input_label: prev.verify_type === "email_meditechx" ? prev.input_label : "",
                input_placeholder: prev.verify_type === "email_meditechx" ? prev.input_placeholder : "",
            }));
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

            <div className="mb-4 flex items-center">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl px-4 py-2 text-sm font-medium text-white/90 shadow-[0_8px_25px_rgba(0,0,0,0.35)] transition hover:bg-white/[0.12] hover:border-white/20"
                >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    بازگشت
                </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                {/* category */}
                <div>
                    <label className="mb-2 block text-sm text-white/90">Category</label>
                    <input
                        value={form.category}
                        onChange={(e) => updateField("category", e.target.value)}
                        placeholder="Social / Partners / Daily ..."
                        className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-white outline-none focus:border-white/30"
                    />
                </div>

                {/* title */}
                <div>
                    <label className="mb-2 block text-sm text-white/90">Title</label>
                    <input
                        value={form.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder="Join our Telegram channel"
                        className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-white outline-none focus:border-white/30"
                    />
                </div>

                {/* xp + active */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="mb-2 block text-sm text-white/90">XP</label>
                        <input
                            type="number"
                            min={1}
                            step={1}
                            value={form.xp}
                            onChange={(e) => updateField("xp", e.target.value)}
                            className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-white outline-none focus:border-white/30"
                        />
                    </div>

                    <div className="flex items-end rounded-xl border border-white/10 bg-slate-900/40 px-3 py-3">
                        <label className="inline-flex items-center gap-2 text-sm text-white/90">
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={(e) => updateField("is_active", e.target.checked)}
                            />
                            Active
                        </label>
                    </div>
                </div>

                {/* link */}
                <div>
                    <label className="mb-2 block text-sm text-white/90">Link</label>
                    <input
                        value={form.link}
                        onChange={(e) => updateField("link", e.target.value)}
                        placeholder="https://t.me/... یا /some/path"
                        className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-white outline-none focus:border-white/30"
                    />
                </div>

                {/* icon mode */}
                <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-3 space-y-3">
                    <div className="text-sm font-medium text-white/90">Icon</div>

                    <div className="flex flex-wrap gap-3">
                        <label className="inline-flex items-center gap-2 text-sm text-white/90">
                            <input
                                type="radio"
                                name="icon_type"
                                checked={form.icon_type === "preset"}
                                onChange={() => updateField("icon_type", "preset")}
                            />
                            Preset
                        </label>

                        <label className="inline-flex items-center gap-2 text-sm text-white/90">
                            <input
                                type="radio"
                                name="icon_type"
                                checked={form.icon_type === "upload"}
                                onChange={() => updateField("icon_type", "upload")}
                            />
                            Upload image
                        </label>
                    </div>

                    {form.icon_type === "preset" ? (
                        <div className="grid grid-cols-3 gap-2">
                            {["telegram", "youtube", "x"].map((v) => (
                                <button
                                    key={v}
                                    type="button"
                                    onClick={() => updateField("icon", v)}
                                    className={[
                                        "rounded-xl border px-3 py-2 text-sm",
                                        form.icon === v
                                            ? "border-white/30 bg-white/15 text-white"
                                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                                    ].join(" ")}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15">
                                {uploadingIcon ? "درحال آپلود..." : "انتخاب آیکن"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={!csrfToken || uploadingIcon || pending}
                                    onChange={(e) => onPickIcon(e.target.files?.[0])}
                                />
                            </label>

                            {(previewIcon || form.icon_image) && (
                                <div className="flex items-center gap-3">
                                    <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                                        <Image
                                            src={previewIcon || form.icon_image}
                                            alt="icon preview"
                                            fill
                                            className="object-contain p-2"
                                            sizes="56px"
                                        />
                                    </div>
                                    <div className="text-xs text-white/60 break-words">
                                        URL: {form.icon_image || "—"}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* verify type */}
                <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-3 space-y-3">
                    <div className="text-sm font-medium text-white/90">Check Type</div>

                    <select
                        value={form.verify_type}
                        onChange={(e) => updateField("verify_type", e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-white outline-none focus:border-white/30"
                    >
                        <option value="simple">Simple (default)</option>
                        <option value="email_meditechx">Email check (MeditechX API)</option>
                    </select>

                    {form.verify_type === "email_meditechx" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block text-xs text-white/70">Input label</label>
                                <input
                                    value={form.input_label}
                                    onChange={(e) => updateField("input_label", e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-white text-sm outline-none focus:border-white/30"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-white/70">Input placeholder</label>
                                <input
                                    value={form.input_placeholder}
                                    onChange={(e) => updateField("input_placeholder", e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-white text-sm outline-none focus:border-white/30"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* submit */}
                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 disabled:opacity-50"
                >
                    {pending ? "درحال ثبت..." : "ثبت تسک"}
                </button>

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

                {createdTask && (
                    <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 text-sm text-white/85">
                        <div className="font-semibold mb-2">Task created:</div>
                        <pre className="whitespace-pre-wrap break-words text-xs text-white/75">
                            {JSON.stringify(createdTask, null, 2)}
                        </pre>
                    </div>
                )}
            </form>
        </div>
    );
}