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
import type { Note, StudyData } from "@/types/study";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface NotesProps {
  data: StudyData;
  onAdd: (n: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  onUpdate: (id: string, n: Partial<Note>) => void;
  onDelete: (id: string) => void;
}

interface NoteForm {
  title: string;
  content: string;
  subjectId: string;
}

function NoteDialog({
  trigger,
  initial,
  onSave,
  mode,
  subjects,
}: {
  trigger: React.ReactNode;
  initial?: NoteForm;
  onSave: (f: NoteForm) => void;
  mode: "create" | "edit";
  subjects: StudyData["subjects"];
}) {
  const [open, setOpen] = useState(false);
  const blank: NoteForm = {
    title: "",
    content: "",
    subjectId: subjects[0]?.id ?? "",
  };
  const [form, setForm] = useState<NoteForm>(initial ?? blank);

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error("Note title is required");
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
      <DialogContent className="max-w-lg" data-ocid="notes.dialog">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "New Note" : "Edit Note"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="note-title">Title *</Label>
            <Input
              id="note-title"
              data-ocid="notes.input"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Note title…"
            />
          </div>
          <div>
            <Label>Subject</Label>
            <Select
              value={form.subjectId}
              onValueChange={(v) => setForm((f) => ({ ...f, subjectId: v }))}
            >
              <SelectTrigger data-ocid="notes.select">
                <SelectValue placeholder="Select subject…" />
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
            <Label htmlFor="note-content">Content</Label>
            <Textarea
              id="note-content"
              data-ocid="notes.textarea"
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
              placeholder="Write your notes here…"
              rows={8}
              className="font-mono text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            data-ocid="notes.cancel_button"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button data-ocid="notes.save_button" onClick={handleSave}>
            {mode === "create" ? "Create Note" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Notes({ data, onAdd, onUpdate, onDelete }: NotesProps) {
  const [filterSubject, setFilterSubject] = useState("all");

  const filtered = data.notes.filter(
    (n) => filterSubject === "all" || n.subjectId === filterSubject,
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Notes
          </h2>
          <p className="text-sm text-muted-foreground">
            {data.notes.length} note{data.notes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger
              className="w-40 h-8 text-xs"
              data-ocid="notes.filter.tab"
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
          <NoteDialog
            mode="create"
            subjects={data.subjects}
            trigger={
              <Button size="sm" data-ocid="notes.open_modal_button">
                <Plus className="w-4 h-4 mr-1" />
                New Note
              </Button>
            }
            onSave={(f) => {
              onAdd(f);
              toast.success("Note created!");
            }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16" data-ocid="notes.empty_state">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">
            No notes yet. Capture your first thought!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((note, i) => {
              const sub = data.subjects.find((s) => s.id === note.subjectId);
              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  data-ocid={`notes.item.${i + 1}`}
                >
                  <Card className="shadow-card hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          {sub && (
                            <span
                              className="text-xs font-medium px-1.5 py-0.5 rounded mb-1 inline-block"
                              style={{
                                background: `${sub.color}22`,
                                color: sub.color,
                              }}
                            >
                              {sub.name}
                            </span>
                          )}
                          <CardTitle className="text-sm font-semibold leading-tight mt-0.5">
                            {note.title}
                          </CardTitle>
                        </div>
                        <div className="flex gap-0.5 flex-shrink-0">
                          <NoteDialog
                            mode="edit"
                            subjects={data.subjects}
                            initial={{
                              title: note.title,
                              content: note.content,
                              subjectId: note.subjectId,
                            }}
                            trigger={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-6 h-6"
                                data-ocid={`notes.edit_button.${i + 1}`}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                            }
                            onSave={(f) => {
                              onUpdate(note.id, f);
                              toast.success("Note updated!");
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6 text-destructive hover:text-destructive"
                            data-ocid={`notes.delete_button.${i + 1}`}
                            onClick={() => {
                              if (confirm("Delete this note?")) {
                                onDelete(note.id);
                                toast.success("Note deleted");
                              }
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-5">
                        {note.content || (
                          <span className="italic">No content</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </p>
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
