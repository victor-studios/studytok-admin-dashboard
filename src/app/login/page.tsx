import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const message = typeof resolvedParams?.message === 'string' ? resolvedParams.message : null;

  return (
    <div className="flex w-full items-center justify-center min-h-[calc(100vh-4rem)] text-foreground">
      <div className="w-full max-w-md p-10 bento-card border border-white/10 rounded-3xl relative z-10 m-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="absolute inset-x-0 -top-px h-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent text-center mb-3 tracking-tight">
          StudyTok Admin
        </h1>
        <p className="text-slate-400 text-center mb-10 text-sm font-medium">Secure Access Portal</p>
        <form className="flex-1 flex flex-col w-full justify-center gap-5 text-slate-300" action={login}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300 ml-1" htmlFor="email">
              Email Address
            </label>
            <input
              className="rounded-2xl px-5 py-4 bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all placeholder:text-slate-500 shadow-inner"
              name="email"
              placeholder="admin@studytok.com"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300 ml-1" htmlFor="password">
              Password
            </label>
            <input
              className="rounded-2xl px-5 py-4 bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all placeholder:text-slate-500 shadow-inner"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
          <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl px-4 py-4 mt-6 font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 transition-all w-full text-lg">
            Sign In to Dashboard
          </button>
          {message && (
            <p className="mt-4 p-4 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-center rounded-2xl text-sm font-medium shadow-[0_0_15px_rgba(244,63,94,0.1)]">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
