import { serial, text, pgTable, timestamp, boolean, integer, date, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const genderEnum = pgEnum('gender', ['male', 'female']);
export const employeeTypeEnum = pgEnum('employee_type', ['teacher', 'staff']);
export const permitStatusEnum = pgEnum('permit_status', ['pending', 'approved', 'rejected']);
export const permitTypeEnum = pgEnum('permit_type', ['sick', 'family', 'other']);
export const academicLevelEnum = pgEnum('academic_level', ['7', '8', '9']);
export const attendanceStatusEnum = pgEnum('attendance_status', ['present', 'absent', 'late', 'excused']);

// Students table
export const studentsTable = pgTable('students', {
  id: serial('id').primaryKey(),
  student_id: text('student_id').notNull().unique(), // NIS or similar unique identifier
  name: text('name').notNull(),
  gender: genderEnum('gender').notNull(),
  birth_date: date('birth_date').notNull(),
  birth_place: text('birth_place').notNull(),
  address: text('address').notNull(),
  phone: text('phone'), // Nullable
  parent_name: text('parent_name').notNull(),
  parent_phone: text('parent_phone').notNull(),
  class_id: integer('class_id'), // Foreign key to classes, nullable
  academic_level: academicLevelEnum('academic_level').notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  enrollment_date: date('enrollment_date').notNull(),
  graduation_date: date('graduation_date'), // Nullable until graduation
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Employees table
export const employeesTable = pgTable('employees', {
  id: serial('id').primaryKey(),
  employee_id: text('employee_id').notNull().unique(), // NIP or similar unique identifier
  name: text('name').notNull(),
  gender: genderEnum('gender').notNull(),
  birth_date: date('birth_date').notNull(),
  birth_place: text('birth_place').notNull(),
  address: text('address').notNull(),
  phone: text('phone').notNull(),
  email: text('email'), // Nullable
  employee_type: employeeTypeEnum('employee_type').notNull(),
  job_title: text('job_title').notNull(),
  hire_date: date('hire_date').notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Classes table
export const classesTable = pgTable('classes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // e.g., "7A", "8B", "9C"
  academic_level: academicLevelEnum('academic_level').notNull(),
  homeroom_teacher_id: integer('homeroom_teacher_id'), // Foreign key to employees, nullable
  academic_year: text('academic_year').notNull(), // e.g., "2023/2024"
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Alumni table (graduated students)
export const alumniTable = pgTable('alumni', {
  id: serial('id').primaryKey(),
  student_id: text('student_id').notNull().unique(),
  name: text('name').notNull(),
  gender: genderEnum('gender').notNull(),
  graduation_year: integer('graduation_year').notNull(),
  graduation_date: date('graduation_date').notNull(),
  current_education: text('current_education'), // Current school/university, nullable
  current_job: text('current_job'), // Nullable
  contact_phone: text('contact_phone'), // Nullable
  contact_email: text('contact_email'), // Nullable
  address: text('address'), // Nullable
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Permits table (student absence permits)
export const permitsTable = pgTable('permits', {
  id: serial('id').primaryKey(),
  student_id: integer('student_id').notNull(), // Foreign key to students
  permit_type: permitTypeEnum('permit_type').notNull(),
  reason: text('reason').notNull(),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  status: permitStatusEnum('status').default('pending').notNull(),
  submitted_by: text('submitted_by').notNull(), // Parent/guardian name
  submitted_at: timestamp('submitted_at').defaultNow().notNull(),
  reviewed_by: integer('reviewed_by'), // Employee ID who reviewed, nullable
  reviewed_at: timestamp('reviewed_at'), // Nullable
  review_notes: text('review_notes'), // Nullable
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Attendance table for daily attendance tracking
export const attendanceTable = pgTable('attendance', {
  id: serial('id').primaryKey(),
  student_id: integer('student_id').notNull(), // Foreign key to students
  date: date('date').notNull(),
  status: attendanceStatusEnum('status').notNull(),
  notes: text('notes'), // Nullable
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Relations
export const studentsRelations = relations(studentsTable, ({ one, many }) => ({
  class: one(classesTable, {
    fields: [studentsTable.class_id],
    references: [classesTable.id]
  }),
  permits: many(permitsTable),
  attendance: many(attendanceTable)
}));

export const employeesRelations = relations(employeesTable, ({ many }) => ({
  homeroomClasses: many(classesTable),
  reviewedPermits: many(permitsTable)
}));

export const classesRelations = relations(classesTable, ({ one, many }) => ({
  homeroomTeacher: one(employeesTable, {
    fields: [classesTable.homeroom_teacher_id],
    references: [employeesTable.id]
  }),
  students: many(studentsTable)
}));

export const permitsRelations = relations(permitsTable, ({ one }) => ({
  student: one(studentsTable, {
    fields: [permitsTable.student_id],
    references: [studentsTable.id]
  }),
  reviewer: one(employeesTable, {
    fields: [permitsTable.reviewed_by],
    references: [employeesTable.id]
  })
}));

export const attendanceRelations = relations(attendanceTable, ({ one }) => ({
  student: one(studentsTable, {
    fields: [attendanceTable.student_id],
    references: [studentsTable.id]
  })
}));

// TypeScript types for table schemas
export type Student = typeof studentsTable.$inferSelect;
export type NewStudent = typeof studentsTable.$inferInsert;

export type Employee = typeof employeesTable.$inferSelect;
export type NewEmployee = typeof employeesTable.$inferInsert;

export type Class = typeof classesTable.$inferSelect;
export type NewClass = typeof classesTable.$inferInsert;

export type Alumni = typeof alumniTable.$inferSelect;
export type NewAlumni = typeof alumniTable.$inferInsert;

export type Permit = typeof permitsTable.$inferSelect;
export type NewPermit = typeof permitsTable.$inferInsert;

export type Attendance = typeof attendanceTable.$inferSelect;
export type NewAttendance = typeof attendanceTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  students: studentsTable,
  employees: employeesTable,
  classes: classesTable,
  alumni: alumniTable,
  permits: permitsTable,
  attendance: attendanceTable
};