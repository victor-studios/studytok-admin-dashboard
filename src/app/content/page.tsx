import { createClient } from "@/lib/supabase/server";
import { FolderPlus, GraduationCap, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClass, deleteClass } from "@/lib/actions/content";

export const revalidate = 0;

export default async function ContentDashboard() {
  const supabase = await createClient();
  const { data: classes } = await supabase.from("academic_classes").select("*").order("created_at", { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-8 h-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Curriculum Hierarchy</h1>
          <p className="text-slate-400 mt-2">Manage your academic classes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: List of Classes */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes?.map((acClass) => (
            <Link key={acClass.id} href={`/content/${acClass.id}`} className="block">
              <div className="bento-card relative group hover:border-cyan-500/30 transition-all overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <GraduationCap className="w-32 h-32" />
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl flex-center shadow-lg" style={{ backgroundColor: `#${acClass.color_hex}` }}>
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <form action={async () => {
                    "use server";
                    await deleteClass(acClass.id);
                  }}>
                    <button className="p-2 bg-rose-500/10 text-rose-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/20">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{acClass.name}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{acClass.description}</p>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">
                    {acClass.academic_level}
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {(!classes || classes.length === 0) && (
            <div className="col-span-2 p-12 border border-dashed border-white/10 rounded-2xl flex-center flex-col text-slate-500 bg-white/5">
              <GraduationCap className="w-12 h-12 mb-4 opacity-30" />
              <p>No classes defined. Create one to begin organizing subjects.</p>
            </div>
          )}
        </div>

        {/* Right Column: Add Class Form */}
        <div className="bento-card h-fit sticky top-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <FolderPlus className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-lg font-bold text-white">New Class</h2>
          </div>
          
          <form action={createClass} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 ml-1">Class Name</label>
              <input name="name" required placeholder="e.g. O-Levels, Grade 8" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm placeholder:text-slate-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 ml-1">Description</label>
              <textarea name="description" required placeholder="A brief overview..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm resize-none placeholder:text-slate-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1 ml-1">Academic Level Target</label>
                <select name="academic_level" className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm appearance-none">
                  <option value="grades1to8">Grades 1-8</option>
                  <option value="grades9to10">O-Levels (Matric)</option>
                  <option value="grades11to12">A-Levels (FSC)</option>
                </select>
              </div>
            </div>
             <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 ml-1">Hex Color</label>
              <div className="flex gap-2">
                <span className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-slate-400 text-sm flex items-center">#</span>
                <input name="color_hex" placeholder="6366F1" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm placeholder:text-slate-500" />
              </div>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold rounded-xl px-4 py-3 transition-colors mt-6 text-sm shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              Create Class
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
