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
import { Textarea } from "@/components/ui/textarea";
import type { StudyData, Subject } from "@/types/study";
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const PALETTE = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
];

interface SubjectsProps {
  data: StudyData;
  onAdd: (s: Omit<Subject, "id" | "createdAt">) => void;
  onUpdate: (id: string, s: Partial<Subject>) => void;
  onDelete: (id: string) => void;
}

interface SubjectForm {
  name: string;
  color: string;
  description: string;
}

function SubjectDialog({
  trigger,
  initial,
  onSave,
  mode,
}: {
  trigger: React.ReactNode;
  initial?: SubjectForm;
  onSave: (f: SubjectForm) => void;
  mode: "create" | "edit";
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<SubjectForm>(
    initial ?? { name: "", color: PALETTE[0], description: "" },
  );

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Subject name is required");
      return;
    }
    onSave(form);
    setOpen(false);
    if (mode === "create")
      setForm({ name: "", color: PALETTE[0], description: "" });
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
      <DialogContent data-ocid="subjects.dialog">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Subject" : "Edit Subject"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="subj-name">Name *</Label>
            <Input
              id="subj-name"
              data-ocid="subjects.input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Mathematics"
            />
          </div>
          <div>
            <Label>Color</Label>
            <div className="flex gap-2 mt-1.5">
              {PALETTE.map((c) => (
                <button
                  type="button"
                  key={c}
                  className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    background: c,
                    borderColor:
                      form.color === c
                        ? "oklch(var(--foreground))"
                        : "transparent",
                  }}
                  onClick={() => setForm((f) => ({ ...f, color: c }))}
                />
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="subj-desc">Description</Label>
            <Textarea
              id="subj-desc"
              data-ocid="subjects.textarea"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Brief description…"
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            data-ocid="subjects.cancel_button"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button data-ocid="subjects.save_button" onClick={handleSave}>
            {mode === "create" ? "Add Subject" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Subjects({ data, onAdd, onUpdate, onDelete }: SubjectsProps) {
  const handleDelete = (id: string, name: string) => {
    if (
      confirm(`Delete "${name}"? All associated tasks and notes will remain.`)
    ) {
      onDelete(id);
      toast.success("Subject deleted");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Subjects
          </h2>
          <p className="text-sm text-muted-foreground">
            {data.subjects.length} subject
            {data.subjects.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <SubjectDialog
          mode="create"
          trigger={
            <Button data-ocid="subjects.open_modal_button">
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          }
          onSave={(f) => {
            onAdd(f);
            toast.success("Subject added!");
          }}
        />
      </div>

      {data.subjects.length === 0 ? (
        <div className="text-center py-16" data-ocid="subjects.empty_state">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">
            No subjects yet. Add your first one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {data.subjects.map((sub, i) => {
              const taskCount = data.tasks.filter(
                (t) => t.subjectId === sub.id,
              ).length;
              const doneCount = data.tasks.filter(
                (t) => t.subjectId === sub.id && t.status === "Done",
              ).length;
              const hours = (
                data.sessions
                  .filter((s) => s.subjectId === sub.id)
                  .reduce((a, s) => a + s.duration, 0) / 60
              ).toFixed(1);

              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Card
                    className="shadow-card hover:shadow-md transition-shadow"
                    data-ocid={`subjects.item.${i + 1}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-10 rounded-sm flex-shrink-0"
                            style={{ background: sub.color }}
                          />
                          <CardTitle className="text-base font-semibold">
                            {sub.name}
                          </CardTitle>
                        </div>
                        <div className="flex gap-1">
                          <SubjectDialog
                            mode="edit"
                            initial={{
                              name: sub.name,
                              color: sub.color,
                              description: sub.description,
                            }}
                            trigger={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-7 h-7"
                                data-ocid={`subjects.edit_button.${i + 1}`}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                            }
                            onSave={(f) => {
                              onUpdate(sub.id, f);
                              toast.success("Subject updated!");
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 text-destructive hover:text-destructive"
                            data-ocid={`subjects.delete_button.${i + 1}`}
                            onClick={() => handleDelete(sub.id, sub.name)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {sub.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {sub.description}
                        </p>
                      )}
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span className="bg-muted px-2 py-0.5 rounded">
                          {taskCount} tasks ({doneCount} done)
                        </span>
                        <span className="bg-muted px-2 py-0.5 rounded">
                          {hours}h studied
                        </span>
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
