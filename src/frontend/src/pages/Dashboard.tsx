import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { StudyData } from "@/types/study";
import {
  BookOpen,
  Calendar,
  CheckSquare,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";

interface DashboardProps {
  data: StudyData;
}

const PRIORITY_COLORS = {
  High: "destructive" as const,
  Medium: "secondary" as const,
  Low: "outline" as const,
};

export function Dashboard({ data }: DashboardProps) {
  const stats = useMemo(() => {
    const totalTasks = data.tasks.length;
    const completedTasks = data.tasks.filter((t) => t.status === "Done").length;
    const totalMinutes = data.sessions.reduce((acc, s) => acc + s.duration, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return {
      totalTasks,
      completedTasks,
      totalHours,
      activeSubjects: data.subjects.length,
      completionRate,
    };
  }, [data]);

  const upcomingTasks = useMemo(() => {
    return data.tasks
      .filter((t) => t.status !== "Done")
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      )
      .slice(0, 5);
  }, [data.tasks]);

  const recentSessions = useMemo(() => {
    return [...data.sessions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [data.sessions]);

  const subjectProgress = useMemo(() => {
    const totalMins = data.sessions.reduce((acc, s) => acc + s.duration, 0);
    return data.subjects
      .map((sub) => {
        const mins = data.sessions
          .filter((s) => s.subjectId === sub.id)
          .reduce((acc, s) => acc + s.duration, 0);
        return {
          ...sub,
          mins,
          percent: totalMins > 0 ? Math.round((mins / totalMins) * 100) : 0,
        };
      })
      .sort((a, b) => b.mins - a.mins);
  }, [data]);

  const statCards = [
    {
      label: "Total Tasks",
      value: stats.totalTasks,
      icon: CheckSquare,
      bg: "bg-chart-1/10",
      accent: "#3B82F6",
    },
    {
      label: "Completed",
      value: stats.completedTasks,
      icon: TrendingUp,
      bg: "bg-chart-2/10",
      accent: "#10B981",
    },
    {
      label: "Study Hours",
      value: `${stats.totalHours}h`,
      icon: Clock,
      bg: "bg-purple/10",
      accent: "#8B5CF6",
    },
    {
      label: "Subjects",
      value: stats.activeSubjects,
      icon: BookOpen,
      bg: "bg-chart-4/10",
      accent: "#F59E0B",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Completion rate hero */}
      <div
        className="rounded-xl p-5 flex items-center gap-5"
        style={{
          background: "oklch(var(--primary) / 0.08)",
          border: "1px solid oklch(var(--primary) / 0.15)",
        }}
      >
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg
            className="w-16 h-16 -rotate-90"
            viewBox="0 0 64 64"
            aria-label="Completion rate chart"
          >
            <title>Completion rate</title>
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="oklch(var(--border))"
              strokeWidth="6"
            />
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="oklch(var(--primary))"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 26}`}
              strokeDashoffset={`${2 * Math.PI * 26 * (1 - stats.completionRate / 100)}`}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-primary">
            {stats.completionRate}%
          </span>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Overall Completion Rate
          </h2>
          <p className="text-sm text-muted-foreground">
            {stats.completedTasks} of {stats.totalTasks} tasks completed ·{" "}
            {stats.totalHours} hours studied
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card
            key={s.label}
            className="shadow-card"
            data-ocid="dashboard.stat.card"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {s.label}
                  </p>
                  <p className="text-2xl font-display font-bold text-foreground mt-1">
                    {s.value}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.bg}`}
                >
                  <s.icon className="w-5 h-5" style={{ color: s.accent }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming tasks */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {upcomingTasks.length === 0 ? (
              <p
                className="text-sm text-muted-foreground text-center py-4"
                data-ocid="dashboard.tasks.empty_state"
              >
                No upcoming tasks 🎉
              </p>
            ) : (
              upcomingTasks.map((task, i) => {
                const daysUntil = Math.ceil(
                  (new Date(task.dueDate).getTime() - Date.now()) / 86400000,
                );
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40"
                    data-ocid={`dashboard.tasks.item.${i + 1}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {task.dueDate} ·{" "}
                        {daysUntil <= 0 ? "Overdue" : `${daysUntil}d left`}
                      </p>
                    </div>
                    <Badge
                      variant={PRIORITY_COLORS[task.priority]}
                      className="text-xs flex-shrink-0"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Recent sessions */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Recent Study Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {recentSessions.length === 0 ? (
              <p
                className="text-sm text-muted-foreground text-center py-4"
                data-ocid="dashboard.sessions.empty_state"
              >
                No sessions logged yet
              </p>
            ) : (
              recentSessions.map((session, i) => {
                const sub = data.subjects.find(
                  (s) => s.id === session.subjectId,
                );
                return (
                  <div
                    key={session.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40"
                    data-ocid={`dashboard.sessions.item.${i + 1}`}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: sub?.color ?? "#999" }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {sub?.name ?? "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.notes || "No notes"}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-foreground">
                        {session.duration}m
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.date}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subject progress */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Study Time by Subject
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {subjectProgress.map((sub) => (
            <div key={sub.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: sub.color }}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {sub.name}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {(sub.mins / 60).toFixed(1)}h ({sub.percent}%)
                </span>
              </div>
              <Progress value={sub.percent} className="h-2" />
            </div>
          ))}
          {subjectProgress.length === 0 && (
            <p
              className="text-sm text-muted-foreground text-center py-3"
              data-ocid="dashboard.progress.empty_state"
            >
              Start logging sessions to see progress
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
