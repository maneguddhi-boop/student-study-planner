import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { StudyData, StudySession } from "@/types/study";
import { Clock, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface SessionsProps {
  data: StudyData;
  onAdd: (s: Omit<StudySession, "id" | "createdAt">) => void;
  onDelete: (id: string) => void;
}

interface SessionForm {
  subjectId: string;
  duration: string;
  notes: string;
  date: string;
}

export function StudySessions({ data, onAdd, onDelete }: SessionsProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<SessionForm>({
    subjectId: data.subjects[0]?.id ?? "",
    duration: "60",
    notes: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const handleSave = () => {
    if (!form.subjectId) {
      toast.error("Please select a subject");
      return;
    }
    const duration = Number.parseInt(form.duration);
    if (!duration || duration <= 0) {
      toast.error("Enter a valid duration");
      return;
    }
    onAdd({
      subjectId: form.subjectId,
      duration,
      notes: form.notes,
      date: form.date,
    });
    toast.success("Session logged!");
    setOpen(false);
    setForm({
      subjectId: data.subjects[0]?.id ?? "",
      duration: "60",
      notes: "",
      date: new Date().toISOString().slice(0, 10),
    });
  };

  const sorted = [...data.sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const totalHours = (
    data.sessions.reduce((a, s) => a + s.duration, 0) / 60
  ).toFixed(1);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Study Sessions
          </h2>
          <p className="text-sm text-muted-foreground">
            {data.sessions.length} sessions · {totalHours}h total
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-ocid="sessions.open_modal_button">
              <Plus className="w-4 h-4 mr-2" />
              Log Session
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="sessions.dialog">
            <DialogHeader>
              <DialogTitle>Log Study Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Subject *</Label>
                <Select
                  value={form.subjectId}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, subjectId: v }))
                  }
                >
                  <SelectTrigger data-ocid="sessions.select">
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="sess-dur">Duration (minutes) *</Label>
                  <Input
                    id="sess-dur"
                    data-ocid="sessions.input"
                    type="number"
                    min={1}
                    max={480}
                    value={form.duration}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, duration: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="sess-date">Date</Label>
                  <Input
                    id="sess-date"
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, date: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="sess-notes">Notes</Label>
                <Textarea
                  id="sess-notes"
                  data-ocid="sessions.textarea"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  placeholder="What did you study?"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                data-ocid="sessions.cancel_button"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button data-ocid="sessions.save_button" onClick={handleSave}>
                Log Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16" data-ocid="sessions.empty_state">
          <Clock className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">
            No sessions logged yet. Start studying!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {sorted.map((session, i) => {
              const sub = data.subjects.find((s) => s.id === session.subjectId);
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.03 }}
                  data-ocid={`sessions.item.${i + 1}`}
                >
                  <Card className="shadow-xs">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div
                        className="w-1 self-stretch rounded-full flex-shrink-0"
                        style={{ background: sub?.color ?? "#999" }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-sm text-foreground">
                            {sub?.name ?? "Unknown"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {session.date}
                          </span>
                        </div>
                        {session.notes && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {session.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
                        <div className="bg-primary/10 text-primary font-bold text-sm px-3 py-1 rounded-full">
                          {session.duration >= 60
                            ? `${Math.floor(session.duration / 60)}h${session.duration % 60 > 0 ? ` ${session.duration % 60}m` : ""}`
                            : `${session.duration}m`}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-destructive hover:text-destructive"
                          data-ocid={`sessions.delete_button.${i + 1}`}
                          onClick={() => {
                            if (confirm("Delete this session?")) {
                              onDelete(session.id);
                              toast.success("Session deleted");
                            }
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
