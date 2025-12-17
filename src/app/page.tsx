import Header from "@/components/Header";
import NotesGrid from "@/components/NotesGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950">
      <Header />
      <main>
        <NotesGrid />
      </main>
    </div>
  );
}
