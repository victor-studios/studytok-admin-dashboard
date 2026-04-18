import { createClient } from "@/lib/supabase/server";
import { FolderPlus, Layers, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { createChapter, deleteChapter } from "@/lib/actions/content";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/DeleteButton";

export const revalidate = 0;

export default async function SubjectDetailPage({ params }: { params: Promise<{ classId: string, subjectId: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;
  
  const { data: subject } = await supabase.from("subjects").select("*, academic_classes(color_hex)").eq("id", resolvedParams.subjectId).single();
  if (!subject) notFound();

  const { data: chapters } = await supabase
    .from("chapters")
    .select("*")
    .eq("subject_id", subject.id)
    .order("order_index", { ascending: true });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-8 h-full">
      <Link href={`/content/${resolvedParams.classId}`} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Subjects
      </Link>
      
      <div className="flex items-end gap-6 mb-8">
        <div className="w-20 h-20 rounded-2xl flex-center shadow-2xl" style={{ backgroundColor: `#${subject.academic_classes?.color_hex || '3B82F6'}` }}>
          <Layers className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">{subject.name}</h1>
          <p className="text-zinc-400 mt-1 max-w-2xl">{subject.short_description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: List of Chapters */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Chapters Overview</h2>
          {chapters?.map((chapter, i) => (
            <Link key={chapter.id} href={`/content/${resolvedParams.classId}/${subject.id}/${chapter.id}`} className="block">
              <div className="bento-card relative group hover:border-cyan-500/30 transition-all flex items-center gap-6 p-4">
                <div className="text-4xl font-black text-white/5 group-hover:text-white/10 transition-colors w-12 text-center">
                  {i + 1}
                </div>
                <div className="flex-1 flex justify-between items-center pr-4">
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">{chapter.title}</h3>
                    <p className="text-zinc-400 text-sm line-clamp-1">{chapter.description}</p>
                  </div>
                  <DeleteButton action={async () => {
                    "use server";
                    await deleteChapter(resolvedParams.classId, subject.id, chapter.id);
                  }} />
                </div>
              </div>
            </Link>
          ))}
          {(!chapters || chapters.length === 0) && (
            <div className="p-12 border border-dashed border-white/10 rounded-2xl flex-center flex-col text-zinc-500">
              <Layers className="w-12 h-12 mb-4 opacity-20" />
              <p>No chapters found. Add the first topic below.</p>
            </div>
          )}
        </div>

        {/* Right Column: Add Chapter Form */}
        <div className="bento-card h-fit sticky top-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <FolderPlus className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Add Chapter</h2>
          </div>
          
          <form action={createChapter.bind(null, resolvedParams.classId, subject.id)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Chapter Title</label>
              <input name="title" required placeholder="e.g. Introduction to Mechanics" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
              <textarea name="description" required placeholder="What will students learn?" rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm resize-none" />
            </div>
            <button type="submit" className="w-full bg-emerald-500 text-white font-bold rounded-xl px-4 py-2 hover:bg-emerald-600 transition-colors mt-4 text-sm shadow-lg shadow-emerald-500/20">
               + Create Chapter
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
