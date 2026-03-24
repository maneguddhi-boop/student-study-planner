import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import type { Priority, StudyData, Task, TaskStatus } from "@/types/study";
import { CheckSquare, Pencil, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const PRIORITY_BADGE: Record<Priority, string> = {
  High: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Low: "bg-green-100 text-green-700 border-green-200",
};

const STATUS_COLS: TaskStatus[] = ["Todo", "In Progress", "Done"];
const STATUS_COLORS: Record<TaskStatus, string> = {
  Todo: "bg-muted/60",
  "In Progress": "bg-blue-50 border-blue-100",
  Done: "bg-green-50 border-green-100",
};

interface TaskForm {
  title: string;
  subjectId: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
}

interface TasksProps {
  data: StudyData;
  onAdd: (t: Omit<Task, "id" | "createdAt">) => void;
  onUpdate: (id: string, t: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

function TaskDialog({
  trigger,
  initial,
  onSave,
  mode,
  subjects,
}: {
  trigger: React.ReactNode;
  initial?: TaskForm;
  onSave: (f: TaskForm) => void;
  mode: "create" | "edit";
  subjects: StudyData["subjects"];
}) {
  const [open, setOpen] = useState(false);
  const blank: TaskForm = {
    title: "",
    subjectId: subjects[0]?.id ?? "",
    dueDate: new Date().toISOString().slice(0, 10),
    priority: "Medium",
    status: "Todo",
  };
  const [form, setForm] = useState<TaskForm>(initial ?? blank);

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    if (!form.subjectId) {
      toast.error("Please select a subject");
      return;
    }
    onSave(form);
    setOpen(false);
    if (mode === "create") setForm(blank);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v && initial) setForm(initial);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent data-ocid="tasks.dialog">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Task" : "Edit Task"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="task-title">Title *</Label>
            <Input
              id="task-title"
              data-ocid="tasks.input"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="e.g. Complete problem set"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Subject *</Label>
              <Select
                value={form.subjectId}
                onValueChange={(v) => setForm((f) => ({ ...f, subjectId: v }))}
              >
                <SelectTrigger data-ocid="tasks.select">
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="task-due">Due Date</Label>
              <Input
                id="task-due"
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dueDate: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, priority: v as Priority }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, status: v as TaskStatus }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_COLS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            data-ocid="tasks.cancel_button"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button data-ocid="tasks.save_button" onClick={handleSave}>
            {mode === "create" ? "Add Task" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Tasks({ data, onAdd, onUpdate, onDelete }: TasksProps) {
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"all" | TaskStatus>("all");

  const filtered = data.tasks.filter((t) => {
    if (filterSubject !== "all" && t.subjectId !== filterSubject) return false;
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    return true;
  });

  const columns = STATUS_COLS.map((status) => ({
    status,
    tasks: filtered.filter((t) => t.status === status),
  }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Tasks
          </h2>
          <p className="text-sm text-muted-foreground">
            {data.tasks.filter((t) => t.status !== "Done").length} active tasks
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger
              className="w-40 h-8 text-xs"
              data-ocid="tasks.filter.tab"
            >
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {data.subjects.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}
          >
            <SelectTrigger className="w-36 h-8 text-xs">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STATUS_COLS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <TaskDialog
            mode="create"
            subjects={data.subjects}
            trigger={
              <Button size="sm" data-ocid="tasks.open_modal_button">
                <Plus className="w-4 h-4 mr-1" />
                Add Task
              </Button>
            }
            onSave={(f) => {
              onAdd(f);
              toast.success("Task added!");
            }}
          />
        </div>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(({ status, tasks: colTasks }) => (
          <div key={status} className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-foreground">
                {status}
              </h3>
              <span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                {colTasks.length}
              </span>
            </div>
            <div
              className={`min-h-32 rounded-xl p-3 space-y-2.5 border ${STATUS_COLORS[status]}`}
            >
              {colTasks.length === 0 && (
                <div className="text-center py-6" data-ocid="tasks.empty_state">
                  <CheckSquare className="w-6 h-6 mx-auto text-muted-foreground/30 mb-1" />
                  <p className="text-xs text-muted-foreground">No tasks</p>
                </div>
              )}
              <AnimatePresence>
                {colTasks.map((task, i) => {
                  const sub = data.subjects.find(
                    (s) => s.id === task.subjectId,
                  );
                  const daysLeft = Math.ceil(
                    (new Date(task.dueDate).getTime() - Date.now()) / 86400000,
                  );
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      data-ocid={`tasks.item.${i + 1}`}
                    >
                      <Card className="shadow-xs">
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-foreground leading-tight">
                              {task.title}
                            </p>
                            <div className="flex gap-0.5 flex-shrink-0">
                              <TaskDialog
                                mode="edit"
                                subjects={data.subjects}
                                initial={{
                                  title: task.title,
                                  subjectId: task.subjectId,
                                  dueDate: task.dueDate,
                                  priority: task.priority,
                                  status: task.status,
                                }}
                                trigger={
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-6 h-6"
                                    data-ocid={`tasks.edit_button.${i + 1}`}
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </Button>
                                }
                                onSave={(f) => {
                                  onUpdate(task.id, f);
                                  toast.success("Task updated!");
                                }}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-6 h-6 text-destructive hover:text-destructive"
                                data-ocid={`tasks.delete_button.${i + 1}`}
                                onClick={() => {
                                  onDelete(task.id);
                                  toast.success("Task deleted");
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {sub && (
                              <span
                                className="text-xs px-1.5 py-0.5 rounded font-medium"
                                style={{
                                  background: `${sub.color}22`,
                                  color: sub.color,
                                }}
                              >
                                {sub.name}
                              </span>
                            )}
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded border font-medium ${PRIORITY_BADGE[task.priority]}`}
                            >
                              {task.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              {task.dueDate}
                            </span>
                            {daysLeft < 3 && daysLeft >= 0 && (
                              <span className="text-xs text-orange-600 font-medium">
                                · Soon!
                              </span>
                            )}
                            {daysLeft < 0 && (
                              <span className="text-xs text-red-600 font-medium">
                                · Overdue
                              </span>
                            )}
                          </div>
                          <Select
                            value={task.status}
                            onValueChange={(v) => {
                              onUpdate(task.id, { status: v as TaskStatus });
                              toast.success("Status updated");
                            }}
                          >
                            <SelectTrigger className="h-6 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_COLS.map((s) => (
                                <SelectItem
                                  key={s}
                                  value={s}
                                  className="text-xs"
                                >
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
