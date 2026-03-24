import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StudyData } from "@/types/study";
import { Brain, Coffee, Pause, Play, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type TimerMode = "work" | "break";

interface PomodoroTimerProps {
  data: StudyData;
  onAddSession: (s: {
    subjectId: string;
    duration: number;
    notes: string;
    date: string;
  }) => void;
}

export function PomodoroTimer({ data, onAddSession }: PomodoroTimerProps) {
  const [workMins, setWorkMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(workMins * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(
    data.subjects[0]?.id ?? "",
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSecs = mode === "work" ? workMins * 60 : breakMins * 60;
  const percent = ((totalSecs - timeLeft) / totalSecs) * 100;
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  const reset = useCallback(() => {
    setRunning(false);
    setTimeLeft(mode === "work" ? workMins * 60 : breakMins * 60);
  }, [mode, workMins, breakMins]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          if (mode === "work") {
            setSessions((s) => s + 1);
            toast.success("Pomodoro complete! Take a break 🎉");
            if (selectedSubject) {
              onAddSession({
                subjectId: selectedSubject,
                duration: workMins,
                notes: `Pomodoro session — ${workMins} minutes`,
                date: new Date().toISOString().slice(0, 10),
              });
            }
            setMode("break");
            setTimeLeft(breakMins * 60);
          } else {
            toast.success("Break over! Back to work 💪");
            setMode("work");
            setTimeLeft(workMins * 60);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [running, mode, workMins, breakMins, selectedSubject, onAddSession]);

  useEffect(() => {
    if (!running) setTimeLeft(mode === "work" ? workMins * 60 : breakMins * 60);
  }, [workMins, breakMins, mode, running]);

  const radius = 110;
  const circ = 2 * Math.PI * radius;
  const isWork = mode === "work";

  const dotSlots = Array.from(
    { length: Math.max(4, sessions + 1) },
    (_, idx) => ({
      id: `session-slot-${idx}`,
      filled: idx < sessions,
    }),
  );
  const sessionDots = dotSlots.map((dot) => (
    <div
      key={dot.id}
      className="w-3 h-3 rounded-full transition-colors"
      style={{
        background: dot.filled
          ? "oklch(var(--primary))"
          : "oklch(var(--border))",
      }}
    />
  ));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Pomodoro Timer
        </h2>
        <p className="text-sm text-muted-foreground">
          Focus deeply, break often.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardContent className="p-8 flex flex-col items-center gap-6">
              {/* Mode toggle */}
              <div className="flex gap-2">
                <Button
                  variant={isWork ? "default" : "outline"}
                  size="sm"
                  data-ocid="timer.work.tab"
                  onClick={() => {
                    if (!running) {
                      setMode("work");
                      setTimeLeft(workMins * 60);
                    }
                  }}
                  className="gap-1.5"
                >
                  <Brain className="w-4 h-4" /> Work
                </Button>
                <Button
                  variant={!isWork ? "default" : "outline"}
                  size="sm"
                  data-ocid="timer.break.tab"
                  onClick={() => {
                    if (!running) {
                      setMode("break");
                      setTimeLeft(breakMins * 60);
                    }
                  }}
                  className="gap-1.5"
                >
                  <Coffee className="w-4 h-4" /> Break
                </Button>
              </div>

              {/* Circular progress */}
              <motion.div
                key={mode}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                <svg
                  width="280"
                  height="280"
                  viewBox="0 0 280 280"
                  role="img"
                  aria-label={`${isWork ? "Work" : "Break"} timer: ${mins}:${secs} remaining`}
                >
                  <title>{isWork ? "Work" : "Break"} timer</title>
                  <circle
                    cx="140"
                    cy="140"
                    r={radius}
                    fill="none"
                    stroke="oklch(var(--border))"
                    strokeWidth="10"
                  />
                  <circle
                    cx="140"
                    cy="140"
                    r={radius}
                    fill="none"
                    stroke={
                      isWork ? "oklch(var(--primary))" : "oklch(var(--chart-2))"
                    }
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={circ * (1 - percent / 100)}
                    transform="rotate(-90 140 140)"
                    style={{
                      transition: running
                        ? "stroke-dashoffset 1s linear"
                        : "stroke-dashoffset 0.3s ease",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-5xl font-bold text-foreground tabular-nums">
                    {mins}:{secs}
                  </span>
                  <span className="text-sm text-muted-foreground mt-1">
                    {isWork ? "Focus Time" : "Break Time"}
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    Session #{sessions + 1}
                  </span>
                </div>
              </motion.div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  data-ocid="timer.reset.button"
                  onClick={reset}
                  className="w-10 h-10"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  data-ocid={
                    running ? "timer.pause.button" : "timer.play.button"
                  }
                  onClick={() => setRunning((r) => !r)}
                  className="w-32 gap-2"
                  style={
                    isWork
                      ? {}
                      : { background: "oklch(var(--chart-2))", color: "white" }
                  }
                >
                  {running ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                  {running ? "Pause" : "Start"}
                </Button>
              </div>

              {/* Session dots */}
              <div className="flex items-center gap-1.5">
                {sessionDots}
                <span className="text-xs text-muted-foreground ml-1">
                  {sessions} completed
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <Card className="shadow-card">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold text-sm text-foreground">
                Settings
              </h3>
              <div>
                <Label htmlFor="work-mins">Work Duration (min)</Label>
                <Input
                  id="work-mins"
                  data-ocid="timer.work_duration.input"
                  type="number"
                  min={1}
                  max={60}
                  value={workMins}
                  onChange={(e) =>
                    setWorkMins(
                      Math.max(1, Number.parseInt(e.target.value) || 25),
                    )
                  }
                  disabled={running}
                />
              </div>
              <div>
                <Label htmlFor="break-mins">Break Duration (min)</Label>
                <Input
                  id="break-mins"
                  data-ocid="timer.break_duration.input"
                  type="number"
                  min={1}
                  max={30}
                  value={breakMins}
                  onChange={(e) =>
                    setBreakMins(
                      Math.max(1, Number.parseInt(e.target.value) || 5),
                    )
                  }
                  disabled={running}
                />
              </div>
              <div>
                <Label>Track Subject</Label>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger data-ocid="timer.subject.select">
                    <SelectValue placeholder="Select subject…" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">
                Completed Pomodoros are automatically logged as study sessions.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm text-foreground mb-3">
                Today&apos;s Sessions
              </h3>
              <div className="text-center">
                <span className="font-display text-4xl font-bold text-primary">
                  {sessions}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Pomodoros completed
                </p>
                <p className="text-xs text-muted-foreground">
                  {sessions * workMins} minutes focused
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
