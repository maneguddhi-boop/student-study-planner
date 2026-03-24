import type {
  Note,
  StudyData,
  StudySession,
  Subject,
  Task,
} from "@/types/study";
import { useCallback, useState } from "react";

const SEED_DATA: StudyData = {
  subjects: [
    {
      id: "s1",
      name: "Mathematics",
      color: "#3B82F6",
      description: "Calculus, Linear Algebra, Statistics",
      createdAt: "2026-03-01T00:00:00Z",
    },
    {
      id: "s2",
      name: "Computer Science",
      color: "#8B5CF6",
      description: "Data Structures, Algorithms, OS",
      createdAt: "2026-03-01T00:00:00Z",
    },
    {
      id: "s3",
      name: "Physics",
      color: "#10B981",
      description: "Mechanics, Thermodynamics, Waves",
      createdAt: "2026-03-02T00:00:00Z",
    },
    {
      id: "s4",
      name: "English Literature",
      color: "#F59E0B",
      description: "British and American Literature",
      createdAt: "2026-03-03T00:00:00Z",
    },
    {
      id: "s5",
      name: "Chemistry",
      color: "#EF4444",
      description: "Organic, Inorganic, Physical Chemistry",
      createdAt: "2026-03-04T00:00:00Z",
    },
  ],
  tasks: [
    {
      id: "t1",
      title: "Complete Calculus Problem Set 7",
      subjectId: "s1",
      dueDate: "2026-03-26",
      priority: "High",
      status: "In Progress",
      createdAt: "2026-03-20T00:00:00Z",
    },
    {
      id: "t2",
      title: "Implement Binary Search Tree",
      subjectId: "s2",
      dueDate: "2026-03-27",
      priority: "High",
      status: "Todo",
      createdAt: "2026-03-20T00:00:00Z",
    },
    {
      id: "t3",
      title: "Read Chapter 5: Wave Mechanics",
      subjectId: "s3",
      dueDate: "2026-03-28",
      priority: "Medium",
      status: "Todo",
      createdAt: "2026-03-21T00:00:00Z",
    },
    {
      id: "t4",
      title: "Essay: Analysis of Hamlet",
      subjectId: "s4",
      dueDate: "2026-03-30",
      priority: "High",
      status: "In Progress",
      createdAt: "2026-03-21T00:00:00Z",
    },
    {
      id: "t5",
      title: "Lab Report: Titration Experiment",
      subjectId: "s5",
      dueDate: "2026-04-01",
      priority: "Medium",
      status: "Done",
      createdAt: "2026-03-15T00:00:00Z",
    },
    {
      id: "t6",
      title: "Statistics Midterm Review",
      subjectId: "s1",
      dueDate: "2026-04-03",
      priority: "High",
      status: "Todo",
      createdAt: "2026-03-22T00:00:00Z",
    },
    {
      id: "t7",
      title: "Dynamic Programming Practice",
      subjectId: "s2",
      dueDate: "2026-04-05",
      priority: "Low",
      status: "Done",
      createdAt: "2026-03-18T00:00:00Z",
    },
    {
      id: "t8",
      title: "Thermodynamics Assignment",
      subjectId: "s3",
      dueDate: "2026-04-02",
      priority: "Medium",
      status: "Todo",
      createdAt: "2026-03-22T00:00:00Z",
    },
  ],
  sessions: [
    {
      id: "ss1",
      subjectId: "s1",
      duration: 90,
      notes: "Worked through integration by parts and substitution methods",
      date: "2026-03-23",
      createdAt: "2026-03-23T14:00:00Z",
    },
    {
      id: "ss2",
      subjectId: "s2",
      duration: 120,
      notes: "Implemented AVL tree with rotation algorithms",
      date: "2026-03-23",
      createdAt: "2026-03-23T17:00:00Z",
    },
    {
      id: "ss3",
      subjectId: "s4",
      duration: 60,
      notes: "Read Act 3 of Hamlet, annotated key passages",
      date: "2026-03-22",
      createdAt: "2026-03-22T10:00:00Z",
    },
    {
      id: "ss4",
      subjectId: "s3",
      duration: 75,
      notes: "Practice problems on harmonic motion",
      date: "2026-03-22",
      createdAt: "2026-03-22T15:00:00Z",
    },
    {
      id: "ss5",
      subjectId: "s5",
      duration: 45,
      notes: "Reviewed oxidation reactions for lab prep",
      date: "2026-03-21",
      createdAt: "2026-03-21T11:00:00Z",
    },
    {
      id: "ss6",
      subjectId: "s1",
      duration: 110,
      notes: "Linear algebra: eigenvalues and eigenvectors",
      date: "2026-03-20",
      createdAt: "2026-03-20T09:00:00Z",
    },
  ],
  notes: [
    {
      id: "n1",
      title: "Integration Techniques Cheat Sheet",
      content:
        "**Integration by Parts:** ∫u dv = uv - ∫v du\n\n**Substitution:** Let u = g(x), du = g'(x)dx\n\n**Partial Fractions:** Decompose rational functions into simpler fractions.\n\nKey formulas to remember for the midterm!",
      subjectId: "s1",
      createdAt: "2026-03-20T00:00:00Z",
      updatedAt: "2026-03-23T00:00:00Z",
    },
    {
      id: "n2",
      title: "Big-O Complexity Reference",
      content:
        "O(1) - Constant: Array access\nO(log n) - Logarithmic: Binary Search\nO(n) - Linear: Linear Search\nO(n log n) - Quasilinear: Merge Sort\nO(n²) - Quadratic: Bubble Sort\nO(2^n) - Exponential: Fibonacci recursive",
      subjectId: "s2",
      createdAt: "2026-03-21T00:00:00Z",
      updatedAt: "2026-03-21T00:00:00Z",
    },
    {
      id: "n3",
      title: "Hamlet Key Themes",
      content:
        "1. Revenge and Justice\n2. Mortality and Existentialism ('To be or not to be')\n3. Corruption and Decay\n4. Appearance vs Reality\n5. Women and Misogyny (Ophelia, Gertrude)\n\nKey quote: 'Something is rotten in the state of Denmark'",
      subjectId: "s4",
      createdAt: "2026-03-22T00:00:00Z",
      updatedAt: "2026-03-22T00:00:00Z",
    },
    {
      id: "n4",
      title: "Wave Equations Summary",
      content:
        "General wave equation: y = A sin(kx - ωt + φ)\n\nA = amplitude, k = wave number = 2π/λ\nω = angular frequency = 2π/T\nv = λf = ω/k\n\nDoppler Effect: f' = f(v ± vO)/(v ∓ vS)",
      subjectId: "s3",
      createdAt: "2026-03-22T00:00:00Z",
      updatedAt: "2026-03-22T00:00:00Z",
    },
  ],
};

