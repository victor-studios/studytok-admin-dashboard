import { createClient } from "@/lib/supabase/server";
import { CopyPlus, PlaySquare, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { createLesson, deleteLesson } from "@/lib/actions/content";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/DeleteButton";

export const revalidate = 0;

export default async function ChapterDetailPage({ params }: { params: Promise<{ classId: string, subjectId: string, chapterId: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  
  const { data: chapter } = await supabase.from("chapters").select("*").eq("id", resolvedParams.chapterId).single();
  if (!chapter) notFound();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("chapter_id", chapter.id)
    .order("lesson_number", { ascending: true });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-8 h-full">
      <Link href={`/content/${resolvedParams.classId}/${resolvedParams.subjectId}`} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Chapters
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">{chapter.title}</h1>
        <p className="text-zinc-400 mt-2 max-w-3xl">{chapter.description}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: List of Lessons */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Video Lessons</h2>
          {lessons?.map((lesson) => (
            <div key={lesson.id} className="bento-card group relative flex items-center gap-6 p-4">
               <div className="w-32 h-20 bg-black/40 border border-white/5 rounded-lg overflow-hidden relative flex-shrink-0">
                 {lesson.video_url ? (
                    <div className="absolute inset-0 flex-center">
                       <PlaySquare className="w-8 h-8 text-white/50" />
                    </div>
                 ) : (
                    <div className="absolute inset-0 flex-center text-xs text-zinc-600">No Video</div>
                 )}
               </div>
               <div className="flex-1 flex justify-between items-center pr-4">
                 <div>
                   <div className="text-xs text-cyan-400 font-bold mb-1">LESSON {lesson.lesson_number}</div>
                   <h3 className="text-lg font-bold text-white leading-tight">{lesson.title}</h3>
                   <p className="text-zinc-400 text-sm mb-2">{lesson.subtitle}</p>
                   <div className="text-xs text-zinc-500">Teacher: {lesson.teacher_name || "Unassigned"} • {Math.floor(lesson.duration_seconds / 60)} mins</div>
                 </div>
                 <DeleteButton action={async () => {
                   "use server";
                   await deleteLesson(resolvedParams.classId, resolvedParams.subjectId, chapter.id, lesson.id);
                 }} />
               </div>
            </div>
          ))}
          {(!lessons || lessons.length === 0) && (
            <div className="p-12 border border-dashed border-white/10 rounded-2xl flex-center flex-col text-zinc-500">
              <PlaySquare className="w-12 h-12 mb-4 opacity-20" />
              <p>No video lessons added to this chapter yet.</p>
            </div>
          )}
        </div>

        {/* Right Column: Add Lesson Form */}
        <div className="bento-card h-fit sticky top-8">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-purple-500/20 rounded-lg">
              <CopyPlus className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Add Lesson</h2>
          </div>
          
          <form action={createLesson.bind(null, resolvedParams.classId, resolvedParams.subjectId, chapter.id, chapter.title)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Lesson Title</label>
              <input name="title" required placeholder="e.g. Newton's First Law" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Subtitle</label>
              <input name="subtitle" required placeholder="Understanding inertia" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 text-sm" />
            </div>
             <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Video File</label>
              <input type="file" name="video_file" accept="video/*" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20" />
            </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Teacher</label>
                <input name="teacher_name" required placeholder="Mr. Smith" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 text-sm" />
               </div>
               <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Duration (sec)</label>
                <input name="duration_seconds" type="number" required placeholder="180" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 text-sm" />
               </div>
            </div>
            <button type="submit" className="w-full bg-purple-500 text-white font-bold rounded-xl px-4 py-2 hover:bg-purple-600 transition-colors mt-4 text-sm shadow-lg shadow-purple-500/20">
               + Upload Lesson
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
