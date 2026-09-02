# Quran College - System Architecture Document

This document outlines the system architecture, routing layer, database schema, and authentication flow for the Quran College application. The details herein are strictly based on the current implementation in the workspace.

## 1. Technology Stack
The application is built on a modern, React-based web stack utilizing the following key dependencies (from `package.json`):
- **Framework**: Next.js 16.3.1 (using the App Router)
- **UI Library**: React 19.2.8 / ReactDOM 19.2.8
- **Styling**: Tailwind CSS v4 (with PostCSS)
- **Backend / Database**: Supabase (via `@supabase/supabase-js` v2.112.3)
- **Icons**: Lucide React v1.33.0

## 2. Application Routing (`app/` Directory)
The application utilizes Next.js App Router conventions with purely client-side rendering for interactivity.

### Public Routes
- **`/` (Root Landing Page)**: A professional, mobile-responsive institutional landing page. Features a Hero section, program highlights (Quran Memorization, Tajweed, Arabic), and calls-to-action directing traffic to `/apply`.
- **`/apply` (Admission Form)**: A comprehensive application form capturing personal, academic, and contact details. It directly inserts a new record into the Supabase `students` table upon submission.

### Protected / Specific Routes
- **`/dashboard` (Teacher Dashboard)**: 
  - **Layout Gate**: Protected by a global layout (`app/dashboard/layout.js`) that enforces a teacher passcode screen before rendering child components.
  - **Roster View**: Fetches all students from Supabase. Features filtering by "Assigned Teacher" and "Payment Status".
  - **Payment Verification**: Teachers can click "Verify Payment" to instantly update a student's `payment_status` to `'Confirmed'` in Supabase and optimistically update the UI.
  - **Student Details Modal**: Clicking "View Details" opens a modal displaying the full student profile alongside a real-time fetch of their `attendance` history.
- **`/portal` (Student Portal)**: 
  - A zero-friction, password-less portal for students.
  - **Login Phase**: Requires the student to enter their WhatsApp number and Date of Birth.
  - **Dashboard Phase**: Displays personalized data including their enrolled course, current payment status badge, and a historical list of attendance check-ins.
- **`/check-in` (Zoom Self-Check-In)**:
  - An aggressively mobile-optimized, single-input route designed to be dropped into a Zoom chat.
  - Requires only the student's WhatsApp number.
  - Features an instant "Payment Verification Gate" that blocks check-in if the student's status is "Pending". If "Confirmed", it upserts an attendance record for the current date.

## 3. Database Schema (Supabase)
The application relies on two primary tables in Supabase, initialized and queried via `lib/supabase.js`.

### `students` Table
Stores all applicant and enrolled student data.
- **Columns**: 
  - `id` (Primary Key, UUID/Int)
  - `name` (String) - English Name
  - `full_name_urdu` (String) - Urdu Name
  - `father_name` (String)
  - `email` (String)
  - `phone` (String) - Used as primary identifier for check-in and portal
  - `date_of_birth` (Date string)
  - `cnic` (String)
  - `city` (String)
  - `country` (String)
  - `education` (String)
  - `islamic_qualification` (String)
  - `course` (String)
  - `assigned_teacher` (String)
  - `payment_status` (String) - Default: 'Pending'. Mutable to 'Confirmed'.
  - `created_at` (Timestamp)

### `attendance` Table
Tracks daily check-ins for zoom classes.
- **Columns**:
  - `id` (Primary Key)
  - `student_id` (Foreign Key referencing `students.id`)
  - `date` (Date string, e.g., 'YYYY-MM-DD')
  - `status` (String) - E.g., 'Present'
- *Note: Relies on a unique constraint spanning `(student_id, date)` to allow successful upsert operations during check-in.*

## 4. Authentication & State Management
Authentication in this application prioritizes low-friction access and relies entirely on client-side state combined with browser `sessionStorage`.

- **Teacher Authentication (`/dashboard`)**:
  - Uses an environment variable (`NEXT_PUBLIC_TEACHER_PASSCODE`).
  - When the teacher enters the correct passcode, `teacher_authenticated = true` is saved in `sessionStorage`.
  - The `DashboardLayout` checks `sessionStorage` on mount. If absent or false, it renders the lock screen.
- **Student Authentication (`/portal`)**:
  - Queries the Supabase `students` table where both `phone` and `date_of_birth` exactly match the user's input.
  - If a match is found, the student's unique `id` is saved to `sessionStorage` as `student_id`.
  - Upon page reload, the component checks `sessionStorage` and automatically fetches the dashboard data if the ID exists.
- **Check-In Validation (`/check-in`)**:
  - Entirely stateless. It queries the `students` table by `phone` at the moment of submission. No session is created or stored, ensuring rapid usability across shared devices or rapid successive check-ins.