function getStorageKey(principal: string) {
  return `study-planner-data-${principal}`;
}

function loadData(principal: string): StudyData {
  const stored = localStorage.getItem(getStorageKey(principal));
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return SEED_DATA;
    }
  }
  return SEED_DATA;
}

function saveData(principal: string, data: StudyData) {
  localStorage.setItem(getStorageKey(principal), JSON.stringify(data));
}

export function useStudyData(principal: string) {
  const [data, setData] = useState<StudyData>(() => loadData(principal));

  const update = useCallback(
    (updater: (prev: StudyData) => StudyData) => {
      setData((prev) => {
        const next = updater(prev);
        saveData(principal, next);
        return next;
      });
    },
    [principal],
  );

  // Subject operations
  const addSubject = useCallback(
    (s: Omit<Subject, "id" | "createdAt">) => {
      update((d) => ({
        ...d,
        subjects: [
          ...d.subjects,
          {
            ...s,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    },
    [update],
  );

  const updateSubject = useCallback(
    (id: string, s: Partial<Subject>) => {
      update((d) => ({
        ...d,
        subjects: d.subjects.map((x) => (x.id === id ? { ...x, ...s } : x)),
      }));
    },
    [update],
  );

  const deleteSubject = useCallback(
    (id: string) => {
      update((d) => ({
        ...d,
        subjects: d.subjects.filter((x) => x.id !== id),
      }));
    },
    [update],
  );

  // Task operations
  const addTask = useCallback(
    (t: Omit<Task, "id" | "createdAt">) => {
      update((d) => ({
        ...d,
        tasks: [
          ...d.tasks,
          {
            ...t,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    },
    [update],
  );

  const updateTask = useCallback(
    (id: string, t: Partial<Task>) => {
      update((d) => ({
        ...d,
        tasks: d.tasks.map((x) => (x.id === id ? { ...x, ...t } : x)),
      }));
    },
    [update],
  );

  const deleteTask = useCallback(
    (id: string) => {
      update((d) => ({ ...d, tasks: d.tasks.filter((x) => x.id !== id) }));
    },
    [update],
  );

  // Session operations
  const addSession = useCallback(
    (s: Omit<StudySession, "id" | "createdAt">) => {
      update((d) => ({
        ...d,
        sessions: [
          ...d.sessions,
          {
            ...s,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    },
    [update],
  );

  const deleteSession = useCallback(
    (id: string) => {
      update((d) => ({
        ...d,
        sessions: d.sessions.filter((x) => x.id !== id),
      }));
    },
    [update],
  );

  // Note operations
  const addNote = useCallback(
    (n: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
      update((d) => ({
        ...d,
        notes: [
          ...d.notes,
          {
            ...n,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      }));
    },
    [update],
  );

  const updateNote = useCallback(
    (id: string, n: Partial<Note>) => {
      update((d) => ({
        ...d,
        notes: d.notes.map((x) =>
          x.id === id ? { ...x, ...n, updatedAt: new Date().toISOString() } : x,
        ),
      }));
    },
    [update],
  );

  const deleteNote = useCallback(
    (id: string) => {
      update((d) => ({ ...d, notes: d.notes.filter((x) => x.id !== id) }));
    },
    [update],
  );

  return {
    data,
    addSubject,
    updateSubject,
    deleteSubject,
    addTask,
    updateTask,
    deleteTask,
    addSession,
    deleteSession,
    addNote,
    updateNote,
    deleteNote,
  };
}
