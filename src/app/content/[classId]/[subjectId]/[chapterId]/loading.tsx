import { FolderRefresh } from "lucide-react";

export default function Loading() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-8 h-full">
      <div className="mb-8">
        <div className="h-4 w-32 bg-white/10 rounded-xl mb-4 animate-pulse"></div>
        <div className="flex items-end gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-white/10 animate-pulse"></div>
          <div className="flex-1">
             <div className="h-10 w-64 bg-white/10 rounded-xl mb-2 animate-pulse"></div>
             <div className="h-4 w-48 bg-white/5 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 w-48 bg-white/10 rounded-xl mb-4 animate-pulse"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bento-card h-24 flex items-center gap-6 p-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-6 w-1/2 bg-white/10 rounded-lg mb-2 animate-pulse"></div>
                <div className="h-4 w-3/4 bg-white/5 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bento-card h-96 sticky top-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/10 rounded-lg animate-pulse h-10 w-10"></div>
            <div className="h-6 w-32 bg-white/10 rounded-lg animate-pulse"></div>
          </div>
          <div className="space-y-6">
            <div className="h-12 w-full bg-white/5 rounded-xl animate-pulse"></div>
            <div className="h-24 w-full bg-white/5 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
