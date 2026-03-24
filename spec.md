# Student Study Planner

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- User authentication (login/signup) with role-based access
- Subject management: create, edit, delete subjects with color labels
- Task management: add study tasks linked to subjects, with due dates, priority, and status (todo/in-progress/done)
- Study sessions: log study sessions with subject, duration, and notes
- Dashboard: overview of upcoming tasks, recent sessions, study stats
- Calendar view: tasks displayed on a weekly/monthly calendar
- Progress tracking: time studied per subject, task completion rates
- Pomodoro-style timer: study timer with configurable intervals
- Notes: quick notes per subject

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Select authorization component
2. Generate Motoko backend with subjects, tasks, study sessions, notes actors
3. Build React frontend with dashboard, task manager, subject manager, study timer, calendar, and progress views
