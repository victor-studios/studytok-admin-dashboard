import { createClient } from "@/lib/supabase/server";
import { FolderPlus, BookOpen, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { createSubject, deleteSubject } from "@/lib/actions/content";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/DeleteButton";

export const revalidate = 0;

export default async function ClassDetailPage({ params }: { params: Promise<{ classId: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;
  
  const { data: acClass } = await supabase.from("academic_classes").select("*").eq("id", resolvedParams.classId).single();
  if (!acClass) notFound();

  const { data: subjects } = await supabase
    .from("subjects")
    .select("*")
    .eq("class_id", acClass.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-8 h-full">
      <Link href="/content" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Classes
      </Link>
      
      <div className="flex items-end gap-6 mb-8">
        <div className="w-20 h-20 rounded-2xl flex-center shadow-2xl" style={{ backgroundColor: `#${acClass.color_hex}` }}>
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">{acClass.name} Subjects</h1>
          <p className="text-zinc-400 mt-1 max-w-2xl">{acClass.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: List of Subjects */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects?.map((subject) => (
            <Link key={subject.id} href={`/content/${acClass.id}/${subject.id}`} className="block">
              <div className="bento-card relative group hover:border-cyan-500/30 transition-all flex flex-col h-full">
                 <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white leading-tight">{subject.name}</h3>
                    <DeleteButton action={async () => {
                      "use server";
                      await deleteSubject(acClass.id, subject.id);
                    }} />
                 </div>
                 <p className="text-zinc-400 text-sm line-clamp-2">{subject.short_description}</p>
                 <div className="mt-4 pt-4 border-t border-white/5 text-xs font-semibold text-cyan-400">
                    MANAGE CHAPTERS →
                 </div>
              </div>
            </Link>
          ))}
          {(!subjects || subjects.length === 0) && (
            <div className="col-span-2 p-12 border border-dashed border-white/10 rounded-2xl flex-center flex-col text-zinc-500">
              <BookOpen className="w-12 h-12 mb-4 opacity-20" />
              <p>No subjects found in this class. Add one below.</p>
            </div>
          )}
        </div>

        {/* Right Column: Add Subject Form */}
        <div className="bento-card h-fit sticky top-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <FolderPlus className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Add Subject</h2>
          </div>
          
          <form action={createSubject.bind(null, acClass.id)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Subject Title</label>
              <input name="name" required placeholder="e.g. Physics" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
              <textarea name="short_description" required placeholder="Overview of the subject..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500 text-sm resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Icon Name (Material Icons)</label>
              <input name="icon_name" placeholder="book" defaultValue="book" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500 text-sm" />
            </div>
            <button type="submit" className="w-full bg-cyan-500 text-white font-bold rounded-xl px-4 py-2 hover:bg-cyan-600 transition-colors mt-4 text-sm shadow-lg shadow-cyan-500/20">
               + Create Subject
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
