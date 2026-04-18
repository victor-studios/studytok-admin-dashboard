import { createClient } from "@/lib/supabase/server";
import { Users, Search, MoreVertical } from "lucide-react";

export const revalidate = 0;

async function getStudents() {
  const supabase = await createClient();
  const { data: students, error } = await supabase
    .from("student_profiles")
    .select("*")
    .order("joined_date", { ascending: false });

  if (error) {
    console.error("Error fetching students:", error);
    return [];
  }
  return students || [];
}

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-cyan-400" />
            Students Roster
          </h1>
          <p className="text-zinc-400 mt-2">View and manage enrolled student profiles.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search students..." 
            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-full sm:w-64"
          />
        </div>
      </div>

      <div className="bento-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="text-xs text-zinc-300 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Student Name</th>
                <th scope="col" className="px-6 py-4 font-semibold">Email</th>
                <th scope="col" className="px-6 py-4 font-semibold">Grade/Tier</th>
                <th scope="col" className="px-6 py-4 font-semibold">Study Minutes</th>
                <th scope="col" className="px-6 py-4 font-semibold">Joined</th>
                <th scope="col" className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/20">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No students currently enrolled.
                  </td>
                </tr>
              ) : (
                students.map((student: any) => (
                  <tr key={student.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-center text-white font-bold text-xs uppercase shadow-lg">
                        {student.name.substring(0, 2)}
                      </div>
                      <div className="font-medium text-white">{student.name}</div>
                    </td>
                    <td className="px-6 py-4">{student.email || "N/A"}</td>
                    <td className="px-6 py-4 flex flex-col gap-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-400/20 text-cyan-300 w-fit">
                        {student.current_grade}
                      </span>
                      <span className="text-xs text-zinc-500">{student.academic_tier}</span>
                    </td>
                    <td className="px-6 py-4">
                      {student.total_study_minutes} mins
                    </td>
                    <td className="px-6 py-4">
                      {new Date(student.joined_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors inline-flex">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
