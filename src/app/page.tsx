import { createClient } from "@/lib/supabase/server";
import { Users, BookOpen, PlayCircle, Trophy, UserPlus } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Disable static caching for admin dashboard

async function getStats() {
  const supabase = await createClient();
  try {
    const [studentsReq, classesReq, subjectsReq, lessonsReq, recentStudentsReq] = await Promise.all([
      supabase.from("student_profiles").select("*", { count: "exact", head: true }),
      supabase.from("academic_classes").select("*", { count: "exact", head: true }),
      supabase.from("subjects").select("*", { count: "exact", head: true }),
      supabase.from("lessons").select("*", { count: "exact", head: true }),
      supabase.from("student_profiles").select("*").order("joined_date", { ascending: false }).limit(4),
    ]);

    return {
      students: studentsReq.count || 0,
      classes: classesReq.count || 0,
      subjects: subjectsReq.count || 0,
      lessons: lessonsReq.count || 0,
      recentStudents: recentStudentsReq.data || [],
    };
  } catch (error) {
    console.warn("Failed to fetch stats during build:", error);
    return {
      students: 0,
      classes: 0,
      subjects: 0,
      lessons: 0,
      recentStudents: [],
    };
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
        <p className="text-zinc-400 mt-2">Welcome to the StudyTok Admin Dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.students}
          icon={Users}
          color="from-blue-500 to-cyan-400"
        />
        <StatCard
          title="Academic Classes"
          value={stats.classes}
          icon={BookOpen}
          color="from-emerald-400 to-teal-500"
        />
        <StatCard
          title="Total Subjects"
          value={stats.subjects}
          icon={BookOpen}
          color="from-cyan-400 to-blue-500"
        />
        <StatCard
          title="Video Lessons"
          value={stats.lessons}
          icon={PlayCircle}
          color="from-purple-500 to-indigo-500"
        />
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bento-card">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/content" className="flex-center flex-col gap-2 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 transition-all text-sm font-medium text-white text-center">
              <BookOpen className="w-8 h-8 text-cyan-400" /> Manage Curriculum
            </Link>
            <Link href="/students" className="flex-center flex-col gap-2 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all text-sm font-medium text-white text-center">
               <Users className="w-8 h-8 text-blue-400" /> View Students
            </Link>
          </div>
        </div>
        <div className="bento-card">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-semibold text-white">Recent Registrations</h2>
             <Link href="/students" className="text-xs text-cyan-400 hover:text-cyan-300">View All</Link>
          </div>
          
          <div className="space-y-3">
             {stats.recentStudents.map((student) => (
                <div key={student.id} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-center flex-shrink-0">
                      <UserPlus className="w-4 h-4 text-white" />
                   </div>
                   <div className="flex-1 overflow-hidden">
                      <div className="text-sm font-semibold text-white truncate">{student.name}</div>
                      <div className="text-xs text-zinc-400 truncate">{student.academic_tier} • {student.current_grade}</div>
                   </div>
                   <div className="text-xs font-medium text-zinc-500">
                      {new Date(student.joined_date).toLocaleDateString()}
                   </div>
                </div>
             ))}
             {stats.recentStudents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-zinc-500 text-sm">
                   <Users className="w-8 h-8 mb-2 opacity-20" />
                   No students registered yet.
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bento-card relative overflow-hidden group">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
        <Icon className="w-24 h-24" />
      </div>
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex-center mb-6 shadow-lg shadow-white/5`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-zinc-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
    </div>
  );
}
