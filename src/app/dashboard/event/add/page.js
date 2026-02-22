import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/server/admin-auth";
import AdminEventCreateForm from "./AdminEventCreateForm";

export const dynamic = "force-dynamic";

export default async function AdminNewEventPage() {
    const adminCtx = await getCurrentAdmin();
    if (!adminCtx) redirect("/");

    return (
        <div className="min-h-screen w-full bg-slate-950 text-white p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
                    <h1 className="text-xl sm:text-2xl font-bold">Add Event (Admin)</h1>
                    <p className="mt-1 text-sm text-white/60">
                        فقط ادمین‌ها اجازه دارند.
                    </p>
                </div>

                <AdminEventCreateForm />
            </div>
        </div>
    );
}