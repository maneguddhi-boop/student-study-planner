export type Priority = "Low" | "Medium" | "High";
export type TaskStatus = "Todo" | "In Progress" | "Done";

export interface Subject {
  id: string;
  name: string;
  color: string;
  description: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  subjectId: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: string;
}

export interface StudySession {
  id: string;
  subjectId: string;
  duration: number; // minutes
  notes: string;
  date: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subjectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyData {
  subjects: Subject[];
  tasks: Task[];
  sessions: StudySession[];
  notes: Note[];
}
