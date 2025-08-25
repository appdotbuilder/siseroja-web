import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import {
  createStudentInputSchema,
  updateStudentInputSchema,
  studentSearchSchema,
  bulkStudentUploadSchema,
  createEmployeeInputSchema,
  updateEmployeeInputSchema,
  employeeSearchSchema,
  createClassInputSchema,
  updateClassInputSchema,
  createAlumniInputSchema,
  updateAlumniInputSchema,
  createPermitInputSchema,
  reviewPermitInputSchema,
  permitSearchSchema,
  recordAttendanceInputSchema,
  academicLevelEnum
} from './schema';

// Import handlers
import { getDashboardStats } from './handlers/dashboard';
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  bulkUploadStudents,
  getStudentsByClassId,
  promoteStudents
} from './handlers/students';
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getTeachers
} from './handlers/employees';
import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
  assignHomeroomTeacher,
  getClassesByAcademicLevel
} from './handlers/classes';
import {
  createAlumni,
  getAlumni,
  getAlumniById,
  updateAlumni,
  deleteAlumni,
  searchAlumniByYear,
  searchAlumniByName,
  migrateStudentToAlumni
} from './handlers/alumni';
import {
  createPermit,
  getPermits,
  getPermitById,
  reviewPermit,
  getPendingPermits,
  getPermitsByStudentId,
  getPermitHistory,
  deletePermit
} from './handlers/permits';
import {
  recordAttendance,
  getAttendanceByDate,
  getAttendanceByStudentId,
  getAttendanceByClassId,
  getDailyAttendanceStats,
  getMonthlyAttendanceReport,
  bulkRecordAttendance,
  updateAttendance
} from './handlers/attendance';
import { z } from 'zod';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Dashboard
  dashboard: router({
    getStats: publicProcedure
      .query(() => getDashboardStats()),
  }),

  // Students
  students: router({
    create: publicProcedure
      .input(createStudentInputSchema)
      .mutation(({ input }) => createStudent(input)),
    
    getAll: publicProcedure
      .input(studentSearchSchema.optional())
      .query(({ input }) => getStudents(input)),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getStudentById(input.id)),
    
    update: publicProcedure
      .input(updateStudentInputSchema)
      .mutation(({ input }) => updateStudent(input)),
    
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteStudent(input.id)),
    
    bulkUpload: publicProcedure
      .input(bulkStudentUploadSchema)
      .mutation(({ input }) => bulkUploadStudents(input)),
    
    getByClassId: publicProcedure
      .input(z.object({ classId: z.number() }))
      .query(({ input }) => getStudentsByClassId(input.classId)),
    
    promote: publicProcedure
      .input(z.object({ classId: z.number(), newAcademicLevel: academicLevelEnum }))
      .mutation(({ input }) => promoteStudents(input.classId, input.newAcademicLevel)),
  }),

  // Employees
  employees: router({
    create: publicProcedure
      .input(createEmployeeInputSchema)
      .mutation(({ input }) => createEmployee(input)),
    
    getAll: publicProcedure
      .input(employeeSearchSchema.optional())
      .query(({ input }) => getEmployees(input)),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getEmployeeById(input.id)),
    
    update: publicProcedure
      .input(updateEmployeeInputSchema)
      .mutation(({ input }) => updateEmployee(input)),
    
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteEmployee(input.id)),
    
    getTeachers: publicProcedure
      .query(() => getTeachers()),
  }),

  // Classes
  classes: router({
    create: publicProcedure
      .input(createClassInputSchema)
      .mutation(({ input }) => createClass(input)),
    
    getAll: publicProcedure
      .query(() => getClasses()),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getClassById(input.id)),
    
    update: publicProcedure
      .input(updateClassInputSchema)
      .mutation(({ input }) => updateClass(input)),
    
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteClass(input.id)),
    
    assignHomeroomTeacher: publicProcedure
      .input(z.object({ classId: z.number(), teacherId: z.number() }))
      .mutation(({ input }) => assignHomeroomTeacher(input.classId, input.teacherId)),
    
    getByAcademicLevel: publicProcedure
      .input(z.object({ level: academicLevelEnum }))
      .query(({ input }) => getClassesByAcademicLevel(input.level)),
  }),

  // Alumni
  alumni: router({
    create: publicProcedure
      .input(createAlumniInputSchema)
      .mutation(({ input }) => createAlumni(input)),
    
    getAll: publicProcedure
      .query(() => getAlumni()),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getAlumniById(input.id)),
    
    update: publicProcedure
      .input(updateAlumniInputSchema)
      .mutation(({ input }) => updateAlumni(input)),
    
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteAlumni(input.id)),
    
    searchByYear: publicProcedure
      .input(z.object({ graduationYear: z.number() }))
      .query(({ input }) => searchAlumniByYear(input.graduationYear)),
    
    searchByName: publicProcedure
      .input(z.object({ name: z.string() }))
      .query(({ input }) => searchAlumniByName(input.name)),
    
    migrateFromStudent: publicProcedure
      .input(z.object({ studentId: z.number() }))
      .mutation(({ input }) => migrateStudentToAlumni(input.studentId)),
  }),

  // Permits
  permits: router({
    create: publicProcedure
      .input(createPermitInputSchema)
      .mutation(({ input }) => createPermit(input)),
    
    getAll: publicProcedure
      .input(permitSearchSchema.optional())
      .query(({ input }) => getPermits(input)),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getPermitById(input.id)),
    
    review: publicProcedure
      .input(reviewPermitInputSchema)
      .mutation(({ input }) => reviewPermit(input)),
    
    getPending: publicProcedure
      .query(() => getPendingPermits()),
    
    getByStudentId: publicProcedure
      .input(z.object({ studentId: z.number() }))
      .query(({ input }) => getPermitsByStudentId(input.studentId)),
    
    getHistory: publicProcedure
      .input(z.object({ studentId: z.number() }))
      .query(({ input }) => getPermitHistory(input.studentId)),
    
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deletePermit(input.id)),
  }),

  // Attendance
  attendance: router({
    record: publicProcedure
      .input(recordAttendanceInputSchema)
      .mutation(({ input }) => recordAttendance(input)),
    
    getByDate: publicProcedure
      .input(z.object({ date: z.coerce.date() }))
      .query(({ input }) => getAttendanceByDate(input.date)),
    
    getByStudentId: publicProcedure
      .input(z.object({ 
        studentId: z.number(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional()
      }))
      .query(({ input }) => getAttendanceByStudentId(input.studentId, input.startDate, input.endDate)),
    
    getByClassId: publicProcedure
      .input(z.object({ classId: z.number(), date: z.coerce.date() }))
      .query(({ input }) => getAttendanceByClassId(input.classId, input.date)),
    
    getDailyStats: publicProcedure
      .input(z.object({ date: z.coerce.date() }))
      .query(({ input }) => getDailyAttendanceStats(input.date)),
    
    getMonthlyReport: publicProcedure
      .input(z.object({ studentId: z.number(), year: z.number(), month: z.number() }))
      .query(({ input }) => getMonthlyAttendanceReport(input.studentId, input.year, input.month)),
    
    bulkRecord: publicProcedure
      .input(z.array(recordAttendanceInputSchema))
      .mutation(({ input }) => bulkRecordAttendance(input)),
    
    update: publicProcedure
      .input(z.object({ 
        id: z.number(),
        status: z.enum(['present', 'absent', 'late', 'excused']),
        notes: z.string().optional()
      }))
      .mutation(({ input }) => updateAttendance(input.id, input.status, input.notes)),
  }),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();