import { z } from 'zod';

// Enums for various fields
export const genderEnum = z.enum(['male', 'female']);
export const employeeTypeEnum = z.enum(['teacher', 'staff']);
export const permitStatusEnum = z.enum(['pending', 'approved', 'rejected']);
export const permitTypeEnum = z.enum(['sick', 'family', 'other']);
export const academicLevelEnum = z.enum(['7', '8', '9']); // Grades 7, 8, 9 for SMP

// Student schema
export const studentSchema = z.object({
  id: z.number(),
  student_id: z.string(), // Unique student identifier like NIS
  name: z.string(),
  gender: genderEnum,
  birth_date: z.coerce.date(),
  birth_place: z.string(),
  address: z.string(),
  phone: z.string().nullable(),
  parent_name: z.string(),
  parent_phone: z.string(),
  class_id: z.number().nullable(),
  academic_level: academicLevelEnum,
  is_active: z.boolean(),
  enrollment_date: z.coerce.date(),
  graduation_date: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Student = z.infer<typeof studentSchema>;

// Input schema for creating students
export const createStudentInputSchema = z.object({
  student_id: z.string().min(1),
  name: z.string().min(1),
  gender: genderEnum,
  birth_date: z.coerce.date(),
  birth_place: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().nullable(),
  parent_name: z.string().min(1),
  parent_phone: z.string().min(1),
  class_id: z.number().nullable(),
  academic_level: academicLevelEnum,
  enrollment_date: z.coerce.date()
});

export type CreateStudentInput = z.infer<typeof createStudentInputSchema>;

// Input schema for updating students
export const updateStudentInputSchema = z.object({
  id: z.number(),
  student_id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  gender: genderEnum.optional(),
  birth_date: z.coerce.date().optional(),
  birth_place: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  phone: z.string().nullable().optional(),
  parent_name: z.string().min(1).optional(),
  parent_phone: z.string().min(1).optional(),
  class_id: z.number().nullable().optional(),
  academic_level: academicLevelEnum.optional(),
  is_active: z.boolean().optional(),
  graduation_date: z.coerce.date().nullable().optional()
});

export type UpdateStudentInput = z.infer<typeof updateStudentInputSchema>;

// Employee schema
export const employeeSchema = z.object({
  id: z.number(),
  employee_id: z.string(), // Unique employee identifier like NIP
  name: z.string(),
  gender: genderEnum,
  birth_date: z.coerce.date(),
  birth_place: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string().nullable(),
  employee_type: employeeTypeEnum,
  job_title: z.string(),
  hire_date: z.coerce.date(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Employee = z.infer<typeof employeeSchema>;

// Input schema for creating employees
export const createEmployeeInputSchema = z.object({
  employee_id: z.string().min(1),
  name: z.string().min(1),
  gender: genderEnum,
  birth_date: z.coerce.date(),
  birth_place: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().nullable(),
  employee_type: employeeTypeEnum,
  job_title: z.string().min(1),
  hire_date: z.coerce.date()
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeInputSchema>;

// Input schema for updating employees
export const updateEmployeeInputSchema = z.object({
  id: z.number(),
  employee_id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  gender: genderEnum.optional(),
  birth_date: z.coerce.date().optional(),
  birth_place: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email().nullable().optional(),
  employee_type: employeeTypeEnum.optional(),
  job_title: z.string().min(1).optional(),
  hire_date: z.coerce.date().optional(),
  is_active: z.boolean().optional()
});

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeInputSchema>;

// Class schema
export const classSchema = z.object({
  id: z.number(),
  name: z.string(), // e.g., "7A", "8B", "9C"
  academic_level: academicLevelEnum,
  homeroom_teacher_id: z.number().nullable(),
  academic_year: z.string(), // e.g., "2023/2024"
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Class = z.infer<typeof classSchema>;

// Input schema for creating classes
export const createClassInputSchema = z.object({
  name: z.string().min(1),
  academic_level: academicLevelEnum,
  homeroom_teacher_id: z.number().nullable(),
  academic_year: z.string().min(1)
});

export type CreateClassInput = z.infer<typeof createClassInputSchema>;

// Input schema for updating classes
export const updateClassInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  academic_level: academicLevelEnum.optional(),
  homeroom_teacher_id: z.number().nullable().optional(),
  academic_year: z.string().min(1).optional(),
  is_active: z.boolean().optional()
});

export type UpdateClassInput = z.infer<typeof updateClassInputSchema>;

// Alumni schema (graduated students)
export const alumniSchema = z.object({
  id: z.number(),
  student_id: z.string(),
  name: z.string(),
  gender: genderEnum,
  graduation_year: z.number(),
  graduation_date: z.coerce.date(),
  current_education: z.string().nullable(), // Current school/university
  current_job: z.string().nullable(),
  contact_phone: z.string().nullable(),
  contact_email: z.string().nullable(),
  address: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Alumni = z.infer<typeof alumniSchema>;

// Input schema for creating alumni records
export const createAlumniInputSchema = z.object({
  student_id: z.string().min(1),
  name: z.string().min(1),
  gender: genderEnum,
  graduation_year: z.number().int().min(2000).max(2100),
  graduation_date: z.coerce.date(),
  current_education: z.string().nullable(),
  current_job: z.string().nullable(),
  contact_phone: z.string().nullable(),
  contact_email: z.string().email().nullable(),
  address: z.string().nullable()
});

export type CreateAlumniInput = z.infer<typeof createAlumniInputSchema>;

// Input schema for updating alumni records
export const updateAlumniInputSchema = z.object({
  id: z.number(),
  current_education: z.string().nullable().optional(),
  current_job: z.string().nullable().optional(),
  contact_phone: z.string().nullable().optional(),
  contact_email: z.string().email().nullable().optional(),
  address: z.string().nullable().optional()
});

export type UpdateAlumniInput = z.infer<typeof updateAlumniInputSchema>;

// Permit schema (student absence permits)
export const permitSchema = z.object({
  id: z.number(),
  student_id: z.number(),
  permit_type: permitTypeEnum,
  reason: z.string(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  status: permitStatusEnum,
  submitted_by: z.string(), // Who submitted (parent/guardian name)
  submitted_at: z.coerce.date(),
  reviewed_by: z.number().nullable(), // Employee ID who reviewed
  reviewed_at: z.coerce.date().nullable(),
  review_notes: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Permit = z.infer<typeof permitSchema>;

// Input schema for creating permit requests
export const createPermitInputSchema = z.object({
  student_id: z.number(),
  permit_type: permitTypeEnum,
  reason: z.string().min(1),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  submitted_by: z.string().min(1)
});

export type CreatePermitInput = z.infer<typeof createPermitInputSchema>;

// Input schema for reviewing permits
export const reviewPermitInputSchema = z.object({
  id: z.number(),
  status: z.enum(['approved', 'rejected']),
  reviewed_by: z.number(),
  review_notes: z.string().nullable()
});

export type ReviewPermitInput = z.infer<typeof reviewPermitInputSchema>;

// Attendance schema for tracking daily attendance
export const attendanceSchema = z.object({
  id: z.number(),
  student_id: z.number(),
  date: z.coerce.date(),
  status: z.enum(['present', 'absent', 'late', 'excused']),
  notes: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Attendance = z.infer<typeof attendanceSchema>;

// Input schema for recording attendance
export const recordAttendanceInputSchema = z.object({
  student_id: z.number(),
  date: z.coerce.date(),
  status: z.enum(['present', 'absent', 'late', 'excused']),
  notes: z.string().nullable()
});

export type RecordAttendanceInput = z.infer<typeof recordAttendanceInputSchema>;

// Dashboard statistics schema
export const dashboardStatsSchema = z.object({
  total_students: z.number(),
  total_employees: z.number(),
  total_classes: z.number(),
  daily_attendance_percentage: z.number(),
  recent_permits: z.number(),
  pending_permits: z.number()
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

// Bulk operations schemas
export const bulkStudentUploadSchema = z.object({
  students: z.array(createStudentInputSchema)
});

export type BulkStudentUpload = z.infer<typeof bulkStudentUploadSchema>;

// Search and filter schemas
export const studentSearchSchema = z.object({
  query: z.string().optional(),
  class_id: z.number().optional(),
  academic_level: academicLevelEnum.optional(),
  is_active: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0)
});

export type StudentSearch = z.infer<typeof studentSearchSchema>;

export const employeeSearchSchema = z.object({
  query: z.string().optional(),
  employee_type: employeeTypeEnum.optional(),
  is_active: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0)
});

export type EmployeeSearch = z.infer<typeof employeeSearchSchema>;

export const permitSearchSchema = z.object({
  student_id: z.number().optional(),
  status: permitStatusEnum.optional(),
  permit_type: permitTypeEnum.optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0)
});

export type PermitSearch = z.infer<typeof permitSearchSchema>;