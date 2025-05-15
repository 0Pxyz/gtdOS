export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold">
        Welcome to {process.env.NEXT_PUBLIC_APP_NAME}
      </h1>
      <p className="mt-4 text-lg">A gamified GTD productivity system.</p>
    </main>
  );
}
