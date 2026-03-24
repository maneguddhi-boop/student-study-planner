import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useStudyData } from "@/hooks/useStudyData";
import { Dashboard } from "@/pages/Dashboard";
import { LoginPage } from "@/pages/LoginPage";
import { Notes } from "@/pages/Notes";
import { PomodoroTimer } from "@/pages/PomodoroTimer";
import { StudySessions } from "@/pages/StudySessions";
import { Subjects } from "@/pages/Subjects";
import { Tasks } from "@/pages/Tasks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export type Page =
  | "dashboard"
  | "subjects"
  | "tasks"
  | "sessions"
  | "notes"
  | "timer";

const queryClient = new QueryClient();

function AppInner() {
  const { identity, clear, isInitializing, loginStatus } =
    useInternetIdentity();
  const [page, setPage] = useState<Page>("dashboard");

  const principal = identity?.getPrincipal().toString() ?? "";
  const isLoggedIn = loginStatus === "success" && !!identity;

  const studyData = useStudyData(principal);

  if (isInitializing) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(var(--sidebar))" }}
      >
        <div className="space-y-3 w-64">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const name = principal.slice(0, 8);

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard data={studyData.data} />;
      case "subjects":
        return (
          <Subjects
            data={studyData.data}
            onAdd={studyData.addSubject}
            onUpdate={studyData.updateSubject}
            onDelete={studyData.deleteSubject}
          />
        );
      case "tasks":
        return (
          <Tasks
            data={studyData.data}
            onAdd={studyData.addTask}
            onUpdate={studyData.updateTask}
            onDelete={studyData.deleteTask}
          />
        );
      case "sessions":
        return (
          <StudySessions
            data={studyData.data}
            onAdd={studyData.addSession}
            onDelete={studyData.deleteSession}
          />
        );
      case "notes":
        return (
          <Notes
            data={studyData.data}
            onAdd={studyData.addNote}
            onUpdate={studyData.updateNote}
            onDelete={studyData.deleteNote}
          />
        );
      case "timer":
        return (
          <PomodoroTimer
            data={studyData.data}
            onAddSession={studyData.addSession}
          />
        );
      default:
        return <Dashboard data={studyData.data} />;
    }
  };

  return (
    <Layout
      currentPage={page}
      onNavigate={setPage}
      onLogout={clear}
      userName={name}
      principal={principal}
    >
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
      <Toaster richColors />
    </QueryClientProvider>
  );
}
