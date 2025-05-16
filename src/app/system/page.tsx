import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function SystemPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <header className="p-4 border-b border-white/10 flex justify-between items-center">
        <h1 className="text-2xl font-bold">GTD-OS System</h1>

        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20"
          >
            Sign Out
          </button>
        </form>
      </header>

      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 p-6 rounded-lg border border-white/10 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">
              Welcome, {data.user.email}
            </h2>
            <p className="text-white/70">
              You have successfully logged in and been redirected to the system
              page. From here you can manage your SDDM settings and customize
              your login experience.
            </p>
          </div>

          <div className="bg-white/5 p-6 rounded-lg border border-white/10 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">SDDM Themes</h2>
            <p className="text-white/70 mb-4">
              You can customize your login screen by selecting different themes.
            </p>
            <a
              href="/system/themes"
              className="block w-full p-2 text-center rounded-md bg-white/10 hover:bg-white/20"
            >
              Manage Themes
            </a>
          </div>

          <div className="bg-white/5 p-6 rounded-lg border border-white/10 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">System Settings</h2>
            <p className="text-white/70 mb-4">
              Configure system preferences and user settings.
            </p>
            <a
              href="/system/settings"
              className="block w-full p-2 text-center rounded-md bg-white/10 hover:bg-white/20"
            >
              Open Settings
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
