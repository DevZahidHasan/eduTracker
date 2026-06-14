--
-- PostgreSQL database dump
--

\restrict dvCFqPkhxhT5gfyEa82yIJFHXWv0PW14ENeqSDhym7Ai1b48HSH9v8O7TQIhzXN

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AssetCondition; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AssetCondition" AS ENUM (
    'NEW',
    'GOOD',
    'FAIR',
    'POOR',
    'BROKEN'
);


ALTER TYPE public."AssetCondition" OWNER TO postgres;

--
-- Name: AssetStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AssetStatus" AS ENUM (
    'ACTIVE',
    'IN_REPAIR',
    'SCRAPPED',
    'DISPOSED',
    'LOST'
);


ALTER TYPE public."AssetStatus" OWNER TO postgres;

--
-- Name: AttendanceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AttendanceStatus" AS ENUM (
    'PRESENT',
    'ABSENT',
    'LATE',
    'EXCUSED'
);


ALTER TYPE public."AttendanceStatus" OWNER TO postgres;

--
-- Name: DayOfWeek; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DayOfWeek" AS ENUM (
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
);


ALTER TYPE public."DayOfWeek" OWNER TO postgres;

--
-- Name: Gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Gender" AS ENUM (
    'MALE',
    'FEMALE',
    'OTHER'
);


ALTER TYPE public."Gender" OWNER TO postgres;

--
-- Name: InquirySource; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InquirySource" AS ENUM (
    'WALK_IN',
    'PHONE',
    'WEBSITE',
    'FACEBOOK',
    'REFERENCE',
    'OTHER'
);


ALTER TYPE public."InquirySource" OWNER TO postgres;

--
-- Name: InquiryStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InquiryStatus" AS ENUM (
    'NEW',
    'CONTACTED',
    'INTERESTED',
    'NOT_INTERESTED',
    'ADMITTED',
    'REJECTED'
);


ALTER TYPE public."InquiryStatus" OWNER TO postgres;

--
-- Name: LeaveStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LeaveStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."LeaveStatus" OWNER TO postgres;

--
-- Name: QuestionPaperStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."QuestionPaperStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED'
);


ALTER TYPE public."QuestionPaperStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AcademicReport; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AcademicReport" (
    id integer NOT NULL,
    "studentId" integer NOT NULL,
    "examType" text NOT NULL,
    gpa double precision,
    "teacherRemarks" text,
    "aiInsights" text,
    "attendanceRate" double precision,
    "generatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AcademicReport" OWNER TO postgres;

--
-- Name: AcademicReport_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AcademicReport_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AcademicReport_id_seq" OWNER TO postgres;

--
-- Name: AcademicReport_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AcademicReport_id_seq" OWNED BY public."AcademicReport".id;


--
-- Name: Asset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Asset" (
    id integer NOT NULL,
    "assetId" text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    "purchaseDate" timestamp(3) without time zone,
    "purchaseCost" double precision,
    condition public."AssetCondition" DEFAULT 'NEW'::public."AssetCondition" NOT NULL,
    location text,
    status public."AssetStatus" DEFAULT 'ACTIVE'::public."AssetStatus" NOT NULL,
    "serialNumber" text,
    "warrantyExpiry" timestamp(3) without time zone,
    "nextMaintenanceDate" timestamp(3) without time zone,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Asset" OWNER TO postgres;

--
-- Name: AssetMaintenance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AssetMaintenance" (
    id integer NOT NULL,
    "assetId" integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description text NOT NULL,
    cost double precision DEFAULT 0 NOT NULL,
    "performedBy" text
);


ALTER TABLE public."AssetMaintenance" OWNER TO postgres;

--
-- Name: AssetMaintenance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AssetMaintenance_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AssetMaintenance_id_seq" OWNER TO postgres;

--
-- Name: AssetMaintenance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AssetMaintenance_id_seq" OWNED BY public."AssetMaintenance".id;


--
-- Name: Asset_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Asset_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Asset_id_seq" OWNER TO postgres;

--
-- Name: Asset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Asset_id_seq" OWNED BY public."Asset".id;


--
-- Name: Attendance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Attendance" (
    id integer NOT NULL,
    "studentId" integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status public."AttendanceStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Attendance" OWNER TO postgres;

--
-- Name: AttendanceLock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AttendanceLock" (
    id integer NOT NULL,
    "className" text NOT NULL,
    section text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "lockedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lockedBy" integer NOT NULL
);


ALTER TABLE public."AttendanceLock" OWNER TO postgres;

--
-- Name: AttendanceLock_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AttendanceLock_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AttendanceLock_id_seq" OWNER TO postgres;

--
-- Name: AttendanceLock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AttendanceLock_id_seq" OWNED BY public."AttendanceLock".id;


--
-- Name: Attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Attendance_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Attendance_id_seq" OWNER TO postgres;

--
-- Name: Attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Attendance_id_seq" OWNED BY public."Attendance".id;


--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuditLog" (
    id integer NOT NULL,
    action text NOT NULL,
    "entityType" text NOT NULL,
    "entityId" text NOT NULL,
    "oldValue" jsonb,
    "newValue" jsonb,
    "performedBy" integer NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AuditLog" OWNER TO postgres;

--
-- Name: AuditLog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AuditLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AuditLog_id_seq" OWNER TO postgres;

--
-- Name: AuditLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AuditLog_id_seq" OWNED BY public."AuditLog".id;


--
-- Name: BankQuestion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BankQuestion" (
    id text NOT NULL,
    "className" text NOT NULL,
    subject text NOT NULL,
    chapter text,
    "questionType" text NOT NULL,
    "questionText" text NOT NULL,
    marks integer NOT NULL,
    options text[],
    "correctAnswer" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."BankQuestion" OWNER TO postgres;

--
-- Name: Book; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Book" (
    id integer NOT NULL,
    isbn text,
    title text NOT NULL,
    author text NOT NULL,
    publisher text,
    category text NOT NULL,
    "totalCopies" integer DEFAULT 1 NOT NULL,
    "availableCopies" integer DEFAULT 1 NOT NULL,
    location text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Book" OWNER TO postgres;

--
-- Name: BookIssue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BookIssue" (
    id integer NOT NULL,
    "bookId" integer NOT NULL,
    "memberId" integer NOT NULL,
    "issueDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    "returnDate" timestamp(3) without time zone,
    status text DEFAULT 'ISSUED'::text NOT NULL,
    "fineAmount" double precision DEFAULT 0 NOT NULL,
    notes text
);


ALTER TABLE public."BookIssue" OWNER TO postgres;

--
-- Name: BookIssue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."BookIssue_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."BookIssue_id_seq" OWNER TO postgres;

--
-- Name: BookIssue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."BookIssue_id_seq" OWNED BY public."BookIssue".id;


--
-- Name: Book_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Book_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Book_id_seq" OWNER TO postgres;

--
-- Name: Book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Book_id_seq" OWNED BY public."Book".id;


--
-- Name: BusRoute; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BusRoute" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "vehicleId" integer,
    "driverId" integer,
    fare double precision DEFAULT 0 NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."BusRoute" OWNER TO postgres;

--
-- Name: BusRoute_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."BusRoute_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."BusRoute_id_seq" OWNER TO postgres;

--
-- Name: BusRoute_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."BusRoute_id_seq" OWNED BY public."BusRoute".id;


--
-- Name: BusStop; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BusStop" (
    id integer NOT NULL,
    "routeId" integer NOT NULL,
    name text NOT NULL,
    "pickupTime" text,
    "dropTime" text,
    fare double precision
);


ALTER TABLE public."BusStop" OWNER TO postgres;

--
-- Name: BusStop_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."BusStop_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."BusStop_id_seq" OWNER TO postgres;

--
-- Name: BusStop_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."BusStop_id_seq" OWNED BY public."BusStop".id;


--
-- Name: ClassSection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ClassSection" (
    id integer NOT NULL,
    "className" text NOT NULL,
    section text NOT NULL,
    "teacherId" integer
);


ALTER TABLE public."ClassSection" OWNER TO postgres;

--
-- Name: ClassSection_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ClassSection_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ClassSection_id_seq" OWNER TO postgres;

--
-- Name: ClassSection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ClassSection_id_seq" OWNED BY public."ClassSection".id;


--
-- Name: DocumentTemplate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DocumentTemplate" (
    id integer NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    config jsonb NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."DocumentTemplate" OWNER TO postgres;

--
-- Name: DocumentTemplate_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DocumentTemplate_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DocumentTemplate_id_seq" OWNER TO postgres;

--
-- Name: DocumentTemplate_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DocumentTemplate_id_seq" OWNED BY public."DocumentTemplate".id;


--
-- Name: Driver; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Driver" (
    id integer NOT NULL,
    "userId" integer,
    "licenseNumber" text NOT NULL,
    phone text,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "driverId" text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Driver" OWNER TO postgres;

--
-- Name: Driver_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Driver_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Driver_id_seq" OWNER TO postgres;

--
-- Name: Driver_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Driver_id_seq" OWNED BY public."Driver".id;


--
-- Name: ExamType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExamType" (
    name text NOT NULL,
    "baseMark" double precision DEFAULT 100 NOT NULL,
    "isFinal" boolean DEFAULT false NOT NULL,
    weightage double precision DEFAULT 100 NOT NULL,
    category text DEFAULT 'FINAL'::text,
    "termNumber" integer DEFAULT 1
);


ALTER TABLE public."ExamType" OWNER TO postgres;

--
-- Name: FeePayment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FeePayment" (
    id text NOT NULL,
    "voucherId" text NOT NULL,
    "studentId" integer NOT NULL,
    amount double precision NOT NULL,
    "paymentDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "paymentMethod" text NOT NULL,
    "transactionId" text,
    "receivedBy" integer NOT NULL
);


ALTER TABLE public."FeePayment" OWNER TO postgres;

--
-- Name: FeeStructure; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FeeStructure" (
    id integer NOT NULL,
    "className" text NOT NULL,
    "feeTypeId" integer NOT NULL,
    amount double precision NOT NULL
);


ALTER TABLE public."FeeStructure" OWNER TO postgres;

--
-- Name: FeeStructure_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."FeeStructure_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."FeeStructure_id_seq" OWNER TO postgres;

--
-- Name: FeeStructure_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."FeeStructure_id_seq" OWNED BY public."FeeStructure".id;


--
-- Name: FeeType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FeeType" (
    id integer NOT NULL,
    name text NOT NULL,
    "isMonthly" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."FeeType" OWNER TO postgres;

--
-- Name: FeeType_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."FeeType_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."FeeType_id_seq" OWNER TO postgres;

--
-- Name: FeeType_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."FeeType_id_seq" OWNED BY public."FeeType".id;


--
-- Name: FeeVoucher; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FeeVoucher" (
    id text NOT NULL,
    "studentId" integer NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    "totalAmount" double precision NOT NULL,
    "paidAmount" double precision DEFAULT 0 NOT NULL,
    status text DEFAULT 'UNPAID'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."FeeVoucher" OWNER TO postgres;

--
-- Name: FeeVoucherItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FeeVoucherItem" (
    id integer NOT NULL,
    "voucherId" text NOT NULL,
    "feeTypeId" integer NOT NULL,
    amount double precision NOT NULL
);


ALTER TABLE public."FeeVoucherItem" OWNER TO postgres;

--
-- Name: FeeVoucherItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."FeeVoucherItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."FeeVoucherItem_id_seq" OWNER TO postgres;

--
-- Name: FeeVoucherItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."FeeVoucherItem_id_seq" OWNED BY public."FeeVoucherItem".id;


--
-- Name: GradeScale; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GradeScale" (
    id integer NOT NULL,
    grade text NOT NULL,
    "minScore" double precision NOT NULL,
    "maxScore" double precision NOT NULL,
    points double precision NOT NULL
);


ALTER TABLE public."GradeScale" OWNER TO postgres;

--
-- Name: GradeScale_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."GradeScale_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GradeScale_id_seq" OWNER TO postgres;

--
-- Name: GradeScale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."GradeScale_id_seq" OWNED BY public."GradeScale".id;


--
-- Name: Inquiry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Inquiry" (
    id integer NOT NULL,
    "inquiryNumber" text NOT NULL,
    "studentName" text NOT NULL,
    "parentName" text NOT NULL,
    phone text NOT NULL,
    email text,
    "interestedGrade" text NOT NULL,
    "previousSchool" text,
    source public."InquirySource" DEFAULT 'OTHER'::public."InquirySource" NOT NULL,
    status public."InquiryStatus" DEFAULT 'NEW'::public."InquiryStatus" NOT NULL,
    notes text,
    "nextFollowUp" timestamp(3) without time zone,
    "assignedToId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Inquiry" OWNER TO postgres;

--
-- Name: Inquiry_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Inquiry_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Inquiry_id_seq" OWNER TO postgres;

--
-- Name: Inquiry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Inquiry_id_seq" OWNED BY public."Inquiry".id;


--
-- Name: LeaveRequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LeaveRequest" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    reason text NOT NULL,
    status public."LeaveStatus" DEFAULT 'PENDING'::public."LeaveStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LeaveRequest" OWNER TO postgres;

--
-- Name: LeaveRequest_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."LeaveRequest_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."LeaveRequest_id_seq" OWNER TO postgres;

--
-- Name: LeaveRequest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."LeaveRequest_id_seq" OWNED BY public."LeaveRequest".id;


--
-- Name: LibraryMember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LibraryMember" (
    id integer NOT NULL,
    "memberId" text NOT NULL,
    "studentId" integer,
    "userId" integer,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryMember" OWNER TO postgres;

--
-- Name: LibraryMember_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."LibraryMember_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."LibraryMember_id_seq" OWNER TO postgres;

--
-- Name: LibraryMember_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."LibraryMember_id_seq" OWNED BY public."LibraryMember".id;


--
-- Name: Mark; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Mark" (
    id integer NOT NULL,
    "studentId" integer NOT NULL,
    subject text NOT NULL,
    score double precision NOT NULL,
    "maxScore" double precision DEFAULT 100 NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "examType" text NOT NULL,
    year integer DEFAULT 2026 NOT NULL
);


ALTER TABLE public."Mark" OWNER TO postgres;

--
-- Name: MarkLock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MarkLock" (
    id integer NOT NULL,
    "className" text NOT NULL,
    subject text NOT NULL,
    "examType" text NOT NULL,
    "lockedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lockedBy" integer NOT NULL,
    year integer DEFAULT 2026 NOT NULL
);


ALTER TABLE public."MarkLock" OWNER TO postgres;

--
-- Name: MarkLock_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."MarkLock_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."MarkLock_id_seq" OWNER TO postgres;

--
-- Name: MarkLock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."MarkLock_id_seq" OWNED BY public."MarkLock".id;


--
-- Name: Mark_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Mark_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Mark_id_seq" OWNER TO postgres;

--
-- Name: Mark_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Mark_id_seq" OWNED BY public."Mark".id;


--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    link text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: Notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Notification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Notification_id_seq" OWNER TO postgres;

--
-- Name: Notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Notification_id_seq" OWNED BY public."Notification".id;


--
-- Name: PayrollRecord; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PayrollRecord" (
    id text NOT NULL,
    "userId" integer NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    "paymentDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text DEFAULT 'PAID'::text NOT NULL,
    allowances double precision DEFAULT 0 NOT NULL,
    "baseSalary" double precision NOT NULL,
    deductions double precision DEFAULT 0 NOT NULL,
    "netPay" double precision NOT NULL,
    "paymentMethod" text
);


ALTER TABLE public."PayrollRecord" OWNER TO postgres;

--
-- Name: Period; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Period" (
    id integer NOT NULL,
    "routineId" integer NOT NULL,
    "subjectId" text NOT NULL,
    "teacherId" integer NOT NULL,
    "startTime" text NOT NULL,
    "endTime" text NOT NULL,
    "periodNumber" integer
);


ALTER TABLE public."Period" OWNER TO postgres;

--
-- Name: Period_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Period_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Period_id_seq" OWNER TO postgres;

--
-- Name: Period_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Period_id_seq" OWNED BY public."Period".id;


--
-- Name: Question; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Question" (
    id text NOT NULL,
    "questionPaperId" text NOT NULL,
    "questionType" text NOT NULL,
    "questionText" text NOT NULL,
    marks integer NOT NULL,
    "order" integer NOT NULL,
    "correctAnswer" text,
    instructions text,
    options text[]
);


ALTER TABLE public."Question" OWNER TO postgres;

--
-- Name: QuestionPaper; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."QuestionPaper" (
    id text NOT NULL,
    title text NOT NULL,
    "className" text NOT NULL,
    section text,
    subject text NOT NULL,
    "examType" text NOT NULL,
    "totalMarks" integer NOT NULL,
    duration integer NOT NULL,
    "examDate" timestamp(3) without time zone,
    "createdBy" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    instructions text,
    status public."QuestionPaperStatus" DEFAULT 'DRAFT'::public."QuestionPaperStatus" NOT NULL,
    "isTemplate" boolean DEFAULT false NOT NULL,
    "templateId" text
);


ALTER TABLE public."QuestionPaper" OWNER TO postgres;

--
-- Name: RefreshToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RefreshToken" (
    id integer NOT NULL,
    token text NOT NULL,
    "userId" integer NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."RefreshToken" OWNER TO postgres;

--
-- Name: RefreshToken_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."RefreshToken_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RefreshToken_id_seq" OWNER TO postgres;

--
-- Name: RefreshToken_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."RefreshToken_id_seq" OWNED BY public."RefreshToken".id;


--
-- Name: Role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Role" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Role" OWNER TO postgres;

--
-- Name: Role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Role_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Role_id_seq" OWNER TO postgres;

--
-- Name: Role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Role_id_seq" OWNED BY public."Role".id;


--
-- Name: Routine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Routine" (
    id integer NOT NULL,
    "classSectionId" integer NOT NULL,
    "dayOfWeek" public."DayOfWeek" NOT NULL
);


ALTER TABLE public."Routine" OWNER TO postgres;

--
-- Name: Routine_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Routine_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Routine_id_seq" OWNER TO postgres;

--
-- Name: Routine_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Routine_id_seq" OWNED BY public."Routine".id;


--
-- Name: SchoolClass; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SchoolClass" (
    name text NOT NULL
);


ALTER TABLE public."SchoolClass" OWNER TO postgres;

--
-- Name: SchoolProfile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SchoolProfile" (
    id integer DEFAULT 1 NOT NULL,
    name text DEFAULT 'EduTrack Academy'::text NOT NULL,
    address text,
    phone text,
    email text,
    "academicYear" text DEFAULT '2026-2027'::text NOT NULL,
    logo text,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    website text,
    signature text
);


ALTER TABLE public."SchoolProfile" OWNER TO postgres;

--
-- Name: StaffAttendance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StaffAttendance" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    status public."AttendanceStatus" NOT NULL,
    remarks text
);


ALTER TABLE public."StaffAttendance" OWNER TO postgres;

--
-- Name: StaffAttendance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."StaffAttendance_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."StaffAttendance_id_seq" OWNER TO postgres;

--
-- Name: StaffAttendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."StaffAttendance_id_seq" OWNED BY public."StaffAttendance".id;


--
-- Name: StaffSalary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StaffSalary" (
    "userId" integer NOT NULL,
    "baseSalary" double precision NOT NULL,
    allowances double precision DEFAULT 0 NOT NULL,
    deductions double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public."StaffSalary" OWNER TO postgres;

--
-- Name: Student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Student" (
    id integer NOT NULL,
    "studentId" text NOT NULL,
    email text,
    "dateOfBirth" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    address text,
    "admissionDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "bloodGroup" text,
    "fullName" text NOT NULL,
    gender public."Gender" NOT NULL,
    "parentName" text,
    "parentPhone" text,
    phone text,
    "profileImage" text,
    "rollNumber" text NOT NULL,
    section text NOT NULL,
    "className" text NOT NULL,
    "busRouteId" integer,
    "busStopId" integer
);


ALTER TABLE public."Student" OWNER TO postgres;

--
-- Name: Student_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Student_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Student_id_seq" OWNER TO postgres;

--
-- Name: Student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Student_id_seq" OWNED BY public."Student".id;


--
-- Name: Subject; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Subject" (
    name text NOT NULL
);


ALTER TABLE public."Subject" OWNER TO postgres;

--
-- Name: SystemSetting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SystemSetting" (
    key text NOT NULL,
    value text NOT NULL
);


ALTER TABLE public."SystemSetting" OWNER TO postgres;

--
-- Name: TermResult; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TermResult" (
    id integer NOT NULL,
    "studentId" integer NOT NULL,
    "examType" text NOT NULL,
    "totalMarks" double precision NOT NULL,
    "obtainedMarks" double precision NOT NULL,
    percentage double precision NOT NULL,
    grade text,
    gpa double precision,
    "position" integer,
    "teacherRemarks" text,
    status text DEFAULT 'FINAL'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TermResult" OWNER TO postgres;

--
-- Name: TermResult_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TermResult_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TermResult_id_seq" OWNER TO postgres;

--
-- Name: TermResult_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TermResult_id_seq" OWNED BY public."TermResult".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    password text,
    name text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    address text,
    "canLogin" boolean DEFAULT true NOT NULL,
    nid text,
    phone text,
    "profileImage" text,
    role text DEFAULT 'TEACHER'::text NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: Vehicle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Vehicle" (
    id integer NOT NULL,
    "registrationNumber" text NOT NULL,
    make text,
    model text,
    capacity integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "insuranceExpiry" timestamp(3) without time zone,
    "nextServiceDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "vehicleId" text NOT NULL
);


ALTER TABLE public."Vehicle" OWNER TO postgres;

--
-- Name: VehicleMaintenance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VehicleMaintenance" (
    id integer NOT NULL,
    "vehicleId" integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description text NOT NULL,
    cost double precision DEFAULT 0 NOT NULL,
    type text DEFAULT 'SERVICE'::text NOT NULL,
    "reportedBy" text
);


ALTER TABLE public."VehicleMaintenance" OWNER TO postgres;

--
-- Name: VehicleMaintenance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."VehicleMaintenance_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."VehicleMaintenance_id_seq" OWNER TO postgres;

--
-- Name: VehicleMaintenance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."VehicleMaintenance_id_seq" OWNED BY public."VehicleMaintenance".id;


--
-- Name: Vehicle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Vehicle_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Vehicle_id_seq" OWNER TO postgres;

--
-- Name: Vehicle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Vehicle_id_seq" OWNED BY public."Vehicle".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: AcademicReport id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AcademicReport" ALTER COLUMN id SET DEFAULT nextval('public."AcademicReport_id_seq"'::regclass);


--
-- Name: Asset id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Asset" ALTER COLUMN id SET DEFAULT nextval('public."Asset_id_seq"'::regclass);


--
-- Name: AssetMaintenance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AssetMaintenance" ALTER COLUMN id SET DEFAULT nextval('public."AssetMaintenance_id_seq"'::regclass);


--
-- Name: Attendance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attendance" ALTER COLUMN id SET DEFAULT nextval('public."Attendance_id_seq"'::regclass);


--
-- Name: AttendanceLock id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AttendanceLock" ALTER COLUMN id SET DEFAULT nextval('public."AttendanceLock_id_seq"'::regclass);


--
-- Name: AuditLog id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog" ALTER COLUMN id SET DEFAULT nextval('public."AuditLog_id_seq"'::regclass);


--
-- Name: Book id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Book" ALTER COLUMN id SET DEFAULT nextval('public."Book_id_seq"'::regclass);


--
-- Name: BookIssue id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookIssue" ALTER COLUMN id SET DEFAULT nextval('public."BookIssue_id_seq"'::regclass);


--
-- Name: BusRoute id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BusRoute" ALTER COLUMN id SET DEFAULT nextval('public."BusRoute_id_seq"'::regclass);


--
-- Name: BusStop id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BusStop" ALTER COLUMN id SET DEFAULT nextval('public."BusStop_id_seq"'::regclass);


--
-- Name: ClassSection id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClassSection" ALTER COLUMN id SET DEFAULT nextval('public."ClassSection_id_seq"'::regclass);


--
-- Name: DocumentTemplate id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DocumentTemplate" ALTER COLUMN id SET DEFAULT nextval('public."DocumentTemplate_id_seq"'::regclass);


--
-- Name: Driver id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Driver" ALTER COLUMN id SET DEFAULT nextval('public."Driver_id_seq"'::regclass);


--
-- Name: FeeStructure id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeeStructure" ALTER COLUMN id SET DEFAULT nextval('public."FeeStructure_id_seq"'::regclass);


--
-- Name: FeeType id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeeType" ALTER COLUMN id SET DEFAULT nextval('public."FeeType_id_seq"'::regclass);


--
-- Name: FeeVoucherItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeeVoucherItem" ALTER COLUMN id SET DEFAULT nextval('public."FeeVoucherItem_id_seq"'::regclass);


--
-- Name: GradeScale id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GradeScale" ALTER COLUMN id SET DEFAULT nextval('public."GradeScale_id_seq"'::regclass);


--
-- Name: Inquiry id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Inquiry" ALTER COLUMN id SET DEFAULT nextval('public."Inquiry_id_seq"'::regclass);


--
-- Name: LeaveRequest id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LeaveRequest" ALTER COLUMN id SET DEFAULT nextval('public."LeaveRequest_id_seq"'::regclass);


--
-- Name: LibraryMember id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LibraryMember" ALTER COLUMN id SET DEFAULT nextval('public."LibraryMember_id_seq"'::regclass);


--
-- Name: Mark id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mark" ALTER COLUMN id SET DEFAULT nextval('public."Mark_id_seq"'::regclass);


--
-- Name: MarkLock id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MarkLock" ALTER COLUMN id SET DEFAULT nextval('public."MarkLock_id_seq"'::regclass);


--
-- Name: Notification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification" ALTER COLUMN id SET DEFAULT nextval('public."Notification_id_seq"'::regclass);


--
-- Name: Period id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Period" ALTER COLUMN id SET DEFAULT nextval('public."Period_id_seq"'::regclass);


--
-- Name: RefreshToken id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshToken" ALTER COLUMN id SET DEFAULT nextval('public."RefreshToken_id_seq"'::regclass);


--
-- Name: Role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role" ALTER COLUMN id SET DEFAULT nextval('public."Role_id_seq"'::regclass);


--
-- Name: Routine id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Routine" ALTER COLUMN id SET DEFAULT nextval('public."Routine_id_seq"'::regclass);


--
-- Name: StaffAttendance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StaffAttendance" ALTER COLUMN id SET DEFAULT nextval('public."StaffAttendance_id_seq"'::regclass);


--
-- Name: Student id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student" ALTER COLUMN id SET DEFAULT nextval('public."Student_id_seq"'::regclass);


--
-- Name: TermResult id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TermResult" ALTER COLUMN id SET DEFAULT nextval('public."TermResult_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: Vehicle id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vehicle" ALTER COLUMN id SET DEFAULT nextval('public."Vehicle_id_seq"'::regclass);


--
-- Name: VehicleMaintenance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VehicleMaintenance" ALTER COLUMN id SET DEFAULT nextval('public."VehicleMaintenance_id_seq"'::regclass);


--
-- Data for Name: AcademicReport; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AcademicReport" (id, "studentId", "examType", gpa, "teacherRemarks", "aiInsights", "attendanceRate", "generatedAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Asset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Asset" (id, "assetId", name, category, "purchaseDate", "purchaseCost", condition, location, status, "serialNumber", "warrantyExpiry", "nextMaintenanceDate", notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AssetMaintenance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AssetMaintenance" (id, "assetId", date, description, cost, "performedBy") FROM stdin;
\.


--
-- Data for Name: Attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Attendance" (id, "studentId", date, status, "createdAt", "updatedAt") FROM stdin;
1	108	2026-06-09 18:00:00	PRESENT	2026-06-10 20:43:53.053	2026-06-10 21:05:31.189
3	109	2026-06-09 18:00:00	PRESENT	2026-06-10 20:45:34.463	2026-06-10 21:05:31.19
4	110	2026-06-09 18:00:00	PRESENT	2026-06-10 20:45:34.464	2026-06-10 21:05:31.19
8	111	2026-06-09 18:00:00	PRESENT	2026-06-10 20:46:34.279	2026-06-10 21:05:31.191
13	112	2026-06-09 18:00:00	PRESENT	2026-06-10 20:47:18.379	2026-06-10 21:05:31.191
19	113	2026-06-09 18:00:00	PRESENT	2026-06-10 20:48:41.023	2026-06-10 21:05:31.192
26	114	2026-06-09 18:00:00	PRESENT	2026-06-10 20:49:16.685	2026-06-10 21:05:31.192
34	115	2026-06-09 18:00:00	PRESENT	2026-06-10 20:50:07.603	2026-06-10 21:05:31.193
43	116	2026-06-09 18:00:00	PRESENT	2026-06-10 20:52:03.37	2026-06-10 21:05:31.194
53	117	2026-06-09 18:00:00	PRESENT	2026-06-10 20:56:09.707	2026-06-10 21:05:31.194
64	118	2026-06-09 18:00:00	PRESENT	2026-06-10 20:56:47.926	2026-06-10 21:05:31.195
76	119	2026-06-09 18:00:00	PRESENT	2026-06-10 20:58:13.845	2026-06-10 21:05:31.195
89	120	2026-06-09 18:00:00	PRESENT	2026-06-10 20:58:54.856	2026-06-10 21:05:31.196
103	121	2026-06-09 18:00:00	PRESENT	2026-06-10 21:00:13.857	2026-06-10 21:05:31.196
118	122	2026-06-09 18:00:00	PRESENT	2026-06-10 21:01:55.167	2026-06-10 21:05:31.197
134	123	2026-06-09 18:00:00	PRESENT	2026-06-10 21:03:34.245	2026-06-10 21:05:31.197
151	124	2026-06-09 18:00:00	PRESENT	2026-06-10 21:04:22.307	2026-06-10 21:05:31.197
169	125	2026-06-09 18:00:00	PRESENT	2026-06-10 21:05:31.198	2026-06-10 21:05:31.198
170	20	2026-06-12 18:00:00	PRESENT	2026-06-13 09:58:01.318	2026-06-13 09:59:32.675
171	37	2026-06-12 18:00:00	PRESENT	2026-06-13 09:58:01.331	2026-06-13 09:59:32.676
172	75	2026-06-12 18:00:00	PRESENT	2026-06-13 09:58:01.332	2026-06-13 09:59:32.676
173	79	2026-06-12 18:00:00	PRESENT	2026-06-13 09:58:01.332	2026-06-13 09:59:32.676
174	104	2026-06-12 18:00:00	PRESENT	2026-06-13 09:58:01.333	2026-06-13 09:59:32.677
175	87	2026-06-12 18:00:00	PRESENT	2026-06-13 09:58:01.333	2026-06-13 09:59:32.677
176	88	2026-06-12 18:00:00	PRESENT	2026-06-13 09:58:01.334	2026-06-13 09:59:32.678
177	105	2026-06-12 18:00:00	PRESENT	2026-06-13 09:58:01.334	2026-06-13 09:59:32.678
178	106	2026-06-12 18:00:00	PRESENT	2026-06-13 09:58:01.334	2026-06-13 09:59:32.678
192	128	2026-06-12 18:00:00	PRESENT	2026-06-13 09:59:32.679	2026-06-13 09:59:32.679
179	102	2026-06-12 18:00:00	PRESENT	2026-06-13 09:58:01.335	2026-06-13 09:59:32.68
180	103	2026-06-12 18:00:00	PRESENT	2026-06-13 09:58:01.335	2026-06-13 09:59:32.68
181	126	2026-06-12 18:00:00	PRESENT	2026-06-13 09:58:01.336	2026-06-13 09:59:32.68
182	127	2026-06-12 18:00:00	PRESENT	2026-06-13 09:58:01.336	2026-06-13 09:59:32.681
197	20	2026-06-13 18:00:00	PRESENT	2026-06-14 17:30:30.02	2026-06-14 17:30:30.02
198	37	2026-06-13 18:00:00	PRESENT	2026-06-14 17:30:30.035	2026-06-14 17:30:30.035
199	75	2026-06-13 18:00:00	PRESENT	2026-06-14 17:30:30.036	2026-06-14 17:30:30.036
200	79	2026-06-13 18:00:00	PRESENT	2026-06-14 17:30:30.037	2026-06-14 17:30:30.037
201	104	2026-06-13 18:00:00	PRESENT	2026-06-14 17:30:30.038	2026-06-14 17:30:30.038
202	87	2026-06-13 18:00:00	PRESENT	2026-06-14 17:30:30.038	2026-06-14 17:30:30.038
203	88	2026-06-13 18:00:00	PRESENT	2026-06-14 17:30:30.039	2026-06-14 17:30:30.039
204	105	2026-06-13 18:00:00	PRESENT	2026-06-14 17:30:30.039	2026-06-14 17:30:30.039
205	106	2026-06-13 18:00:00	PRESENT	2026-06-14 17:30:30.04	2026-06-14 17:30:30.04
206	128	2026-06-13 18:00:00	PRESENT	2026-06-14 17:30:30.041	2026-06-14 17:30:30.041
207	102	2026-06-13 18:00:00	PRESENT	2026-06-14 17:30:30.041	2026-06-14 17:30:30.041
208	129	2026-06-13 18:00:00	PRESENT	2026-06-14 17:30:30.042	2026-06-14 17:30:30.042
209	103	2026-06-13 18:00:00	PRESENT	2026-06-14 17:30:30.042	2026-06-14 17:30:30.042
210	126	2026-06-13 18:00:00	PRESENT	2026-06-14 17:30:30.043	2026-06-14 17:30:30.043
211	127	2026-06-13 18:00:00	PRESENT	2026-06-14 17:30:30.044	2026-06-14 17:30:30.044
\.


--
-- Data for Name: AttendanceLock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AttendanceLock" (id, "className", section, date, "lockedAt", "lockedBy") FROM stdin;
1	CLASS_10	Z	2026-06-09 18:00:00	2026-06-10 20:43:53.062	1
2	CLASS_5	A	2026-06-12 18:00:00	2026-06-13 09:58:01.338	1
3	CLASS_5	A	2026-06-13 18:00:00	2026-06-14 17:30:30.047	1
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuditLog" (id, action, "entityType", "entityId", "oldValue", "newValue", "performedBy", "timestamp") FROM stdin;
1	CREATE	Student	101	\N	{"id": 101, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "A", "fullName": "Test Student", "busStopId": null, "className": "CLASS_1", "createdAt": "2026-06-07T08:30:15.472Z", "studentId": "STU-TEST-001", "updatedAt": "2026-06-07T08:30:15.472Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "99", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-07T08:30:15.472Z"}	1	2026-06-07 08:30:15.482
2	CREATE	Student	102	\N	{"id": 102, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "A", "fullName": "Test Student", "busStopId": null, "className": "CLASS_5", "createdAt": "2026-06-10T20:39:11.735Z", "studentId": "STU-951388", "updatedAt": "2026-06-10T20:39:11.735Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "951388", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:39:11.735Z"}	1	2026-06-10 20:39:11.769
3	CREATE	Student	103	\N	{"id": 103, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "A", "fullName": "Test Student", "busStopId": null, "className": "CLASS_5", "createdAt": "2026-06-10T20:39:55.499Z", "studentId": "STU-995164", "updatedAt": "2026-06-10T20:39:55.499Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "995164", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:39:55.499Z"}	1	2026-06-10 20:39:55.506
4	CREATE	Student	104	\N	{"id": 104, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "A", "fullName": "Test Student", "busStopId": null, "className": "CLASS_5", "createdAt": "2026-06-10T20:40:41.546Z", "studentId": "STU-041222", "updatedAt": "2026-06-10T20:40:41.546Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "041222", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:40:41.546Z"}	1	2026-06-10 20:40:41.551
5	UPDATE	Student	104	{"id": 104, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "A", "fullName": "Test Student", "busStopId": null, "className": "CLASS_5", "createdAt": "2026-06-10T20:40:41.546Z", "studentId": "STU-041222", "updatedAt": "2026-06-10T20:40:41.546Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "041222", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:40:41.546Z"}	{"id": 104, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "A", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_5", "createdAt": "2026-06-10T20:40:41.546Z", "studentId": "STU-041222", "updatedAt": "2026-06-10T20:40:41.569Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "041222", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:40:41.546Z"}	1	2026-06-10 20:40:41.579
6	CREATE	Student	105	\N	{"id": 105, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "A", "fullName": "Test Student", "busStopId": null, "className": "CLASS_5", "createdAt": "2026-06-10T20:41:34.494Z", "studentId": "STU-094203", "updatedAt": "2026-06-10T20:41:34.494Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "094203", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:41:34.494Z"}	1	2026-06-10 20:41:34.5
7	UPDATE	Student	105	{"id": 105, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "A", "fullName": "Test Student", "busStopId": null, "className": "CLASS_5", "createdAt": "2026-06-10T20:41:34.494Z", "studentId": "STU-094203", "updatedAt": "2026-06-10T20:41:34.494Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "094203", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:41:34.494Z"}	{"id": 105, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "A", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_5", "createdAt": "2026-06-10T20:41:34.494Z", "studentId": "STU-094203", "updatedAt": "2026-06-10T20:41:34.516Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "094203", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:41:34.494Z"}	1	2026-06-10 20:41:34.519
8	CREATE	Student	106	\N	{"id": 106, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "A", "fullName": "Test Student", "busStopId": null, "className": "CLASS_5", "createdAt": "2026-06-10T20:42:12.850Z", "studentId": "STU-132581", "updatedAt": "2026-06-10T20:42:12.850Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "132581", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:42:12.850Z"}	1	2026-06-10 20:42:12.858
9	UPDATE	Student	106	{"id": 106, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "A", "fullName": "Test Student", "busStopId": null, "className": "CLASS_5", "createdAt": "2026-06-10T20:42:12.850Z", "studentId": "STU-132581", "updatedAt": "2026-06-10T20:42:12.850Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "132581", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:42:12.850Z"}	{"id": 106, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "A", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_5", "createdAt": "2026-06-10T20:42:12.850Z", "studentId": "STU-132581", "updatedAt": "2026-06-10T20:42:12.873Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "132581", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:42:12.850Z"}	1	2026-06-10 20:42:12.875
10	CREATE	Student	108	\N	{"id": 108, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:43:53.014Z", "studentId": "STU-232732", "updatedAt": "2026-06-10T20:43:53.014Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "232732", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:43:53.014Z"}	1	2026-06-10 20:43:53.018
11	UPDATE	Student	108	{"id": 108, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:43:53.014Z", "studentId": "STU-232732", "updatedAt": "2026-06-10T20:43:53.014Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "232732", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:43:53.014Z"}	{"id": 108, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:43:53.014Z", "studentId": "STU-232732", "updatedAt": "2026-06-10T20:43:53.031Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "232732", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:43:53.014Z"}	1	2026-06-10 20:43:53.034
12	UPDATE	Attendance	BULK	\N	{"count": 1, "records": [{"date": "2026-06-10", "status": "PRESENT", "studentId": 108}]}	1	2026-06-10 20:43:53.066
26	UPDATE	MarkLock	CLASS_10-MATH-Term 1-2026	\N	{"id": 1, "year": 2026, "subject": "MATH", "examType": "Term 1", "lockedAt": "2026-06-10T20:47:18.414Z", "lockedBy": 1, "className": "CLASS_10"}	1	2026-06-10 20:47:18.417
13	CREATE	Student	109	\N	{"id": 109, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:44:40.043Z", "studentId": "STU-279770", "updatedAt": "2026-06-10T20:44:40.043Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "279770", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:44:40.043Z"}	1	2026-06-10 20:44:40.047
14	UPDATE	Student	109	{"id": 109, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:44:40.043Z", "studentId": "STU-279770", "updatedAt": "2026-06-10T20:44:40.043Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "279770", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:44:40.043Z"}	{"id": 109, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:44:40.043Z", "studentId": "STU-279770", "updatedAt": "2026-06-10T20:44:40.059Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "279770", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:44:40.043Z"}	1	2026-06-10 20:44:40.062
15	CREATE	Student	110	\N	{"id": 110, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:45:34.410Z", "studentId": "STU-334127", "updatedAt": "2026-06-10T20:45:34.410Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "334127", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:45:34.410Z"}	1	2026-06-10 20:45:34.417
16	UPDATE	Student	110	{"id": 110, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:45:34.410Z", "studentId": "STU-334127", "updatedAt": "2026-06-10T20:45:34.410Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "334127", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:45:34.410Z"}	{"id": 110, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:45:34.410Z", "studentId": "STU-334127", "updatedAt": "2026-06-10T20:45:34.434Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "334127", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:45:34.410Z"}	1	2026-06-10 20:45:34.436
17	UPDATE	Attendance	BULK	\N	{"count": 3, "records": [{"date": "2026-06-10", "status": "PRESENT", "studentId": 108}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 109}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 110}]}	1	2026-06-10 20:45:34.465
18	CREATE	Student	111	\N	{"id": 111, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:46:34.229Z", "studentId": "STU-393948", "updatedAt": "2026-06-10T20:46:34.229Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "393948", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:46:34.229Z"}	1	2026-06-10 20:46:34.234
19	UPDATE	Student	111	{"id": 111, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:46:34.229Z", "studentId": "STU-393948", "updatedAt": "2026-06-10T20:46:34.229Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "393948", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:46:34.229Z"}	{"id": 111, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:46:34.229Z", "studentId": "STU-393948", "updatedAt": "2026-06-10T20:46:34.245Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "393948", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:46:34.229Z"}	1	2026-06-10 20:46:34.247
20	UPDATE	Attendance	BULK	\N	{"count": 4, "records": [{"date": "2026-06-10", "status": "PRESENT", "studentId": 108}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 109}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 110}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 111}]}	1	2026-06-10 20:46:34.281
21	CREATE	Mark	1	\N	{"id": 1, "date": "2026-06-10T20:46:34.300Z", "year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "createdAt": "2026-06-10T20:46:34.308Z", "studentId": 111, "updatedAt": "2026-06-10T20:46:34.308Z"}	1	2026-06-10 20:46:34.32
22	CREATE	Student	112	\N	{"id": 112, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:47:18.329Z", "studentId": "STU-438054", "updatedAt": "2026-06-10T20:47:18.329Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "438054", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:47:18.329Z"}	1	2026-06-10 20:47:18.334
23	UPDATE	Student	112	{"id": 112, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:47:18.329Z", "studentId": "STU-438054", "updatedAt": "2026-06-10T20:47:18.329Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "438054", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:47:18.329Z"}	{"id": 112, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:47:18.329Z", "studentId": "STU-438054", "updatedAt": "2026-06-10T20:47:18.345Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "438054", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:47:18.329Z"}	1	2026-06-10 20:47:18.348
24	UPDATE	Attendance	BULK	\N	{"count": 5, "records": [{"date": "2026-06-10", "status": "PRESENT", "studentId": 108}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 109}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 110}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 111}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 112}]}	1	2026-06-10 20:47:18.381
25	CREATE	Mark	2	\N	{"id": 2, "date": "2026-06-10T20:47:18.401Z", "year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "createdAt": "2026-06-10T20:47:18.404Z", "studentId": 112, "updatedAt": "2026-06-10T20:47:18.404Z"}	1	2026-06-10 20:47:18.408
27	CREATE	Student	113	\N	{"id": 113, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:48:40.972Z", "studentId": "STU-520703", "updatedAt": "2026-06-10T20:48:40.972Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "520703", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:48:40.972Z"}	1	2026-06-10 20:48:40.976
28	UPDATE	Student	113	{"id": 113, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:48:40.972Z", "studentId": "STU-520703", "updatedAt": "2026-06-10T20:48:40.972Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "520703", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:48:40.972Z"}	{"id": 113, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:48:40.972Z", "studentId": "STU-520703", "updatedAt": "2026-06-10T20:48:40.989Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "520703", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:48:40.972Z"}	1	2026-06-10 20:48:40.991
29	UPDATE	Attendance	BULK	\N	{"count": 6, "records": [{"date": "2026-06-10", "status": "PRESENT", "studentId": 108}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 109}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 110}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 111}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 112}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 113}]}	1	2026-06-10 20:48:41.025
30	CREATE	Student	114	\N	{"id": 114, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:49:16.638Z", "studentId": "STU-556389", "updatedAt": "2026-06-10T20:49:16.638Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "556389", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:49:16.638Z"}	1	2026-06-10 20:49:16.645
31	UPDATE	Student	114	{"id": 114, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:49:16.638Z", "studentId": "STU-556389", "updatedAt": "2026-06-10T20:49:16.638Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "556389", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:49:16.638Z"}	{"id": 114, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:49:16.638Z", "studentId": "STU-556389", "updatedAt": "2026-06-10T20:49:16.656Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "556389", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:49:16.638Z"}	1	2026-06-10 20:49:16.658
32	UPDATE	Attendance	BULK	\N	{"count": 7, "records": [{"date": "2026-06-10", "status": "PRESENT", "studentId": 108}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 109}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 110}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 111}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 112}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 113}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 114}]}	1	2026-06-10 20:49:16.686
33	CREATE	Student	115	\N	{"id": 115, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:50:07.555Z", "studentId": "STU-607299", "updatedAt": "2026-06-10T20:50:07.555Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "607299", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:50:07.555Z"}	1	2026-06-10 20:50:07.559
34	UPDATE	Student	115	{"id": 115, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:50:07.555Z", "studentId": "STU-607299", "updatedAt": "2026-06-10T20:50:07.555Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "607299", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:50:07.555Z"}	{"id": 115, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:50:07.555Z", "studentId": "STU-607299", "updatedAt": "2026-06-10T20:50:07.575Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "607299", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:50:07.555Z"}	1	2026-06-10 20:50:07.576
35	UPDATE	Attendance	BULK	\N	{"count": 8, "records": [{"date": "2026-06-10", "status": "PRESENT", "studentId": 108}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 109}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 110}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 111}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 112}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 113}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 114}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 115}]}	1	2026-06-10 20:50:07.607
36	CREATE	Mark	4	\N	{"id": 4, "date": "2026-06-10T20:50:07.625Z", "year": 609325, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "createdAt": "2026-06-10T20:50:07.628Z", "studentId": 115, "updatedAt": "2026-06-10T20:50:07.628Z"}	1	2026-06-10 20:50:07.631
37	CREATE	Student	116	\N	{"id": 116, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:52:03.321Z", "studentId": "STU-723084", "updatedAt": "2026-06-10T20:52:03.321Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "723084", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:52:03.321Z"}	1	2026-06-10 20:52:03.33
50	CREATE	Mark	7	\N	{"id": 7, "date": "2026-06-10T20:56:47.953Z", "year": 2065, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "createdAt": "2026-06-10T20:56:47.957Z", "studentId": 118, "updatedAt": "2026-06-10T20:56:47.957Z"}	1	2026-06-10 20:56:47.96
51	UPDATE	MarkLock	CLASS_10-MATH-Term 1-2082	\N	{"id": 4, "year": 2082, "subject": "MATH", "examType": "Term 1", "lockedAt": "2026-06-10T20:56:47.967Z", "lockedBy": 1, "className": "CLASS_10"}	1	2026-06-10 20:56:47.968
38	UPDATE	Student	116	{"id": 116, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:52:03.321Z", "studentId": "STU-723084", "updatedAt": "2026-06-10T20:52:03.321Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "723084", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:52:03.321Z"}	{"id": 116, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:52:03.321Z", "studentId": "STU-723084", "updatedAt": "2026-06-10T20:52:03.340Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "723084", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:52:03.321Z"}	1	2026-06-10 20:52:03.342
39	UPDATE	Attendance	BULK	\N	{"count": 9, "records": [{"date": "2026-06-10", "status": "PRESENT", "studentId": 108}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 109}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 110}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 111}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 112}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 113}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 114}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 115}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 116}]}	1	2026-06-10 20:52:03.372
40	CREATE	Mark	5	\N	{"id": 5, "date": "2026-06-10T20:52:03.389Z", "year": 2053, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "createdAt": "2026-06-10T20:52:03.394Z", "studentId": 116, "updatedAt": "2026-06-10T20:52:03.394Z"}	1	2026-06-10 20:52:03.398
41	UPDATE	MarkLock	CLASS_10-MATH-Term 1-2070	\N	{"id": 2, "year": 2070, "subject": "MATH", "examType": "Term 1", "lockedAt": "2026-06-10T20:52:03.404Z", "lockedBy": 1, "className": "CLASS_10"}	1	2026-06-10 20:52:03.405
42	CREATE	Student	117	\N	{"id": 117, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:56:09.638Z", "studentId": "STU-969372", "updatedAt": "2026-06-10T20:56:09.638Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "969372", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:56:09.638Z"}	1	2026-06-10 20:56:09.645
43	UPDATE	Student	117	{"id": 117, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:56:09.638Z", "studentId": "STU-969372", "updatedAt": "2026-06-10T20:56:09.638Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "969372", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:56:09.638Z"}	{"id": 117, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:56:09.638Z", "studentId": "STU-969372", "updatedAt": "2026-06-10T20:56:09.666Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "969372", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:56:09.638Z"}	1	2026-06-10 20:56:09.668
44	UPDATE	Attendance	BULK	\N	{"count": 10, "records": [{"date": "2026-06-10", "status": "PRESENT", "studentId": 108}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 109}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 110}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 111}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 112}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 113}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 114}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 115}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 116}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 117}]}	1	2026-06-10 20:56:09.709
45	CREATE	Mark	6	\N	{"id": 6, "date": "2026-06-10T20:56:09.731Z", "year": 2064, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "createdAt": "2026-06-10T20:56:09.736Z", "studentId": 117, "updatedAt": "2026-06-10T20:56:09.736Z"}	1	2026-06-10 20:56:09.739
46	UPDATE	MarkLock	CLASS_10-MATH-Term 1-2081	\N	{"id": 3, "year": 2081, "subject": "MATH", "examType": "Term 1", "lockedAt": "2026-06-10T20:56:09.746Z", "lockedBy": 1, "className": "CLASS_10"}	1	2026-06-10 20:56:09.747
47	CREATE	Student	118	\N	{"id": 118, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:56:47.869Z", "studentId": "STU-007597", "updatedAt": "2026-06-10T20:56:47.869Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "007597", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:56:47.869Z"}	1	2026-06-10 20:56:47.873
48	UPDATE	Student	118	{"id": 118, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:56:47.869Z", "studentId": "STU-007597", "updatedAt": "2026-06-10T20:56:47.869Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "007597", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:56:47.869Z"}	{"id": 118, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:56:47.869Z", "studentId": "STU-007597", "updatedAt": "2026-06-10T20:56:47.885Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "007597", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:56:47.869Z"}	1	2026-06-10 20:56:47.887
49	UPDATE	Attendance	BULK	\N	{"count": 11, "records": [{"date": "2026-06-10", "status": "PRESENT", "studentId": 108}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 109}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 110}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 111}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 112}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 113}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 114}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 115}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 116}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 117}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 118}]}	1	2026-06-10 20:56:47.929
52	CREATE	Student	119	\N	{"id": 119, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:58:13.776Z", "studentId": "STU-093501", "updatedAt": "2026-06-10T20:58:13.776Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "093501", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:58:13.776Z"}	1	2026-06-10 20:58:13.78
53	UPDATE	Student	119	{"id": 119, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:58:13.776Z", "studentId": "STU-093501", "updatedAt": "2026-06-10T20:58:13.776Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "093501", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:58:13.776Z"}	{"id": 119, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:58:13.776Z", "studentId": "STU-093501", "updatedAt": "2026-06-10T20:58:13.793Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "093501", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:58:13.776Z"}	1	2026-06-10 20:58:13.795
54	UPDATE	Attendance	BULK	\N	{"count": 12, "records": [{"date": "2026-06-10", "status": "PRESENT", "studentId": 108}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 109}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 110}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 111}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 112}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 113}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 114}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 115}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 116}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 117}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 118}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 119}]}	1	2026-06-10 20:58:13.855
55	CREATE	Mark	8	\N	{"id": 8, "date": "2026-06-10T20:58:13.874Z", "year": 2028, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "createdAt": "2026-06-10T20:58:13.877Z", "studentId": 119, "updatedAt": "2026-06-10T20:58:13.877Z"}	1	2026-06-10 20:58:13.881
56	UPDATE	MarkLock	CLASS_10-MATH-Term 1-2043	\N	{"id": 5, "year": 2043, "subject": "MATH", "examType": "Term 1", "lockedAt": "2026-06-10T20:58:13.887Z", "lockedBy": 1, "className": "CLASS_10"}	1	2026-06-10 20:58:13.889
57	CREATE	Student	120	\N	{"id": 120, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:58:54.794Z", "studentId": "STU-134523", "updatedAt": "2026-06-10T20:58:54.794Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "134523", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:58:54.794Z"}	1	2026-06-10 20:58:54.798
58	UPDATE	Student	120	{"id": 120, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:58:54.794Z", "studentId": "STU-134523", "updatedAt": "2026-06-10T20:58:54.794Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "134523", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:58:54.794Z"}	{"id": 120, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T20:58:54.794Z", "studentId": "STU-134523", "updatedAt": "2026-06-10T20:58:54.812Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "134523", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T20:58:54.794Z"}	1	2026-06-10 20:58:54.814
59	UPDATE	Attendance	BULK	\N	{"count": 13, "records": [{"date": "2026-06-10", "status": "PRESENT", "studentId": 108}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 109}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 110}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 111}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 112}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 113}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 114}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 115}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 116}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 117}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 118}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 119}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 120}]}	1	2026-06-10 20:58:54.858
60	CREATE	Mark	9	\N	{"id": 9, "date": "2026-06-10T20:58:54.882Z", "year": 2084, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "createdAt": "2026-06-10T20:58:54.885Z", "studentId": 120, "updatedAt": "2026-06-10T20:58:54.885Z"}	1	2026-06-10 20:58:54.888
61	UPDATE	MarkLock	CLASS_10-MATH-Term 1-2030	\N	{"id": 6, "year": 2030, "subject": "MATH", "examType": "Term 1", "lockedAt": "2026-06-10T20:58:54.895Z", "lockedBy": 1, "className": "CLASS_10"}	1	2026-06-10 20:58:54.897
62	CREATE	Student	121	\N	{"id": 121, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T21:00:13.794Z", "studentId": "STU-213507", "updatedAt": "2026-06-10T21:00:13.794Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "213507", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T21:00:13.794Z"}	1	2026-06-10 21:00:13.799
63	UPDATE	Student	121	{"id": 121, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T21:00:13.794Z", "studentId": "STU-213507", "updatedAt": "2026-06-10T21:00:13.794Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "213507", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T21:00:13.794Z"}	{"id": 121, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T21:00:13.794Z", "studentId": "STU-213507", "updatedAt": "2026-06-10T21:00:13.817Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "213507", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T21:00:13.794Z"}	1	2026-06-10 21:00:13.819
64	UPDATE	Attendance	BULK	\N	{"count": 14, "records": [{"date": "2026-06-10", "status": "PRESENT", "studentId": 108}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 109}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 110}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 111}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 112}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 113}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 114}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 115}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 116}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 117}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 118}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 119}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 120}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 121}]}	1	2026-06-10 21:00:13.868
65	CREATE	Mark	10	\N	{"id": 10, "date": "2026-06-10T21:00:13.890Z", "year": 2064, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "createdAt": "2026-06-10T21:00:13.893Z", "studentId": 121, "updatedAt": "2026-06-10T21:00:13.893Z"}	1	2026-06-10 21:00:13.896
66	UPDATE	MarkLock	CLASS_10-MATH-Term 1-2078	\N	{"id": 7, "year": 2078, "subject": "MATH", "examType": "Term 1", "lockedAt": "2026-06-10T21:00:13.902Z", "lockedBy": 1, "className": "CLASS_10"}	1	2026-06-10 21:00:13.903
67	CREATE	Student	122	\N	{"id": 122, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T21:01:55.105Z", "studentId": "STU-314830", "updatedAt": "2026-06-10T21:01:55.105Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "314830", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T21:01:55.105Z"}	1	2026-06-10 21:01:55.109
68	UPDATE	Student	122	{"id": 122, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T21:01:55.105Z", "studentId": "STU-314830", "updatedAt": "2026-06-10T21:01:55.105Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "314830", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T21:01:55.105Z"}	{"id": 122, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T21:01:55.105Z", "studentId": "STU-314830", "updatedAt": "2026-06-10T21:01:55.121Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "314830", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T21:01:55.105Z"}	1	2026-06-10 21:01:55.123
69	UPDATE	Attendance	BULK	\N	{"count": 15, "records": [{"date": "2026-06-10", "status": "PRESENT", "studentId": 108}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 109}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 110}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 111}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 112}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 113}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 114}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 115}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 116}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 117}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 118}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 119}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 120}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 121}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 122}]}	1	2026-06-10 21:01:55.17
70	CREATE	Mark	11	\N	{"id": 11, "date": "2026-06-10T21:01:55.192Z", "year": 2075, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "createdAt": "2026-06-10T21:01:55.196Z", "studentId": 122, "updatedAt": "2026-06-10T21:01:55.196Z"}	1	2026-06-10 21:01:55.199
71	UPDATE	MarkLock	CLASS_10-MATH-Term 1-2021	\N	{"id": 8, "year": 2021, "subject": "MATH", "examType": "Term 1", "lockedAt": "2026-06-10T21:01:55.206Z", "lockedBy": 1, "className": "CLASS_10"}	1	2026-06-10 21:01:55.208
72	CREATE	Student	123	\N	{"id": 123, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T21:03:34.177Z", "studentId": "STU-413900", "updatedAt": "2026-06-10T21:03:34.177Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "413900", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T21:03:34.177Z"}	1	2026-06-10 21:03:34.182
73	UPDATE	Student	123	{"id": 123, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T21:03:34.177Z", "studentId": "STU-413900", "updatedAt": "2026-06-10T21:03:34.177Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "413900", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T21:03:34.177Z"}	{"id": 123, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T21:03:34.177Z", "studentId": "STU-413900", "updatedAt": "2026-06-10T21:03:34.195Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "413900", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T21:03:34.177Z"}	1	2026-06-10 21:03:34.198
74	UPDATE	Attendance	BULK	\N	{"count": 16, "records": [{"date": "2026-06-10", "status": "PRESENT", "studentId": 108}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 109}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 110}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 111}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 112}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 113}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 114}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 115}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 116}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 117}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 118}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 119}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 120}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 121}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 122}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 123}]}	1	2026-06-10 21:03:34.248
75	CREATE	Mark	12	\N	{"id": 12, "date": "2026-06-10T21:03:34.271Z", "year": 2036, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "createdAt": "2026-06-10T21:03:34.275Z", "studentId": 123, "updatedAt": "2026-06-10T21:03:34.275Z"}	1	2026-06-10 21:03:34.278
76	UPDATE	MarkLock	CLASS_10-MATH-Term 1-2050	\N	{"id": 9, "year": 2050, "subject": "MATH", "examType": "Term 1", "lockedAt": "2026-06-10T21:03:34.286Z", "lockedBy": 1, "className": "CLASS_10"}	1	2026-06-10 21:03:34.287
77	CREATE	Student	124	\N	{"id": 124, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T21:04:22.244Z", "studentId": "STU-461970", "updatedAt": "2026-06-10T21:04:22.244Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "461970", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T21:04:22.244Z"}	1	2026-06-10 21:04:22.249
78	UPDATE	Student	124	{"id": 124, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T21:04:22.244Z", "studentId": "STU-461970", "updatedAt": "2026-06-10T21:04:22.244Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "461970", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T21:04:22.244Z"}	{"id": 124, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T21:04:22.244Z", "studentId": "STU-461970", "updatedAt": "2026-06-10T21:04:22.262Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "461970", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T21:04:22.244Z"}	1	2026-06-10 21:04:22.265
79	UPDATE	Attendance	BULK	\N	{"count": 17, "records": [{"date": "2026-06-10", "status": "PRESENT", "studentId": 108}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 109}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 110}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 111}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 112}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 113}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 114}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 115}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 116}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 117}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 118}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 119}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 120}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 121}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 122}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 123}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 124}]}	1	2026-06-10 21:04:22.309
80	CREATE	Mark	13	\N	{"id": 13, "date": "2026-06-10T21:04:22.338Z", "year": 2079, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "createdAt": "2026-06-10T21:04:22.344Z", "studentId": 124, "updatedAt": "2026-06-10T21:04:22.344Z"}	1	2026-06-10 21:04:22.348
81	UPDATE	MarkLock	CLASS_10-MATH-Term 1-2029	\N	{"id": 10, "year": 2029, "subject": "MATH", "examType": "Term 1", "lockedAt": "2026-06-10T21:04:22.354Z", "lockedBy": 1, "className": "CLASS_10"}	1	2026-06-10 21:04:22.355
82	CREATE	Student	125	\N	{"id": 125, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T21:05:31.127Z", "studentId": "STU-530849", "updatedAt": "2026-06-10T21:05:31.127Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "530849", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T21:05:31.127Z"}	1	2026-06-10 21:05:31.132
83	UPDATE	Student	125	{"id": 125, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T21:05:31.127Z", "studentId": "STU-530849", "updatedAt": "2026-06-10T21:05:31.127Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "530849", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T21:05:31.127Z"}	{"id": 125, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "Z", "fullName": "Test Student Updated", "busStopId": null, "className": "CLASS_10", "createdAt": "2026-06-10T21:05:31.127Z", "studentId": "STU-530849", "updatedAt": "2026-06-10T21:05:31.151Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "530849", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-10T21:05:31.127Z"}	1	2026-06-10 21:05:31.154
84	UPDATE	Attendance	BULK	\N	{"count": 18, "records": [{"date": "2026-06-10", "status": "PRESENT", "studentId": 108}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 109}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 110}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 111}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 112}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 113}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 114}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 115}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 116}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 117}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 118}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 119}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 120}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 121}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 122}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 123}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 124}, {"date": "2026-06-10", "status": "PRESENT", "studentId": 125}]}	1	2026-06-10 21:05:31.207
85	CREATE	Mark	14	\N	{"id": 14, "date": "2026-06-10T21:05:31.230Z", "year": 2024, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "createdAt": "2026-06-10T21:05:31.233Z", "studentId": 125, "updatedAt": "2026-06-10T21:05:31.233Z"}	1	2026-06-10 21:05:31.237
86	UPDATE	MarkLock	CLASS_10-MATH-Term 1-2039	\N	{"id": 11, "year": 2039, "subject": "MATH", "examType": "Term 1", "lockedAt": "2026-06-10T21:05:31.244Z", "lockedBy": 1, "className": "CLASS_10"}	1	2026-06-10 21:05:31.245
87	CREATE	Student	126	\N	{"id": 126, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "A", "fullName": "Test Student", "busStopId": null, "className": "CLASS_5", "createdAt": "2026-06-13T09:55:50.611Z", "studentId": "STU-TEST-999", "updatedAt": "2026-06-13T09:55:50.611Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "999", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-13T09:55:50.611Z"}	1	2026-06-13 09:55:50.626
88	UPDATE	Mark	BULK	\N	{"count": 1, "records": [{"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 126}]}	1	2026-06-13 09:55:50.684
89	CREATE	Student	127	\N	{"id": 127, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "A", "fullName": "Test Student", "busStopId": null, "className": "CLASS_5", "createdAt": "2026-06-13T09:58:01.279Z", "studentId": "STU-UNIQUE-TEST-0001", "updatedAt": "2026-06-13T09:58:01.279Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "9999", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-13T09:58:01.279Z"}	1	2026-06-13 09:58:01.283
90	UPDATE	Attendance	BULK	\N	{"count": 13, "records": [{"date": "2026-06-13", "status": "PRESENT", "studentId": 20}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 37}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 75}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 79}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 104}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 87}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 88}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 105}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 106}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 102}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 103}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 126}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 127}]}	1	2026-06-13 09:58:01.339
91	UPDATE	Mark	BULK	\N	{"count": 13, "records": [{"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 20}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 37}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 75}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 79}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 104}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 87}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 88}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 105}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 106}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 102}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 103}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 126}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 127}]}	1	2026-06-13 09:58:01.398
92	CREATE	Student	128	\N	{"id": 128, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "A", "fullName": "Test Student", "busStopId": null, "className": "CLASS_5", "createdAt": "2026-06-13T09:59:32.631Z", "studentId": "STU-TEST-1781344772615", "updatedAt": "2026-06-13T09:59:32.631Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "2615", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-13T09:59:32.631Z"}	1	2026-06-13 09:59:32.635
93	UPDATE	Attendance	BULK	\N	{"count": 14, "records": [{"date": "2026-06-13", "status": "PRESENT", "studentId": 20}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 37}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 75}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 79}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 104}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 87}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 88}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 105}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 106}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 128}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 102}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 103}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 126}, {"date": "2026-06-13", "status": "PRESENT", "studentId": 127}]}	1	2026-06-13 09:59:32.683
94	UPDATE	Mark	BULK	\N	{"count": 14, "records": [{"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 20}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 37}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 75}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 79}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 104}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 87}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 88}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 105}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 106}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 128}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 102}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 103}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 126}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 127}]}	1	2026-06-13 09:59:32.742
95	CREATE	Student	129	\N	{"id": 129, "email": null, "phone": null, "gender": "MALE", "address": null, "section": "A", "fullName": "Test Student", "busStopId": null, "className": "CLASS_5", "createdAt": "2026-06-14T17:30:29.919Z", "studentId": "STU-TEST-1781458229839", "updatedAt": "2026-06-14T17:30:29.919Z", "bloodGroup": null, "busRouteId": null, "parentName": null, "rollNumber": "9839", "dateOfBirth": null, "parentPhone": null, "profileImage": null, "admissionDate": "2026-06-14T17:30:29.919Z"}	1	2026-06-14 17:30:29.941
96	UPDATE	Attendance	BULK	\N	{"count": 15, "records": [{"date": "2026-06-14", "status": "PRESENT", "studentId": 20}, {"date": "2026-06-14", "status": "PRESENT", "studentId": 37}, {"date": "2026-06-14", "status": "PRESENT", "studentId": 75}, {"date": "2026-06-14", "status": "PRESENT", "studentId": 79}, {"date": "2026-06-14", "status": "PRESENT", "studentId": 104}, {"date": "2026-06-14", "status": "PRESENT", "studentId": 87}, {"date": "2026-06-14", "status": "PRESENT", "studentId": 88}, {"date": "2026-06-14", "status": "PRESENT", "studentId": 105}, {"date": "2026-06-14", "status": "PRESENT", "studentId": 106}, {"date": "2026-06-14", "status": "PRESENT", "studentId": 128}, {"date": "2026-06-14", "status": "PRESENT", "studentId": 102}, {"date": "2026-06-14", "status": "PRESENT", "studentId": 129}, {"date": "2026-06-14", "status": "PRESENT", "studentId": 103}, {"date": "2026-06-14", "status": "PRESENT", "studentId": 126}, {"date": "2026-06-14", "status": "PRESENT", "studentId": 127}]}	1	2026-06-14 17:30:30.051
97	UPDATE	Mark	BULK	\N	{"count": 15, "records": [{"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 20}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 37}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 75}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 79}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 104}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 87}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 88}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 105}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 106}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 128}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 102}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 129}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 103}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 126}, {"year": 2026, "score": 85, "subject": "MATH", "examType": "Term 1", "maxScore": 100, "studentId": 127}]}	1	2026-06-14 17:30:30.168
\.


--
-- Data for Name: BankQuestion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BankQuestion" (id, "className", subject, chapter, "questionType", "questionText", marks, options, "correctAnswer", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Book; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Book" (id, isbn, title, author, publisher, category, "totalCopies", "availableCopies", location, "createdAt", "updatedAt") FROM stdin;
1	ISBN-134523	Test Book	Test Author	\N	General	5	5	\N	2026-06-10 20:58:55.849	2026-06-10 20:58:55.849
2	ISBN-213507	Test Book	Test Author	\N	General	5	5	\N	2026-06-10 21:00:14.934	2026-06-10 21:00:14.934
3	ISBN-314830	Test Book	Test Author	\N	General	5	5	\N	2026-06-10 21:01:56.163	2026-06-10 21:01:56.196
4	ISBN-413900	Test Book	Test Author	\N	General	5	5	\N	2026-06-10 21:03:35.25	2026-06-10 21:03:35.278
5	ISBN-461970	Test Book	Test Author	\N	General	5	5	\N	2026-06-10 21:04:23.307	2026-06-10 21:04:23.334
6	ISBN-530849	Test Book	Test Author	\N	General	5	5	\N	2026-06-10 21:05:32.232	2026-06-10 21:05:32.262
\.


--
-- Data for Name: BookIssue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BookIssue" (id, "bookId", "memberId", "issueDate", "dueDate", "returnDate", status, "fineAmount", notes) FROM stdin;
1	3	1	2026-06-10 21:01:56.183	2026-06-17 21:01:56.176	2026-06-10 21:01:56.194	RETURNED	0	\N
2	4	2	2026-06-10 21:03:35.268	2026-06-17 21:03:35.262	2026-06-10 21:03:35.277	RETURNED	0	\N
3	5	3	2026-06-10 21:04:23.323	2026-06-17 21:04:23.317	2026-06-10 21:04:23.333	RETURNED	0	\N
4	6	4	2026-06-10 21:05:32.251	2026-06-17 21:05:32.243	2026-06-10 21:05:32.26	RETURNED	0	\N
\.


--
-- Data for Name: BusRoute; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BusRoute" (id, name, description, "vehicleId", "driverId", fare, status, "createdAt", "updatedAt") FROM stdin;
1	Route 413900	\N	\N	\N	1000	ACTIVE	2026-06-10 21:03:35.284	2026-06-10 21:03:35.284
2	Route 461970	\N	\N	\N	1000	ACTIVE	2026-06-10 21:04:23.341	2026-06-10 21:04:23.341
3	Route 530849	\N	\N	\N	1000	ACTIVE	2026-06-10 21:05:32.268	2026-06-10 21:05:32.268
\.


--
-- Data for Name: BusStop; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BusStop" (id, "routeId", name, "pickupTime", "dropTime", fare) FROM stdin;
1	1	Stop A	\N	\N	\N
2	1	Stop B	\N	\N	\N
3	2	Stop A	\N	\N	\N
4	2	Stop B	\N	\N	\N
5	3	Stop A	\N	\N	\N
6	3	Stop B	\N	\N	\N
\.


--
-- Data for Name: ClassSection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ClassSection" (id, "className", section, "teacherId") FROM stdin;
1	CLASS_1	A	\N
2	CLASS_1	B	\N
3	CLASS_2	A	\N
4	CLASS_2	B	\N
5	CLASS_3	A	\N
6	CLASS_3	B	\N
7	CLASS_4	A	\N
8	CLASS_4	B	\N
9	CLASS_5	A	\N
10	CLASS_5	B	\N
11	CLASS_6	A	\N
12	CLASS_6	B	\N
13	CLASS_7	A	\N
14	CLASS_7	B	\N
15	CLASS_8	A	\N
16	CLASS_8	B	\N
17	CLASS_9	A	\N
18	CLASS_9	B	\N
19	CLASS_10	A	\N
20	CLASS_10	B	\N
21	CLASS_10	Z	\N
22	CLASS_6	C	\N
23	CLASS_6	D	\N
24	CLASS_7	C	\N
25	CLASS_7	D	\N
26	CLASS_8	C	\N
27	CLASS_8	D	\N
28	CLASS_9	C	\N
29	CLASS_9	D	\N
30	CLASS_10	C	\N
31	CLASS_10	D	\N
\.


--
-- Data for Name: DocumentTemplate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DocumentTemplate" (id, name, type, config, "isDefault", "createdAt", "updatedAt") FROM stdin;
1	Classic Blue	ID_CARD	{"layout": "portrait", "textColor": "#1e293b", "primaryColor": "#1e40af", "secondaryColor": "#ffffff", "showExpiryDate": true, "showSchoolPhone": true, "showSchoolAddress": true}	t	2026-06-07 08:28:55.525	2026-06-07 08:28:55.525
2	Modern Dark	ID_CARD	{"layout": "landscape", "textColor": "#334155", "primaryColor": "#0f172a", "secondaryColor": "#f8fafc", "showExpiryDate": true, "showSchoolPhone": false, "showSchoolAddress": true}	f	2026-06-07 08:28:55.529	2026-06-07 08:28:55.529
3	Emerald Professional	ID_CARD	{"layout": "portrait", "textColor": "#064e3b", "primaryColor": "#059669", "secondaryColor": "#ecfdf5", "showExpiryDate": false, "showSchoolPhone": true, "showSchoolAddress": true}	f	2026-06-07 08:28:55.53	2026-06-07 08:28:55.53
4	Sunset Minimal	ID_CARD	{"layout": "portrait", "textColor": "#431407", "primaryColor": "#ea580c", "secondaryColor": "#fff7ed", "showExpiryDate": true, "showSchoolPhone": false, "showSchoolAddress": false}	f	2026-06-07 08:28:55.531	2026-06-07 08:28:55.531
5	Royal Purple	ID_CARD	{"layout": "landscape", "textColor": "#1e1b4b", "primaryColor": "#7c3aed", "secondaryColor": "#f5f3ff", "showExpiryDate": true, "showSchoolPhone": true, "showSchoolAddress": true}	f	2026-06-07 08:28:55.532	2026-06-07 08:28:55.532
6	Formal Gold	CHARACTER_CERTIFICATE	{"titleFont": "Georgia", "borderStyle": "double", "primaryColor": "#b45309"}	t	2026-06-07 08:28:55.532	2026-06-07 08:28:55.532
7	Modern Clean	CHARACTER_CERTIFICATE	{"titleFont": "Arial", "borderStyle": "solid", "primaryColor": "#2563eb"}	f	2026-06-07 08:28:55.533	2026-06-07 08:28:55.533
8	Elegant Silver	CHARACTER_CERTIFICATE	{"titleFont": "Courier New", "borderStyle": "dashed", "primaryColor": "#475569"}	f	2026-06-07 08:28:55.534	2026-06-07 08:28:55.534
9	Royal Blue	CHARACTER_CERTIFICATE	{"titleFont": "Verdana", "borderStyle": "double", "primaryColor": "#1e3a8a"}	f	2026-06-07 08:28:55.534	2026-06-07 08:28:55.534
10	Traditional Green	CHARACTER_CERTIFICATE	{"titleFont": "Times New Roman", "borderStyle": "solid", "primaryColor": "#15803d"}	f	2026-06-07 08:28:55.535	2026-06-07 08:28:55.535
11	Vintage Script	LEAVING_CERTIFICATE	{"titleFont": "Times New Roman", "borderStyle": "double", "primaryColor": "#78350f"}	t	2026-06-07 08:28:55.535	2026-06-07 08:28:55.535
12	Corporate Blue	LEAVING_CERTIFICATE	{"titleFont": "Verdana", "borderStyle": "solid", "primaryColor": "#1e3a8a"}	f	2026-06-07 08:28:55.536	2026-06-07 08:28:55.536
13	Simple Professional	LEAVING_CERTIFICATE	{"titleFont": "Arial", "borderStyle": "solid", "primaryColor": "#334155"}	f	2026-06-07 08:28:55.537	2026-06-07 08:28:55.537
14	Academic Red	LEAVING_CERTIFICATE	{"titleFont": "Georgia", "borderStyle": "double", "primaryColor": "#b91c1c"}	f	2026-06-07 08:28:55.537	2026-06-07 08:28:55.537
15	Classic Slate	LEAVING_CERTIFICATE	{"titleFont": "Courier New", "borderStyle": "dashed", "primaryColor": "#475569"}	f	2026-06-07 08:28:55.538	2026-06-07 08:28:55.538
\.


--
-- Data for Name: Driver; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Driver" (id, "userId", "licenseNumber", phone, status, "createdAt", "updatedAt", "driverId", name) FROM stdin;
\.


--
-- Data for Name: ExamType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ExamType" (name, "baseMark", "isFinal", weightage, category, "termNumber") FROM stdin;
T1 Tutorial	20	f	20	TUTORIAL	1
Term 1	100	t	80	FINAL	1
T2 Tutorial	20	f	20	TUTORIAL	2
Term 2	100	t	80	FINAL	2
T3 Tutorial	20	f	20	TUTORIAL	3
Term 3	100	t	80	FINAL	3
CLASS_TEST	100	f	100	FINAL	1
MONTHLY_EXAM	100	f	100	FINAL	1
MID_TERM	100	f	100	FINAL	1
FINAL_EXAM	100	f	100	FINAL	1
T1_TUTORIAL	30	f	30	TUTORIAL	1
T1_FINAL	70	f	70	FINAL	1
T2_TUTORIAL	30	f	30	TUTORIAL	2
T2_FINAL	70	f	70	FINAL	2
T3_TUTORIAL	30	f	30	TUTORIAL	3
T3_FINAL	70	f	70	FINAL	3
\.


--
-- Data for Name: FeePayment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FeePayment" (id, "voucherId", "studentId", amount, "paymentDate", "paymentMethod", "transactionId", "receivedBy") FROM stdin;
2904d868-146e-4105-a89b-9146cb745479	c00eb5b2-953a-4af8-8077-18edda327df8	117	5000	2026-06-10 20:56:09.908	CASH	\N	1
037efde6-1638-4ae9-aeb7-932f89363142	1a32d3cb-46da-4e44-b00c-fcd4d7e304a7	118	5000	2026-06-10 20:56:48.087	CASH	\N	1
b2307e17-8b7b-4cdb-9ba4-d2b234e1460a	25955494-9742-4829-94da-9ea9eba54ad2	119	5000	2026-06-10 20:58:14.005	CASH	\N	1
1833ec32-c50e-4cc4-8f16-bae2b8abf939	f40e1d66-e29e-4cbe-b7a6-3e39ef58ac16	120	5000	2026-06-10 20:58:55.02	CASH	\N	1
f4f43f9b-fd7e-4c4d-8453-e2fc17f7375a	fdc5b52c-47ff-40c6-9a44-48cab6411a2f	121	5000	2026-06-10 21:00:14.025	CASH	\N	1
146aa277-f6c7-49ab-8331-8a81dedd3a2c	b3b21fc4-875f-4480-8ca4-b9edbd61ce97	122	5000	2026-06-10 21:01:55.338	CASH	\N	1
0fa6c401-9060-48fc-860e-df23408f1bf1	ef37a668-ece7-47e3-811c-491416b4a413	123	5000	2026-06-10 21:03:34.422	CASH	\N	1
113d7a92-ebb2-481a-b3cc-bf029f95d11b	50ad6140-5585-434a-90a8-ca37f35fd013	124	5000	2026-06-10 21:04:22.481	CASH	\N	1
4dbcbf1c-a13e-4c8f-8b45-c8de8a11e971	ba027b58-f00b-4919-84b7-27857f913321	125	5000	2026-06-10 21:05:31.384	CASH	\N	1
\.


--
-- Data for Name: FeeStructure; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FeeStructure" (id, "className", "feeTypeId", amount) FROM stdin;
1	CLASS_10	1	5000
2	CLASS_10	3	5000
3	CLASS_10	4	5000
4	CLASS_10	5	5000
5	CLASS_10	6	5000
6	CLASS_10	7	5000
7	CLASS_10	8	5000
8	CLASS_10	9	5000
9	CLASS_10	10	5000
\.


--
-- Data for Name: FeeType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FeeType" (id, name, "isMonthly", "createdAt", "updatedAt") FROM stdin;
1	Monthly Fee 969372	t	2026-06-10 20:56:09.775	2026-06-10 20:56:09.775
2	Transport Fee	t	2026-06-10 20:56:09.813	2026-06-10 20:56:09.813
3	Monthly Fee 007597	t	2026-06-10 20:56:47.995	2026-06-10 20:56:47.995
4	Monthly Fee 093501	t	2026-06-10 20:58:13.912	2026-06-10 20:58:13.912
5	Monthly Fee 134523	t	2026-06-10 20:58:54.923	2026-06-10 20:58:54.923
6	Monthly Fee 213507	t	2026-06-10 21:00:13.932	2026-06-10 21:00:13.932
7	Monthly Fee 314830	t	2026-06-10 21:01:55.238	2026-06-10 21:01:55.238
8	Monthly Fee 413900	t	2026-06-10 21:03:34.313	2026-06-10 21:03:34.313
9	Monthly Fee 461970	t	2026-06-10 21:04:22.386	2026-06-10 21:04:22.386
10	Monthly Fee 530849	t	2026-06-10 21:05:31.279	2026-06-10 21:05:31.279
\.


--
-- Data for Name: FeeVoucher; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FeeVoucher" (id, "studentId", month, year, "dueDate", "totalAmount", "paidAmount", status, "createdAt", "updatedAt") FROM stdin;
4500427b-369e-43a5-9fec-f57364441a29	9	6	2026	2026-06-30 00:00:00	5000	0	UNPAID	2026-06-10 20:56:09.829	2026-06-10 20:56:09.829
9f15ed79-31b1-43a6-841f-c9d238bdfeba	15	6	2026	2026-06-30 00:00:00	5000	0	UNPAID	2026-06-10 20:56:09.835	2026-06-10 20:56:09.835
d2dbd7f5-cd9c-4050-b311-941386451af8	72	6	2026	2026-06-30 00:00:00	5000	0	UNPAID	2026-06-10 20:56:09.837	2026-06-10 20:56:09.837
e6b15a99-3797-4141-aa1e-23db1aedc801	93	6	2026	2026-06-30 00:00:00	5000	0	UNPAID	2026-06-10 20:56:09.839	2026-06-10 20:56:09.839
5f260948-76a1-4c30-9bc9-2f260c4870b8	94	6	2026	2026-06-30 00:00:00	5000	0	UNPAID	2026-06-10 20:56:09.841	2026-06-10 20:56:09.841
f654f03b-3600-4656-8889-72d6d4de5cff	108	6	2026	2026-06-30 00:00:00	5000	0	UNPAID	2026-06-10 20:56:09.843	2026-06-10 20:56:09.843
69402bbb-0749-4fe7-8fd2-b7cb2e74a843	109	6	2026	2026-06-30 00:00:00	5000	0	UNPAID	2026-06-10 20:56:09.845	2026-06-10 20:56:09.845
137060c9-20d2-4f80-a7b6-3bfd30cc8c66	110	6	2026	2026-06-30 00:00:00	5000	0	UNPAID	2026-06-10 20:56:09.847	2026-06-10 20:56:09.847
aa410d48-60d0-4b76-bef4-8c5cbd6cd7a0	111	6	2026	2026-06-30 00:00:00	5000	0	UNPAID	2026-06-10 20:56:09.848	2026-06-10 20:56:09.848
04ca4a68-3926-4b8b-85da-b141949e659a	112	6	2026	2026-06-30 00:00:00	5000	0	UNPAID	2026-06-10 20:56:09.85	2026-06-10 20:56:09.85
a955578d-f962-4700-87e3-689d4d4b6bee	113	6	2026	2026-06-30 00:00:00	5000	0	UNPAID	2026-06-10 20:56:09.851	2026-06-10 20:56:09.851
e345efa0-bbfa-40f8-a9bd-55e9cfea15e1	114	6	2026	2026-06-30 00:00:00	5000	0	UNPAID	2026-06-10 20:56:09.853	2026-06-10 20:56:09.853
f4976d1d-a1b9-4524-9611-c3b5cee8fd30	115	6	2026	2026-06-30 00:00:00	5000	0	UNPAID	2026-06-10 20:56:09.854	2026-06-10 20:56:09.854
4a813acc-aebb-4f78-a026-d24dfb6407d6	116	6	2026	2026-06-30 00:00:00	5000	0	UNPAID	2026-06-10 20:56:09.856	2026-06-10 20:56:09.856
c00eb5b2-953a-4af8-8077-18edda327df8	117	6	2026	2026-06-30 00:00:00	5000	5000	PAID	2026-06-10 20:56:09.857	2026-06-10 20:56:09.91
1a32d3cb-46da-4e44-b00c-fcd4d7e304a7	118	6	2026	2026-06-30 00:00:00	10000	5000	PARTIAL	2026-06-10 20:56:48.039	2026-06-10 20:56:48.088
25955494-9742-4829-94da-9ea9eba54ad2	119	6	2026	2026-06-30 00:00:00	15000	5000	PARTIAL	2026-06-10 20:58:13.958	2026-06-10 20:58:14.007
f40e1d66-e29e-4cbe-b7a6-3e39ef58ac16	120	6	2026	2026-06-30 00:00:00	20000	5000	PARTIAL	2026-06-10 20:58:54.973	2026-06-10 20:58:55.021
fdc5b52c-47ff-40c6-9a44-48cab6411a2f	121	6	2026	2026-06-30 00:00:00	25000	5000	PARTIAL	2026-06-10 21:00:13.976	2026-06-10 21:00:14.026
b3b21fc4-875f-4480-8ca4-b9edbd61ce97	122	6	2026	2026-06-30 00:00:00	30000	5000	PARTIAL	2026-06-10 21:01:55.289	2026-06-10 21:01:55.34
ef37a668-ece7-47e3-811c-491416b4a413	123	6	2026	2026-06-30 00:00:00	35000	5000	PARTIAL	2026-06-10 21:03:34.371	2026-06-10 21:03:34.424
50ad6140-5585-434a-90a8-ca37f35fd013	124	6	2026	2026-06-30 00:00:00	40000	5000	PARTIAL	2026-06-10 21:04:22.433	2026-06-10 21:04:22.482
ba027b58-f00b-4919-84b7-27857f913321	125	6	2026	2026-06-30 00:00:00	45000	5000	PARTIAL	2026-06-10 21:05:31.334	2026-06-10 21:05:31.385
\.


--
-- Data for Name: FeeVoucherItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FeeVoucherItem" (id, "voucherId", "feeTypeId", amount) FROM stdin;
1	4500427b-369e-43a5-9fec-f57364441a29	1	5000
2	9f15ed79-31b1-43a6-841f-c9d238bdfeba	1	5000
3	d2dbd7f5-cd9c-4050-b311-941386451af8	1	5000
4	e6b15a99-3797-4141-aa1e-23db1aedc801	1	5000
5	5f260948-76a1-4c30-9bc9-2f260c4870b8	1	5000
6	f654f03b-3600-4656-8889-72d6d4de5cff	1	5000
7	69402bbb-0749-4fe7-8fd2-b7cb2e74a843	1	5000
8	137060c9-20d2-4f80-a7b6-3bfd30cc8c66	1	5000
9	aa410d48-60d0-4b76-bef4-8c5cbd6cd7a0	1	5000
10	04ca4a68-3926-4b8b-85da-b141949e659a	1	5000
11	a955578d-f962-4700-87e3-689d4d4b6bee	1	5000
12	e345efa0-bbfa-40f8-a9bd-55e9cfea15e1	1	5000
13	f4976d1d-a1b9-4524-9611-c3b5cee8fd30	1	5000
14	4a813acc-aebb-4f78-a026-d24dfb6407d6	1	5000
15	c00eb5b2-953a-4af8-8077-18edda327df8	1	5000
16	1a32d3cb-46da-4e44-b00c-fcd4d7e304a7	1	5000
17	1a32d3cb-46da-4e44-b00c-fcd4d7e304a7	3	5000
18	25955494-9742-4829-94da-9ea9eba54ad2	1	5000
19	25955494-9742-4829-94da-9ea9eba54ad2	3	5000
20	25955494-9742-4829-94da-9ea9eba54ad2	4	5000
21	f40e1d66-e29e-4cbe-b7a6-3e39ef58ac16	1	5000
22	f40e1d66-e29e-4cbe-b7a6-3e39ef58ac16	3	5000
23	f40e1d66-e29e-4cbe-b7a6-3e39ef58ac16	4	5000
24	f40e1d66-e29e-4cbe-b7a6-3e39ef58ac16	5	5000
25	fdc5b52c-47ff-40c6-9a44-48cab6411a2f	1	5000
26	fdc5b52c-47ff-40c6-9a44-48cab6411a2f	3	5000
27	fdc5b52c-47ff-40c6-9a44-48cab6411a2f	4	5000
28	fdc5b52c-47ff-40c6-9a44-48cab6411a2f	5	5000
29	fdc5b52c-47ff-40c6-9a44-48cab6411a2f	6	5000
30	b3b21fc4-875f-4480-8ca4-b9edbd61ce97	1	5000
31	b3b21fc4-875f-4480-8ca4-b9edbd61ce97	3	5000
32	b3b21fc4-875f-4480-8ca4-b9edbd61ce97	4	5000
33	b3b21fc4-875f-4480-8ca4-b9edbd61ce97	5	5000
34	b3b21fc4-875f-4480-8ca4-b9edbd61ce97	6	5000
35	b3b21fc4-875f-4480-8ca4-b9edbd61ce97	7	5000
36	ef37a668-ece7-47e3-811c-491416b4a413	1	5000
37	ef37a668-ece7-47e3-811c-491416b4a413	3	5000
38	ef37a668-ece7-47e3-811c-491416b4a413	4	5000
39	ef37a668-ece7-47e3-811c-491416b4a413	5	5000
40	ef37a668-ece7-47e3-811c-491416b4a413	6	5000
41	ef37a668-ece7-47e3-811c-491416b4a413	7	5000
42	ef37a668-ece7-47e3-811c-491416b4a413	8	5000
43	50ad6140-5585-434a-90a8-ca37f35fd013	1	5000
44	50ad6140-5585-434a-90a8-ca37f35fd013	3	5000
45	50ad6140-5585-434a-90a8-ca37f35fd013	4	5000
46	50ad6140-5585-434a-90a8-ca37f35fd013	5	5000
47	50ad6140-5585-434a-90a8-ca37f35fd013	6	5000
48	50ad6140-5585-434a-90a8-ca37f35fd013	7	5000
49	50ad6140-5585-434a-90a8-ca37f35fd013	8	5000
50	50ad6140-5585-434a-90a8-ca37f35fd013	9	5000
51	ba027b58-f00b-4919-84b7-27857f913321	1	5000
52	ba027b58-f00b-4919-84b7-27857f913321	3	5000
53	ba027b58-f00b-4919-84b7-27857f913321	4	5000
54	ba027b58-f00b-4919-84b7-27857f913321	5	5000
55	ba027b58-f00b-4919-84b7-27857f913321	6	5000
56	ba027b58-f00b-4919-84b7-27857f913321	7	5000
57	ba027b58-f00b-4919-84b7-27857f913321	8	5000
58	ba027b58-f00b-4919-84b7-27857f913321	9	5000
59	ba027b58-f00b-4919-84b7-27857f913321	10	5000
\.


--
-- Data for Name: GradeScale; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GradeScale" (id, grade, "minScore", "maxScore", points) FROM stdin;
\.


--
-- Data for Name: Inquiry; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Inquiry" (id, "inquiryNumber", "studentName", "parentName", phone, email, "interestedGrade", "previousSchool", source, status, notes, "nextFollowUp", "assignedToId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LeaveRequest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LeaveRequest" (id, "userId", "startDate", "endDate", reason, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryMember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LibraryMember" (id, "memberId", "studentId", "userId", status, "createdAt", "updatedAt") FROM stdin;
1	LIB-STU-122-7680	122	\N	ACTIVE	2026-06-10 21:01:56.173	2026-06-10 21:01:56.173
2	LIB-STU-123-9041	123	\N	ACTIVE	2026-06-10 21:03:35.259	2026-06-10 21:03:35.259
3	LIB-STU-124-4322	124	\N	ACTIVE	2026-06-10 21:04:23.315	2026-06-10 21:04:23.315
4	LIB-STU-125-3458	125	\N	ACTIVE	2026-06-10 21:05:32.241	2026-06-10 21:05:32.241
\.


--
-- Data for Name: Mark; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Mark" (id, "studentId", subject, score, "maxScore", date, "createdAt", "updatedAt", "examType", year) FROM stdin;
1	111	MATH	85	100	2026-06-10 20:46:34.3	2026-06-10 20:46:34.308	2026-06-10 20:46:34.308	Term 1	2026
2	112	MATH	85	100	2026-06-10 20:47:18.401	2026-06-10 20:47:18.404	2026-06-10 20:47:18.404	Term 1	2026
4	115	MATH	85	100	2026-06-10 20:50:07.625	2026-06-10 20:50:07.628	2026-06-10 20:50:07.628	Term 1	609325
5	116	MATH	85	100	2026-06-10 20:52:03.389	2026-06-10 20:52:03.394	2026-06-10 20:52:03.394	Term 1	2053
6	117	MATH	85	100	2026-06-10 20:56:09.731	2026-06-10 20:56:09.736	2026-06-10 20:56:09.736	Term 1	2064
7	118	MATH	85	100	2026-06-10 20:56:47.953	2026-06-10 20:56:47.957	2026-06-10 20:56:47.957	Term 1	2065
8	119	MATH	85	100	2026-06-10 20:58:13.874	2026-06-10 20:58:13.877	2026-06-10 20:58:13.877	Term 1	2028
9	120	MATH	85	100	2026-06-10 20:58:54.882	2026-06-10 20:58:54.885	2026-06-10 20:58:54.885	Term 1	2084
10	121	MATH	85	100	2026-06-10 21:00:13.89	2026-06-10 21:00:13.893	2026-06-10 21:00:13.893	Term 1	2064
11	122	MATH	85	100	2026-06-10 21:01:55.192	2026-06-10 21:01:55.196	2026-06-10 21:01:55.196	Term 1	2075
12	123	MATH	85	100	2026-06-10 21:03:34.271	2026-06-10 21:03:34.275	2026-06-10 21:03:34.275	Term 1	2036
13	124	MATH	85	100	2026-06-10 21:04:22.338	2026-06-10 21:04:22.344	2026-06-10 21:04:22.344	Term 1	2079
14	125	MATH	85	100	2026-06-10 21:05:31.23	2026-06-10 21:05:31.233	2026-06-10 21:05:31.233	Term 1	2024
58	20	BANGLA	27	30	2026-06-14 19:04:58.449	2026-06-14 19:04:58.452	2026-06-14 19:04:58.452	T1_TUTORIAL	2026
59	20	ENGLISH	25	30	2026-06-14 19:04:58.454	2026-06-14 19:04:58.454	2026-06-14 19:04:58.454	T1_TUTORIAL	2026
60	20	ICT	26	30	2026-06-14 19:04:58.455	2026-06-14 19:04:58.455	2026-06-14 19:04:58.455	T1_TUTORIAL	2026
61	20	MATH	27	30	2026-06-14 19:04:58.456	2026-06-14 19:04:58.456	2026-06-14 19:04:58.456	T1_TUTORIAL	2026
62	20	RELIGION	24	30	2026-06-14 19:04:58.457	2026-06-14 19:04:58.457	2026-06-14 19:04:58.457	T1_TUTORIAL	2026
63	20	BANGLA	54	70	2026-06-14 19:04:58.458	2026-06-14 19:04:58.458	2026-06-14 19:04:58.458	T1_FINAL	2026
64	20	ENGLISH	35	70	2026-06-14 19:04:58.459	2026-06-14 19:04:58.459	2026-06-14 19:04:58.459	T1_FINAL	2026
65	20	ICT	46	70	2026-06-14 19:04:58.46	2026-06-14 19:04:58.46	2026-06-14 19:04:58.46	T1_FINAL	2026
66	20	MATH	50	70	2026-06-14 19:04:58.46	2026-06-14 19:04:58.46	2026-06-14 19:04:58.46	T1_FINAL	2026
67	20	RELIGION	38	70	2026-06-14 19:04:58.461	2026-06-14 19:04:58.461	2026-06-14 19:04:58.461	T1_FINAL	2026
68	20	BANGLA	23	30	2026-06-14 19:04:58.462	2026-06-14 19:04:58.462	2026-06-14 19:04:58.462	T2_TUTORIAL	2026
69	20	ENGLISH	15	30	2026-06-14 19:04:58.463	2026-06-14 19:04:58.463	2026-06-14 19:04:58.463	T2_TUTORIAL	2026
70	20	ICT	16	30	2026-06-14 19:04:58.463	2026-06-14 19:04:58.463	2026-06-14 19:04:58.463	T2_TUTORIAL	2026
71	20	MATH	20	30	2026-06-14 19:04:58.464	2026-06-14 19:04:58.465	2026-06-14 19:04:58.465	T2_TUTORIAL	2026
72	20	RELIGION	16	30	2026-06-14 19:04:58.465	2026-06-14 19:04:58.465	2026-06-14 19:04:58.465	T2_TUTORIAL	2026
73	20	BANGLA	40	70	2026-06-14 19:04:58.466	2026-06-14 19:04:58.466	2026-06-14 19:04:58.466	T2_FINAL	2026
74	20	ENGLISH	47	70	2026-06-14 19:04:58.466	2026-06-14 19:04:58.467	2026-06-14 19:04:58.467	T2_FINAL	2026
75	20	ICT	45	70	2026-06-14 19:04:58.467	2026-06-14 19:04:58.467	2026-06-14 19:04:58.467	T2_FINAL	2026
76	20	MATH	63	70	2026-06-14 19:04:58.468	2026-06-14 19:04:58.468	2026-06-14 19:04:58.468	T2_FINAL	2026
77	20	RELIGION	45	70	2026-06-14 19:04:58.468	2026-06-14 19:04:58.468	2026-06-14 19:04:58.468	T2_FINAL	2026
78	20	BANGLA	19	30	2026-06-14 19:04:58.469	2026-06-14 19:04:58.469	2026-06-14 19:04:58.469	T3_TUTORIAL	2026
79	20	ENGLISH	23	30	2026-06-14 19:04:58.47	2026-06-14 19:04:58.47	2026-06-14 19:04:58.47	T3_TUTORIAL	2026
80	20	ICT	21	30	2026-06-14 19:04:58.47	2026-06-14 19:04:58.47	2026-06-14 19:04:58.47	T3_TUTORIAL	2026
81	20	MATH	25	30	2026-06-14 19:04:58.471	2026-06-14 19:04:58.471	2026-06-14 19:04:58.471	T3_TUTORIAL	2026
82	20	RELIGION	20	30	2026-06-14 19:04:58.472	2026-06-14 19:04:58.472	2026-06-14 19:04:58.472	T3_TUTORIAL	2026
83	20	BANGLA	62	70	2026-06-14 19:04:58.473	2026-06-14 19:04:58.473	2026-06-14 19:04:58.473	T3_FINAL	2026
84	20	ENGLISH	44	70	2026-06-14 19:04:58.474	2026-06-14 19:04:58.474	2026-06-14 19:04:58.474	T3_FINAL	2026
85	20	ICT	56	70	2026-06-14 19:04:58.475	2026-06-14 19:04:58.475	2026-06-14 19:04:58.475	T3_FINAL	2026
86	20	MATH	45	70	2026-06-14 19:04:58.475	2026-06-14 19:04:58.475	2026-06-14 19:04:58.475	T3_FINAL	2026
87	20	RELIGION	57	70	2026-06-14 19:04:58.476	2026-06-14 19:04:58.476	2026-06-14 19:04:58.476	T3_FINAL	2026
88	37	BANGLA	15	30	2026-06-14 19:04:58.49	2026-06-14 19:04:58.491	2026-06-14 19:04:58.491	T1_TUTORIAL	2026
89	37	ENGLISH	16	30	2026-06-14 19:04:58.491	2026-06-14 19:04:58.491	2026-06-14 19:04:58.491	T1_TUTORIAL	2026
90	37	ICT	23	30	2026-06-14 19:04:58.492	2026-06-14 19:04:58.492	2026-06-14 19:04:58.492	T1_TUTORIAL	2026
91	37	MATH	19	30	2026-06-14 19:04:58.493	2026-06-14 19:04:58.493	2026-06-14 19:04:58.493	T1_TUTORIAL	2026
92	37	RELIGION	18	30	2026-06-14 19:04:58.493	2026-06-14 19:04:58.493	2026-06-14 19:04:58.493	T1_TUTORIAL	2026
93	37	BANGLA	46	70	2026-06-14 19:04:58.494	2026-06-14 19:04:58.494	2026-06-14 19:04:58.494	T1_FINAL	2026
94	37	ENGLISH	45	70	2026-06-14 19:04:58.495	2026-06-14 19:04:58.495	2026-06-14 19:04:58.495	T1_FINAL	2026
95	37	ICT	47	70	2026-06-14 19:04:58.496	2026-06-14 19:04:58.496	2026-06-14 19:04:58.496	T1_FINAL	2026
96	37	MATH	39	70	2026-06-14 19:04:58.497	2026-06-14 19:04:58.497	2026-06-14 19:04:58.497	T1_FINAL	2026
97	37	RELIGION	36	70	2026-06-14 19:04:58.498	2026-06-14 19:04:58.498	2026-06-14 19:04:58.498	T1_FINAL	2026
98	37	BANGLA	27	30	2026-06-14 19:04:58.499	2026-06-14 19:04:58.499	2026-06-14 19:04:58.499	T2_TUTORIAL	2026
99	37	ENGLISH	23	30	2026-06-14 19:04:58.5	2026-06-14 19:04:58.5	2026-06-14 19:04:58.5	T2_TUTORIAL	2026
100	37	ICT	15	30	2026-06-14 19:04:58.501	2026-06-14 19:04:58.501	2026-06-14 19:04:58.501	T2_TUTORIAL	2026
101	37	MATH	25	30	2026-06-14 19:04:58.502	2026-06-14 19:04:58.502	2026-06-14 19:04:58.502	T2_TUTORIAL	2026
102	37	RELIGION	22	30	2026-06-14 19:04:58.502	2026-06-14 19:04:58.502	2026-06-14 19:04:58.502	T2_TUTORIAL	2026
103	37	BANGLA	36	70	2026-06-14 19:04:58.503	2026-06-14 19:04:58.503	2026-06-14 19:04:58.503	T2_FINAL	2026
104	37	ENGLISH	62	70	2026-06-14 19:04:58.504	2026-06-14 19:04:58.504	2026-06-14 19:04:58.504	T2_FINAL	2026
105	37	ICT	60	70	2026-06-14 19:04:58.504	2026-06-14 19:04:58.504	2026-06-14 19:04:58.504	T2_FINAL	2026
106	37	MATH	57	70	2026-06-14 19:04:58.505	2026-06-14 19:04:58.505	2026-06-14 19:04:58.505	T2_FINAL	2026
107	37	RELIGION	55	70	2026-06-14 19:04:58.505	2026-06-14 19:04:58.506	2026-06-14 19:04:58.506	T2_FINAL	2026
108	37	BANGLA	16	30	2026-06-14 19:04:58.506	2026-06-14 19:04:58.506	2026-06-14 19:04:58.506	T3_TUTORIAL	2026
109	37	ENGLISH	20	30	2026-06-14 19:04:58.507	2026-06-14 19:04:58.507	2026-06-14 19:04:58.507	T3_TUTORIAL	2026
110	37	ICT	17	30	2026-06-14 19:04:58.508	2026-06-14 19:04:58.508	2026-06-14 19:04:58.508	T3_TUTORIAL	2026
111	37	MATH	25	30	2026-06-14 19:04:58.509	2026-06-14 19:04:58.509	2026-06-14 19:04:58.509	T3_TUTORIAL	2026
112	37	RELIGION	22	30	2026-06-14 19:04:58.509	2026-06-14 19:04:58.51	2026-06-14 19:04:58.51	T3_TUTORIAL	2026
113	37	BANGLA	47	70	2026-06-14 19:04:58.511	2026-06-14 19:04:58.511	2026-06-14 19:04:58.511	T3_FINAL	2026
114	37	ENGLISH	58	70	2026-06-14 19:04:58.512	2026-06-14 19:04:58.512	2026-06-14 19:04:58.512	T3_FINAL	2026
115	37	ICT	38	70	2026-06-14 19:04:58.513	2026-06-14 19:04:58.513	2026-06-14 19:04:58.513	T3_FINAL	2026
116	37	MATH	57	70	2026-06-14 19:04:58.514	2026-06-14 19:04:58.514	2026-06-14 19:04:58.514	T3_FINAL	2026
117	37	RELIGION	41	70	2026-06-14 19:04:58.514	2026-06-14 19:04:58.514	2026-06-14 19:04:58.514	T3_FINAL	2026
118	75	BANGLA	22	30	2026-06-14 19:04:58.52	2026-06-14 19:04:58.52	2026-06-14 19:04:58.52	T1_TUTORIAL	2026
119	75	ENGLISH	17	30	2026-06-14 19:04:58.521	2026-06-14 19:04:58.521	2026-06-14 19:04:58.521	T1_TUTORIAL	2026
120	75	ICT	18	30	2026-06-14 19:04:58.522	2026-06-14 19:04:58.522	2026-06-14 19:04:58.522	T1_TUTORIAL	2026
121	75	MATH	17	30	2026-06-14 19:04:58.523	2026-06-14 19:04:58.523	2026-06-14 19:04:58.523	T1_TUTORIAL	2026
122	75	RELIGION	26	30	2026-06-14 19:04:58.523	2026-06-14 19:04:58.523	2026-06-14 19:04:58.523	T1_TUTORIAL	2026
123	75	BANGLA	36	70	2026-06-14 19:04:58.524	2026-06-14 19:04:58.524	2026-06-14 19:04:58.524	T1_FINAL	2026
124	75	ENGLISH	40	70	2026-06-14 19:04:58.524	2026-06-14 19:04:58.525	2026-06-14 19:04:58.525	T1_FINAL	2026
125	75	ICT	57	70	2026-06-14 19:04:58.525	2026-06-14 19:04:58.525	2026-06-14 19:04:58.525	T1_FINAL	2026
126	75	MATH	64	70	2026-06-14 19:04:58.526	2026-06-14 19:04:58.526	2026-06-14 19:04:58.526	T1_FINAL	2026
127	75	RELIGION	41	70	2026-06-14 19:04:58.526	2026-06-14 19:04:58.526	2026-06-14 19:04:58.526	T1_FINAL	2026
128	75	BANGLA	26	30	2026-06-14 19:04:58.527	2026-06-14 19:04:58.527	2026-06-14 19:04:58.527	T2_TUTORIAL	2026
129	75	ENGLISH	26	30	2026-06-14 19:04:58.527	2026-06-14 19:04:58.527	2026-06-14 19:04:58.527	T2_TUTORIAL	2026
130	75	ICT	22	30	2026-06-14 19:04:58.528	2026-06-14 19:04:58.528	2026-06-14 19:04:58.528	T2_TUTORIAL	2026
131	75	MATH	18	30	2026-06-14 19:04:58.528	2026-06-14 19:04:58.528	2026-06-14 19:04:58.528	T2_TUTORIAL	2026
132	75	RELIGION	27	30	2026-06-14 19:04:58.529	2026-06-14 19:04:58.529	2026-06-14 19:04:58.529	T2_TUTORIAL	2026
133	75	BANGLA	55	70	2026-06-14 19:04:58.53	2026-06-14 19:04:58.53	2026-06-14 19:04:58.53	T2_FINAL	2026
134	75	ENGLISH	57	70	2026-06-14 19:04:58.53	2026-06-14 19:04:58.53	2026-06-14 19:04:58.53	T2_FINAL	2026
135	75	ICT	57	70	2026-06-14 19:04:58.531	2026-06-14 19:04:58.531	2026-06-14 19:04:58.531	T2_FINAL	2026
136	75	MATH	38	70	2026-06-14 19:04:58.531	2026-06-14 19:04:58.531	2026-06-14 19:04:58.531	T2_FINAL	2026
137	75	RELIGION	46	70	2026-06-14 19:04:58.532	2026-06-14 19:04:58.532	2026-06-14 19:04:58.532	T2_FINAL	2026
138	75	BANGLA	19	30	2026-06-14 19:04:58.532	2026-06-14 19:04:58.532	2026-06-14 19:04:58.532	T3_TUTORIAL	2026
139	75	ENGLISH	18	30	2026-06-14 19:04:58.533	2026-06-14 19:04:58.533	2026-06-14 19:04:58.533	T3_TUTORIAL	2026
140	75	ICT	20	30	2026-06-14 19:04:58.533	2026-06-14 19:04:58.534	2026-06-14 19:04:58.534	T3_TUTORIAL	2026
141	75	MATH	24	30	2026-06-14 19:04:58.534	2026-06-14 19:04:58.534	2026-06-14 19:04:58.534	T3_TUTORIAL	2026
142	75	RELIGION	21	30	2026-06-14 19:04:58.534	2026-06-14 19:04:58.535	2026-06-14 19:04:58.535	T3_TUTORIAL	2026
143	75	BANGLA	56	70	2026-06-14 19:04:58.535	2026-06-14 19:04:58.535	2026-06-14 19:04:58.535	T3_FINAL	2026
144	75	ENGLISH	51	70	2026-06-14 19:04:58.536	2026-06-14 19:04:58.536	2026-06-14 19:04:58.536	T3_FINAL	2026
145	75	ICT	63	70	2026-06-14 19:04:58.537	2026-06-14 19:04:58.537	2026-06-14 19:04:58.537	T3_FINAL	2026
146	75	MATH	58	70	2026-06-14 19:04:58.538	2026-06-14 19:04:58.538	2026-06-14 19:04:58.538	T3_FINAL	2026
147	75	RELIGION	36	70	2026-06-14 19:04:58.539	2026-06-14 19:04:58.539	2026-06-14 19:04:58.539	T3_FINAL	2026
148	79	BANGLA	24	30	2026-06-14 19:04:58.543	2026-06-14 19:04:58.544	2026-06-14 19:04:58.544	T1_TUTORIAL	2026
149	79	ENGLISH	21	30	2026-06-14 19:04:58.544	2026-06-14 19:04:58.544	2026-06-14 19:04:58.544	T1_TUTORIAL	2026
150	79	ICT	26	30	2026-06-14 19:04:58.545	2026-06-14 19:04:58.545	2026-06-14 19:04:58.545	T1_TUTORIAL	2026
151	79	MATH	24	30	2026-06-14 19:04:58.545	2026-06-14 19:04:58.545	2026-06-14 19:04:58.545	T1_TUTORIAL	2026
152	79	RELIGION	20	30	2026-06-14 19:04:58.546	2026-06-14 19:04:58.546	2026-06-14 19:04:58.546	T1_TUTORIAL	2026
153	79	BANGLA	64	70	2026-06-14 19:04:58.546	2026-06-14 19:04:58.546	2026-06-14 19:04:58.546	T1_FINAL	2026
154	79	ENGLISH	47	70	2026-06-14 19:04:58.547	2026-06-14 19:04:58.547	2026-06-14 19:04:58.547	T1_FINAL	2026
155	79	ICT	39	70	2026-06-14 19:04:58.547	2026-06-14 19:04:58.547	2026-06-14 19:04:58.547	T1_FINAL	2026
156	79	MATH	46	70	2026-06-14 19:04:58.548	2026-06-14 19:04:58.548	2026-06-14 19:04:58.548	T1_FINAL	2026
157	79	RELIGION	50	70	2026-06-14 19:04:58.548	2026-06-14 19:04:58.548	2026-06-14 19:04:58.548	T1_FINAL	2026
158	79	BANGLA	16	30	2026-06-14 19:04:58.549	2026-06-14 19:04:58.549	2026-06-14 19:04:58.549	T2_TUTORIAL	2026
159	79	ENGLISH	20	30	2026-06-14 19:04:58.55	2026-06-14 19:04:58.55	2026-06-14 19:04:58.55	T2_TUTORIAL	2026
160	79	ICT	20	30	2026-06-14 19:04:58.55	2026-06-14 19:04:58.55	2026-06-14 19:04:58.55	T2_TUTORIAL	2026
161	79	MATH	15	30	2026-06-14 19:04:58.551	2026-06-14 19:04:58.551	2026-06-14 19:04:58.551	T2_TUTORIAL	2026
162	79	RELIGION	22	30	2026-06-14 19:04:58.551	2026-06-14 19:04:58.552	2026-06-14 19:04:58.552	T2_TUTORIAL	2026
163	79	BANGLA	45	70	2026-06-14 19:04:58.552	2026-06-14 19:04:58.552	2026-06-14 19:04:58.552	T2_FINAL	2026
164	79	ENGLISH	44	70	2026-06-14 19:04:58.553	2026-06-14 19:04:58.553	2026-06-14 19:04:58.553	T2_FINAL	2026
165	79	ICT	64	70	2026-06-14 19:04:58.553	2026-06-14 19:04:58.554	2026-06-14 19:04:58.554	T2_FINAL	2026
166	79	MATH	35	70	2026-06-14 19:04:58.554	2026-06-14 19:04:58.554	2026-06-14 19:04:58.554	T2_FINAL	2026
167	79	RELIGION	43	70	2026-06-14 19:04:58.554	2026-06-14 19:04:58.555	2026-06-14 19:04:58.555	T2_FINAL	2026
168	79	BANGLA	18	30	2026-06-14 19:04:58.555	2026-06-14 19:04:58.555	2026-06-14 19:04:58.555	T3_TUTORIAL	2026
169	79	ENGLISH	17	30	2026-06-14 19:04:58.555	2026-06-14 19:04:58.556	2026-06-14 19:04:58.556	T3_TUTORIAL	2026
170	79	ICT	16	30	2026-06-14 19:04:58.556	2026-06-14 19:04:58.556	2026-06-14 19:04:58.556	T3_TUTORIAL	2026
171	79	MATH	26	30	2026-06-14 19:04:58.556	2026-06-14 19:04:58.557	2026-06-14 19:04:58.557	T3_TUTORIAL	2026
172	79	RELIGION	20	30	2026-06-14 19:04:58.557	2026-06-14 19:04:58.557	2026-06-14 19:04:58.557	T3_TUTORIAL	2026
173	79	BANGLA	50	70	2026-06-14 19:04:58.558	2026-06-14 19:04:58.558	2026-06-14 19:04:58.558	T3_FINAL	2026
174	79	ENGLISH	46	70	2026-06-14 19:04:58.558	2026-06-14 19:04:58.558	2026-06-14 19:04:58.558	T3_FINAL	2026
175	79	ICT	48	70	2026-06-14 19:04:58.559	2026-06-14 19:04:58.559	2026-06-14 19:04:58.559	T3_FINAL	2026
176	79	MATH	50	70	2026-06-14 19:04:58.559	2026-06-14 19:04:58.559	2026-06-14 19:04:58.559	T3_FINAL	2026
177	79	RELIGION	56	70	2026-06-14 19:04:58.56	2026-06-14 19:04:58.56	2026-06-14 19:04:58.56	T3_FINAL	2026
178	87	BANGLA	20	30	2026-06-14 19:04:58.564	2026-06-14 19:04:58.564	2026-06-14 19:04:58.564	T1_TUTORIAL	2026
179	87	ENGLISH	16	30	2026-06-14 19:04:58.565	2026-06-14 19:04:58.565	2026-06-14 19:04:58.565	T1_TUTORIAL	2026
180	87	ICT	27	30	2026-06-14 19:04:58.565	2026-06-14 19:04:58.565	2026-06-14 19:04:58.565	T1_TUTORIAL	2026
181	87	MATH	15	30	2026-06-14 19:04:58.566	2026-06-14 19:04:58.566	2026-06-14 19:04:58.566	T1_TUTORIAL	2026
182	87	RELIGION	26	30	2026-06-14 19:04:58.566	2026-06-14 19:04:58.566	2026-06-14 19:04:58.566	T1_TUTORIAL	2026
183	87	BANGLA	56	70	2026-06-14 19:04:58.567	2026-06-14 19:04:58.567	2026-06-14 19:04:58.567	T1_FINAL	2026
184	87	ENGLISH	52	70	2026-06-14 19:04:58.567	2026-06-14 19:04:58.567	2026-06-14 19:04:58.567	T1_FINAL	2026
185	87	ICT	60	70	2026-06-14 19:04:58.568	2026-06-14 19:04:58.568	2026-06-14 19:04:58.568	T1_FINAL	2026
186	87	MATH	35	70	2026-06-14 19:04:58.568	2026-06-14 19:04:58.568	2026-06-14 19:04:58.568	T1_FINAL	2026
187	87	RELIGION	47	70	2026-06-14 19:04:58.569	2026-06-14 19:04:58.569	2026-06-14 19:04:58.569	T1_FINAL	2026
188	87	BANGLA	20	30	2026-06-14 19:04:58.57	2026-06-14 19:04:58.57	2026-06-14 19:04:58.57	T2_TUTORIAL	2026
189	87	ENGLISH	23	30	2026-06-14 19:04:58.57	2026-06-14 19:04:58.57	2026-06-14 19:04:58.57	T2_TUTORIAL	2026
190	87	ICT	17	30	2026-06-14 19:04:58.571	2026-06-14 19:04:58.571	2026-06-14 19:04:58.571	T2_TUTORIAL	2026
191	87	MATH	20	30	2026-06-14 19:04:58.571	2026-06-14 19:04:58.571	2026-06-14 19:04:58.571	T2_TUTORIAL	2026
192	87	RELIGION	16	30	2026-06-14 19:04:58.572	2026-06-14 19:04:58.572	2026-06-14 19:04:58.572	T2_TUTORIAL	2026
193	87	BANGLA	49	70	2026-06-14 19:04:58.572	2026-06-14 19:04:58.572	2026-06-14 19:04:58.572	T2_FINAL	2026
194	87	ENGLISH	55	70	2026-06-14 19:04:58.573	2026-06-14 19:04:58.573	2026-06-14 19:04:58.573	T2_FINAL	2026
195	87	ICT	55	70	2026-06-14 19:04:58.573	2026-06-14 19:04:58.573	2026-06-14 19:04:58.573	T2_FINAL	2026
196	87	MATH	49	70	2026-06-14 19:04:58.574	2026-06-14 19:04:58.574	2026-06-14 19:04:58.574	T2_FINAL	2026
197	87	RELIGION	54	70	2026-06-14 19:04:58.574	2026-06-14 19:04:58.574	2026-06-14 19:04:58.574	T2_FINAL	2026
198	87	BANGLA	27	30	2026-06-14 19:04:58.575	2026-06-14 19:04:58.575	2026-06-14 19:04:58.575	T3_TUTORIAL	2026
199	87	ENGLISH	25	30	2026-06-14 19:04:58.575	2026-06-14 19:04:58.575	2026-06-14 19:04:58.575	T3_TUTORIAL	2026
200	87	ICT	25	30	2026-06-14 19:04:58.576	2026-06-14 19:04:58.576	2026-06-14 19:04:58.576	T3_TUTORIAL	2026
201	87	MATH	21	30	2026-06-14 19:04:58.576	2026-06-14 19:04:58.576	2026-06-14 19:04:58.576	T3_TUTORIAL	2026
202	87	RELIGION	20	30	2026-06-14 19:04:58.577	2026-06-14 19:04:58.577	2026-06-14 19:04:58.577	T3_TUTORIAL	2026
203	87	BANGLA	38	70	2026-06-14 19:04:58.578	2026-06-14 19:04:58.578	2026-06-14 19:04:58.578	T3_FINAL	2026
204	87	ENGLISH	48	70	2026-06-14 19:04:58.578	2026-06-14 19:04:58.579	2026-06-14 19:04:58.579	T3_FINAL	2026
205	87	ICT	63	70	2026-06-14 19:04:58.579	2026-06-14 19:04:58.579	2026-06-14 19:04:58.579	T3_FINAL	2026
206	87	MATH	59	70	2026-06-14 19:04:58.58	2026-06-14 19:04:58.58	2026-06-14 19:04:58.58	T3_FINAL	2026
207	87	RELIGION	36	70	2026-06-14 19:04:58.581	2026-06-14 19:04:58.581	2026-06-14 19:04:58.581	T3_FINAL	2026
208	88	BANGLA	15	30	2026-06-14 19:04:58.585	2026-06-14 19:04:58.585	2026-06-14 19:04:58.585	T1_TUTORIAL	2026
209	88	ENGLISH	25	30	2026-06-14 19:04:58.585	2026-06-14 19:04:58.585	2026-06-14 19:04:58.585	T1_TUTORIAL	2026
210	88	ICT	21	30	2026-06-14 19:04:58.586	2026-06-14 19:04:58.586	2026-06-14 19:04:58.586	T1_TUTORIAL	2026
211	88	MATH	20	30	2026-06-14 19:04:58.586	2026-06-14 19:04:58.587	2026-06-14 19:04:58.587	T1_TUTORIAL	2026
212	88	RELIGION	26	30	2026-06-14 19:04:58.587	2026-06-14 19:04:58.587	2026-06-14 19:04:58.587	T1_TUTORIAL	2026
213	88	BANGLA	36	70	2026-06-14 19:04:58.588	2026-06-14 19:04:58.588	2026-06-14 19:04:58.588	T1_FINAL	2026
214	88	ENGLISH	46	70	2026-06-14 19:04:58.588	2026-06-14 19:04:58.588	2026-06-14 19:04:58.588	T1_FINAL	2026
215	88	ICT	61	70	2026-06-14 19:04:58.589	2026-06-14 19:04:58.589	2026-06-14 19:04:58.589	T1_FINAL	2026
216	88	MATH	44	70	2026-06-14 19:04:58.589	2026-06-14 19:04:58.589	2026-06-14 19:04:58.589	T1_FINAL	2026
217	88	RELIGION	54	70	2026-06-14 19:04:58.59	2026-06-14 19:04:58.59	2026-06-14 19:04:58.59	T1_FINAL	2026
218	88	BANGLA	16	30	2026-06-14 19:04:58.59	2026-06-14 19:04:58.591	2026-06-14 19:04:58.591	T2_TUTORIAL	2026
219	88	ENGLISH	20	30	2026-06-14 19:04:58.591	2026-06-14 19:04:58.591	2026-06-14 19:04:58.591	T2_TUTORIAL	2026
220	88	ICT	22	30	2026-06-14 19:04:58.592	2026-06-14 19:04:58.592	2026-06-14 19:04:58.592	T2_TUTORIAL	2026
221	88	MATH	21	30	2026-06-14 19:04:58.592	2026-06-14 19:04:58.592	2026-06-14 19:04:58.592	T2_TUTORIAL	2026
222	88	RELIGION	26	30	2026-06-14 19:04:58.593	2026-06-14 19:04:58.593	2026-06-14 19:04:58.593	T2_TUTORIAL	2026
223	88	BANGLA	37	70	2026-06-14 19:04:58.593	2026-06-14 19:04:58.593	2026-06-14 19:04:58.593	T2_FINAL	2026
224	88	ENGLISH	64	70	2026-06-14 19:04:58.594	2026-06-14 19:04:58.594	2026-06-14 19:04:58.594	T2_FINAL	2026
225	88	ICT	52	70	2026-06-14 19:04:58.594	2026-06-14 19:04:58.594	2026-06-14 19:04:58.594	T2_FINAL	2026
226	88	MATH	48	70	2026-06-14 19:04:58.595	2026-06-14 19:04:58.595	2026-06-14 19:04:58.595	T2_FINAL	2026
227	88	RELIGION	64	70	2026-06-14 19:04:58.595	2026-06-14 19:04:58.595	2026-06-14 19:04:58.595	T2_FINAL	2026
228	88	BANGLA	17	30	2026-06-14 19:04:58.596	2026-06-14 19:04:58.596	2026-06-14 19:04:58.596	T3_TUTORIAL	2026
229	88	ENGLISH	21	30	2026-06-14 19:04:58.596	2026-06-14 19:04:58.596	2026-06-14 19:04:58.596	T3_TUTORIAL	2026
230	88	ICT	27	30	2026-06-14 19:04:58.597	2026-06-14 19:04:58.597	2026-06-14 19:04:58.597	T3_TUTORIAL	2026
231	88	MATH	27	30	2026-06-14 19:04:58.597	2026-06-14 19:04:58.597	2026-06-14 19:04:58.597	T3_TUTORIAL	2026
232	88	RELIGION	17	30	2026-06-14 19:04:58.598	2026-06-14 19:04:58.598	2026-06-14 19:04:58.598	T3_TUTORIAL	2026
233	88	BANGLA	54	70	2026-06-14 19:04:58.599	2026-06-14 19:04:58.599	2026-06-14 19:04:58.599	T3_FINAL	2026
234	88	ENGLISH	58	70	2026-06-14 19:04:58.599	2026-06-14 19:04:58.599	2026-06-14 19:04:58.599	T3_FINAL	2026
235	88	ICT	53	70	2026-06-14 19:04:58.6	2026-06-14 19:04:58.6	2026-06-14 19:04:58.6	T3_FINAL	2026
236	88	MATH	63	70	2026-06-14 19:04:58.6	2026-06-14 19:04:58.6	2026-06-14 19:04:58.6	T3_FINAL	2026
237	88	RELIGION	50	70	2026-06-14 19:04:58.601	2026-06-14 19:04:58.601	2026-06-14 19:04:58.601	T3_FINAL	2026
238	102	BANGLA	26	30	2026-06-14 19:04:58.606	2026-06-14 19:04:58.606	2026-06-14 19:04:58.606	T1_TUTORIAL	2026
239	102	ENGLISH	16	30	2026-06-14 19:04:58.606	2026-06-14 19:04:58.606	2026-06-14 19:04:58.606	T1_TUTORIAL	2026
240	102	ICT	19	30	2026-06-14 19:04:58.607	2026-06-14 19:04:58.607	2026-06-14 19:04:58.607	T1_TUTORIAL	2026
241	102	MATH	16	30	2026-06-14 19:04:58.607	2026-06-14 19:04:58.607	2026-06-14 19:04:58.607	T1_TUTORIAL	2026
242	102	RELIGION	26	30	2026-06-14 19:04:58.608	2026-06-14 19:04:58.608	2026-06-14 19:04:58.608	T1_TUTORIAL	2026
243	102	BANGLA	47	70	2026-06-14 19:04:58.608	2026-06-14 19:04:58.608	2026-06-14 19:04:58.608	T1_FINAL	2026
244	102	ENGLISH	62	70	2026-06-14 19:04:58.609	2026-06-14 19:04:58.609	2026-06-14 19:04:58.609	T1_FINAL	2026
245	102	ICT	52	70	2026-06-14 19:04:58.61	2026-06-14 19:04:58.61	2026-06-14 19:04:58.61	T1_FINAL	2026
246	102	MATH	36	70	2026-06-14 19:04:58.61	2026-06-14 19:04:58.61	2026-06-14 19:04:58.61	T1_FINAL	2026
247	102	RELIGION	51	70	2026-06-14 19:04:58.611	2026-06-14 19:04:58.611	2026-06-14 19:04:58.611	T1_FINAL	2026
248	102	BANGLA	17	30	2026-06-14 19:04:58.611	2026-06-14 19:04:58.611	2026-06-14 19:04:58.611	T2_TUTORIAL	2026
249	102	ENGLISH	22	30	2026-06-14 19:04:58.612	2026-06-14 19:04:58.612	2026-06-14 19:04:58.612	T2_TUTORIAL	2026
250	102	ICT	16	30	2026-06-14 19:04:58.612	2026-06-14 19:04:58.612	2026-06-14 19:04:58.612	T2_TUTORIAL	2026
251	102	MATH	26	30	2026-06-14 19:04:58.613	2026-06-14 19:04:58.613	2026-06-14 19:04:58.613	T2_TUTORIAL	2026
252	102	RELIGION	25	30	2026-06-14 19:04:58.613	2026-06-14 19:04:58.613	2026-06-14 19:04:58.613	T2_TUTORIAL	2026
253	102	BANGLA	60	70	2026-06-14 19:04:58.614	2026-06-14 19:04:58.614	2026-06-14 19:04:58.614	T2_FINAL	2026
254	102	ENGLISH	43	70	2026-06-14 19:04:58.615	2026-06-14 19:04:58.615	2026-06-14 19:04:58.615	T2_FINAL	2026
255	102	ICT	49	70	2026-06-14 19:04:58.615	2026-06-14 19:04:58.615	2026-06-14 19:04:58.615	T2_FINAL	2026
256	102	MATH	38	70	2026-06-14 19:04:58.616	2026-06-14 19:04:58.616	2026-06-14 19:04:58.616	T2_FINAL	2026
257	102	RELIGION	37	70	2026-06-14 19:04:58.616	2026-06-14 19:04:58.616	2026-06-14 19:04:58.616	T2_FINAL	2026
258	102	BANGLA	15	30	2026-06-14 19:04:58.617	2026-06-14 19:04:58.617	2026-06-14 19:04:58.617	T3_TUTORIAL	2026
259	102	ENGLISH	21	30	2026-06-14 19:04:58.618	2026-06-14 19:04:58.618	2026-06-14 19:04:58.618	T3_TUTORIAL	2026
260	102	ICT	22	30	2026-06-14 19:04:58.619	2026-06-14 19:04:58.619	2026-06-14 19:04:58.619	T3_TUTORIAL	2026
261	102	MATH	25	30	2026-06-14 19:04:58.619	2026-06-14 19:04:58.619	2026-06-14 19:04:58.619	T3_TUTORIAL	2026
262	102	RELIGION	17	30	2026-06-14 19:04:58.62	2026-06-14 19:04:58.62	2026-06-14 19:04:58.62	T3_TUTORIAL	2026
263	102	BANGLA	50	70	2026-06-14 19:04:58.62	2026-06-14 19:04:58.621	2026-06-14 19:04:58.621	T3_FINAL	2026
264	102	ENGLISH	55	70	2026-06-14 19:04:58.621	2026-06-14 19:04:58.621	2026-06-14 19:04:58.621	T3_FINAL	2026
265	102	ICT	57	70	2026-06-14 19:04:58.622	2026-06-14 19:04:58.622	2026-06-14 19:04:58.622	T3_FINAL	2026
266	102	MATH	52	70	2026-06-14 19:04:58.622	2026-06-14 19:04:58.622	2026-06-14 19:04:58.622	T3_FINAL	2026
267	102	RELIGION	59	70	2026-06-14 19:04:58.623	2026-06-14 19:04:58.623	2026-06-14 19:04:58.623	T3_FINAL	2026
268	103	BANGLA	18	30	2026-06-14 19:04:58.627	2026-06-14 19:04:58.627	2026-06-14 19:04:58.627	T1_TUTORIAL	2026
269	103	ENGLISH	20	30	2026-06-14 19:04:58.628	2026-06-14 19:04:58.628	2026-06-14 19:04:58.628	T1_TUTORIAL	2026
270	103	ICT	25	30	2026-06-14 19:04:58.628	2026-06-14 19:04:58.628	2026-06-14 19:04:58.628	T1_TUTORIAL	2026
271	103	MATH	25	30	2026-06-14 19:04:58.629	2026-06-14 19:04:58.629	2026-06-14 19:04:58.629	T1_TUTORIAL	2026
272	103	RELIGION	16	30	2026-06-14 19:04:58.629	2026-06-14 19:04:58.629	2026-06-14 19:04:58.629	T1_TUTORIAL	2026
273	103	BANGLA	52	70	2026-06-14 19:04:58.63	2026-06-14 19:04:58.63	2026-06-14 19:04:58.63	T1_FINAL	2026
274	103	ENGLISH	45	70	2026-06-14 19:04:58.63	2026-06-14 19:04:58.63	2026-06-14 19:04:58.63	T1_FINAL	2026
275	103	ICT	45	70	2026-06-14 19:04:58.631	2026-06-14 19:04:58.631	2026-06-14 19:04:58.631	T1_FINAL	2026
276	103	MATH	58	70	2026-06-14 19:04:58.631	2026-06-14 19:04:58.631	2026-06-14 19:04:58.631	T1_FINAL	2026
277	103	RELIGION	45	70	2026-06-14 19:04:58.632	2026-06-14 19:04:58.632	2026-06-14 19:04:58.632	T1_FINAL	2026
278	103	BANGLA	18	30	2026-06-14 19:04:58.632	2026-06-14 19:04:58.633	2026-06-14 19:04:58.633	T2_TUTORIAL	2026
279	103	ENGLISH	27	30	2026-06-14 19:04:58.633	2026-06-14 19:04:58.633	2026-06-14 19:04:58.633	T2_TUTORIAL	2026
280	103	ICT	18	30	2026-06-14 19:04:58.634	2026-06-14 19:04:58.634	2026-06-14 19:04:58.634	T2_TUTORIAL	2026
281	103	MATH	20	30	2026-06-14 19:04:58.634	2026-06-14 19:04:58.634	2026-06-14 19:04:58.634	T2_TUTORIAL	2026
282	103	RELIGION	21	30	2026-06-14 19:04:58.635	2026-06-14 19:04:58.635	2026-06-14 19:04:58.635	T2_TUTORIAL	2026
283	103	BANGLA	52	70	2026-06-14 19:04:58.635	2026-06-14 19:04:58.635	2026-06-14 19:04:58.635	T2_FINAL	2026
284	103	ENGLISH	42	70	2026-06-14 19:04:58.636	2026-06-14 19:04:58.636	2026-06-14 19:04:58.636	T2_FINAL	2026
285	103	ICT	38	70	2026-06-14 19:04:58.636	2026-06-14 19:04:58.636	2026-06-14 19:04:58.636	T2_FINAL	2026
286	103	MATH	42	70	2026-06-14 19:04:58.637	2026-06-14 19:04:58.637	2026-06-14 19:04:58.637	T2_FINAL	2026
287	103	RELIGION	42	70	2026-06-14 19:04:58.637	2026-06-14 19:04:58.637	2026-06-14 19:04:58.637	T2_FINAL	2026
288	103	BANGLA	18	30	2026-06-14 19:04:58.638	2026-06-14 19:04:58.638	2026-06-14 19:04:58.638	T3_TUTORIAL	2026
289	103	ENGLISH	15	30	2026-06-14 19:04:58.638	2026-06-14 19:04:58.638	2026-06-14 19:04:58.638	T3_TUTORIAL	2026
290	103	ICT	26	30	2026-06-14 19:04:58.639	2026-06-14 19:04:58.639	2026-06-14 19:04:58.639	T3_TUTORIAL	2026
291	103	MATH	20	30	2026-06-14 19:04:58.639	2026-06-14 19:04:58.639	2026-06-14 19:04:58.639	T3_TUTORIAL	2026
292	103	RELIGION	19	30	2026-06-14 19:04:58.64	2026-06-14 19:04:58.64	2026-06-14 19:04:58.64	T3_TUTORIAL	2026
293	103	BANGLA	51	70	2026-06-14 19:04:58.64	2026-06-14 19:04:58.64	2026-06-14 19:04:58.64	T3_FINAL	2026
294	103	ENGLISH	38	70	2026-06-14 19:04:58.641	2026-06-14 19:04:58.641	2026-06-14 19:04:58.641	T3_FINAL	2026
295	103	ICT	59	70	2026-06-14 19:04:58.647	2026-06-14 19:04:58.647	2026-06-14 19:04:58.647	T3_FINAL	2026
296	103	MATH	47	70	2026-06-14 19:04:58.648	2026-06-14 19:04:58.648	2026-06-14 19:04:58.648	T3_FINAL	2026
297	103	RELIGION	58	70	2026-06-14 19:04:58.649	2026-06-14 19:04:58.649	2026-06-14 19:04:58.649	T3_FINAL	2026
298	104	BANGLA	22	30	2026-06-14 19:04:58.654	2026-06-14 19:04:58.654	2026-06-14 19:04:58.654	T1_TUTORIAL	2026
299	104	ENGLISH	23	30	2026-06-14 19:04:58.654	2026-06-14 19:04:58.655	2026-06-14 19:04:58.655	T1_TUTORIAL	2026
300	104	ICT	21	30	2026-06-14 19:04:58.655	2026-06-14 19:04:58.655	2026-06-14 19:04:58.655	T1_TUTORIAL	2026
301	104	MATH	26	30	2026-06-14 19:04:58.656	2026-06-14 19:04:58.656	2026-06-14 19:04:58.656	T1_TUTORIAL	2026
302	104	RELIGION	23	30	2026-06-14 19:04:58.656	2026-06-14 19:04:58.656	2026-06-14 19:04:58.656	T1_TUTORIAL	2026
303	104	BANGLA	59	70	2026-06-14 19:04:58.657	2026-06-14 19:04:58.657	2026-06-14 19:04:58.657	T1_FINAL	2026
304	104	ENGLISH	42	70	2026-06-14 19:04:58.658	2026-06-14 19:04:58.658	2026-06-14 19:04:58.658	T1_FINAL	2026
305	104	ICT	47	70	2026-06-14 19:04:58.658	2026-06-14 19:04:58.658	2026-06-14 19:04:58.658	T1_FINAL	2026
306	104	MATH	60	70	2026-06-14 19:04:58.659	2026-06-14 19:04:58.659	2026-06-14 19:04:58.659	T1_FINAL	2026
307	104	RELIGION	41	70	2026-06-14 19:04:58.659	2026-06-14 19:04:58.659	2026-06-14 19:04:58.659	T1_FINAL	2026
308	104	BANGLA	24	30	2026-06-14 19:04:58.66	2026-06-14 19:04:58.66	2026-06-14 19:04:58.66	T2_TUTORIAL	2026
309	104	ENGLISH	20	30	2026-06-14 19:04:58.66	2026-06-14 19:04:58.661	2026-06-14 19:04:58.661	T2_TUTORIAL	2026
310	104	ICT	19	30	2026-06-14 19:04:58.661	2026-06-14 19:04:58.661	2026-06-14 19:04:58.661	T2_TUTORIAL	2026
311	104	MATH	25	30	2026-06-14 19:04:58.661	2026-06-14 19:04:58.662	2026-06-14 19:04:58.662	T2_TUTORIAL	2026
312	104	RELIGION	25	30	2026-06-14 19:04:58.662	2026-06-14 19:04:58.662	2026-06-14 19:04:58.662	T2_TUTORIAL	2026
313	104	BANGLA	37	70	2026-06-14 19:04:58.662	2026-06-14 19:04:58.663	2026-06-14 19:04:58.663	T2_FINAL	2026
314	104	ENGLISH	54	70	2026-06-14 19:04:58.663	2026-06-14 19:04:58.663	2026-06-14 19:04:58.663	T2_FINAL	2026
315	104	ICT	61	70	2026-06-14 19:04:58.664	2026-06-14 19:04:58.664	2026-06-14 19:04:58.664	T2_FINAL	2026
316	104	MATH	53	70	2026-06-14 19:04:58.664	2026-06-14 19:04:58.664	2026-06-14 19:04:58.664	T2_FINAL	2026
317	104	RELIGION	40	70	2026-06-14 19:04:58.665	2026-06-14 19:04:58.665	2026-06-14 19:04:58.665	T2_FINAL	2026
318	104	BANGLA	26	30	2026-06-14 19:04:58.665	2026-06-14 19:04:58.665	2026-06-14 19:04:58.665	T3_TUTORIAL	2026
319	104	ENGLISH	18	30	2026-06-14 19:04:58.666	2026-06-14 19:04:58.666	2026-06-14 19:04:58.666	T3_TUTORIAL	2026
320	104	ICT	25	30	2026-06-14 19:04:58.666	2026-06-14 19:04:58.666	2026-06-14 19:04:58.666	T3_TUTORIAL	2026
321	104	MATH	22	30	2026-06-14 19:04:58.667	2026-06-14 19:04:58.667	2026-06-14 19:04:58.667	T3_TUTORIAL	2026
322	104	RELIGION	16	30	2026-06-14 19:04:58.667	2026-06-14 19:04:58.667	2026-06-14 19:04:58.667	T3_TUTORIAL	2026
323	104	BANGLA	36	70	2026-06-14 19:04:58.668	2026-06-14 19:04:58.668	2026-06-14 19:04:58.668	T3_FINAL	2026
324	104	ENGLISH	56	70	2026-06-14 19:04:58.668	2026-06-14 19:04:58.668	2026-06-14 19:04:58.668	T3_FINAL	2026
325	104	ICT	47	70	2026-06-14 19:04:58.669	2026-06-14 19:04:58.669	2026-06-14 19:04:58.669	T3_FINAL	2026
326	104	MATH	35	70	2026-06-14 19:04:58.67	2026-06-14 19:04:58.67	2026-06-14 19:04:58.67	T3_FINAL	2026
327	104	RELIGION	50	70	2026-06-14 19:04:58.67	2026-06-14 19:04:58.67	2026-06-14 19:04:58.67	T3_FINAL	2026
328	105	BANGLA	20	30	2026-06-14 19:04:58.674	2026-06-14 19:04:58.674	2026-06-14 19:04:58.674	T1_TUTORIAL	2026
329	105	ENGLISH	17	30	2026-06-14 19:04:58.675	2026-06-14 19:04:58.675	2026-06-14 19:04:58.675	T1_TUTORIAL	2026
330	105	ICT	25	30	2026-06-14 19:04:58.675	2026-06-14 19:04:58.675	2026-06-14 19:04:58.675	T1_TUTORIAL	2026
331	105	MATH	17	30	2026-06-14 19:04:58.676	2026-06-14 19:04:58.676	2026-06-14 19:04:58.676	T1_TUTORIAL	2026
332	105	RELIGION	15	30	2026-06-14 19:04:58.676	2026-06-14 19:04:58.676	2026-06-14 19:04:58.676	T1_TUTORIAL	2026
333	105	BANGLA	45	70	2026-06-14 19:04:58.677	2026-06-14 19:04:58.677	2026-06-14 19:04:58.677	T1_FINAL	2026
334	105	ENGLISH	42	70	2026-06-14 19:04:58.677	2026-06-14 19:04:58.677	2026-06-14 19:04:58.677	T1_FINAL	2026
335	105	ICT	60	70	2026-06-14 19:04:58.678	2026-06-14 19:04:58.678	2026-06-14 19:04:58.678	T1_FINAL	2026
336	105	MATH	54	70	2026-06-14 19:04:58.678	2026-06-14 19:04:58.678	2026-06-14 19:04:58.678	T1_FINAL	2026
337	105	RELIGION	38	70	2026-06-14 19:04:58.679	2026-06-14 19:04:58.679	2026-06-14 19:04:58.679	T1_FINAL	2026
338	105	BANGLA	26	30	2026-06-14 19:04:58.679	2026-06-14 19:04:58.679	2026-06-14 19:04:58.679	T2_TUTORIAL	2026
339	105	ENGLISH	17	30	2026-06-14 19:04:58.68	2026-06-14 19:04:58.68	2026-06-14 19:04:58.68	T2_TUTORIAL	2026
340	105	ICT	27	30	2026-06-14 19:04:58.68	2026-06-14 19:04:58.68	2026-06-14 19:04:58.68	T2_TUTORIAL	2026
341	105	MATH	19	30	2026-06-14 19:04:58.681	2026-06-14 19:04:58.681	2026-06-14 19:04:58.681	T2_TUTORIAL	2026
342	105	RELIGION	24	30	2026-06-14 19:04:58.681	2026-06-14 19:04:58.681	2026-06-14 19:04:58.681	T2_TUTORIAL	2026
343	105	BANGLA	60	70	2026-06-14 19:04:58.682	2026-06-14 19:04:58.682	2026-06-14 19:04:58.682	T2_FINAL	2026
344	105	ENGLISH	51	70	2026-06-14 19:04:58.682	2026-06-14 19:04:58.682	2026-06-14 19:04:58.682	T2_FINAL	2026
345	105	ICT	39	70	2026-06-14 19:04:58.683	2026-06-14 19:04:58.683	2026-06-14 19:04:58.683	T2_FINAL	2026
346	105	MATH	53	70	2026-06-14 19:04:58.683	2026-06-14 19:04:58.684	2026-06-14 19:04:58.684	T2_FINAL	2026
347	105	RELIGION	38	70	2026-06-14 19:04:58.684	2026-06-14 19:04:58.684	2026-06-14 19:04:58.684	T2_FINAL	2026
348	105	BANGLA	21	30	2026-06-14 19:04:58.684	2026-06-14 19:04:58.685	2026-06-14 19:04:58.685	T3_TUTORIAL	2026
349	105	ENGLISH	16	30	2026-06-14 19:04:58.685	2026-06-14 19:04:58.685	2026-06-14 19:04:58.685	T3_TUTORIAL	2026
350	105	ICT	19	30	2026-06-14 19:04:58.685	2026-06-14 19:04:58.686	2026-06-14 19:04:58.686	T3_TUTORIAL	2026
351	105	MATH	20	30	2026-06-14 19:04:58.686	2026-06-14 19:04:58.686	2026-06-14 19:04:58.686	T3_TUTORIAL	2026
352	105	RELIGION	25	30	2026-06-14 19:04:58.686	2026-06-14 19:04:58.687	2026-06-14 19:04:58.687	T3_TUTORIAL	2026
353	105	BANGLA	61	70	2026-06-14 19:04:58.687	2026-06-14 19:04:58.687	2026-06-14 19:04:58.687	T3_FINAL	2026
354	105	ENGLISH	41	70	2026-06-14 19:04:58.687	2026-06-14 19:04:58.688	2026-06-14 19:04:58.688	T3_FINAL	2026
355	105	ICT	56	70	2026-06-14 19:04:58.688	2026-06-14 19:04:58.688	2026-06-14 19:04:58.688	T3_FINAL	2026
356	105	MATH	37	70	2026-06-14 19:04:58.688	2026-06-14 19:04:58.688	2026-06-14 19:04:58.688	T3_FINAL	2026
357	105	RELIGION	40	70	2026-06-14 19:04:58.689	2026-06-14 19:04:58.689	2026-06-14 19:04:58.689	T3_FINAL	2026
358	106	BANGLA	18	30	2026-06-14 19:04:58.693	2026-06-14 19:04:58.693	2026-06-14 19:04:58.693	T1_TUTORIAL	2026
359	106	ENGLISH	25	30	2026-06-14 19:04:58.693	2026-06-14 19:04:58.693	2026-06-14 19:04:58.693	T1_TUTORIAL	2026
360	106	ICT	26	30	2026-06-14 19:04:58.694	2026-06-14 19:04:58.694	2026-06-14 19:04:58.694	T1_TUTORIAL	2026
361	106	MATH	20	30	2026-06-14 19:04:58.694	2026-06-14 19:04:58.694	2026-06-14 19:04:58.694	T1_TUTORIAL	2026
362	106	RELIGION	16	30	2026-06-14 19:04:58.695	2026-06-14 19:04:58.695	2026-06-14 19:04:58.695	T1_TUTORIAL	2026
363	106	BANGLA	37	70	2026-06-14 19:04:58.695	2026-06-14 19:04:58.695	2026-06-14 19:04:58.695	T1_FINAL	2026
364	106	ENGLISH	57	70	2026-06-14 19:04:58.696	2026-06-14 19:04:58.696	2026-06-14 19:04:58.696	T1_FINAL	2026
365	106	ICT	41	70	2026-06-14 19:04:58.696	2026-06-14 19:04:58.696	2026-06-14 19:04:58.696	T1_FINAL	2026
366	106	MATH	49	70	2026-06-14 19:04:58.697	2026-06-14 19:04:58.698	2026-06-14 19:04:58.698	T1_FINAL	2026
367	106	RELIGION	44	70	2026-06-14 19:04:58.699	2026-06-14 19:04:58.699	2026-06-14 19:04:58.699	T1_FINAL	2026
368	106	BANGLA	23	30	2026-06-14 19:04:58.699	2026-06-14 19:04:58.699	2026-06-14 19:04:58.699	T2_TUTORIAL	2026
369	106	ENGLISH	24	30	2026-06-14 19:04:58.7	2026-06-14 19:04:58.7	2026-06-14 19:04:58.7	T2_TUTORIAL	2026
370	106	ICT	19	30	2026-06-14 19:04:58.701	2026-06-14 19:04:58.701	2026-06-14 19:04:58.701	T2_TUTORIAL	2026
371	106	MATH	23	30	2026-06-14 19:04:58.701	2026-06-14 19:04:58.701	2026-06-14 19:04:58.701	T2_TUTORIAL	2026
372	106	RELIGION	15	30	2026-06-14 19:04:58.702	2026-06-14 19:04:58.702	2026-06-14 19:04:58.702	T2_TUTORIAL	2026
373	106	BANGLA	43	70	2026-06-14 19:04:58.702	2026-06-14 19:04:58.702	2026-06-14 19:04:58.702	T2_FINAL	2026
374	106	ENGLISH	63	70	2026-06-14 19:04:58.703	2026-06-14 19:04:58.703	2026-06-14 19:04:58.703	T2_FINAL	2026
375	106	ICT	36	70	2026-06-14 19:04:58.703	2026-06-14 19:04:58.703	2026-06-14 19:04:58.703	T2_FINAL	2026
376	106	MATH	62	70	2026-06-14 19:04:58.704	2026-06-14 19:04:58.704	2026-06-14 19:04:58.704	T2_FINAL	2026
377	106	RELIGION	53	70	2026-06-14 19:04:58.704	2026-06-14 19:04:58.704	2026-06-14 19:04:58.704	T2_FINAL	2026
378	106	BANGLA	22	30	2026-06-14 19:04:58.705	2026-06-14 19:04:58.705	2026-06-14 19:04:58.705	T3_TUTORIAL	2026
379	106	ENGLISH	23	30	2026-06-14 19:04:58.706	2026-06-14 19:04:58.706	2026-06-14 19:04:58.706	T3_TUTORIAL	2026
380	106	ICT	24	30	2026-06-14 19:04:58.706	2026-06-14 19:04:58.706	2026-06-14 19:04:58.706	T3_TUTORIAL	2026
381	106	MATH	20	30	2026-06-14 19:04:58.707	2026-06-14 19:04:58.707	2026-06-14 19:04:58.707	T3_TUTORIAL	2026
382	106	RELIGION	21	30	2026-06-14 19:04:58.707	2026-06-14 19:04:58.707	2026-06-14 19:04:58.707	T3_TUTORIAL	2026
383	106	BANGLA	53	70	2026-06-14 19:04:58.708	2026-06-14 19:04:58.708	2026-06-14 19:04:58.708	T3_FINAL	2026
384	106	ENGLISH	35	70	2026-06-14 19:04:58.708	2026-06-14 19:04:58.708	2026-06-14 19:04:58.708	T3_FINAL	2026
385	106	ICT	58	70	2026-06-14 19:04:58.709	2026-06-14 19:04:58.709	2026-06-14 19:04:58.709	T3_FINAL	2026
386	106	MATH	42	70	2026-06-14 19:04:58.709	2026-06-14 19:04:58.709	2026-06-14 19:04:58.709	T3_FINAL	2026
387	106	RELIGION	41	70	2026-06-14 19:04:58.71	2026-06-14 19:04:58.71	2026-06-14 19:04:58.71	T3_FINAL	2026
388	126	BANGLA	27	30	2026-06-14 19:04:58.713	2026-06-14 19:04:58.713	2026-06-14 19:04:58.713	T1_TUTORIAL	2026
389	126	ENGLISH	23	30	2026-06-14 19:04:58.714	2026-06-14 19:04:58.714	2026-06-14 19:04:58.714	T1_TUTORIAL	2026
390	126	ICT	18	30	2026-06-14 19:04:58.714	2026-06-14 19:04:58.714	2026-06-14 19:04:58.714	T1_TUTORIAL	2026
391	126	MATH	20	30	2026-06-14 19:04:58.715	2026-06-14 19:04:58.715	2026-06-14 19:04:58.715	T1_TUTORIAL	2026
392	126	RELIGION	15	30	2026-06-14 19:04:58.715	2026-06-14 19:04:58.715	2026-06-14 19:04:58.715	T1_TUTORIAL	2026
393	126	BANGLA	49	70	2026-06-14 19:04:58.716	2026-06-14 19:04:58.716	2026-06-14 19:04:58.716	T1_FINAL	2026
394	126	ENGLISH	57	70	2026-06-14 19:04:58.716	2026-06-14 19:04:58.716	2026-06-14 19:04:58.716	T1_FINAL	2026
395	126	ICT	43	70	2026-06-14 19:04:58.717	2026-06-14 19:04:58.717	2026-06-14 19:04:58.717	T1_FINAL	2026
396	126	MATH	44	70	2026-06-14 19:04:58.717	2026-06-14 19:04:58.717	2026-06-14 19:04:58.717	T1_FINAL	2026
397	126	RELIGION	62	70	2026-06-14 19:04:58.718	2026-06-14 19:04:58.718	2026-06-14 19:04:58.718	T1_FINAL	2026
398	126	BANGLA	21	30	2026-06-14 19:04:58.718	2026-06-14 19:04:58.718	2026-06-14 19:04:58.718	T2_TUTORIAL	2026
399	126	ENGLISH	15	30	2026-06-14 19:04:58.719	2026-06-14 19:04:58.719	2026-06-14 19:04:58.719	T2_TUTORIAL	2026
400	126	ICT	24	30	2026-06-14 19:04:58.719	2026-06-14 19:04:58.719	2026-06-14 19:04:58.719	T2_TUTORIAL	2026
401	126	MATH	15	30	2026-06-14 19:04:58.72	2026-06-14 19:04:58.72	2026-06-14 19:04:58.72	T2_TUTORIAL	2026
402	126	RELIGION	18	30	2026-06-14 19:04:58.72	2026-06-14 19:04:58.72	2026-06-14 19:04:58.72	T2_TUTORIAL	2026
403	126	BANGLA	64	70	2026-06-14 19:04:58.721	2026-06-14 19:04:58.721	2026-06-14 19:04:58.721	T2_FINAL	2026
404	126	ENGLISH	64	70	2026-06-14 19:04:58.721	2026-06-14 19:04:58.721	2026-06-14 19:04:58.721	T2_FINAL	2026
405	126	ICT	55	70	2026-06-14 19:04:58.722	2026-06-14 19:04:58.722	2026-06-14 19:04:58.722	T2_FINAL	2026
406	126	MATH	45	70	2026-06-14 19:04:58.722	2026-06-14 19:04:58.722	2026-06-14 19:04:58.722	T2_FINAL	2026
407	126	RELIGION	61	70	2026-06-14 19:04:58.723	2026-06-14 19:04:58.723	2026-06-14 19:04:58.723	T2_FINAL	2026
408	126	BANGLA	16	30	2026-06-14 19:04:58.723	2026-06-14 19:04:58.723	2026-06-14 19:04:58.723	T3_TUTORIAL	2026
409	126	ENGLISH	21	30	2026-06-14 19:04:58.724	2026-06-14 19:04:58.724	2026-06-14 19:04:58.724	T3_TUTORIAL	2026
410	126	ICT	26	30	2026-06-14 19:04:58.724	2026-06-14 19:04:58.724	2026-06-14 19:04:58.724	T3_TUTORIAL	2026
411	126	MATH	20	30	2026-06-14 19:04:58.725	2026-06-14 19:04:58.725	2026-06-14 19:04:58.725	T3_TUTORIAL	2026
412	126	RELIGION	20	30	2026-06-14 19:04:58.725	2026-06-14 19:04:58.725	2026-06-14 19:04:58.725	T3_TUTORIAL	2026
413	126	BANGLA	40	70	2026-06-14 19:04:58.726	2026-06-14 19:04:58.726	2026-06-14 19:04:58.726	T3_FINAL	2026
414	126	ENGLISH	48	70	2026-06-14 19:04:58.726	2026-06-14 19:04:58.726	2026-06-14 19:04:58.726	T3_FINAL	2026
415	126	ICT	43	70	2026-06-14 19:04:58.727	2026-06-14 19:04:58.727	2026-06-14 19:04:58.727	T3_FINAL	2026
416	126	MATH	52	70	2026-06-14 19:04:58.727	2026-06-14 19:04:58.727	2026-06-14 19:04:58.727	T3_FINAL	2026
417	126	RELIGION	63	70	2026-06-14 19:04:58.728	2026-06-14 19:04:58.728	2026-06-14 19:04:58.728	T3_FINAL	2026
418	127	BANGLA	24	30	2026-06-14 19:04:58.732	2026-06-14 19:04:58.732	2026-06-14 19:04:58.732	T1_TUTORIAL	2026
419	127	ENGLISH	15	30	2026-06-14 19:04:58.732	2026-06-14 19:04:58.732	2026-06-14 19:04:58.732	T1_TUTORIAL	2026
420	127	ICT	19	30	2026-06-14 19:04:58.733	2026-06-14 19:04:58.733	2026-06-14 19:04:58.733	T1_TUTORIAL	2026
421	127	MATH	25	30	2026-06-14 19:04:58.733	2026-06-14 19:04:58.733	2026-06-14 19:04:58.733	T1_TUTORIAL	2026
422	127	RELIGION	26	30	2026-06-14 19:04:58.734	2026-06-14 19:04:58.734	2026-06-14 19:04:58.734	T1_TUTORIAL	2026
423	127	BANGLA	39	70	2026-06-14 19:04:58.734	2026-06-14 19:04:58.734	2026-06-14 19:04:58.734	T1_FINAL	2026
424	127	ENGLISH	59	70	2026-06-14 19:04:58.735	2026-06-14 19:04:58.735	2026-06-14 19:04:58.735	T1_FINAL	2026
425	127	ICT	63	70	2026-06-14 19:04:58.735	2026-06-14 19:04:58.735	2026-06-14 19:04:58.735	T1_FINAL	2026
426	127	MATH	64	70	2026-06-14 19:04:58.736	2026-06-14 19:04:58.736	2026-06-14 19:04:58.736	T1_FINAL	2026
427	127	RELIGION	35	70	2026-06-14 19:04:58.736	2026-06-14 19:04:58.736	2026-06-14 19:04:58.736	T1_FINAL	2026
428	127	BANGLA	22	30	2026-06-14 19:04:58.737	2026-06-14 19:04:58.737	2026-06-14 19:04:58.737	T2_TUTORIAL	2026
429	127	ENGLISH	26	30	2026-06-14 19:04:58.737	2026-06-14 19:04:58.738	2026-06-14 19:04:58.738	T2_TUTORIAL	2026
430	127	ICT	25	30	2026-06-14 19:04:58.738	2026-06-14 19:04:58.738	2026-06-14 19:04:58.738	T2_TUTORIAL	2026
431	127	MATH	18	30	2026-06-14 19:04:58.738	2026-06-14 19:04:58.739	2026-06-14 19:04:58.739	T2_TUTORIAL	2026
432	127	RELIGION	20	30	2026-06-14 19:04:58.739	2026-06-14 19:04:58.739	2026-06-14 19:04:58.739	T2_TUTORIAL	2026
433	127	BANGLA	46	70	2026-06-14 19:04:58.74	2026-06-14 19:04:58.74	2026-06-14 19:04:58.74	T2_FINAL	2026
434	127	ENGLISH	38	70	2026-06-14 19:04:58.74	2026-06-14 19:04:58.74	2026-06-14 19:04:58.74	T2_FINAL	2026
435	127	ICT	54	70	2026-06-14 19:04:58.741	2026-06-14 19:04:58.741	2026-06-14 19:04:58.741	T2_FINAL	2026
436	127	MATH	37	70	2026-06-14 19:04:58.741	2026-06-14 19:04:58.741	2026-06-14 19:04:58.741	T2_FINAL	2026
437	127	RELIGION	57	70	2026-06-14 19:04:58.742	2026-06-14 19:04:58.742	2026-06-14 19:04:58.742	T2_FINAL	2026
438	127	BANGLA	21	30	2026-06-14 19:04:58.742	2026-06-14 19:04:58.742	2026-06-14 19:04:58.742	T3_TUTORIAL	2026
439	127	ENGLISH	19	30	2026-06-14 19:04:58.743	2026-06-14 19:04:58.743	2026-06-14 19:04:58.743	T3_TUTORIAL	2026
440	127	ICT	26	30	2026-06-14 19:04:58.743	2026-06-14 19:04:58.743	2026-06-14 19:04:58.743	T3_TUTORIAL	2026
441	127	MATH	24	30	2026-06-14 19:04:58.744	2026-06-14 19:04:58.744	2026-06-14 19:04:58.744	T3_TUTORIAL	2026
442	127	RELIGION	27	30	2026-06-14 19:04:58.744	2026-06-14 19:04:58.744	2026-06-14 19:04:58.744	T3_TUTORIAL	2026
443	127	BANGLA	36	70	2026-06-14 19:04:58.745	2026-06-14 19:04:58.745	2026-06-14 19:04:58.745	T3_FINAL	2026
444	127	ENGLISH	62	70	2026-06-14 19:04:58.745	2026-06-14 19:04:58.745	2026-06-14 19:04:58.745	T3_FINAL	2026
445	127	ICT	40	70	2026-06-14 19:04:58.746	2026-06-14 19:04:58.746	2026-06-14 19:04:58.746	T3_FINAL	2026
446	127	MATH	55	70	2026-06-14 19:04:58.746	2026-06-14 19:04:58.746	2026-06-14 19:04:58.746	T3_FINAL	2026
447	127	RELIGION	38	70	2026-06-14 19:04:58.747	2026-06-14 19:04:58.747	2026-06-14 19:04:58.747	T3_FINAL	2026
448	128	BANGLA	26	30	2026-06-14 19:04:58.751	2026-06-14 19:04:58.751	2026-06-14 19:04:58.751	T1_TUTORIAL	2026
449	128	ENGLISH	27	30	2026-06-14 19:04:58.752	2026-06-14 19:04:58.752	2026-06-14 19:04:58.752	T1_TUTORIAL	2026
450	128	ICT	19	30	2026-06-14 19:04:58.752	2026-06-14 19:04:58.752	2026-06-14 19:04:58.752	T1_TUTORIAL	2026
451	128	MATH	27	30	2026-06-14 19:04:58.753	2026-06-14 19:04:58.753	2026-06-14 19:04:58.753	T1_TUTORIAL	2026
452	128	RELIGION	26	30	2026-06-14 19:04:58.753	2026-06-14 19:04:58.754	2026-06-14 19:04:58.754	T1_TUTORIAL	2026
453	128	BANGLA	54	70	2026-06-14 19:04:58.754	2026-06-14 19:04:58.754	2026-06-14 19:04:58.754	T1_FINAL	2026
454	128	ENGLISH	37	70	2026-06-14 19:04:58.755	2026-06-14 19:04:58.755	2026-06-14 19:04:58.755	T1_FINAL	2026
455	128	ICT	58	70	2026-06-14 19:04:58.757	2026-06-14 19:04:58.757	2026-06-14 19:04:58.757	T1_FINAL	2026
456	128	MATH	52	70	2026-06-14 19:04:58.758	2026-06-14 19:04:58.758	2026-06-14 19:04:58.758	T1_FINAL	2026
457	128	RELIGION	40	70	2026-06-14 19:04:58.758	2026-06-14 19:04:58.758	2026-06-14 19:04:58.758	T1_FINAL	2026
458	128	BANGLA	18	30	2026-06-14 19:04:58.759	2026-06-14 19:04:58.759	2026-06-14 19:04:58.759	T2_TUTORIAL	2026
459	128	ENGLISH	18	30	2026-06-14 19:04:58.759	2026-06-14 19:04:58.759	2026-06-14 19:04:58.759	T2_TUTORIAL	2026
460	128	ICT	18	30	2026-06-14 19:04:58.76	2026-06-14 19:04:58.76	2026-06-14 19:04:58.76	T2_TUTORIAL	2026
461	128	MATH	17	30	2026-06-14 19:04:58.761	2026-06-14 19:04:58.761	2026-06-14 19:04:58.761	T2_TUTORIAL	2026
462	128	RELIGION	18	30	2026-06-14 19:04:58.761	2026-06-14 19:04:58.761	2026-06-14 19:04:58.761	T2_TUTORIAL	2026
463	128	BANGLA	53	70	2026-06-14 19:04:58.762	2026-06-14 19:04:58.762	2026-06-14 19:04:58.762	T2_FINAL	2026
464	128	ENGLISH	38	70	2026-06-14 19:04:58.762	2026-06-14 19:04:58.762	2026-06-14 19:04:58.762	T2_FINAL	2026
465	128	ICT	57	70	2026-06-14 19:04:58.763	2026-06-14 19:04:58.763	2026-06-14 19:04:58.763	T2_FINAL	2026
466	128	MATH	55	70	2026-06-14 19:04:58.763	2026-06-14 19:04:58.763	2026-06-14 19:04:58.763	T2_FINAL	2026
467	128	RELIGION	51	70	2026-06-14 19:04:58.764	2026-06-14 19:04:58.764	2026-06-14 19:04:58.764	T2_FINAL	2026
468	128	BANGLA	27	30	2026-06-14 19:04:58.764	2026-06-14 19:04:58.764	2026-06-14 19:04:58.764	T3_TUTORIAL	2026
469	128	ENGLISH	25	30	2026-06-14 19:04:58.765	2026-06-14 19:04:58.765	2026-06-14 19:04:58.765	T3_TUTORIAL	2026
470	128	ICT	23	30	2026-06-14 19:04:58.765	2026-06-14 19:04:58.765	2026-06-14 19:04:58.765	T3_TUTORIAL	2026
471	128	MATH	24	30	2026-06-14 19:04:58.766	2026-06-14 19:04:58.766	2026-06-14 19:04:58.766	T3_TUTORIAL	2026
472	128	RELIGION	25	30	2026-06-14 19:04:58.766	2026-06-14 19:04:58.766	2026-06-14 19:04:58.766	T3_TUTORIAL	2026
473	128	BANGLA	46	70	2026-06-14 19:04:58.767	2026-06-14 19:04:58.767	2026-06-14 19:04:58.767	T3_FINAL	2026
474	128	ENGLISH	35	70	2026-06-14 19:04:58.767	2026-06-14 19:04:58.767	2026-06-14 19:04:58.767	T3_FINAL	2026
475	128	ICT	59	70	2026-06-14 19:04:58.768	2026-06-14 19:04:58.768	2026-06-14 19:04:58.768	T3_FINAL	2026
476	128	MATH	36	70	2026-06-14 19:04:58.768	2026-06-14 19:04:58.768	2026-06-14 19:04:58.768	T3_FINAL	2026
477	128	RELIGION	56	70	2026-06-14 19:04:58.769	2026-06-14 19:04:58.769	2026-06-14 19:04:58.769	T3_FINAL	2026
478	129	BANGLA	22	30	2026-06-14 19:04:58.772	2026-06-14 19:04:58.773	2026-06-14 19:04:58.773	T1_TUTORIAL	2026
479	129	ENGLISH	24	30	2026-06-14 19:04:58.773	2026-06-14 19:04:58.773	2026-06-14 19:04:58.773	T1_TUTORIAL	2026
480	129	ICT	18	30	2026-06-14 19:04:58.773	2026-06-14 19:04:58.773	2026-06-14 19:04:58.773	T1_TUTORIAL	2026
481	129	MATH	23	30	2026-06-14 19:04:58.774	2026-06-14 19:04:58.774	2026-06-14 19:04:58.774	T1_TUTORIAL	2026
482	129	RELIGION	24	30	2026-06-14 19:04:58.774	2026-06-14 19:04:58.774	2026-06-14 19:04:58.774	T1_TUTORIAL	2026
483	129	BANGLA	37	70	2026-06-14 19:04:58.775	2026-06-14 19:04:58.775	2026-06-14 19:04:58.775	T1_FINAL	2026
484	129	ENGLISH	38	70	2026-06-14 19:04:58.775	2026-06-14 19:04:58.776	2026-06-14 19:04:58.776	T1_FINAL	2026
485	129	ICT	43	70	2026-06-14 19:04:58.776	2026-06-14 19:04:58.776	2026-06-14 19:04:58.776	T1_FINAL	2026
486	129	MATH	53	70	2026-06-14 19:04:58.777	2026-06-14 19:04:58.777	2026-06-14 19:04:58.777	T1_FINAL	2026
487	129	RELIGION	35	70	2026-06-14 19:04:58.777	2026-06-14 19:04:58.777	2026-06-14 19:04:58.777	T1_FINAL	2026
488	129	BANGLA	19	30	2026-06-14 19:04:58.778	2026-06-14 19:04:58.778	2026-06-14 19:04:58.778	T2_TUTORIAL	2026
489	129	ENGLISH	26	30	2026-06-14 19:04:58.778	2026-06-14 19:04:58.778	2026-06-14 19:04:58.778	T2_TUTORIAL	2026
490	129	ICT	21	30	2026-06-14 19:04:58.779	2026-06-14 19:04:58.779	2026-06-14 19:04:58.779	T2_TUTORIAL	2026
491	129	MATH	18	30	2026-06-14 19:04:58.779	2026-06-14 19:04:58.779	2026-06-14 19:04:58.779	T2_TUTORIAL	2026
492	129	RELIGION	25	30	2026-06-14 19:04:58.78	2026-06-14 19:04:58.78	2026-06-14 19:04:58.78	T2_TUTORIAL	2026
493	129	BANGLA	59	70	2026-06-14 19:04:58.78	2026-06-14 19:04:58.78	2026-06-14 19:04:58.78	T2_FINAL	2026
494	129	ENGLISH	58	70	2026-06-14 19:04:58.781	2026-06-14 19:04:58.781	2026-06-14 19:04:58.781	T2_FINAL	2026
495	129	ICT	45	70	2026-06-14 19:04:58.781	2026-06-14 19:04:58.781	2026-06-14 19:04:58.781	T2_FINAL	2026
496	129	MATH	64	70	2026-06-14 19:04:58.782	2026-06-14 19:04:58.782	2026-06-14 19:04:58.782	T2_FINAL	2026
497	129	RELIGION	51	70	2026-06-14 19:04:58.782	2026-06-14 19:04:58.782	2026-06-14 19:04:58.782	T2_FINAL	2026
498	129	BANGLA	24	30	2026-06-14 19:04:58.783	2026-06-14 19:04:58.783	2026-06-14 19:04:58.783	T3_TUTORIAL	2026
499	129	ENGLISH	15	30	2026-06-14 19:04:58.783	2026-06-14 19:04:58.783	2026-06-14 19:04:58.783	T3_TUTORIAL	2026
500	129	ICT	16	30	2026-06-14 19:04:58.784	2026-06-14 19:04:58.784	2026-06-14 19:04:58.784	T3_TUTORIAL	2026
501	129	MATH	27	30	2026-06-14 19:04:58.784	2026-06-14 19:04:58.784	2026-06-14 19:04:58.784	T3_TUTORIAL	2026
502	129	RELIGION	25	30	2026-06-14 19:04:58.784	2026-06-14 19:04:58.785	2026-06-14 19:04:58.785	T3_TUTORIAL	2026
503	129	BANGLA	59	70	2026-06-14 19:04:58.785	2026-06-14 19:04:58.785	2026-06-14 19:04:58.785	T3_FINAL	2026
504	129	ENGLISH	64	70	2026-06-14 19:04:58.786	2026-06-14 19:04:58.786	2026-06-14 19:04:58.786	T3_FINAL	2026
505	129	ICT	46	70	2026-06-14 19:04:58.786	2026-06-14 19:04:58.786	2026-06-14 19:04:58.786	T3_FINAL	2026
506	129	MATH	58	70	2026-06-14 19:04:58.786	2026-06-14 19:04:58.786	2026-06-14 19:04:58.786	T3_FINAL	2026
507	129	RELIGION	63	70	2026-06-14 19:04:58.787	2026-06-14 19:04:58.787	2026-06-14 19:04:58.787	T3_FINAL	2026
\.


--
-- Data for Name: MarkLock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MarkLock" (id, "className", subject, "examType", "lockedAt", "lockedBy", year) FROM stdin;
1	CLASS_10	MATH	Term 1	2026-06-10 20:47:18.414	1	2026
2	CLASS_10	MATH	Term 1	2026-06-10 20:52:03.404	1	2070
3	CLASS_10	MATH	Term 1	2026-06-10 20:56:09.746	1	2081
4	CLASS_10	MATH	Term 1	2026-06-10 20:56:47.967	1	2082
5	CLASS_10	MATH	Term 1	2026-06-10 20:58:13.887	1	2043
6	CLASS_10	MATH	Term 1	2026-06-10 20:58:54.895	1	2030
7	CLASS_10	MATH	Term 1	2026-06-10 21:00:13.902	1	2078
8	CLASS_10	MATH	Term 1	2026-06-10 21:01:55.206	1	2021
9	CLASS_10	MATH	Term 1	2026-06-10 21:03:34.286	1	2050
10	CLASS_10	MATH	Term 1	2026-06-10 21:04:22.354	1	2029
11	CLASS_10	MATH	Term 1	2026-06-10 21:05:31.244	1	2039
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, "userId", title, message, type, "isRead", link, "createdAt") FROM stdin;
1	1	Bulk Attendance Update	1 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-10 20:43:53.078
2	1	Bulk Attendance Update	3 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-10 20:45:34.475
3	1	Bulk Attendance Update	4 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-10 20:46:34.291
4	1	Bulk Attendance Update	5 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-10 20:47:18.391
5	1	Marks Finalized	Exam marks for MATH (Term 1) in Class CLASS_10 for 2026 have been locked by Admin User.	SUCCESS	f	/marks	2026-06-10 20:47:18.419
6	1	Bulk Attendance Update	6 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-10 20:48:41.036
7	1	Bulk Attendance Update	7 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-10 20:49:16.695
8	1	Bulk Attendance Update	8 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-10 20:50:07.615
9	1	Bulk Attendance Update	9 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-10 20:52:03.38
10	1	Marks Finalized	Exam marks for MATH (Term 1) in Class CLASS_10 for 2070 have been locked by Admin User.	SUCCESS	f	/marks	2026-06-10 20:52:03.406
11	1	Bulk Attendance Update	10 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-10 20:56:09.72
12	1	Marks Finalized	Exam marks for MATH (Term 1) in Class CLASS_10 for 2081 have been locked by Admin User.	SUCCESS	f	/marks	2026-06-10 20:56:09.748
13	1	Bulk Attendance Update	11 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-10 20:56:47.942
14	1	Marks Finalized	Exam marks for MATH (Term 1) in Class CLASS_10 for 2082 have been locked by Admin User.	SUCCESS	f	/marks	2026-06-10 20:56:47.969
15	1	Bulk Attendance Update	12 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-10 20:58:13.865
16	1	Marks Finalized	Exam marks for MATH (Term 1) in Class CLASS_10 for 2043 have been locked by Admin User.	SUCCESS	f	/marks	2026-06-10 20:58:13.89
17	1	Bulk Attendance Update	13 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-10 20:58:54.87
18	1	Marks Finalized	Exam marks for MATH (Term 1) in Class CLASS_10 for 2030 have been locked by Admin User.	SUCCESS	f	/marks	2026-06-10 20:58:54.898
19	1	Bulk Attendance Update	14 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-10 21:00:13.879
20	1	Marks Finalized	Exam marks for MATH (Term 1) in Class CLASS_10 for 2078 have been locked by Admin User.	SUCCESS	f	/marks	2026-06-10 21:00:13.905
21	1	Bulk Attendance Update	15 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-10 21:01:55.18
22	1	Marks Finalized	Exam marks for MATH (Term 1) in Class CLASS_10 for 2021 have been locked by Admin User.	SUCCESS	f	/marks	2026-06-10 21:01:55.209
23	1	Bulk Attendance Update	16 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-10 21:03:34.262
24	1	Marks Finalized	Exam marks for MATH (Term 1) in Class CLASS_10 for 2050 have been locked by Admin User.	SUCCESS	f	/marks	2026-06-10 21:03:34.288
25	1	Bulk Attendance Update	17 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-10 21:04:22.325
26	1	Marks Finalized	Exam marks for MATH (Term 1) in Class CLASS_10 for 2029 have been locked by Admin User.	SUCCESS	f	/marks	2026-06-10 21:04:22.356
27	1	Bulk Attendance Update	18 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-10 21:05:31.22
28	1	Marks Finalized	Exam marks for MATH (Term 1) in Class CLASS_10 for 2039 have been locked by Admin User.	SUCCESS	f	/marks	2026-06-10 21:05:31.246
29	1	Bulk Attendance Update	13 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-13 09:58:01.349
30	1	Bulk Attendance Update	14 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-13 09:59:32.692
31	1	Bulk Attendance Update	15 attendance records were processed by Admin User.	INFO	f	/attendance	2026-06-14 17:30:30.077
\.


--
-- Data for Name: PayrollRecord; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PayrollRecord" (id, "userId", month, year, "paymentDate", status, allowances, "baseSalary", deductions, "netPay", "paymentMethod") FROM stdin;
ee9c7719-f954-463d-9fc9-6670057df815	10	6	2026	2026-06-10 20:58:14.827	PENDING	5000	30000	1000	34000	CASH
d873dc18-6112-4295-b672-0f239a9c1a27	11	6	2026	2026-06-10 20:58:55.842	PENDING	5000	30000	1000	34000	CASH
5c984ff2-e733-4f77-990e-04610114f7cd	12	6	2026	2026-06-10 21:00:14.921	PENDING	5000	30000	1000	34000	CASH
c546c0c3-b6b4-4e17-a554-1b1fef742ce8	13	6	2026	2026-06-10 21:01:56.158	PENDING	5000	30000	1000	34000	CASH
840ef78b-0d89-4d1d-b220-ced716621d73	14	6	2026	2026-06-10 21:03:35.244	PENDING	5000	30000	1000	34000	CASH
e5134924-476d-45ac-bcd1-a8cc8bc4278b	15	6	2026	2026-06-10 21:04:23.3	PENDING	5000	30000	1000	34000	CASH
0e762919-34ea-458f-b80b-c6e6bd3a1663	16	6	2026	2026-06-10 21:05:32.227	PAID	5000	30000	1000	34000	CASH
\.


--
-- Data for Name: Period; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Period" (id, "routineId", "subjectId", "teacherId", "startTime", "endTime", "periodNumber") FROM stdin;
\.


--
-- Data for Name: Question; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Question" (id, "questionPaperId", "questionType", "questionText", marks, "order", "correctAnswer", instructions, options) FROM stdin;
\.


--
-- Data for Name: QuestionPaper; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."QuestionPaper" (id, title, "className", section, subject, "examType", "totalMarks", duration, "examDate", "createdBy", "createdAt", "updatedAt", instructions, status, "isTemplate", "templateId") FROM stdin;
6b1b0be7-a79c-4292-b24e-821810e84228	Test Paper	CLASS_5	\N	MATH	Term 1	100	120	\N	1	2026-06-10 21:04:23.357	2026-06-10 21:04:23.357	\N	DRAFT	f	\N
01a860ad-8052-4d3b-9db5-3feb70b31aed	Test Paper	CLASS_5	\N	MATH	Term 1	100	120	\N	1	2026-06-10 21:05:32.285	2026-06-10 21:05:32.285	\N	DRAFT	f	\N
\.


--
-- Data for Name: RefreshToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RefreshToken" (id, token, "userId", "expiresAt", "createdAt") FROM stdin;
1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgwODIwOTY1LCJleHAiOjE3ODE0MjU3NjV9.UNGY424i6Px-xq3SEMFE27YyJ65-WoyBAa-bsfNHUbc	1	2026-06-14 08:29:25.765	2026-06-07 08:29:25.771
2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgwODI1MzExLCJleHAiOjE3ODE0MzAxMTF9.Z8VnGevMfMCy4UT6avCqdCkbwRbp7SLGHrVQWCK7f90	1	2026-06-14 09:41:51.587	2026-06-07 09:41:51.588
3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTIzNzY2LCJleHAiOjE3ODE3Mjg1NjZ9.nA3d1txMdG3OmsxCGCCFqIdVaHVVHlzjSwk_fsfS_AI	1	2026-06-17 20:36:06.379	2026-06-10 20:36:06.387
4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTIzODA5LCJleHAiOjE3ODE3Mjg2MDl9._OaXvxBYYdGF69XwFzTXjs8_t5kTj33c7Vm7u3AMqmY	1	2026-06-17 20:36:49.66	2026-06-10 20:36:49.67
5	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTIzODUxLCJleHAiOjE3ODE3Mjg2NTF9.Z8W2gMrZeaTfQtKsdW254B8ORGEGSkiGgDeVYKazy-4	1	2026-06-17 20:37:31.043	2026-06-10 20:37:31.052
6	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTIzOTUxLCJleHAiOjE3ODE3Mjg3NTF9.A8gctWnirfwc9xDI_1YxK0UGGcKRM-fAbZFDBBFByDM	1	2026-06-17 20:39:11.655	2026-06-10 20:39:11.667
7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTIzOTk1LCJleHAiOjE3ODE3Mjg3OTV9._BSpKQtLpLdfkGZUdIPwOCn9Utja5DSdOzEz727CdhY	1	2026-06-17 20:39:55.437	2026-06-10 20:39:55.448
8	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI0MDQxLCJleHAiOjE3ODE3Mjg4NDF9.N1OSMicfDN8Jj4iWFsQ8vs9KuCOXqEH3KxsQmGNUvJc	1	2026-06-17 20:40:41.489	2026-06-10 20:40:41.499
9	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI0MDk0LCJleHAiOjE3ODE3Mjg4OTR9.LrSD_8yRWSU9FF3_kOrI3S7e32ob7V2mAbujqsU6s08	1	2026-06-17 20:41:34.439	2026-06-10 20:41:34.447
10	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI0MTMyLCJleHAiOjE3ODE3Mjg5MzJ9.PIgx2hwzg2-Qd3_nJ0vppSAa6qnC07KTQtucp28YmN8	1	2026-06-17 20:42:12.796	2026-06-10 20:42:12.802
11	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI0MTc1LCJleHAiOjE3ODE3Mjg5NzV9.6URac31lXOlCN-ERqK1vycFnOLmG-PE2TzADkx2qhFw	1	2026-06-17 20:42:55.769	2026-06-10 20:42:55.779
12	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI0MjMyLCJleHAiOjE3ODE3MjkwMzJ9.4D0RCJUYdKHXGXkHH6kgIwRmXBXwVv4ZIM6SMT8RJrE	1	2026-06-17 20:43:52.95	2026-06-10 20:43:52.959
13	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI0Mjc5LCJleHAiOjE3ODE3MjkwNzl9.t9kdjDq1FQSmVwgA2TfeWCme1BV91mordvszxX3_Eoc	1	2026-06-17 20:44:39.991	2026-06-10 20:44:39.998
14	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI0MzM0LCJleHAiOjE3ODE3MjkxMzR9.EFysEesfDqweiJpI-CyX6HobAEmJGDdS8lPNI9gvVEA	1	2026-06-17 20:45:34.354	2026-06-10 20:45:34.361
15	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI0Mzk0LCJleHAiOjE3ODE3MjkxOTR9.9aXxMnuf-TICjbcei3Fuo5ejfsNwOrqOBhjsxztwaIA	1	2026-06-17 20:46:34.173	2026-06-10 20:46:34.179
16	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI0NDM4LCJleHAiOjE3ODE3MjkyMzh9.A_o9ZGLvUL_eFSmT3ei9lV53M3Kb3WoJeGvVs77zrF0	1	2026-06-17 20:47:18.272	2026-06-10 20:47:18.281
17	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI0NTIwLCJleHAiOjE3ODE3MjkzMjB9.gXeLCbE8sX3y87TUc3DWT4h2EN8Od1H1p4wDK0IP32Y	1	2026-06-17 20:48:40.918	2026-06-10 20:48:40.924
18	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI0NTU2LCJleHAiOjE3ODE3MjkzNTZ9._6Y1O1k-sEmgjeNJ4Ys-2APMt5vdN3XB9cO2oZka7jY	1	2026-06-17 20:49:16.592	2026-06-10 20:49:16.598
19	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI0NjA3LCJleHAiOjE3ODE3Mjk0MDd9.wdib5lQp1oTzoq7FzK0U-G-JQI2X1-pangKCJZwHOVY	1	2026-06-17 20:50:07.504	2026-06-10 20:50:07.51
20	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI0NzIzLCJleHAiOjE3ODE3Mjk1MjN9.bn1xj1evf7F3o9bmbtHNtQ6yc3RlQRVmrxqYvz5jr7E	1	2026-06-17 20:52:03.277	2026-06-10 20:52:03.283
21	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI0OTY5LCJleHAiOjE3ODE3Mjk3Njl9.s9xpuY36gr40XxPWNLRjlQxI0UId3rXUZkNAlOzhOWQ	1	2026-06-17 20:56:09.586	2026-06-10 20:56:09.592
22	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI1MDA3LCJleHAiOjE3ODE3Mjk4MDd9.KFdxhlNSEmp8HnJSj5VmuDNvKEvenLF5Uey2iLF-StE	1	2026-06-17 20:56:47.816	2026-06-10 20:56:47.826
23	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI1MDkzLCJleHAiOjE3ODE3Mjk4OTN9.fQBlp5BTCqHRCu_V-1XZY3oGd9dnMXZvNbbGCIKp0sQ	1	2026-06-17 20:58:13.72	2026-06-10 20:58:13.726
24	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI1MTM0LCJleHAiOjE3ODE3Mjk5MzR9.Ybd_WBpSIcAWaS4PiNQx9vTsddexB7WKcuPSEhEIx04	1	2026-06-17 20:58:54.745	2026-06-10 20:58:54.751
25	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI1MTYyLCJleHAiOjE3ODE3Mjk5NjJ9.85AIGpuRPBVCnVVkoweH0Wet7Wl7XaMEFtAQrCg9w5U	1	2026-06-17 20:59:22.739	2026-06-10 20:59:22.744
26	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI1MjEzLCJleHAiOjE3ODE3MzAwMTN9.O6nIuUm49RP9o9ohEWbNZU7DVYBYY22AVET3DL22iic	1	2026-06-17 21:00:13.738	2026-06-10 21:00:13.744
27	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI1MzE1LCJleHAiOjE3ODE3MzAxMTV9.6x5f85I_h_5QSmhtRheCaaScr489ZVHxMSdcjiIHpug	1	2026-06-17 21:01:55.046	2026-06-10 21:01:55.056
28	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI1NDE0LCJleHAiOjE3ODE3MzAyMTR9.SXPiQDKQTfxCDfrMQ7BQ-oa9n0e6iQmUQGXuXqDgSPE	1	2026-06-17 21:03:34.124	2026-06-10 21:03:34.13
29	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI1NDYyLCJleHAiOjE3ODE3MzAyNjJ9.Qa-5rLvIqD3y5MG5GJ779ZeJ8Ik7UeYQ9P_V5fze-qM	1	2026-06-17 21:04:22.188	2026-06-10 21:04:22.197
30	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI1NTMxLCJleHAiOjE3ODE3MzAzMzF9.ULuBZKsnNocOaA5kB-BlVsXgSZs78DBZVPP_MRiGo3k	1	2026-06-17 21:05:31.073	2026-06-10 21:05:31.079
31	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI2MDMwLCJleHAiOjE3ODE3MzA4MzB9.0REGsLHmQx5qlwYKCp9pBmfk2kt_K-dLooEUZP9-DwM	1	2026-06-17 21:13:50.126	2026-06-10 21:13:50.135
32	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMTI2MTY5LCJleHAiOjE3ODE3MzA5Njl9.5b4FwYDA5FNOhCgkcrPJL06Rj4aMTLX094ZZzu9sPQo	1	2026-06-17 21:16:09.307	2026-06-10 21:16:09.313
33	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMzQ0MTczLCJleHAiOjE3ODE5NDg5NzN9.p1Z8pD_tg7CbN8HRKnqlT8RqND8mHomG0v58frazjvs	1	2026-06-20 09:49:33.367	2026-06-13 09:49:33.381
34	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMzQ0MjI3LCJleHAiOjE3ODE5NDkwMjd9.gGKiewgJdq8cu-v8ypKneVZpFmIT7jgbmSQnCIQOTqU	1	2026-06-20 09:50:27.529	2026-06-13 09:50:27.536
35	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMzQ0Mjc4LCJleHAiOjE3ODE5NDkwNzh9.nTxMf_NkK8_MAaJ93d3Smilq-4uRwwTtR4h084QQlcE	1	2026-06-20 09:51:18.753	2026-06-13 09:51:18.759
36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMzQ0MzMwLCJleHAiOjE3ODE5NDkxMzB9.a0rcZCK9bz6a7nh0lh8Y96UuTCg1cGxJHZTzCYN5nFE	1	2026-06-20 09:52:10.943	2026-06-13 09:52:10.952
37	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMzQ0NDYxLCJleHAiOjE3ODE5NDkyNjF9.ZPHh4m_zCJRCYrLV33A2H0iOImtRzYRqd0UO1-sujOk	1	2026-06-20 09:54:21.682	2026-06-13 09:54:21.688
38	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMzQ0NTA4LCJleHAiOjE3ODE5NDkzMDh9.GGXH0CrsYKrUypcpkNVNTZGKhnKi4-w9soKgmlvOSV4	1	2026-06-20 09:55:08.387	2026-06-13 09:55:08.393
39	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMzQ0NTUwLCJleHAiOjE3ODE5NDkzNTB9.3EuN_FzzngaYE2yUw5e0E1r6TX0d2SNwa-o4VqEU4eY	1	2026-06-20 09:55:50.571	2026-06-13 09:55:50.577
40	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMzQ0NjAzLCJleHAiOjE3ODE5NDk0MDN9.EUSRkO85v3xqEQOgSFIpRc59zT7J7rL0KBtasTori6I	1	2026-06-20 09:56:43.219	2026-06-13 09:56:43.225
41	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMzQ0NjQzLCJleHAiOjE3ODE5NDk0NDN9.R7F9f3wcCb_eUdikBPI2lZ6iJacRDA-s5VvLfOrVogI	1	2026-06-20 09:57:23.703	2026-06-13 09:57:23.709
42	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMzQ0NjgxLCJleHAiOjE3ODE5NDk0ODF9.HuDbgJqWQrJEZVhec4XZrf0V-_lJrT_kwwF6o3sySJo	1	2026-06-20 09:58:01.233	2026-06-13 09:58:01.239
43	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMzQ0NzM1LCJleHAiOjE3ODE5NDk1MzV9.RWU6AgpC5spRFEzC-pWdMQ5q2urwUI5GovqRZY_NdqE	1	2026-06-20 09:58:55.507	2026-06-13 09:58:55.513
44	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMzQ0NzcyLCJleHAiOjE3ODE5NDk1NzJ9.IO8a4EaO1vU-EM2iBNwrudvCeR13brtV8XHrzAwDeRQ	1	2026-06-20 09:59:32.58	2026-06-13 09:59:32.586
45	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxNDU4MjI5LCJleHAiOjE3ODIwNjMwMjl9.yixudJRRU6V64RNcrCe8ycPkOCCbyY0gQoQNjvcC1gI	1	2026-06-21 17:30:29.676	2026-06-14 17:30:29.689
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Role" (id, name, description, "createdAt", "updatedAt") FROM stdin;
1	ADMIN	Full system access	2026-06-07 08:28:55.539	2026-06-07 08:28:55.539
2	PRINCIPAL	Academic and administrative oversight	2026-06-07 08:28:55.541	2026-06-07 08:28:55.541
3	TEACHER	Class and student management	2026-06-07 08:28:55.542	2026-06-07 08:28:55.542
4	STAFF	General school staff	2026-06-07 08:28:55.543	2026-06-07 08:28:55.543
5	LIBRARIAN	Library management	2026-06-07 08:28:55.543	2026-06-07 08:28:55.543
6	ACCOUNTANT	Financial management	2026-06-07 08:28:55.544	2026-06-07 08:28:55.544
7	CLERK	Front desk and admissions	2026-06-07 08:28:55.544	2026-06-07 08:28:55.544
8	SECURITY	Campus security	2026-06-07 08:28:55.545	2026-06-07 08:28:55.545
9	CLEANER	Maintenance staff	2026-06-07 08:28:55.545	2026-06-07 08:28:55.545
\.


--
-- Data for Name: Routine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Routine" (id, "classSectionId", "dayOfWeek") FROM stdin;
\.


--
-- Data for Name: SchoolClass; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SchoolClass" (name) FROM stdin;
CLASS_1
CLASS_2
CLASS_3
CLASS_4
CLASS_5
CLASS_6
CLASS_7
CLASS_8
CLASS_9
CLASS_10
\.


--
-- Data for Name: SchoolProfile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SchoolProfile" (id, name, address, phone, email, "academicYear", logo, "updatedAt", website, signature) FROM stdin;
1	EduTracker Enterprise Academy	123 Education Lane, Tech City	+880123456789	info@edutracker.com	2026-2027	\N	2026-06-07 08:28:55.801	www.edutracker.com	\N
\.


--
-- Data for Name: StaffAttendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StaffAttendance" (id, "userId", date, status, remarks) FROM stdin;
\.


--
-- Data for Name: StaffSalary; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StaffSalary" ("userId", "baseSalary", allowances, deductions) FROM stdin;
10	30000	5000	1000
11	30000	5000	1000
12	30000	5000	1000
13	30000	5000	1000
14	30000	5000	1000
15	30000	5000	1000
16	30000	5000	1000
\.


--
-- Data for Name: Student; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Student" (id, "studentId", email, "dateOfBirth", "createdAt", "updatedAt", address, "admissionDate", "bloodGroup", "fullName", gender, "parentName", "parentPhone", phone, "profileImage", "rollNumber", section, "className", "busRouteId", "busStopId") FROM stdin;
1	STU-2026-0001	\N	\N	2026-06-07 08:28:55.698	2026-06-07 08:28:55.698	\N	2026-06-07 08:28:55.697	\N	John Jackson	MALE	\N	\N	01766007968	\N	01	A	CLASS_1	\N	\N
2	STU-2026-0002	\N	\N	2026-06-07 08:28:55.703	2026-06-07 08:28:55.703	\N	2026-06-07 08:28:55.702	\N	Jennifer Brown	FEMALE	\N	\N	01753878644	\N	01	A	CLASS_9	\N	\N
3	STU-2026-0003	\N	\N	2026-06-07 08:28:55.704	2026-06-07 08:28:55.704	\N	2026-06-07 08:28:55.704	\N	William Miller	FEMALE	\N	\N	01746035410	\N	01	B	CLASS_2	\N	\N
4	STU-2026-0004	\N	\N	2026-06-07 08:28:55.705	2026-06-07 08:28:55.705	\N	2026-06-07 08:28:55.705	\N	Charles Davis	FEMALE	\N	\N	01762378003	\N	01	A	CLASS_2	\N	\N
5	STU-2026-0005	\N	\N	2026-06-07 08:28:55.707	2026-06-07 08:28:55.707	\N	2026-06-07 08:28:55.707	\N	Barbara Thomas	MALE	\N	\N	01781519085	\N	01	B	CLASS_5	\N	\N
6	STU-2026-0006	\N	\N	2026-06-07 08:28:55.708	2026-06-07 08:28:55.708	\N	2026-06-07 08:28:55.708	\N	Richard Moore	FEMALE	\N	\N	01799005103	\N	01	A	CLASS_7	\N	\N
7	STU-2026-0007	\N	\N	2026-06-07 08:28:55.709	2026-06-07 08:28:55.709	\N	2026-06-07 08:28:55.709	\N	Barbara Rodriguez	MALE	\N	\N	01728998068	\N	01	B	CLASS_7	\N	\N
8	STU-2026-0008	\N	\N	2026-06-07 08:28:55.711	2026-06-07 08:28:55.711	\N	2026-06-07 08:28:55.711	\N	Mary Gonzalez	FEMALE	\N	\N	01723742050	\N	01	B	CLASS_1	\N	\N
9	STU-2026-0009	\N	\N	2026-06-07 08:28:55.712	2026-06-07 08:28:55.712	\N	2026-06-07 08:28:55.712	\N	John Smith	MALE	\N	\N	01751188511	\N	01	A	CLASS_10	\N	\N
10	STU-2026-0010	\N	\N	2026-06-07 08:28:55.713	2026-06-07 08:28:55.713	\N	2026-06-07 08:28:55.713	\N	James Lopez	MALE	\N	\N	01779789879	\N	02	A	CLASS_7	\N	\N
11	STU-2026-0011	\N	\N	2026-06-07 08:28:55.714	2026-06-07 08:28:55.714	\N	2026-06-07 08:28:55.714	\N	Charles Miller	FEMALE	\N	\N	01786782944	\N	01	B	CLASS_3	\N	\N
12	STU-2026-0012	\N	\N	2026-06-07 08:28:55.715	2026-06-07 08:28:55.715	\N	2026-06-07 08:28:55.715	\N	Karen Davis	FEMALE	\N	\N	01724878633	\N	03	A	CLASS_7	\N	\N
13	STU-2026-0013	\N	\N	2026-06-07 08:28:55.717	2026-06-07 08:28:55.717	\N	2026-06-07 08:28:55.716	\N	Patricia Martin	FEMALE	\N	\N	01759986970	\N	01	B	CLASS_8	\N	\N
14	STU-2026-0014	\N	\N	2026-06-07 08:28:55.718	2026-06-07 08:28:55.718	\N	2026-06-07 08:28:55.718	\N	William Thomas	FEMALE	\N	\N	01721577462	\N	02	B	CLASS_7	\N	\N
15	STU-2026-0015	\N	\N	2026-06-07 08:28:55.719	2026-06-07 08:28:55.719	\N	2026-06-07 08:28:55.719	\N	Sarah Lopez	FEMALE	\N	\N	01771549915	\N	02	A	CLASS_10	\N	\N
16	STU-2026-0016	\N	\N	2026-06-07 08:28:55.72	2026-06-07 08:28:55.72	\N	2026-06-07 08:28:55.72	\N	David Smith	FEMALE	\N	\N	01750310291	\N	01	B	CLASS_9	\N	\N
17	STU-2026-0017	\N	\N	2026-06-07 08:28:55.721	2026-06-07 08:28:55.721	\N	2026-06-07 08:28:55.721	\N	Thomas Jones	FEMALE	\N	\N	01750309039	\N	03	B	CLASS_7	\N	\N
18	STU-2026-0018	\N	\N	2026-06-07 08:28:55.722	2026-06-07 08:28:55.722	\N	2026-06-07 08:28:55.722	\N	Joseph Taylor	FEMALE	\N	\N	01788763092	\N	02	B	CLASS_5	\N	\N
19	STU-2026-0019	\N	\N	2026-06-07 08:28:55.723	2026-06-07 08:28:55.723	\N	2026-06-07 08:28:55.723	\N	David Miller	FEMALE	\N	\N	01784434567	\N	01	A	CLASS_3	\N	\N
20	STU-2026-0020	\N	\N	2026-06-07 08:28:55.724	2026-06-07 08:28:55.724	\N	2026-06-07 08:28:55.724	\N	Mary Anderson	MALE	\N	\N	01732291635	\N	01	A	CLASS_5	\N	\N
21	STU-2026-0021	\N	\N	2026-06-07 08:28:55.725	2026-06-07 08:28:55.725	\N	2026-06-07 08:28:55.725	\N	Mary Brown	FEMALE	\N	\N	01740119413	\N	02	B	CLASS_9	\N	\N
22	STU-2026-0022	\N	\N	2026-06-07 08:28:55.726	2026-06-07 08:28:55.726	\N	2026-06-07 08:28:55.726	\N	Sarah Anderson	MALE	\N	\N	01743341035	\N	04	A	CLASS_7	\N	\N
23	STU-2026-0023	\N	\N	2026-06-07 08:28:55.727	2026-06-07 08:28:55.727	\N	2026-06-07 08:28:55.727	\N	David Martinez	MALE	\N	\N	01715851362	\N	02	A	CLASS_2	\N	\N
24	STU-2026-0024	\N	\N	2026-06-07 08:28:55.728	2026-06-07 08:28:55.728	\N	2026-06-07 08:28:55.728	\N	Robert Jackson	FEMALE	\N	\N	01770979221	\N	01	B	CLASS_6	\N	\N
25	STU-2026-0025	\N	\N	2026-06-07 08:28:55.729	2026-06-07 08:28:55.729	\N	2026-06-07 08:28:55.729	\N	Barbara Lopez	FEMALE	\N	\N	01744153502	\N	02	A	CLASS_9	\N	\N
26	STU-2026-0026	\N	\N	2026-06-07 08:28:55.73	2026-06-07 08:28:55.73	\N	2026-06-07 08:28:55.73	\N	Patricia Garcia	FEMALE	\N	\N	01788538193	\N	02	B	CLASS_2	\N	\N
27	STU-2026-0027	\N	\N	2026-06-07 08:28:55.731	2026-06-07 08:28:55.731	\N	2026-06-07 08:28:55.731	\N	Susan Jackson	FEMALE	\N	\N	01756575026	\N	03	B	CLASS_2	\N	\N
28	STU-2026-0028	\N	\N	2026-06-07 08:28:55.732	2026-06-07 08:28:55.732	\N	2026-06-07 08:28:55.732	\N	Mary Davis	MALE	\N	\N	01788517173	\N	02	B	CLASS_6	\N	\N
29	STU-2026-0029	\N	\N	2026-06-07 08:28:55.733	2026-06-07 08:28:55.733	\N	2026-06-07 08:28:55.733	\N	Joseph Rodriguez	MALE	\N	\N	01719786499	\N	03	A	CLASS_9	\N	\N
30	STU-2026-0030	\N	\N	2026-06-07 08:28:55.734	2026-06-07 08:28:55.734	\N	2026-06-07 08:28:55.734	\N	Patricia Taylor	MALE	\N	\N	01794167480	\N	04	B	CLASS_2	\N	\N
31	STU-2026-0031	\N	\N	2026-06-07 08:28:55.735	2026-06-07 08:28:55.735	\N	2026-06-07 08:28:55.735	\N	William Brown	MALE	\N	\N	01796308810	\N	02	A	CLASS_1	\N	\N
32	STU-2026-0032	\N	\N	2026-06-07 08:28:55.736	2026-06-07 08:28:55.736	\N	2026-06-07 08:28:55.736	\N	John Davis	MALE	\N	\N	01737038245	\N	02	B	CLASS_1	\N	\N
33	STU-2026-0033	\N	\N	2026-06-07 08:28:55.737	2026-06-07 08:28:55.737	\N	2026-06-07 08:28:55.737	\N	Mary Smith	MALE	\N	\N	01788248925	\N	02	B	CLASS_3	\N	\N
34	STU-2026-0034	\N	\N	2026-06-07 08:28:55.738	2026-06-07 08:28:55.738	\N	2026-06-07 08:28:55.738	\N	Barbara Smith	FEMALE	\N	\N	01744838704	\N	03	B	CLASS_1	\N	\N
35	STU-2026-0035	\N	\N	2026-06-07 08:28:55.739	2026-06-07 08:28:55.739	\N	2026-06-07 08:28:55.739	\N	William Wilson	FEMALE	\N	\N	01753712845	\N	04	B	CLASS_7	\N	\N
36	STU-2026-0036	\N	\N	2026-06-07 08:28:55.74	2026-06-07 08:28:55.74	\N	2026-06-07 08:28:55.74	\N	Michael Johnson	MALE	\N	\N	01710742921	\N	03	B	CLASS_9	\N	\N
37	STU-2026-0037	\N	\N	2026-06-07 08:28:55.741	2026-06-07 08:28:55.741	\N	2026-06-07 08:28:55.741	\N	Robert Davis	MALE	\N	\N	01788877141	\N	02	A	CLASS_5	\N	\N
38	STU-2026-0038	\N	\N	2026-06-07 08:28:55.742	2026-06-07 08:28:55.742	\N	2026-06-07 08:28:55.742	\N	Charles Hernandez	FEMALE	\N	\N	01753280275	\N	05	A	CLASS_7	\N	\N
39	STU-2026-0039	\N	\N	2026-06-07 08:28:55.743	2026-06-07 08:28:55.743	\N	2026-06-07 08:28:55.743	\N	David Moore	FEMALE	\N	\N	01754399080	\N	02	A	CLASS_3	\N	\N
40	STU-2026-0040	\N	\N	2026-06-07 08:28:55.744	2026-06-07 08:28:55.744	\N	2026-06-07 08:28:55.744	\N	Charles Brown	FEMALE	\N	\N	01754078321	\N	03	A	CLASS_1	\N	\N
41	STU-2026-0041	\N	\N	2026-06-07 08:28:55.745	2026-06-07 08:28:55.745	\N	2026-06-07 08:28:55.745	\N	Richard Davis	MALE	\N	\N	01786513925	\N	01	B	CLASS_4	\N	\N
42	STU-2026-0042	\N	\N	2026-06-07 08:28:55.746	2026-06-07 08:28:55.746	\N	2026-06-07 08:28:55.746	\N	Thomas Jackson	MALE	\N	\N	01751623625	\N	03	B	CLASS_3	\N	\N
43	STU-2026-0043	\N	\N	2026-06-07 08:28:55.747	2026-06-07 08:28:55.747	\N	2026-06-07 08:28:55.747	\N	Thomas Jones	FEMALE	\N	\N	01767730369	\N	05	B	CLASS_2	\N	\N
44	STU-2026-0044	\N	\N	2026-06-07 08:28:55.748	2026-06-07 08:28:55.748	\N	2026-06-07 08:28:55.748	\N	Joseph Williams	FEMALE	\N	\N	01778641242	\N	03	A	CLASS_3	\N	\N
45	STU-2026-0045	\N	\N	2026-06-07 08:28:55.749	2026-06-07 08:28:55.749	\N	2026-06-07 08:28:55.749	\N	Mary Rodriguez	MALE	\N	\N	01783783685	\N	05	B	CLASS_7	\N	\N
46	STU-2026-0046	\N	\N	2026-06-07 08:28:55.75	2026-06-07 08:28:55.75	\N	2026-06-07 08:28:55.75	\N	James Brown	FEMALE	\N	\N	01719343432	\N	04	A	CLASS_1	\N	\N
47	STU-2026-0047	\N	\N	2026-06-07 08:28:55.751	2026-06-07 08:28:55.751	\N	2026-06-07 08:28:55.751	\N	Karen Jackson	MALE	\N	\N	01740601039	\N	06	A	CLASS_7	\N	\N
48	STU-2026-0048	\N	\N	2026-06-07 08:28:55.752	2026-06-07 08:28:55.752	\N	2026-06-07 08:28:55.751	\N	Sarah Jackson	FEMALE	\N	\N	01736027268	\N	03	A	CLASS_2	\N	\N
49	STU-2026-0049	\N	\N	2026-06-07 08:28:55.752	2026-06-07 08:28:55.752	\N	2026-06-07 08:28:55.752	\N	Richard Brown	MALE	\N	\N	01760575312	\N	04	B	CLASS_1	\N	\N
50	STU-2026-0050	\N	\N	2026-06-07 08:28:55.753	2026-06-07 08:28:55.753	\N	2026-06-07 08:28:55.753	\N	Sarah Martinez	FEMALE	\N	\N	01759244415	\N	02	B	CLASS_4	\N	\N
51	STU-2026-0051	\N	\N	2026-06-07 08:28:55.754	2026-06-07 08:28:55.754	\N	2026-06-07 08:28:55.754	\N	Jennifer Gonzalez	MALE	\N	\N	01784757304	\N	02	B	CLASS_8	\N	\N
52	STU-2026-0052	\N	\N	2026-06-07 08:28:55.755	2026-06-07 08:28:55.755	\N	2026-06-07 08:28:55.755	\N	Patricia Brown	FEMALE	\N	\N	01710875098	\N	04	A	CLASS_2	\N	\N
53	STU-2026-0053	\N	\N	2026-06-07 08:28:55.756	2026-06-07 08:28:55.756	\N	2026-06-07 08:28:55.756	\N	Michael Jones	FEMALE	\N	\N	01730982578	\N	01	A	CLASS_4	\N	\N
54	STU-2026-0054	\N	\N	2026-06-07 08:28:55.757	2026-06-07 08:28:55.757	\N	2026-06-07 08:28:55.757	\N	Michael Taylor	FEMALE	\N	\N	01716629419	\N	05	B	CLASS_1	\N	\N
55	STU-2026-0055	\N	\N	2026-06-07 08:28:55.758	2026-06-07 08:28:55.758	\N	2026-06-07 08:28:55.758	\N	Karen Martin	FEMALE	\N	\N	01788029260	\N	03	B	CLASS_8	\N	\N
56	STU-2026-0056	\N	\N	2026-06-07 08:28:55.759	2026-06-07 08:28:55.759	\N	2026-06-07 08:28:55.758	\N	Robert Moore	MALE	\N	\N	01712528441	\N	05	A	CLASS_2	\N	\N
57	STU-2026-0057	\N	\N	2026-06-07 08:28:55.759	2026-06-07 08:28:55.759	\N	2026-06-07 08:28:55.759	\N	Elizabeth Thomas	MALE	\N	\N	01793497291	\N	03	B	CLASS_4	\N	\N
58	STU-2026-0058	\N	\N	2026-06-07 08:28:55.76	2026-06-07 08:28:55.76	\N	2026-06-07 08:28:55.76	\N	Elizabeth Gonzalez	FEMALE	\N	\N	01759296382	\N	04	A	CLASS_9	\N	\N
59	STU-2026-0059	\N	\N	2026-06-07 08:28:55.761	2026-06-07 08:28:55.761	\N	2026-06-07 08:28:55.761	\N	John Martinez	FEMALE	\N	\N	01728464239	\N	04	B	CLASS_8	\N	\N
60	STU-2026-0060	\N	\N	2026-06-07 08:28:55.763	2026-06-07 08:28:55.763	\N	2026-06-07 08:28:55.762	\N	Mary Lopez	MALE	\N	\N	01750353542	\N	06	A	CLASS_2	\N	\N
61	STU-2026-0061	\N	\N	2026-06-07 08:28:55.764	2026-06-07 08:28:55.764	\N	2026-06-07 08:28:55.764	\N	Mary Moore	FEMALE	\N	\N	01796671865	\N	04	B	CLASS_9	\N	\N
62	STU-2026-0062	\N	\N	2026-06-07 08:28:55.765	2026-06-07 08:28:55.765	\N	2026-06-07 08:28:55.765	\N	Sarah Garcia	FEMALE	\N	\N	01714580198	\N	07	A	CLASS_2	\N	\N
63	STU-2026-0063	\N	\N	2026-06-07 08:28:55.766	2026-06-07 08:28:55.766	\N	2026-06-07 08:28:55.766	\N	Michael Gonzalez	MALE	\N	\N	01741371812	\N	05	A	CLASS_1	\N	\N
64	STU-2026-0064	\N	\N	2026-06-07 08:28:55.767	2026-06-07 08:28:55.767	\N	2026-06-07 08:28:55.767	\N	Linda Rodriguez	MALE	\N	\N	01743145351	\N	04	A	CLASS_3	\N	\N
65	STU-2026-0065	\N	\N	2026-06-07 08:28:55.768	2026-06-07 08:28:55.768	\N	2026-06-07 08:28:55.768	\N	Sarah Gonzalez	FEMALE	\N	\N	01710148291	\N	06	B	CLASS_2	\N	\N
66	STU-2026-0066	\N	\N	2026-06-07 08:28:55.769	2026-06-07 08:28:55.769	\N	2026-06-07 08:28:55.769	\N	Charles Jackson	FEMALE	\N	\N	01722151438	\N	02	A	CLASS_4	\N	\N
67	STU-2026-0067	\N	\N	2026-06-07 08:28:55.77	2026-06-07 08:28:55.77	\N	2026-06-07 08:28:55.77	\N	Charles Taylor	FEMALE	\N	\N	01749718288	\N	03	B	CLASS_6	\N	\N
68	STU-2026-0068	\N	\N	2026-06-07 08:28:55.77	2026-06-07 08:28:55.77	\N	2026-06-07 08:28:55.77	\N	Michael Martin	MALE	\N	\N	01725806285	\N	05	A	CLASS_9	\N	\N
69	STU-2026-0069	\N	\N	2026-06-07 08:28:55.771	2026-06-07 08:28:55.771	\N	2026-06-07 08:28:55.771	\N	James Lopez	FEMALE	\N	\N	01755135841	\N	04	B	CLASS_4	\N	\N
70	STU-2026-0070	\N	\N	2026-06-07 08:28:55.772	2026-06-07 08:28:55.772	\N	2026-06-07 08:28:55.772	\N	Barbara Hernandez	FEMALE	\N	\N	01780939099	\N	06	B	CLASS_7	\N	\N
71	STU-2026-0071	\N	\N	2026-06-07 08:28:55.773	2026-06-07 08:28:55.773	\N	2026-06-07 08:28:55.773	\N	Charles Gonzalez	FEMALE	\N	\N	01730160899	\N	05	A	CLASS_3	\N	\N
72	STU-2026-0072	\N	\N	2026-06-07 08:28:55.774	2026-06-07 08:28:55.774	\N	2026-06-07 08:28:55.774	\N	Mary Jackson	MALE	\N	\N	01747208463	\N	01	B	CLASS_10	\N	\N
73	STU-2026-0073	\N	\N	2026-06-07 08:28:55.774	2026-06-07 08:28:55.774	\N	2026-06-07 08:28:55.774	\N	Joseph Hernandez	FEMALE	\N	\N	01738601132	\N	04	B	CLASS_6	\N	\N
74	STU-2026-0074	\N	\N	2026-06-07 08:28:55.775	2026-06-07 08:28:55.775	\N	2026-06-07 08:28:55.775	\N	Elizabeth Jackson	MALE	\N	\N	01752378605	\N	04	B	CLASS_3	\N	\N
75	STU-2026-0075	\N	\N	2026-06-07 08:28:55.777	2026-06-07 08:28:55.777	\N	2026-06-07 08:28:55.776	\N	James Jackson	MALE	\N	\N	01731565463	\N	03	A	CLASS_5	\N	\N
76	STU-2026-0076	\N	\N	2026-06-07 08:28:55.777	2026-06-07 08:28:55.777	\N	2026-06-07 08:28:55.777	\N	Patricia Anderson	FEMALE	\N	\N	01793487114	\N	05	B	CLASS_4	\N	\N
77	STU-2026-0077	\N	\N	2026-06-07 08:28:55.778	2026-06-07 08:28:55.778	\N	2026-06-07 08:28:55.778	\N	Barbara Lopez	MALE	\N	\N	01794214094	\N	05	B	CLASS_9	\N	\N
78	STU-2026-0078	\N	\N	2026-06-07 08:28:55.779	2026-06-07 08:28:55.779	\N	2026-06-07 08:28:55.779	\N	William Moore	MALE	\N	\N	01725178266	\N	03	A	CLASS_4	\N	\N
79	STU-2026-0079	\N	\N	2026-06-07 08:28:55.78	2026-06-07 08:28:55.78	\N	2026-06-07 08:28:55.78	\N	Richard Hernandez	FEMALE	\N	\N	01787680213	\N	04	A	CLASS_5	\N	\N
80	STU-2026-0080	\N	\N	2026-06-07 08:28:55.781	2026-06-07 08:28:55.781	\N	2026-06-07 08:28:55.781	\N	Mary Miller	MALE	\N	\N	01764506183	\N	06	B	CLASS_4	\N	\N
81	STU-2026-0081	\N	\N	2026-06-07 08:28:55.782	2026-06-07 08:28:55.782	\N	2026-06-07 08:28:55.782	\N	Joseph Martin	FEMALE	\N	\N	01743035027	\N	05	B	CLASS_8	\N	\N
82	STU-2026-0082	\N	\N	2026-06-07 08:28:55.783	2026-06-07 08:28:55.783	\N	2026-06-07 08:28:55.783	\N	Jessica Johnson	FEMALE	\N	\N	01775570450	\N	01	A	CLASS_6	\N	\N
83	STU-2026-0083	\N	\N	2026-06-07 08:28:55.784	2026-06-07 08:28:55.784	\N	2026-06-07 08:28:55.784	\N	David Johnson	MALE	\N	\N	01729606785	\N	06	A	CLASS_3	\N	\N
84	STU-2026-0084	\N	\N	2026-06-07 08:28:55.785	2026-06-07 08:28:55.785	\N	2026-06-07 08:28:55.785	\N	Michael Rodriguez	MALE	\N	\N	01723940842	\N	02	A	CLASS_6	\N	\N
85	STU-2026-0085	\N	\N	2026-06-07 08:28:55.786	2026-06-07 08:28:55.786	\N	2026-06-07 08:28:55.786	\N	Karen Smith	MALE	\N	\N	01799116156	\N	05	B	CLASS_3	\N	\N
86	STU-2026-0086	\N	\N	2026-06-07 08:28:55.786	2026-06-07 08:28:55.786	\N	2026-06-07 08:28:55.786	\N	Sarah Gonzalez	FEMALE	\N	\N	01727474717	\N	07	B	CLASS_4	\N	\N
87	STU-2026-0087	\N	\N	2026-06-07 08:28:55.787	2026-06-07 08:28:55.787	\N	2026-06-07 08:28:55.787	\N	Jessica Garcia	MALE	\N	\N	01773374034	\N	05	A	CLASS_5	\N	\N
88	STU-2026-0088	\N	\N	2026-06-07 08:28:55.788	2026-06-07 08:28:55.788	\N	2026-06-07 08:28:55.788	\N	David Garcia	MALE	\N	\N	01742961183	\N	06	A	CLASS_5	\N	\N
89	STU-2026-0089	\N	\N	2026-06-07 08:28:55.789	2026-06-07 08:28:55.789	\N	2026-06-07 08:28:55.789	\N	Jessica Miller	MALE	\N	\N	01717257198	\N	01	A	CLASS_8	\N	\N
90	STU-2026-0090	\N	\N	2026-06-07 08:28:55.79	2026-06-07 08:28:55.79	\N	2026-06-07 08:28:55.79	\N	Jennifer Hernandez	MALE	\N	\N	01764267464	\N	06	A	CLASS_1	\N	\N
91	STU-2026-0091	\N	\N	2026-06-07 08:28:55.791	2026-06-07 08:28:55.791	\N	2026-06-07 08:28:55.791	\N	Robert Brown	MALE	\N	\N	01789694419	\N	02	A	CLASS_8	\N	\N
92	STU-2026-0092	\N	\N	2026-06-07 08:28:55.791	2026-06-07 08:28:55.791	\N	2026-06-07 08:28:55.791	\N	Richard Brown	MALE	\N	\N	01715298402	\N	07	A	CLASS_1	\N	\N
93	STU-2026-0093	\N	\N	2026-06-07 08:28:55.792	2026-06-07 08:28:55.792	\N	2026-06-07 08:28:55.792	\N	Thomas Thomas	MALE	\N	\N	01722230055	\N	03	A	CLASS_10	\N	\N
94	STU-2026-0094	\N	\N	2026-06-07 08:28:55.793	2026-06-07 08:28:55.793	\N	2026-06-07 08:28:55.793	\N	Richard Davis	MALE	\N	\N	01780885714	\N	04	A	CLASS_10	\N	\N
95	STU-2026-0095	\N	\N	2026-06-07 08:28:55.794	2026-06-07 08:28:55.794	\N	2026-06-07 08:28:55.794	\N	Patricia Moore	FEMALE	\N	\N	01766064981	\N	08	A	CLASS_2	\N	\N
96	STU-2026-0096	\N	\N	2026-06-07 08:28:55.795	2026-06-07 08:28:55.795	\N	2026-06-07 08:28:55.795	\N	John Martin	FEMALE	\N	\N	01786733895	\N	06	B	CLASS_8	\N	\N
97	STU-2026-0097	\N	\N	2026-06-07 08:28:55.796	2026-06-07 08:28:55.796	\N	2026-06-07 08:28:55.796	\N	Joseph Wilson	FEMALE	\N	\N	01719289639	\N	07	A	CLASS_3	\N	\N
98	STU-2026-0098	\N	\N	2026-06-07 08:28:55.797	2026-06-07 08:28:55.797	\N	2026-06-07 08:28:55.796	\N	Jessica Thomas	MALE	\N	\N	01785413915	\N	09	A	CLASS_2	\N	\N
99	STU-2026-0099	\N	\N	2026-06-07 08:28:55.797	2026-06-07 08:28:55.797	\N	2026-06-07 08:28:55.797	\N	Elizabeth Rodriguez	MALE	\N	\N	01758092864	\N	07	B	CLASS_7	\N	\N
100	STU-2026-0100	\N	\N	2026-06-07 08:28:55.798	2026-06-07 08:28:55.798	\N	2026-06-07 08:28:55.798	\N	Robert Jones	FEMALE	\N	\N	01770259152	\N	08	B	CLASS_7	\N	\N
101	STU-TEST-001	\N	\N	2026-06-07 08:30:15.472	2026-06-07 08:30:15.472	\N	2026-06-07 08:30:15.472	\N	Test Student	MALE	\N	\N	\N	\N	99	A	CLASS_1	\N	\N
102	STU-951388	\N	\N	2026-06-10 20:39:11.735	2026-06-10 20:39:11.735	\N	2026-06-10 20:39:11.735	\N	Test Student	MALE	\N	\N	\N	\N	951388	A	CLASS_5	\N	\N
103	STU-995164	\N	\N	2026-06-10 20:39:55.499	2026-06-10 20:39:55.499	\N	2026-06-10 20:39:55.499	\N	Test Student	MALE	\N	\N	\N	\N	995164	A	CLASS_5	\N	\N
104	STU-041222	\N	\N	2026-06-10 20:40:41.546	2026-06-10 20:40:41.569	\N	2026-06-10 20:40:41.546	\N	Test Student Updated	MALE	\N	\N	\N	\N	041222	A	CLASS_5	\N	\N
105	STU-094203	\N	\N	2026-06-10 20:41:34.494	2026-06-10 20:41:34.516	\N	2026-06-10 20:41:34.494	\N	Test Student Updated	MALE	\N	\N	\N	\N	094203	A	CLASS_5	\N	\N
106	STU-132581	\N	\N	2026-06-10 20:42:12.85	2026-06-10 20:42:12.873	\N	2026-06-10 20:42:12.85	\N	Test Student Updated	MALE	\N	\N	\N	\N	132581	A	CLASS_5	\N	\N
108	STU-232732	\N	\N	2026-06-10 20:43:53.014	2026-06-10 20:43:53.031	\N	2026-06-10 20:43:53.014	\N	Test Student Updated	MALE	\N	\N	\N	\N	232732	Z	CLASS_10	\N	\N
109	STU-279770	\N	\N	2026-06-10 20:44:40.043	2026-06-10 20:44:40.059	\N	2026-06-10 20:44:40.043	\N	Test Student Updated	MALE	\N	\N	\N	\N	279770	Z	CLASS_10	\N	\N
110	STU-334127	\N	\N	2026-06-10 20:45:34.41	2026-06-10 20:45:34.434	\N	2026-06-10 20:45:34.41	\N	Test Student Updated	MALE	\N	\N	\N	\N	334127	Z	CLASS_10	\N	\N
111	STU-393948	\N	\N	2026-06-10 20:46:34.229	2026-06-10 20:46:34.245	\N	2026-06-10 20:46:34.229	\N	Test Student Updated	MALE	\N	\N	\N	\N	393948	Z	CLASS_10	\N	\N
112	STU-438054	\N	\N	2026-06-10 20:47:18.329	2026-06-10 20:47:18.345	\N	2026-06-10 20:47:18.329	\N	Test Student Updated	MALE	\N	\N	\N	\N	438054	Z	CLASS_10	\N	\N
113	STU-520703	\N	\N	2026-06-10 20:48:40.972	2026-06-10 20:48:40.989	\N	2026-06-10 20:48:40.972	\N	Test Student Updated	MALE	\N	\N	\N	\N	520703	Z	CLASS_10	\N	\N
114	STU-556389	\N	\N	2026-06-10 20:49:16.638	2026-06-10 20:49:16.656	\N	2026-06-10 20:49:16.638	\N	Test Student Updated	MALE	\N	\N	\N	\N	556389	Z	CLASS_10	\N	\N
115	STU-607299	\N	\N	2026-06-10 20:50:07.555	2026-06-10 20:50:07.575	\N	2026-06-10 20:50:07.555	\N	Test Student Updated	MALE	\N	\N	\N	\N	607299	Z	CLASS_10	\N	\N
116	STU-723084	\N	\N	2026-06-10 20:52:03.321	2026-06-10 20:52:03.34	\N	2026-06-10 20:52:03.321	\N	Test Student Updated	MALE	\N	\N	\N	\N	723084	Z	CLASS_10	\N	\N
117	STU-969372	\N	\N	2026-06-10 20:56:09.638	2026-06-10 20:56:09.666	\N	2026-06-10 20:56:09.638	\N	Test Student Updated	MALE	\N	\N	\N	\N	969372	Z	CLASS_10	\N	\N
118	STU-007597	\N	\N	2026-06-10 20:56:47.869	2026-06-10 20:56:47.885	\N	2026-06-10 20:56:47.869	\N	Test Student Updated	MALE	\N	\N	\N	\N	007597	Z	CLASS_10	\N	\N
119	STU-093501	\N	\N	2026-06-10 20:58:13.776	2026-06-10 20:58:13.793	\N	2026-06-10 20:58:13.776	\N	Test Student Updated	MALE	\N	\N	\N	\N	093501	Z	CLASS_10	\N	\N
120	STU-134523	\N	\N	2026-06-10 20:58:54.794	2026-06-10 20:58:54.812	\N	2026-06-10 20:58:54.794	\N	Test Student Updated	MALE	\N	\N	\N	\N	134523	Z	CLASS_10	\N	\N
121	STU-213507	\N	\N	2026-06-10 21:00:13.794	2026-06-10 21:00:13.817	\N	2026-06-10 21:00:13.794	\N	Test Student Updated	MALE	\N	\N	\N	\N	213507	Z	CLASS_10	\N	\N
122	STU-314830	\N	\N	2026-06-10 21:01:55.105	2026-06-10 21:01:55.121	\N	2026-06-10 21:01:55.105	\N	Test Student Updated	MALE	\N	\N	\N	\N	314830	Z	CLASS_10	\N	\N
123	STU-413900	\N	\N	2026-06-10 21:03:34.177	2026-06-10 21:03:35.295	\N	2026-06-10 21:03:34.177	\N	Test Student Updated	MALE	\N	\N	\N	\N	413900	Z	CLASS_10	1	1
124	STU-461970	\N	\N	2026-06-10 21:04:22.244	2026-06-10 21:04:23.35	\N	2026-06-10 21:04:22.244	\N	Test Student Updated	MALE	\N	\N	\N	\N	461970	Z	CLASS_10	2	3
4130	STRESS-083388-1	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1	FEMALE	\N	\N	+10000833880001	\N	R083388-1	C	CLASS_6	\N	\N
125	STU-530849	\N	\N	2026-06-10 21:05:31.127	2026-06-10 21:05:32.278	\N	2026-06-10 21:05:31.127	\N	Test Student Updated	MALE	\N	\N	\N	\N	530849	Z	CLASS_10	3	5
126	STU-TEST-999	\N	\N	2026-06-13 09:55:50.611	2026-06-13 09:55:50.611	\N	2026-06-13 09:55:50.611	\N	Test Student	MALE	\N	\N	\N	\N	999	A	CLASS_5	\N	\N
127	STU-UNIQUE-TEST-0001	\N	\N	2026-06-13 09:58:01.279	2026-06-13 09:58:01.279	\N	2026-06-13 09:58:01.279	\N	Test Student	MALE	\N	\N	\N	\N	9999	A	CLASS_5	\N	\N
128	STU-TEST-1781344772615	\N	\N	2026-06-13 09:59:32.631	2026-06-13 09:59:32.631	\N	2026-06-13 09:59:32.631	\N	Test Student	MALE	\N	\N	\N	\N	2615	A	CLASS_5	\N	\N
129	STU-TEST-1781458229839	\N	\N	2026-06-14 17:30:29.919	2026-06-14 17:30:29.919	\N	2026-06-14 17:30:29.919	\N	Test Student	MALE	\N	\N	\N	\N	9839	A	CLASS_5	\N	\N
4131	STRESS-083388-2	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 2	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-2	MALE	\N	\N	+10000833880002	\N	R083388-2	A	CLASS_10	\N	\N
4132	STRESS-083388-3	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 3	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-3	FEMALE	\N	\N	+10000833880003	\N	R083388-3	C	CLASS_8	\N	\N
4133	STRESS-083388-4	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 4	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-4	MALE	\N	\N	+10000833880004	\N	R083388-4	A	CLASS_6	\N	\N
4134	STRESS-083388-5	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 5	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-5	MALE	\N	\N	+10000833880005	\N	R083388-5	A	CLASS_7	\N	\N
4135	STRESS-083388-6	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 6	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-6	FEMALE	\N	\N	+10000833880006	\N	R083388-6	D	CLASS_6	\N	\N
4136	STRESS-083388-7	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 7	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-7	MALE	\N	\N	+10000833880007	\N	R083388-7	A	CLASS_7	\N	\N
4137	STRESS-083388-8	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 8	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-8	MALE	\N	\N	+10000833880008	\N	R083388-8	C	CLASS_10	\N	\N
4138	STRESS-083388-9	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 9	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-9	MALE	\N	\N	+10000833880009	\N	R083388-9	D	CLASS_6	\N	\N
4139	STRESS-083388-10	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 10	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-10	FEMALE	\N	\N	+10000833880010	\N	R083388-10	C	CLASS_8	\N	\N
4140	STRESS-083388-11	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 11	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-11	MALE	\N	\N	+10000833880011	\N	R083388-11	A	CLASS_8	\N	\N
4141	STRESS-083388-12	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 12	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-12	MALE	\N	\N	+10000833880012	\N	R083388-12	D	CLASS_6	\N	\N
4142	STRESS-083388-13	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 13	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-13	FEMALE	\N	\N	+10000833880013	\N	R083388-13	C	CLASS_6	\N	\N
4143	STRESS-083388-14	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 14	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-14	MALE	\N	\N	+10000833880014	\N	R083388-14	B	CLASS_9	\N	\N
4144	STRESS-083388-15	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 15	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-15	MALE	\N	\N	+10000833880015	\N	R083388-15	C	CLASS_8	\N	\N
4145	STRESS-083388-16	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 16	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-16	MALE	\N	\N	+10000833880016	\N	R083388-16	D	CLASS_6	\N	\N
4146	STRESS-083388-17	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 17	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-17	FEMALE	\N	\N	+10000833880017	\N	R083388-17	D	CLASS_8	\N	\N
4147	STRESS-083388-18	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 18	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-18	MALE	\N	\N	+10000833880018	\N	R083388-18	A	CLASS_8	\N	\N
4148	STRESS-083388-19	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 19	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-19	FEMALE	\N	\N	+10000833880019	\N	R083388-19	B	CLASS_9	\N	\N
4149	STRESS-083388-20	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 20	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-20	FEMALE	\N	\N	+10000833880020	\N	R083388-20	C	CLASS_10	\N	\N
4150	STRESS-083388-21	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 21	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-21	MALE	\N	\N	+10000833880021	\N	R083388-21	D	CLASS_8	\N	\N
4151	STRESS-083388-22	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 22	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-22	FEMALE	\N	\N	+10000833880022	\N	R083388-22	C	CLASS_9	\N	\N
4152	STRESS-083388-23	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 23	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-23	MALE	\N	\N	+10000833880023	\N	R083388-23	B	CLASS_7	\N	\N
4153	STRESS-083388-24	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 24	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-24	MALE	\N	\N	+10000833880024	\N	R083388-24	B	CLASS_8	\N	\N
4154	STRESS-083388-25	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 25	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-25	MALE	\N	\N	+10000833880025	\N	R083388-25	D	CLASS_8	\N	\N
4155	STRESS-083388-26	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 26	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-26	FEMALE	\N	\N	+10000833880026	\N	R083388-26	A	CLASS_9	\N	\N
4156	STRESS-083388-27	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 27	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-27	MALE	\N	\N	+10000833880027	\N	R083388-27	A	CLASS_9	\N	\N
4157	STRESS-083388-28	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 28	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-28	FEMALE	\N	\N	+10000833880028	\N	R083388-28	C	CLASS_10	\N	\N
4158	STRESS-083388-29	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 29	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-29	FEMALE	\N	\N	+10000833880029	\N	R083388-29	C	CLASS_7	\N	\N
4159	STRESS-083388-30	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 30	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-30	FEMALE	\N	\N	+10000833880030	\N	R083388-30	A	CLASS_10	\N	\N
4160	STRESS-083388-31	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 31	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-31	FEMALE	\N	\N	+10000833880031	\N	R083388-31	C	CLASS_8	\N	\N
4161	STRESS-083388-32	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 32	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-32	MALE	\N	\N	+10000833880032	\N	R083388-32	D	CLASS_8	\N	\N
4162	STRESS-083388-33	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 33	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-33	FEMALE	\N	\N	+10000833880033	\N	R083388-33	B	CLASS_6	\N	\N
4163	STRESS-083388-34	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 34	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-34	FEMALE	\N	\N	+10000833880034	\N	R083388-34	D	CLASS_10	\N	\N
4164	STRESS-083388-35	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 35	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-35	FEMALE	\N	\N	+10000833880035	\N	R083388-35	A	CLASS_10	\N	\N
4165	STRESS-083388-36	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 36	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-36	FEMALE	\N	\N	+10000833880036	\N	R083388-36	A	CLASS_10	\N	\N
4166	STRESS-083388-37	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 37	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-37	MALE	\N	\N	+10000833880037	\N	R083388-37	C	CLASS_10	\N	\N
4167	STRESS-083388-38	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 38	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-38	MALE	\N	\N	+10000833880038	\N	R083388-38	A	CLASS_8	\N	\N
4168	STRESS-083388-39	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 39	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-39	MALE	\N	\N	+10000833880039	\N	R083388-39	D	CLASS_8	\N	\N
4169	STRESS-083388-40	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 40	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-40	MALE	\N	\N	+10000833880040	\N	R083388-40	A	CLASS_6	\N	\N
4170	STRESS-083388-41	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 41	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-41	MALE	\N	\N	+10000833880041	\N	R083388-41	B	CLASS_9	\N	\N
4171	STRESS-083388-42	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 42	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-42	MALE	\N	\N	+10000833880042	\N	R083388-42	D	CLASS_9	\N	\N
4172	STRESS-083388-43	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 43	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-43	FEMALE	\N	\N	+10000833880043	\N	R083388-43	A	CLASS_8	\N	\N
4173	STRESS-083388-44	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 44	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-44	MALE	\N	\N	+10000833880044	\N	R083388-44	A	CLASS_6	\N	\N
4174	STRESS-083388-45	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 45	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-45	MALE	\N	\N	+10000833880045	\N	R083388-45	B	CLASS_6	\N	\N
4175	STRESS-083388-46	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 46	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-46	FEMALE	\N	\N	+10000833880046	\N	R083388-46	B	CLASS_7	\N	\N
4176	STRESS-083388-47	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 47	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-47	FEMALE	\N	\N	+10000833880047	\N	R083388-47	C	CLASS_9	\N	\N
4177	STRESS-083388-48	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 48	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-48	MALE	\N	\N	+10000833880048	\N	R083388-48	B	CLASS_8	\N	\N
4178	STRESS-083388-49	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 49	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-49	FEMALE	\N	\N	+10000833880049	\N	R083388-49	D	CLASS_9	\N	\N
4179	STRESS-083388-50	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 50	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-50	FEMALE	\N	\N	+10000833880050	\N	R083388-50	A	CLASS_6	\N	\N
4180	STRESS-083388-51	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 51	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-51	MALE	\N	\N	+10000833880051	\N	R083388-51	D	CLASS_7	\N	\N
4181	STRESS-083388-52	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 52	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-52	FEMALE	\N	\N	+10000833880052	\N	R083388-52	C	CLASS_6	\N	\N
4182	STRESS-083388-53	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 53	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-53	FEMALE	\N	\N	+10000833880053	\N	R083388-53	D	CLASS_6	\N	\N
4183	STRESS-083388-54	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 54	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-54	MALE	\N	\N	+10000833880054	\N	R083388-54	A	CLASS_8	\N	\N
4184	STRESS-083388-55	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 55	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-55	MALE	\N	\N	+10000833880055	\N	R083388-55	C	CLASS_10	\N	\N
4185	STRESS-083388-56	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 56	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-56	MALE	\N	\N	+10000833880056	\N	R083388-56	C	CLASS_9	\N	\N
4186	STRESS-083388-57	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 57	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-57	FEMALE	\N	\N	+10000833880057	\N	R083388-57	D	CLASS_10	\N	\N
4187	STRESS-083388-58	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 58	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-58	MALE	\N	\N	+10000833880058	\N	R083388-58	C	CLASS_6	\N	\N
4188	STRESS-083388-59	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 59	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-59	FEMALE	\N	\N	+10000833880059	\N	R083388-59	D	CLASS_10	\N	\N
4189	STRESS-083388-60	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 60	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-60	MALE	\N	\N	+10000833880060	\N	R083388-60	A	CLASS_6	\N	\N
4190	STRESS-083388-61	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 61	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-61	FEMALE	\N	\N	+10000833880061	\N	R083388-61	B	CLASS_9	\N	\N
4191	STRESS-083388-62	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 62	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-62	MALE	\N	\N	+10000833880062	\N	R083388-62	B	CLASS_6	\N	\N
4192	STRESS-083388-63	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 63	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-63	FEMALE	\N	\N	+10000833880063	\N	R083388-63	D	CLASS_9	\N	\N
4193	STRESS-083388-64	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 64	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-64	MALE	\N	\N	+10000833880064	\N	R083388-64	A	CLASS_6	\N	\N
4194	STRESS-083388-65	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 65	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-65	FEMALE	\N	\N	+10000833880065	\N	R083388-65	C	CLASS_10	\N	\N
4195	STRESS-083388-66	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 66	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-66	MALE	\N	\N	+10000833880066	\N	R083388-66	A	CLASS_8	\N	\N
4196	STRESS-083388-67	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 67	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-67	FEMALE	\N	\N	+10000833880067	\N	R083388-67	A	CLASS_9	\N	\N
4197	STRESS-083388-68	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 68	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-68	FEMALE	\N	\N	+10000833880068	\N	R083388-68	D	CLASS_10	\N	\N
4198	STRESS-083388-69	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 69	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-69	FEMALE	\N	\N	+10000833880069	\N	R083388-69	B	CLASS_10	\N	\N
4199	STRESS-083388-70	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 70	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-70	FEMALE	\N	\N	+10000833880070	\N	R083388-70	B	CLASS_10	\N	\N
4200	STRESS-083388-71	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 71	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-71	MALE	\N	\N	+10000833880071	\N	R083388-71	C	CLASS_9	\N	\N
4201	STRESS-083388-72	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 72	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-72	MALE	\N	\N	+10000833880072	\N	R083388-72	D	CLASS_10	\N	\N
4202	STRESS-083388-73	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 73	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-73	FEMALE	\N	\N	+10000833880073	\N	R083388-73	D	CLASS_8	\N	\N
4203	STRESS-083388-74	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 74	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-74	MALE	\N	\N	+10000833880074	\N	R083388-74	B	CLASS_6	\N	\N
4204	STRESS-083388-75	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 75	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-75	FEMALE	\N	\N	+10000833880075	\N	R083388-75	A	CLASS_7	\N	\N
4205	STRESS-083388-76	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 76	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-76	FEMALE	\N	\N	+10000833880076	\N	R083388-76	B	CLASS_8	\N	\N
4206	STRESS-083388-77	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 77	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-77	MALE	\N	\N	+10000833880077	\N	R083388-77	D	CLASS_7	\N	\N
4207	STRESS-083388-78	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 78	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-78	FEMALE	\N	\N	+10000833880078	\N	R083388-78	C	CLASS_7	\N	\N
4208	STRESS-083388-79	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 79	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-79	FEMALE	\N	\N	+10000833880079	\N	R083388-79	A	CLASS_8	\N	\N
4209	STRESS-083388-80	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 80	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-80	FEMALE	\N	\N	+10000833880080	\N	R083388-80	A	CLASS_6	\N	\N
4210	STRESS-083388-81	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 81	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-81	MALE	\N	\N	+10000833880081	\N	R083388-81	B	CLASS_9	\N	\N
4211	STRESS-083388-82	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 82	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-82	FEMALE	\N	\N	+10000833880082	\N	R083388-82	B	CLASS_9	\N	\N
4212	STRESS-083388-83	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 83	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-83	MALE	\N	\N	+10000833880083	\N	R083388-83	A	CLASS_10	\N	\N
4213	STRESS-083388-84	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 84	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-84	MALE	\N	\N	+10000833880084	\N	R083388-84	C	CLASS_9	\N	\N
4214	STRESS-083388-85	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 85	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-85	FEMALE	\N	\N	+10000833880085	\N	R083388-85	C	CLASS_10	\N	\N
4215	STRESS-083388-86	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 86	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-86	MALE	\N	\N	+10000833880086	\N	R083388-86	A	CLASS_10	\N	\N
4216	STRESS-083388-87	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 87	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-87	FEMALE	\N	\N	+10000833880087	\N	R083388-87	D	CLASS_7	\N	\N
4217	STRESS-083388-88	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 88	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-88	MALE	\N	\N	+10000833880088	\N	R083388-88	A	CLASS_9	\N	\N
4218	STRESS-083388-89	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 89	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-89	MALE	\N	\N	+10000833880089	\N	R083388-89	A	CLASS_6	\N	\N
4219	STRESS-083388-90	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 90	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-90	MALE	\N	\N	+10000833880090	\N	R083388-90	C	CLASS_7	\N	\N
4220	STRESS-083388-91	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 91	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-91	MALE	\N	\N	+10000833880091	\N	R083388-91	A	CLASS_10	\N	\N
4221	STRESS-083388-92	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 92	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-92	FEMALE	\N	\N	+10000833880092	\N	R083388-92	D	CLASS_7	\N	\N
4222	STRESS-083388-93	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 93	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-93	FEMALE	\N	\N	+10000833880093	\N	R083388-93	C	CLASS_9	\N	\N
4223	STRESS-083388-94	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 94	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-94	FEMALE	\N	\N	+10000833880094	\N	R083388-94	C	CLASS_10	\N	\N
4224	STRESS-083388-95	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 95	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-95	MALE	\N	\N	+10000833880095	\N	R083388-95	B	CLASS_9	\N	\N
4225	STRESS-083388-96	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 96	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-96	FEMALE	\N	\N	+10000833880096	\N	R083388-96	C	CLASS_8	\N	\N
4226	STRESS-083388-97	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 97	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-97	MALE	\N	\N	+10000833880097	\N	R083388-97	C	CLASS_6	\N	\N
4227	STRESS-083388-98	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 98	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-98	MALE	\N	\N	+10000833880098	\N	R083388-98	B	CLASS_6	\N	\N
4228	STRESS-083388-99	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 99	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-99	MALE	\N	\N	+10000833880099	\N	R083388-99	B	CLASS_9	\N	\N
4229	STRESS-083388-100	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 100	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-100	MALE	\N	\N	+10000833880100	\N	R083388-100	D	CLASS_8	\N	\N
4230	STRESS-083388-101	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 101	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-101	FEMALE	\N	\N	+10000833880101	\N	R083388-101	C	CLASS_6	\N	\N
4231	STRESS-083388-102	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 102	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-102	MALE	\N	\N	+10000833880102	\N	R083388-102	B	CLASS_7	\N	\N
4232	STRESS-083388-103	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 103	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-103	FEMALE	\N	\N	+10000833880103	\N	R083388-103	D	CLASS_7	\N	\N
4233	STRESS-083388-104	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 104	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-104	MALE	\N	\N	+10000833880104	\N	R083388-104	A	CLASS_8	\N	\N
4234	STRESS-083388-105	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 105	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-105	FEMALE	\N	\N	+10000833880105	\N	R083388-105	D	CLASS_9	\N	\N
4235	STRESS-083388-106	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 106	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-106	FEMALE	\N	\N	+10000833880106	\N	R083388-106	B	CLASS_7	\N	\N
4236	STRESS-083388-107	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 107	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-107	MALE	\N	\N	+10000833880107	\N	R083388-107	B	CLASS_9	\N	\N
4237	STRESS-083388-108	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 108	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-108	FEMALE	\N	\N	+10000833880108	\N	R083388-108	C	CLASS_9	\N	\N
4238	STRESS-083388-109	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 109	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-109	FEMALE	\N	\N	+10000833880109	\N	R083388-109	A	CLASS_9	\N	\N
4239	STRESS-083388-110	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 110	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-110	FEMALE	\N	\N	+10000833880110	\N	R083388-110	B	CLASS_8	\N	\N
4240	STRESS-083388-111	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 111	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-111	MALE	\N	\N	+10000833880111	\N	R083388-111	C	CLASS_8	\N	\N
4241	STRESS-083388-112	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 112	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-112	MALE	\N	\N	+10000833880112	\N	R083388-112	D	CLASS_7	\N	\N
4242	STRESS-083388-113	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 113	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-113	FEMALE	\N	\N	+10000833880113	\N	R083388-113	C	CLASS_9	\N	\N
4243	STRESS-083388-114	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 114	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-114	FEMALE	\N	\N	+10000833880114	\N	R083388-114	A	CLASS_10	\N	\N
4244	STRESS-083388-115	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 115	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-115	FEMALE	\N	\N	+10000833880115	\N	R083388-115	D	CLASS_7	\N	\N
4245	STRESS-083388-116	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 116	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-116	FEMALE	\N	\N	+10000833880116	\N	R083388-116	C	CLASS_7	\N	\N
4246	STRESS-083388-117	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 117	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-117	FEMALE	\N	\N	+10000833880117	\N	R083388-117	C	CLASS_9	\N	\N
4247	STRESS-083388-118	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 118	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-118	FEMALE	\N	\N	+10000833880118	\N	R083388-118	C	CLASS_6	\N	\N
4248	STRESS-083388-119	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 119	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-119	MALE	\N	\N	+10000833880119	\N	R083388-119	C	CLASS_10	\N	\N
4249	STRESS-083388-120	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 120	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-120	FEMALE	\N	\N	+10000833880120	\N	R083388-120	B	CLASS_9	\N	\N
4250	STRESS-083388-121	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 121	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-121	MALE	\N	\N	+10000833880121	\N	R083388-121	A	CLASS_10	\N	\N
4251	STRESS-083388-122	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 122	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-122	FEMALE	\N	\N	+10000833880122	\N	R083388-122	D	CLASS_9	\N	\N
4252	STRESS-083388-123	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 123	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-123	FEMALE	\N	\N	+10000833880123	\N	R083388-123	A	CLASS_8	\N	\N
4253	STRESS-083388-124	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 124	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-124	FEMALE	\N	\N	+10000833880124	\N	R083388-124	B	CLASS_9	\N	\N
4254	STRESS-083388-125	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 125	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-125	FEMALE	\N	\N	+10000833880125	\N	R083388-125	B	CLASS_8	\N	\N
4255	STRESS-083388-126	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 126	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-126	FEMALE	\N	\N	+10000833880126	\N	R083388-126	A	CLASS_10	\N	\N
4256	STRESS-083388-127	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 127	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-127	MALE	\N	\N	+10000833880127	\N	R083388-127	C	CLASS_8	\N	\N
4257	STRESS-083388-128	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 128	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-128	FEMALE	\N	\N	+10000833880128	\N	R083388-128	D	CLASS_6	\N	\N
4258	STRESS-083388-129	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 129	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-129	FEMALE	\N	\N	+10000833880129	\N	R083388-129	C	CLASS_9	\N	\N
4259	STRESS-083388-130	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 130	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-130	MALE	\N	\N	+10000833880130	\N	R083388-130	A	CLASS_6	\N	\N
4260	STRESS-083388-131	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 131	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-131	FEMALE	\N	\N	+10000833880131	\N	R083388-131	B	CLASS_8	\N	\N
4261	STRESS-083388-132	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 132	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-132	MALE	\N	\N	+10000833880132	\N	R083388-132	A	CLASS_6	\N	\N
4262	STRESS-083388-133	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 133	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-133	FEMALE	\N	\N	+10000833880133	\N	R083388-133	B	CLASS_9	\N	\N
4263	STRESS-083388-134	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 134	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-134	FEMALE	\N	\N	+10000833880134	\N	R083388-134	B	CLASS_6	\N	\N
4264	STRESS-083388-135	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 135	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-135	MALE	\N	\N	+10000833880135	\N	R083388-135	A	CLASS_9	\N	\N
4265	STRESS-083388-136	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 136	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-136	MALE	\N	\N	+10000833880136	\N	R083388-136	C	CLASS_7	\N	\N
4266	STRESS-083388-137	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 137	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-137	MALE	\N	\N	+10000833880137	\N	R083388-137	A	CLASS_10	\N	\N
4267	STRESS-083388-138	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 138	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-138	MALE	\N	\N	+10000833880138	\N	R083388-138	A	CLASS_7	\N	\N
4268	STRESS-083388-139	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 139	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-139	MALE	\N	\N	+10000833880139	\N	R083388-139	D	CLASS_6	\N	\N
4269	STRESS-083388-140	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 140	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-140	FEMALE	\N	\N	+10000833880140	\N	R083388-140	D	CLASS_9	\N	\N
4270	STRESS-083388-141	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 141	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-141	FEMALE	\N	\N	+10000833880141	\N	R083388-141	A	CLASS_7	\N	\N
4271	STRESS-083388-142	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 142	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-142	FEMALE	\N	\N	+10000833880142	\N	R083388-142	A	CLASS_10	\N	\N
4272	STRESS-083388-143	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 143	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-143	FEMALE	\N	\N	+10000833880143	\N	R083388-143	D	CLASS_8	\N	\N
4273	STRESS-083388-144	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 144	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-144	FEMALE	\N	\N	+10000833880144	\N	R083388-144	B	CLASS_8	\N	\N
4274	STRESS-083388-145	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 145	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-145	FEMALE	\N	\N	+10000833880145	\N	R083388-145	B	CLASS_8	\N	\N
4275	STRESS-083388-146	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 146	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-146	FEMALE	\N	\N	+10000833880146	\N	R083388-146	A	CLASS_10	\N	\N
4276	STRESS-083388-147	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 147	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-147	MALE	\N	\N	+10000833880147	\N	R083388-147	B	CLASS_9	\N	\N
4277	STRESS-083388-148	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 148	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-148	MALE	\N	\N	+10000833880148	\N	R083388-148	C	CLASS_6	\N	\N
4278	STRESS-083388-149	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 149	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-149	FEMALE	\N	\N	+10000833880149	\N	R083388-149	D	CLASS_6	\N	\N
4279	STRESS-083388-150	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 150	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-150	FEMALE	\N	\N	+10000833880150	\N	R083388-150	D	CLASS_7	\N	\N
4280	STRESS-083388-151	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 151	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-151	FEMALE	\N	\N	+10000833880151	\N	R083388-151	D	CLASS_8	\N	\N
4281	STRESS-083388-152	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 152	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-152	MALE	\N	\N	+10000833880152	\N	R083388-152	B	CLASS_7	\N	\N
4282	STRESS-083388-153	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 153	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-153	FEMALE	\N	\N	+10000833880153	\N	R083388-153	B	CLASS_9	\N	\N
4283	STRESS-083388-154	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 154	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-154	MALE	\N	\N	+10000833880154	\N	R083388-154	A	CLASS_8	\N	\N
4284	STRESS-083388-155	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 155	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-155	FEMALE	\N	\N	+10000833880155	\N	R083388-155	A	CLASS_10	\N	\N
4285	STRESS-083388-156	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 156	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-156	FEMALE	\N	\N	+10000833880156	\N	R083388-156	D	CLASS_10	\N	\N
4286	STRESS-083388-157	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 157	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-157	FEMALE	\N	\N	+10000833880157	\N	R083388-157	B	CLASS_8	\N	\N
4287	STRESS-083388-158	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 158	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-158	FEMALE	\N	\N	+10000833880158	\N	R083388-158	C	CLASS_7	\N	\N
4288	STRESS-083388-159	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 159	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-159	FEMALE	\N	\N	+10000833880159	\N	R083388-159	D	CLASS_8	\N	\N
4289	STRESS-083388-160	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 160	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-160	MALE	\N	\N	+10000833880160	\N	R083388-160	C	CLASS_7	\N	\N
4290	STRESS-083388-161	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 161	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-161	FEMALE	\N	\N	+10000833880161	\N	R083388-161	C	CLASS_10	\N	\N
4291	STRESS-083388-162	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 162	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-162	FEMALE	\N	\N	+10000833880162	\N	R083388-162	C	CLASS_6	\N	\N
4292	STRESS-083388-163	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 163	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-163	FEMALE	\N	\N	+10000833880163	\N	R083388-163	A	CLASS_7	\N	\N
4293	STRESS-083388-164	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 164	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-164	MALE	\N	\N	+10000833880164	\N	R083388-164	D	CLASS_6	\N	\N
4294	STRESS-083388-165	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 165	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-165	MALE	\N	\N	+10000833880165	\N	R083388-165	C	CLASS_10	\N	\N
4295	STRESS-083388-166	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 166	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-166	MALE	\N	\N	+10000833880166	\N	R083388-166	A	CLASS_10	\N	\N
4296	STRESS-083388-167	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 167	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-167	FEMALE	\N	\N	+10000833880167	\N	R083388-167	D	CLASS_6	\N	\N
4297	STRESS-083388-168	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 168	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-168	FEMALE	\N	\N	+10000833880168	\N	R083388-168	B	CLASS_8	\N	\N
4298	STRESS-083388-169	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 169	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-169	MALE	\N	\N	+10000833880169	\N	R083388-169	C	CLASS_7	\N	\N
4299	STRESS-083388-170	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 170	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-170	FEMALE	\N	\N	+10000833880170	\N	R083388-170	D	CLASS_8	\N	\N
4300	STRESS-083388-171	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 171	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-171	FEMALE	\N	\N	+10000833880171	\N	R083388-171	C	CLASS_10	\N	\N
4301	STRESS-083388-172	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 172	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-172	MALE	\N	\N	+10000833880172	\N	R083388-172	C	CLASS_9	\N	\N
4302	STRESS-083388-173	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 173	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-173	MALE	\N	\N	+10000833880173	\N	R083388-173	C	CLASS_6	\N	\N
4303	STRESS-083388-174	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 174	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-174	FEMALE	\N	\N	+10000833880174	\N	R083388-174	A	CLASS_8	\N	\N
4304	STRESS-083388-175	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 175	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-175	FEMALE	\N	\N	+10000833880175	\N	R083388-175	B	CLASS_6	\N	\N
4305	STRESS-083388-176	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 176	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-176	FEMALE	\N	\N	+10000833880176	\N	R083388-176	C	CLASS_6	\N	\N
4306	STRESS-083388-177	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 177	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-177	FEMALE	\N	\N	+10000833880177	\N	R083388-177	D	CLASS_10	\N	\N
4307	STRESS-083388-178	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 178	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-178	FEMALE	\N	\N	+10000833880178	\N	R083388-178	B	CLASS_7	\N	\N
4308	STRESS-083388-179	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 179	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-179	MALE	\N	\N	+10000833880179	\N	R083388-179	B	CLASS_7	\N	\N
4309	STRESS-083388-180	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 180	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-180	FEMALE	\N	\N	+10000833880180	\N	R083388-180	C	CLASS_7	\N	\N
4310	STRESS-083388-181	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 181	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-181	MALE	\N	\N	+10000833880181	\N	R083388-181	C	CLASS_7	\N	\N
4311	STRESS-083388-182	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 182	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-182	FEMALE	\N	\N	+10000833880182	\N	R083388-182	B	CLASS_6	\N	\N
4312	STRESS-083388-183	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 183	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-183	FEMALE	\N	\N	+10000833880183	\N	R083388-183	C	CLASS_10	\N	\N
4313	STRESS-083388-184	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 184	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-184	MALE	\N	\N	+10000833880184	\N	R083388-184	C	CLASS_7	\N	\N
4314	STRESS-083388-185	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 185	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-185	MALE	\N	\N	+10000833880185	\N	R083388-185	B	CLASS_9	\N	\N
4315	STRESS-083388-186	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 186	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-186	FEMALE	\N	\N	+10000833880186	\N	R083388-186	B	CLASS_7	\N	\N
4316	STRESS-083388-187	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 187	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-187	MALE	\N	\N	+10000833880187	\N	R083388-187	B	CLASS_10	\N	\N
4317	STRESS-083388-188	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 188	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-188	FEMALE	\N	\N	+10000833880188	\N	R083388-188	D	CLASS_10	\N	\N
4318	STRESS-083388-189	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 189	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-189	MALE	\N	\N	+10000833880189	\N	R083388-189	B	CLASS_10	\N	\N
4319	STRESS-083388-190	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 190	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-190	MALE	\N	\N	+10000833880190	\N	R083388-190	A	CLASS_6	\N	\N
4320	STRESS-083388-191	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 191	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-191	MALE	\N	\N	+10000833880191	\N	R083388-191	D	CLASS_8	\N	\N
4321	STRESS-083388-192	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 192	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-192	MALE	\N	\N	+10000833880192	\N	R083388-192	C	CLASS_8	\N	\N
4322	STRESS-083388-193	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 193	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-193	MALE	\N	\N	+10000833880193	\N	R083388-193	B	CLASS_10	\N	\N
4323	STRESS-083388-194	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 194	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-194	FEMALE	\N	\N	+10000833880194	\N	R083388-194	B	CLASS_10	\N	\N
4324	STRESS-083388-195	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 195	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-195	FEMALE	\N	\N	+10000833880195	\N	R083388-195	B	CLASS_7	\N	\N
4325	STRESS-083388-196	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 196	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-196	FEMALE	\N	\N	+10000833880196	\N	R083388-196	C	CLASS_8	\N	\N
4326	STRESS-083388-197	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 197	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-197	MALE	\N	\N	+10000833880197	\N	R083388-197	D	CLASS_6	\N	\N
4327	STRESS-083388-198	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 198	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-198	MALE	\N	\N	+10000833880198	\N	R083388-198	A	CLASS_10	\N	\N
4328	STRESS-083388-199	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 199	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-199	FEMALE	\N	\N	+10000833880199	\N	R083388-199	C	CLASS_9	\N	\N
4329	STRESS-083388-200	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 200	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-200	FEMALE	\N	\N	+10000833880200	\N	R083388-200	C	CLASS_7	\N	\N
4330	STRESS-083388-201	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 201	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-201	MALE	\N	\N	+10000833880201	\N	R083388-201	A	CLASS_10	\N	\N
4331	STRESS-083388-202	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 202	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-202	FEMALE	\N	\N	+10000833880202	\N	R083388-202	A	CLASS_9	\N	\N
4332	STRESS-083388-203	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 203	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-203	MALE	\N	\N	+10000833880203	\N	R083388-203	A	CLASS_10	\N	\N
4333	STRESS-083388-204	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 204	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-204	MALE	\N	\N	+10000833880204	\N	R083388-204	A	CLASS_9	\N	\N
4334	STRESS-083388-205	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 205	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-205	MALE	\N	\N	+10000833880205	\N	R083388-205	C	CLASS_6	\N	\N
4335	STRESS-083388-206	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 206	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-206	FEMALE	\N	\N	+10000833880206	\N	R083388-206	A	CLASS_6	\N	\N
4336	STRESS-083388-207	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 207	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-207	FEMALE	\N	\N	+10000833880207	\N	R083388-207	C	CLASS_10	\N	\N
4337	STRESS-083388-208	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 208	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-208	MALE	\N	\N	+10000833880208	\N	R083388-208	A	CLASS_7	\N	\N
4338	STRESS-083388-209	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 209	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-209	FEMALE	\N	\N	+10000833880209	\N	R083388-209	A	CLASS_7	\N	\N
4339	STRESS-083388-210	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 210	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-210	MALE	\N	\N	+10000833880210	\N	R083388-210	D	CLASS_6	\N	\N
4340	STRESS-083388-211	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 211	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-211	MALE	\N	\N	+10000833880211	\N	R083388-211	B	CLASS_7	\N	\N
4341	STRESS-083388-212	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 212	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-212	FEMALE	\N	\N	+10000833880212	\N	R083388-212	D	CLASS_8	\N	\N
4342	STRESS-083388-213	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 213	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-213	FEMALE	\N	\N	+10000833880213	\N	R083388-213	C	CLASS_10	\N	\N
4343	STRESS-083388-214	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 214	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-214	MALE	\N	\N	+10000833880214	\N	R083388-214	B	CLASS_8	\N	\N
4344	STRESS-083388-215	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 215	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-215	MALE	\N	\N	+10000833880215	\N	R083388-215	A	CLASS_9	\N	\N
4345	STRESS-083388-216	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 216	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-216	MALE	\N	\N	+10000833880216	\N	R083388-216	B	CLASS_8	\N	\N
4346	STRESS-083388-217	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 217	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-217	MALE	\N	\N	+10000833880217	\N	R083388-217	D	CLASS_10	\N	\N
4347	STRESS-083388-218	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 218	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-218	MALE	\N	\N	+10000833880218	\N	R083388-218	D	CLASS_7	\N	\N
4348	STRESS-083388-219	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 219	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-219	FEMALE	\N	\N	+10000833880219	\N	R083388-219	D	CLASS_9	\N	\N
4349	STRESS-083388-220	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 220	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-220	FEMALE	\N	\N	+10000833880220	\N	R083388-220	C	CLASS_8	\N	\N
4350	STRESS-083388-221	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 221	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-221	FEMALE	\N	\N	+10000833880221	\N	R083388-221	A	CLASS_9	\N	\N
4351	STRESS-083388-222	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 222	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-222	MALE	\N	\N	+10000833880222	\N	R083388-222	A	CLASS_10	\N	\N
4352	STRESS-083388-223	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 223	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-223	MALE	\N	\N	+10000833880223	\N	R083388-223	D	CLASS_7	\N	\N
4353	STRESS-083388-224	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 224	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-224	MALE	\N	\N	+10000833880224	\N	R083388-224	B	CLASS_8	\N	\N
4354	STRESS-083388-225	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 225	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-225	MALE	\N	\N	+10000833880225	\N	R083388-225	B	CLASS_6	\N	\N
4355	STRESS-083388-226	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 226	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-226	FEMALE	\N	\N	+10000833880226	\N	R083388-226	D	CLASS_6	\N	\N
4356	STRESS-083388-227	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 227	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-227	FEMALE	\N	\N	+10000833880227	\N	R083388-227	B	CLASS_8	\N	\N
4357	STRESS-083388-228	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 228	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-228	FEMALE	\N	\N	+10000833880228	\N	R083388-228	B	CLASS_10	\N	\N
4358	STRESS-083388-229	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 229	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-229	FEMALE	\N	\N	+10000833880229	\N	R083388-229	D	CLASS_8	\N	\N
4359	STRESS-083388-230	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 230	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-230	MALE	\N	\N	+10000833880230	\N	R083388-230	B	CLASS_10	\N	\N
4360	STRESS-083388-231	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 231	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-231	MALE	\N	\N	+10000833880231	\N	R083388-231	A	CLASS_6	\N	\N
4361	STRESS-083388-232	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 232	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-232	MALE	\N	\N	+10000833880232	\N	R083388-232	A	CLASS_8	\N	\N
4362	STRESS-083388-233	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 233	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-233	MALE	\N	\N	+10000833880233	\N	R083388-233	C	CLASS_7	\N	\N
4363	STRESS-083388-234	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 234	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-234	FEMALE	\N	\N	+10000833880234	\N	R083388-234	B	CLASS_6	\N	\N
4364	STRESS-083388-235	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 235	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-235	FEMALE	\N	\N	+10000833880235	\N	R083388-235	A	CLASS_7	\N	\N
4365	STRESS-083388-236	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 236	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-236	MALE	\N	\N	+10000833880236	\N	R083388-236	B	CLASS_9	\N	\N
4366	STRESS-083388-237	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 237	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-237	FEMALE	\N	\N	+10000833880237	\N	R083388-237	B	CLASS_7	\N	\N
4367	STRESS-083388-238	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 238	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-238	FEMALE	\N	\N	+10000833880238	\N	R083388-238	B	CLASS_9	\N	\N
4368	STRESS-083388-239	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 239	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-239	FEMALE	\N	\N	+10000833880239	\N	R083388-239	A	CLASS_9	\N	\N
4369	STRESS-083388-240	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 240	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-240	MALE	\N	\N	+10000833880240	\N	R083388-240	D	CLASS_7	\N	\N
4370	STRESS-083388-241	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 241	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-241	FEMALE	\N	\N	+10000833880241	\N	R083388-241	A	CLASS_6	\N	\N
4371	STRESS-083388-242	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 242	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-242	FEMALE	\N	\N	+10000833880242	\N	R083388-242	C	CLASS_10	\N	\N
4372	STRESS-083388-243	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 243	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-243	MALE	\N	\N	+10000833880243	\N	R083388-243	A	CLASS_8	\N	\N
4373	STRESS-083388-244	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 244	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-244	FEMALE	\N	\N	+10000833880244	\N	R083388-244	C	CLASS_6	\N	\N
4374	STRESS-083388-245	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 245	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-245	FEMALE	\N	\N	+10000833880245	\N	R083388-245	D	CLASS_9	\N	\N
4375	STRESS-083388-246	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 246	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-246	FEMALE	\N	\N	+10000833880246	\N	R083388-246	D	CLASS_8	\N	\N
4376	STRESS-083388-247	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 247	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-247	FEMALE	\N	\N	+10000833880247	\N	R083388-247	A	CLASS_9	\N	\N
4377	STRESS-083388-248	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 248	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-248	FEMALE	\N	\N	+10000833880248	\N	R083388-248	D	CLASS_7	\N	\N
4378	STRESS-083388-249	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 249	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-249	FEMALE	\N	\N	+10000833880249	\N	R083388-249	B	CLASS_10	\N	\N
4379	STRESS-083388-250	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 250	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-250	FEMALE	\N	\N	+10000833880250	\N	R083388-250	C	CLASS_10	\N	\N
4380	STRESS-083388-251	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 251	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-251	MALE	\N	\N	+10000833880251	\N	R083388-251	D	CLASS_6	\N	\N
4381	STRESS-083388-252	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 252	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-252	FEMALE	\N	\N	+10000833880252	\N	R083388-252	C	CLASS_9	\N	\N
4382	STRESS-083388-253	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 253	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-253	FEMALE	\N	\N	+10000833880253	\N	R083388-253	B	CLASS_7	\N	\N
4383	STRESS-083388-254	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 254	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-254	MALE	\N	\N	+10000833880254	\N	R083388-254	B	CLASS_10	\N	\N
4384	STRESS-083388-255	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 255	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-255	MALE	\N	\N	+10000833880255	\N	R083388-255	C	CLASS_7	\N	\N
4385	STRESS-083388-256	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 256	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-256	MALE	\N	\N	+10000833880256	\N	R083388-256	D	CLASS_7	\N	\N
4386	STRESS-083388-257	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 257	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-257	FEMALE	\N	\N	+10000833880257	\N	R083388-257	C	CLASS_9	\N	\N
4387	STRESS-083388-258	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 258	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-258	FEMALE	\N	\N	+10000833880258	\N	R083388-258	A	CLASS_9	\N	\N
4388	STRESS-083388-259	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 259	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-259	MALE	\N	\N	+10000833880259	\N	R083388-259	D	CLASS_9	\N	\N
4389	STRESS-083388-260	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 260	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-260	MALE	\N	\N	+10000833880260	\N	R083388-260	C	CLASS_7	\N	\N
4390	STRESS-083388-261	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 261	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-261	MALE	\N	\N	+10000833880261	\N	R083388-261	C	CLASS_7	\N	\N
4391	STRESS-083388-262	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 262	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-262	MALE	\N	\N	+10000833880262	\N	R083388-262	D	CLASS_8	\N	\N
4392	STRESS-083388-263	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 263	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-263	FEMALE	\N	\N	+10000833880263	\N	R083388-263	A	CLASS_7	\N	\N
4393	STRESS-083388-264	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 264	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-264	FEMALE	\N	\N	+10000833880264	\N	R083388-264	A	CLASS_6	\N	\N
4394	STRESS-083388-265	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 265	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-265	MALE	\N	\N	+10000833880265	\N	R083388-265	D	CLASS_7	\N	\N
4395	STRESS-083388-266	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 266	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-266	MALE	\N	\N	+10000833880266	\N	R083388-266	A	CLASS_10	\N	\N
4396	STRESS-083388-267	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 267	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-267	FEMALE	\N	\N	+10000833880267	\N	R083388-267	C	CLASS_8	\N	\N
4397	STRESS-083388-268	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 268	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-268	MALE	\N	\N	+10000833880268	\N	R083388-268	A	CLASS_6	\N	\N
4398	STRESS-083388-269	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 269	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-269	MALE	\N	\N	+10000833880269	\N	R083388-269	C	CLASS_7	\N	\N
4399	STRESS-083388-270	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 270	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-270	MALE	\N	\N	+10000833880270	\N	R083388-270	A	CLASS_10	\N	\N
4400	STRESS-083388-271	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 271	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-271	FEMALE	\N	\N	+10000833880271	\N	R083388-271	C	CLASS_8	\N	\N
4401	STRESS-083388-272	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 272	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-272	MALE	\N	\N	+10000833880272	\N	R083388-272	B	CLASS_10	\N	\N
4402	STRESS-083388-273	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 273	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-273	MALE	\N	\N	+10000833880273	\N	R083388-273	C	CLASS_6	\N	\N
4403	STRESS-083388-274	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 274	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-274	MALE	\N	\N	+10000833880274	\N	R083388-274	A	CLASS_6	\N	\N
4404	STRESS-083388-275	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 275	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-275	MALE	\N	\N	+10000833880275	\N	R083388-275	B	CLASS_8	\N	\N
4405	STRESS-083388-276	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 276	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-276	MALE	\N	\N	+10000833880276	\N	R083388-276	B	CLASS_7	\N	\N
4406	STRESS-083388-277	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 277	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-277	FEMALE	\N	\N	+10000833880277	\N	R083388-277	D	CLASS_6	\N	\N
4407	STRESS-083388-278	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 278	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-278	MALE	\N	\N	+10000833880278	\N	R083388-278	B	CLASS_9	\N	\N
4408	STRESS-083388-279	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 279	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-279	MALE	\N	\N	+10000833880279	\N	R083388-279	B	CLASS_9	\N	\N
4409	STRESS-083388-280	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 280	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-280	FEMALE	\N	\N	+10000833880280	\N	R083388-280	D	CLASS_6	\N	\N
4410	STRESS-083388-281	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 281	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-281	FEMALE	\N	\N	+10000833880281	\N	R083388-281	B	CLASS_6	\N	\N
4411	STRESS-083388-282	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 282	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-282	MALE	\N	\N	+10000833880282	\N	R083388-282	B	CLASS_7	\N	\N
4412	STRESS-083388-283	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 283	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-283	FEMALE	\N	\N	+10000833880283	\N	R083388-283	D	CLASS_6	\N	\N
4413	STRESS-083388-284	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 284	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-284	FEMALE	\N	\N	+10000833880284	\N	R083388-284	C	CLASS_8	\N	\N
4414	STRESS-083388-285	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 285	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-285	MALE	\N	\N	+10000833880285	\N	R083388-285	B	CLASS_8	\N	\N
4415	STRESS-083388-286	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 286	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-286	FEMALE	\N	\N	+10000833880286	\N	R083388-286	A	CLASS_9	\N	\N
4416	STRESS-083388-287	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 287	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-287	MALE	\N	\N	+10000833880287	\N	R083388-287	A	CLASS_10	\N	\N
4417	STRESS-083388-288	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 288	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-288	FEMALE	\N	\N	+10000833880288	\N	R083388-288	A	CLASS_6	\N	\N
4418	STRESS-083388-289	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 289	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-289	MALE	\N	\N	+10000833880289	\N	R083388-289	C	CLASS_10	\N	\N
4419	STRESS-083388-290	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 290	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-290	MALE	\N	\N	+10000833880290	\N	R083388-290	D	CLASS_9	\N	\N
4420	STRESS-083388-291	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 291	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-291	MALE	\N	\N	+10000833880291	\N	R083388-291	D	CLASS_10	\N	\N
4421	STRESS-083388-292	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 292	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-292	MALE	\N	\N	+10000833880292	\N	R083388-292	C	CLASS_8	\N	\N
4422	STRESS-083388-293	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 293	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-293	MALE	\N	\N	+10000833880293	\N	R083388-293	A	CLASS_10	\N	\N
4423	STRESS-083388-294	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 294	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-294	MALE	\N	\N	+10000833880294	\N	R083388-294	A	CLASS_6	\N	\N
4424	STRESS-083388-295	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 295	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-295	FEMALE	\N	\N	+10000833880295	\N	R083388-295	C	CLASS_8	\N	\N
4425	STRESS-083388-296	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 296	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-296	MALE	\N	\N	+10000833880296	\N	R083388-296	B	CLASS_7	\N	\N
4426	STRESS-083388-297	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 297	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-297	MALE	\N	\N	+10000833880297	\N	R083388-297	C	CLASS_6	\N	\N
4427	STRESS-083388-298	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 298	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-298	FEMALE	\N	\N	+10000833880298	\N	R083388-298	D	CLASS_9	\N	\N
4428	STRESS-083388-299	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 299	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-299	FEMALE	\N	\N	+10000833880299	\N	R083388-299	D	CLASS_8	\N	\N
4429	STRESS-083388-300	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 300	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-300	MALE	\N	\N	+10000833880300	\N	R083388-300	D	CLASS_10	\N	\N
4430	STRESS-083388-301	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 301	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-301	MALE	\N	\N	+10000833880301	\N	R083388-301	D	CLASS_7	\N	\N
4431	STRESS-083388-302	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 302	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-302	FEMALE	\N	\N	+10000833880302	\N	R083388-302	A	CLASS_10	\N	\N
4432	STRESS-083388-303	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 303	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-303	FEMALE	\N	\N	+10000833880303	\N	R083388-303	D	CLASS_6	\N	\N
4433	STRESS-083388-304	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 304	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-304	FEMALE	\N	\N	+10000833880304	\N	R083388-304	B	CLASS_8	\N	\N
4434	STRESS-083388-305	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 305	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-305	FEMALE	\N	\N	+10000833880305	\N	R083388-305	D	CLASS_10	\N	\N
4435	STRESS-083388-306	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 306	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-306	FEMALE	\N	\N	+10000833880306	\N	R083388-306	D	CLASS_8	\N	\N
4436	STRESS-083388-307	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 307	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-307	FEMALE	\N	\N	+10000833880307	\N	R083388-307	B	CLASS_6	\N	\N
4437	STRESS-083388-308	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 308	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-308	MALE	\N	\N	+10000833880308	\N	R083388-308	C	CLASS_7	\N	\N
4438	STRESS-083388-309	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 309	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-309	FEMALE	\N	\N	+10000833880309	\N	R083388-309	A	CLASS_6	\N	\N
4439	STRESS-083388-310	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 310	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-310	MALE	\N	\N	+10000833880310	\N	R083388-310	B	CLASS_10	\N	\N
4440	STRESS-083388-311	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 311	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-311	MALE	\N	\N	+10000833880311	\N	R083388-311	C	CLASS_7	\N	\N
4441	STRESS-083388-312	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 312	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-312	FEMALE	\N	\N	+10000833880312	\N	R083388-312	B	CLASS_8	\N	\N
4442	STRESS-083388-313	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 313	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-313	FEMALE	\N	\N	+10000833880313	\N	R083388-313	B	CLASS_6	\N	\N
4443	STRESS-083388-314	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 314	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-314	MALE	\N	\N	+10000833880314	\N	R083388-314	D	CLASS_8	\N	\N
4444	STRESS-083388-315	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 315	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-315	FEMALE	\N	\N	+10000833880315	\N	R083388-315	A	CLASS_8	\N	\N
4445	STRESS-083388-316	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 316	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-316	FEMALE	\N	\N	+10000833880316	\N	R083388-316	B	CLASS_10	\N	\N
4446	STRESS-083388-317	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 317	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-317	FEMALE	\N	\N	+10000833880317	\N	R083388-317	A	CLASS_9	\N	\N
4447	STRESS-083388-318	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 318	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-318	MALE	\N	\N	+10000833880318	\N	R083388-318	C	CLASS_8	\N	\N
4448	STRESS-083388-319	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 319	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-319	MALE	\N	\N	+10000833880319	\N	R083388-319	C	CLASS_9	\N	\N
4449	STRESS-083388-320	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 320	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-320	MALE	\N	\N	+10000833880320	\N	R083388-320	D	CLASS_6	\N	\N
4450	STRESS-083388-321	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 321	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-321	FEMALE	\N	\N	+10000833880321	\N	R083388-321	A	CLASS_8	\N	\N
4451	STRESS-083388-322	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 322	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-322	MALE	\N	\N	+10000833880322	\N	R083388-322	D	CLASS_10	\N	\N
4452	STRESS-083388-323	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 323	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-323	MALE	\N	\N	+10000833880323	\N	R083388-323	C	CLASS_6	\N	\N
4453	STRESS-083388-324	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 324	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-324	MALE	\N	\N	+10000833880324	\N	R083388-324	B	CLASS_10	\N	\N
4454	STRESS-083388-325	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 325	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-325	MALE	\N	\N	+10000833880325	\N	R083388-325	B	CLASS_10	\N	\N
4455	STRESS-083388-326	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 326	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-326	FEMALE	\N	\N	+10000833880326	\N	R083388-326	A	CLASS_9	\N	\N
4456	STRESS-083388-327	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 327	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-327	FEMALE	\N	\N	+10000833880327	\N	R083388-327	B	CLASS_6	\N	\N
4457	STRESS-083388-328	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 328	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-328	FEMALE	\N	\N	+10000833880328	\N	R083388-328	C	CLASS_9	\N	\N
4458	STRESS-083388-329	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 329	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-329	MALE	\N	\N	+10000833880329	\N	R083388-329	B	CLASS_6	\N	\N
4459	STRESS-083388-330	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 330	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-330	MALE	\N	\N	+10000833880330	\N	R083388-330	C	CLASS_8	\N	\N
4460	STRESS-083388-331	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 331	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-331	MALE	\N	\N	+10000833880331	\N	R083388-331	A	CLASS_10	\N	\N
4461	STRESS-083388-332	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 332	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-332	MALE	\N	\N	+10000833880332	\N	R083388-332	C	CLASS_7	\N	\N
4462	STRESS-083388-333	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 333	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-333	FEMALE	\N	\N	+10000833880333	\N	R083388-333	A	CLASS_10	\N	\N
4463	STRESS-083388-334	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 334	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-334	MALE	\N	\N	+10000833880334	\N	R083388-334	B	CLASS_8	\N	\N
4464	STRESS-083388-335	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 335	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-335	MALE	\N	\N	+10000833880335	\N	R083388-335	A	CLASS_8	\N	\N
4465	STRESS-083388-336	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 336	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-336	FEMALE	\N	\N	+10000833880336	\N	R083388-336	A	CLASS_6	\N	\N
4466	STRESS-083388-337	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 337	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-337	MALE	\N	\N	+10000833880337	\N	R083388-337	A	CLASS_7	\N	\N
4467	STRESS-083388-338	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 338	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-338	MALE	\N	\N	+10000833880338	\N	R083388-338	C	CLASS_8	\N	\N
4468	STRESS-083388-339	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 339	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-339	MALE	\N	\N	+10000833880339	\N	R083388-339	C	CLASS_8	\N	\N
4469	STRESS-083388-340	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 340	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-340	FEMALE	\N	\N	+10000833880340	\N	R083388-340	B	CLASS_6	\N	\N
4470	STRESS-083388-341	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 341	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-341	MALE	\N	\N	+10000833880341	\N	R083388-341	D	CLASS_9	\N	\N
4471	STRESS-083388-342	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 342	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-342	FEMALE	\N	\N	+10000833880342	\N	R083388-342	A	CLASS_6	\N	\N
4472	STRESS-083388-343	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 343	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-343	FEMALE	\N	\N	+10000833880343	\N	R083388-343	A	CLASS_6	\N	\N
4473	STRESS-083388-344	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 344	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-344	FEMALE	\N	\N	+10000833880344	\N	R083388-344	B	CLASS_7	\N	\N
4474	STRESS-083388-345	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 345	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-345	FEMALE	\N	\N	+10000833880345	\N	R083388-345	A	CLASS_9	\N	\N
4475	STRESS-083388-346	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 346	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-346	FEMALE	\N	\N	+10000833880346	\N	R083388-346	B	CLASS_7	\N	\N
4476	STRESS-083388-347	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 347	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-347	MALE	\N	\N	+10000833880347	\N	R083388-347	A	CLASS_7	\N	\N
4477	STRESS-083388-348	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 348	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-348	MALE	\N	\N	+10000833880348	\N	R083388-348	B	CLASS_6	\N	\N
4478	STRESS-083388-349	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 349	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-349	FEMALE	\N	\N	+10000833880349	\N	R083388-349	D	CLASS_8	\N	\N
4479	STRESS-083388-350	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 350	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-350	FEMALE	\N	\N	+10000833880350	\N	R083388-350	B	CLASS_7	\N	\N
4480	STRESS-083388-351	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 351	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-351	MALE	\N	\N	+10000833880351	\N	R083388-351	D	CLASS_10	\N	\N
4481	STRESS-083388-352	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 352	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-352	MALE	\N	\N	+10000833880352	\N	R083388-352	B	CLASS_8	\N	\N
4482	STRESS-083388-353	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 353	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-353	FEMALE	\N	\N	+10000833880353	\N	R083388-353	B	CLASS_9	\N	\N
4483	STRESS-083388-354	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 354	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-354	MALE	\N	\N	+10000833880354	\N	R083388-354	D	CLASS_7	\N	\N
4484	STRESS-083388-355	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 355	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-355	FEMALE	\N	\N	+10000833880355	\N	R083388-355	C	CLASS_10	\N	\N
4485	STRESS-083388-356	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 356	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-356	FEMALE	\N	\N	+10000833880356	\N	R083388-356	D	CLASS_7	\N	\N
4486	STRESS-083388-357	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 357	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-357	FEMALE	\N	\N	+10000833880357	\N	R083388-357	A	CLASS_10	\N	\N
4487	STRESS-083388-358	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 358	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-358	MALE	\N	\N	+10000833880358	\N	R083388-358	B	CLASS_7	\N	\N
4488	STRESS-083388-359	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 359	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-359	FEMALE	\N	\N	+10000833880359	\N	R083388-359	C	CLASS_6	\N	\N
4489	STRESS-083388-360	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 360	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-360	MALE	\N	\N	+10000833880360	\N	R083388-360	D	CLASS_8	\N	\N
4490	STRESS-083388-361	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 361	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-361	MALE	\N	\N	+10000833880361	\N	R083388-361	C	CLASS_7	\N	\N
4491	STRESS-083388-362	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 362	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-362	FEMALE	\N	\N	+10000833880362	\N	R083388-362	D	CLASS_10	\N	\N
4492	STRESS-083388-363	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 363	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-363	FEMALE	\N	\N	+10000833880363	\N	R083388-363	D	CLASS_7	\N	\N
4493	STRESS-083388-364	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 364	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-364	FEMALE	\N	\N	+10000833880364	\N	R083388-364	D	CLASS_6	\N	\N
4494	STRESS-083388-365	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 365	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-365	FEMALE	\N	\N	+10000833880365	\N	R083388-365	B	CLASS_6	\N	\N
4495	STRESS-083388-366	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 366	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-366	FEMALE	\N	\N	+10000833880366	\N	R083388-366	B	CLASS_9	\N	\N
4496	STRESS-083388-367	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 367	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-367	FEMALE	\N	\N	+10000833880367	\N	R083388-367	C	CLASS_7	\N	\N
4497	STRESS-083388-368	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 368	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-368	FEMALE	\N	\N	+10000833880368	\N	R083388-368	B	CLASS_9	\N	\N
4498	STRESS-083388-369	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 369	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-369	MALE	\N	\N	+10000833880369	\N	R083388-369	A	CLASS_8	\N	\N
4499	STRESS-083388-370	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 370	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-370	FEMALE	\N	\N	+10000833880370	\N	R083388-370	B	CLASS_7	\N	\N
4500	STRESS-083388-371	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 371	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-371	MALE	\N	\N	+10000833880371	\N	R083388-371	D	CLASS_9	\N	\N
4501	STRESS-083388-372	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 372	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-372	FEMALE	\N	\N	+10000833880372	\N	R083388-372	D	CLASS_6	\N	\N
4502	STRESS-083388-373	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 373	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-373	FEMALE	\N	\N	+10000833880373	\N	R083388-373	B	CLASS_7	\N	\N
4503	STRESS-083388-374	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 374	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-374	MALE	\N	\N	+10000833880374	\N	R083388-374	C	CLASS_6	\N	\N
4504	STRESS-083388-375	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 375	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-375	FEMALE	\N	\N	+10000833880375	\N	R083388-375	A	CLASS_7	\N	\N
4505	STRESS-083388-376	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 376	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-376	FEMALE	\N	\N	+10000833880376	\N	R083388-376	A	CLASS_6	\N	\N
4506	STRESS-083388-377	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 377	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-377	MALE	\N	\N	+10000833880377	\N	R083388-377	D	CLASS_6	\N	\N
4507	STRESS-083388-378	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 378	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-378	MALE	\N	\N	+10000833880378	\N	R083388-378	D	CLASS_9	\N	\N
4508	STRESS-083388-379	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 379	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-379	MALE	\N	\N	+10000833880379	\N	R083388-379	C	CLASS_8	\N	\N
4509	STRESS-083388-380	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 380	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-380	MALE	\N	\N	+10000833880380	\N	R083388-380	A	CLASS_7	\N	\N
4510	STRESS-083388-381	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 381	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-381	FEMALE	\N	\N	+10000833880381	\N	R083388-381	B	CLASS_6	\N	\N
4511	STRESS-083388-382	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 382	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-382	FEMALE	\N	\N	+10000833880382	\N	R083388-382	B	CLASS_6	\N	\N
4512	STRESS-083388-383	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 383	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-383	MALE	\N	\N	+10000833880383	\N	R083388-383	D	CLASS_9	\N	\N
4513	STRESS-083388-384	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 384	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-384	FEMALE	\N	\N	+10000833880384	\N	R083388-384	D	CLASS_9	\N	\N
4514	STRESS-083388-385	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 385	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-385	FEMALE	\N	\N	+10000833880385	\N	R083388-385	C	CLASS_6	\N	\N
4515	STRESS-083388-386	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 386	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-386	FEMALE	\N	\N	+10000833880386	\N	R083388-386	B	CLASS_6	\N	\N
4516	STRESS-083388-387	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 387	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-387	MALE	\N	\N	+10000833880387	\N	R083388-387	B	CLASS_6	\N	\N
4517	STRESS-083388-388	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 388	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-388	FEMALE	\N	\N	+10000833880388	\N	R083388-388	B	CLASS_8	\N	\N
4518	STRESS-083388-389	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 389	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-389	FEMALE	\N	\N	+10000833880389	\N	R083388-389	B	CLASS_9	\N	\N
4519	STRESS-083388-390	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 390	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-390	FEMALE	\N	\N	+10000833880390	\N	R083388-390	B	CLASS_7	\N	\N
4520	STRESS-083388-391	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 391	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-391	FEMALE	\N	\N	+10000833880391	\N	R083388-391	B	CLASS_10	\N	\N
4521	STRESS-083388-392	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 392	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-392	FEMALE	\N	\N	+10000833880392	\N	R083388-392	C	CLASS_9	\N	\N
4522	STRESS-083388-393	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 393	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-393	FEMALE	\N	\N	+10000833880393	\N	R083388-393	B	CLASS_9	\N	\N
4523	STRESS-083388-394	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 394	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-394	MALE	\N	\N	+10000833880394	\N	R083388-394	C	CLASS_6	\N	\N
4524	STRESS-083388-395	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 395	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-395	MALE	\N	\N	+10000833880395	\N	R083388-395	A	CLASS_7	\N	\N
4525	STRESS-083388-396	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 396	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-396	MALE	\N	\N	+10000833880396	\N	R083388-396	B	CLASS_6	\N	\N
4526	STRESS-083388-397	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 397	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-397	MALE	\N	\N	+10000833880397	\N	R083388-397	A	CLASS_8	\N	\N
4527	STRESS-083388-398	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 398	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-398	FEMALE	\N	\N	+10000833880398	\N	R083388-398	A	CLASS_10	\N	\N
4528	STRESS-083388-399	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 399	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-399	MALE	\N	\N	+10000833880399	\N	R083388-399	C	CLASS_7	\N	\N
4529	STRESS-083388-400	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 400	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-400	MALE	\N	\N	+10000833880400	\N	R083388-400	D	CLASS_8	\N	\N
4530	STRESS-083388-401	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 401	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-401	MALE	\N	\N	+10000833880401	\N	R083388-401	C	CLASS_9	\N	\N
4531	STRESS-083388-402	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 402	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-402	FEMALE	\N	\N	+10000833880402	\N	R083388-402	A	CLASS_6	\N	\N
4532	STRESS-083388-403	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 403	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-403	FEMALE	\N	\N	+10000833880403	\N	R083388-403	D	CLASS_6	\N	\N
4533	STRESS-083388-404	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 404	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-404	MALE	\N	\N	+10000833880404	\N	R083388-404	D	CLASS_9	\N	\N
4534	STRESS-083388-405	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 405	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-405	MALE	\N	\N	+10000833880405	\N	R083388-405	B	CLASS_6	\N	\N
4535	STRESS-083388-406	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 406	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-406	MALE	\N	\N	+10000833880406	\N	R083388-406	D	CLASS_8	\N	\N
4536	STRESS-083388-407	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 407	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-407	MALE	\N	\N	+10000833880407	\N	R083388-407	D	CLASS_7	\N	\N
4537	STRESS-083388-408	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 408	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-408	MALE	\N	\N	+10000833880408	\N	R083388-408	D	CLASS_8	\N	\N
4538	STRESS-083388-409	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 409	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-409	MALE	\N	\N	+10000833880409	\N	R083388-409	A	CLASS_8	\N	\N
4539	STRESS-083388-410	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 410	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-410	MALE	\N	\N	+10000833880410	\N	R083388-410	A	CLASS_7	\N	\N
4540	STRESS-083388-411	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 411	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-411	MALE	\N	\N	+10000833880411	\N	R083388-411	A	CLASS_6	\N	\N
4541	STRESS-083388-412	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 412	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-412	FEMALE	\N	\N	+10000833880412	\N	R083388-412	C	CLASS_6	\N	\N
4542	STRESS-083388-413	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 413	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-413	FEMALE	\N	\N	+10000833880413	\N	R083388-413	D	CLASS_8	\N	\N
4543	STRESS-083388-414	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 414	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-414	MALE	\N	\N	+10000833880414	\N	R083388-414	C	CLASS_7	\N	\N
4544	STRESS-083388-415	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 415	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-415	FEMALE	\N	\N	+10000833880415	\N	R083388-415	C	CLASS_6	\N	\N
4545	STRESS-083388-416	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 416	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-416	MALE	\N	\N	+10000833880416	\N	R083388-416	D	CLASS_9	\N	\N
4546	STRESS-083388-417	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 417	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-417	MALE	\N	\N	+10000833880417	\N	R083388-417	A	CLASS_7	\N	\N
4547	STRESS-083388-418	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 418	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-418	MALE	\N	\N	+10000833880418	\N	R083388-418	B	CLASS_10	\N	\N
4548	STRESS-083388-419	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 419	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-419	FEMALE	\N	\N	+10000833880419	\N	R083388-419	D	CLASS_8	\N	\N
4549	STRESS-083388-420	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 420	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-420	MALE	\N	\N	+10000833880420	\N	R083388-420	A	CLASS_9	\N	\N
4550	STRESS-083388-421	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 421	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-421	FEMALE	\N	\N	+10000833880421	\N	R083388-421	C	CLASS_7	\N	\N
4551	STRESS-083388-422	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 422	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-422	FEMALE	\N	\N	+10000833880422	\N	R083388-422	D	CLASS_8	\N	\N
4552	STRESS-083388-423	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 423	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-423	MALE	\N	\N	+10000833880423	\N	R083388-423	B	CLASS_8	\N	\N
4553	STRESS-083388-424	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 424	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-424	MALE	\N	\N	+10000833880424	\N	R083388-424	C	CLASS_10	\N	\N
4554	STRESS-083388-425	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 425	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-425	FEMALE	\N	\N	+10000833880425	\N	R083388-425	D	CLASS_6	\N	\N
4555	STRESS-083388-426	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 426	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-426	MALE	\N	\N	+10000833880426	\N	R083388-426	A	CLASS_9	\N	\N
4556	STRESS-083388-427	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 427	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-427	MALE	\N	\N	+10000833880427	\N	R083388-427	D	CLASS_10	\N	\N
4557	STRESS-083388-428	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 428	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-428	MALE	\N	\N	+10000833880428	\N	R083388-428	C	CLASS_8	\N	\N
4558	STRESS-083388-429	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 429	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-429	MALE	\N	\N	+10000833880429	\N	R083388-429	B	CLASS_10	\N	\N
4559	STRESS-083388-430	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 430	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-430	MALE	\N	\N	+10000833880430	\N	R083388-430	B	CLASS_6	\N	\N
4560	STRESS-083388-431	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 431	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-431	MALE	\N	\N	+10000833880431	\N	R083388-431	D	CLASS_10	\N	\N
4561	STRESS-083388-432	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 432	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-432	MALE	\N	\N	+10000833880432	\N	R083388-432	A	CLASS_9	\N	\N
4562	STRESS-083388-433	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 433	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-433	MALE	\N	\N	+10000833880433	\N	R083388-433	D	CLASS_7	\N	\N
4563	STRESS-083388-434	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 434	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-434	FEMALE	\N	\N	+10000833880434	\N	R083388-434	D	CLASS_7	\N	\N
4564	STRESS-083388-435	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 435	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-435	FEMALE	\N	\N	+10000833880435	\N	R083388-435	D	CLASS_7	\N	\N
4565	STRESS-083388-436	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 436	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-436	MALE	\N	\N	+10000833880436	\N	R083388-436	D	CLASS_9	\N	\N
4566	STRESS-083388-437	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 437	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-437	FEMALE	\N	\N	+10000833880437	\N	R083388-437	D	CLASS_7	\N	\N
4567	STRESS-083388-438	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 438	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-438	MALE	\N	\N	+10000833880438	\N	R083388-438	D	CLASS_6	\N	\N
4568	STRESS-083388-439	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 439	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-439	FEMALE	\N	\N	+10000833880439	\N	R083388-439	D	CLASS_8	\N	\N
4569	STRESS-083388-440	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 440	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-440	MALE	\N	\N	+10000833880440	\N	R083388-440	C	CLASS_6	\N	\N
4570	STRESS-083388-441	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 441	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-441	MALE	\N	\N	+10000833880441	\N	R083388-441	B	CLASS_6	\N	\N
4571	STRESS-083388-442	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 442	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-442	FEMALE	\N	\N	+10000833880442	\N	R083388-442	C	CLASS_8	\N	\N
4572	STRESS-083388-443	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 443	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-443	MALE	\N	\N	+10000833880443	\N	R083388-443	A	CLASS_6	\N	\N
4573	STRESS-083388-444	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 444	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-444	FEMALE	\N	\N	+10000833880444	\N	R083388-444	B	CLASS_9	\N	\N
4574	STRESS-083388-445	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 445	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-445	MALE	\N	\N	+10000833880445	\N	R083388-445	D	CLASS_10	\N	\N
4575	STRESS-083388-446	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 446	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-446	FEMALE	\N	\N	+10000833880446	\N	R083388-446	C	CLASS_9	\N	\N
4576	STRESS-083388-447	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 447	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-447	MALE	\N	\N	+10000833880447	\N	R083388-447	D	CLASS_8	\N	\N
4577	STRESS-083388-448	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 448	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-448	FEMALE	\N	\N	+10000833880448	\N	R083388-448	B	CLASS_6	\N	\N
4578	STRESS-083388-449	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 449	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-449	MALE	\N	\N	+10000833880449	\N	R083388-449	B	CLASS_7	\N	\N
4579	STRESS-083388-450	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 450	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-450	MALE	\N	\N	+10000833880450	\N	R083388-450	A	CLASS_8	\N	\N
4580	STRESS-083388-451	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 451	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-451	FEMALE	\N	\N	+10000833880451	\N	R083388-451	B	CLASS_8	\N	\N
4581	STRESS-083388-452	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 452	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-452	FEMALE	\N	\N	+10000833880452	\N	R083388-452	D	CLASS_9	\N	\N
4582	STRESS-083388-453	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 453	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-453	FEMALE	\N	\N	+10000833880453	\N	R083388-453	D	CLASS_7	\N	\N
4583	STRESS-083388-454	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 454	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-454	FEMALE	\N	\N	+10000833880454	\N	R083388-454	D	CLASS_8	\N	\N
4584	STRESS-083388-455	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 455	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-455	FEMALE	\N	\N	+10000833880455	\N	R083388-455	B	CLASS_7	\N	\N
4585	STRESS-083388-456	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 456	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-456	MALE	\N	\N	+10000833880456	\N	R083388-456	C	CLASS_6	\N	\N
4586	STRESS-083388-457	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 457	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-457	FEMALE	\N	\N	+10000833880457	\N	R083388-457	C	CLASS_10	\N	\N
4587	STRESS-083388-458	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 458	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-458	FEMALE	\N	\N	+10000833880458	\N	R083388-458	C	CLASS_8	\N	\N
4588	STRESS-083388-459	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 459	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-459	MALE	\N	\N	+10000833880459	\N	R083388-459	D	CLASS_8	\N	\N
4589	STRESS-083388-460	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 460	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-460	FEMALE	\N	\N	+10000833880460	\N	R083388-460	D	CLASS_10	\N	\N
4590	STRESS-083388-461	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 461	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-461	FEMALE	\N	\N	+10000833880461	\N	R083388-461	D	CLASS_6	\N	\N
4591	STRESS-083388-462	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 462	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-462	MALE	\N	\N	+10000833880462	\N	R083388-462	A	CLASS_6	\N	\N
4592	STRESS-083388-463	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 463	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-463	MALE	\N	\N	+10000833880463	\N	R083388-463	B	CLASS_9	\N	\N
4593	STRESS-083388-464	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 464	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-464	MALE	\N	\N	+10000833880464	\N	R083388-464	C	CLASS_8	\N	\N
4594	STRESS-083388-465	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 465	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-465	FEMALE	\N	\N	+10000833880465	\N	R083388-465	C	CLASS_6	\N	\N
4595	STRESS-083388-466	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 466	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-466	FEMALE	\N	\N	+10000833880466	\N	R083388-466	D	CLASS_8	\N	\N
4596	STRESS-083388-467	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 467	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-467	MALE	\N	\N	+10000833880467	\N	R083388-467	D	CLASS_7	\N	\N
4597	STRESS-083388-468	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 468	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-468	MALE	\N	\N	+10000833880468	\N	R083388-468	A	CLASS_8	\N	\N
4598	STRESS-083388-469	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 469	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-469	FEMALE	\N	\N	+10000833880469	\N	R083388-469	C	CLASS_9	\N	\N
4599	STRESS-083388-470	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 470	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-470	FEMALE	\N	\N	+10000833880470	\N	R083388-470	C	CLASS_10	\N	\N
4600	STRESS-083388-471	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 471	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-471	MALE	\N	\N	+10000833880471	\N	R083388-471	D	CLASS_8	\N	\N
4601	STRESS-083388-472	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 472	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-472	FEMALE	\N	\N	+10000833880472	\N	R083388-472	C	CLASS_6	\N	\N
4602	STRESS-083388-473	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 473	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-473	MALE	\N	\N	+10000833880473	\N	R083388-473	A	CLASS_7	\N	\N
4603	STRESS-083388-474	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 474	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-474	MALE	\N	\N	+10000833880474	\N	R083388-474	A	CLASS_6	\N	\N
4604	STRESS-083388-475	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 475	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-475	MALE	\N	\N	+10000833880475	\N	R083388-475	C	CLASS_8	\N	\N
4605	STRESS-083388-476	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 476	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-476	FEMALE	\N	\N	+10000833880476	\N	R083388-476	B	CLASS_10	\N	\N
4606	STRESS-083388-477	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 477	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-477	FEMALE	\N	\N	+10000833880477	\N	R083388-477	D	CLASS_6	\N	\N
4607	STRESS-083388-478	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 478	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-478	FEMALE	\N	\N	+10000833880478	\N	R083388-478	D	CLASS_7	\N	\N
4608	STRESS-083388-479	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 479	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-479	FEMALE	\N	\N	+10000833880479	\N	R083388-479	C	CLASS_10	\N	\N
4609	STRESS-083388-480	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 480	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-480	FEMALE	\N	\N	+10000833880480	\N	R083388-480	B	CLASS_7	\N	\N
4610	STRESS-083388-481	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 481	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-481	FEMALE	\N	\N	+10000833880481	\N	R083388-481	B	CLASS_8	\N	\N
4611	STRESS-083388-482	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 482	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-482	MALE	\N	\N	+10000833880482	\N	R083388-482	D	CLASS_7	\N	\N
4612	STRESS-083388-483	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 483	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-483	FEMALE	\N	\N	+10000833880483	\N	R083388-483	D	CLASS_7	\N	\N
4613	STRESS-083388-484	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 484	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-484	FEMALE	\N	\N	+10000833880484	\N	R083388-484	A	CLASS_9	\N	\N
4614	STRESS-083388-485	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 485	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-485	MALE	\N	\N	+10000833880485	\N	R083388-485	A	CLASS_6	\N	\N
4615	STRESS-083388-486	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 486	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-486	MALE	\N	\N	+10000833880486	\N	R083388-486	D	CLASS_8	\N	\N
4616	STRESS-083388-487	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 487	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-487	FEMALE	\N	\N	+10000833880487	\N	R083388-487	B	CLASS_10	\N	\N
4617	STRESS-083388-488	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 488	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-488	FEMALE	\N	\N	+10000833880488	\N	R083388-488	D	CLASS_9	\N	\N
4618	STRESS-083388-489	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 489	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-489	MALE	\N	\N	+10000833880489	\N	R083388-489	B	CLASS_7	\N	\N
4619	STRESS-083388-490	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 490	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-490	MALE	\N	\N	+10000833880490	\N	R083388-490	D	CLASS_6	\N	\N
4620	STRESS-083388-491	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 491	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-491	FEMALE	\N	\N	+10000833880491	\N	R083388-491	D	CLASS_9	\N	\N
4621	STRESS-083388-492	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 492	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-492	FEMALE	\N	\N	+10000833880492	\N	R083388-492	B	CLASS_6	\N	\N
4622	STRESS-083388-493	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 493	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-493	MALE	\N	\N	+10000833880493	\N	R083388-493	C	CLASS_8	\N	\N
4623	STRESS-083388-494	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 494	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-494	MALE	\N	\N	+10000833880494	\N	R083388-494	B	CLASS_9	\N	\N
4624	STRESS-083388-495	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 495	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-495	MALE	\N	\N	+10000833880495	\N	R083388-495	B	CLASS_8	\N	\N
4625	STRESS-083388-496	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 496	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-496	MALE	\N	\N	+10000833880496	\N	R083388-496	D	CLASS_9	\N	\N
4626	STRESS-083388-497	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 497	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-497	MALE	\N	\N	+10000833880497	\N	R083388-497	A	CLASS_7	\N	\N
4627	STRESS-083388-498	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 498	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-498	MALE	\N	\N	+10000833880498	\N	R083388-498	B	CLASS_6	\N	\N
4628	STRESS-083388-499	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 499	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-499	FEMALE	\N	\N	+10000833880499	\N	R083388-499	D	CLASS_9	\N	\N
4629	STRESS-083388-500	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 500	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-500	MALE	\N	\N	+10000833880500	\N	R083388-500	C	CLASS_10	\N	\N
4630	STRESS-083388-501	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 501	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-501	MALE	\N	\N	+10000833880501	\N	R083388-501	B	CLASS_10	\N	\N
4631	STRESS-083388-502	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 502	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-502	FEMALE	\N	\N	+10000833880502	\N	R083388-502	C	CLASS_8	\N	\N
4632	STRESS-083388-503	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 503	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-503	MALE	\N	\N	+10000833880503	\N	R083388-503	A	CLASS_7	\N	\N
4633	STRESS-083388-504	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 504	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-504	MALE	\N	\N	+10000833880504	\N	R083388-504	D	CLASS_7	\N	\N
4634	STRESS-083388-505	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 505	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-505	MALE	\N	\N	+10000833880505	\N	R083388-505	A	CLASS_7	\N	\N
4635	STRESS-083388-506	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 506	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-506	FEMALE	\N	\N	+10000833880506	\N	R083388-506	D	CLASS_10	\N	\N
4636	STRESS-083388-507	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 507	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-507	MALE	\N	\N	+10000833880507	\N	R083388-507	D	CLASS_10	\N	\N
4637	STRESS-083388-508	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 508	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-508	FEMALE	\N	\N	+10000833880508	\N	R083388-508	D	CLASS_8	\N	\N
4638	STRESS-083388-509	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 509	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-509	FEMALE	\N	\N	+10000833880509	\N	R083388-509	A	CLASS_6	\N	\N
4639	STRESS-083388-510	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 510	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-510	MALE	\N	\N	+10000833880510	\N	R083388-510	C	CLASS_9	\N	\N
4640	STRESS-083388-511	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 511	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-511	MALE	\N	\N	+10000833880511	\N	R083388-511	B	CLASS_10	\N	\N
4641	STRESS-083388-512	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 512	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-512	FEMALE	\N	\N	+10000833880512	\N	R083388-512	C	CLASS_7	\N	\N
4642	STRESS-083388-513	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 513	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-513	FEMALE	\N	\N	+10000833880513	\N	R083388-513	D	CLASS_10	\N	\N
4643	STRESS-083388-514	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 514	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-514	MALE	\N	\N	+10000833880514	\N	R083388-514	D	CLASS_9	\N	\N
4644	STRESS-083388-515	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 515	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-515	MALE	\N	\N	+10000833880515	\N	R083388-515	D	CLASS_8	\N	\N
4645	STRESS-083388-516	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 516	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-516	FEMALE	\N	\N	+10000833880516	\N	R083388-516	A	CLASS_9	\N	\N
4646	STRESS-083388-517	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 517	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-517	FEMALE	\N	\N	+10000833880517	\N	R083388-517	B	CLASS_9	\N	\N
4647	STRESS-083388-518	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 518	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-518	MALE	\N	\N	+10000833880518	\N	R083388-518	C	CLASS_9	\N	\N
4648	STRESS-083388-519	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 519	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-519	FEMALE	\N	\N	+10000833880519	\N	R083388-519	C	CLASS_10	\N	\N
4649	STRESS-083388-520	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 520	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-520	FEMALE	\N	\N	+10000833880520	\N	R083388-520	B	CLASS_6	\N	\N
4650	STRESS-083388-521	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 521	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-521	FEMALE	\N	\N	+10000833880521	\N	R083388-521	B	CLASS_6	\N	\N
4651	STRESS-083388-522	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 522	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-522	FEMALE	\N	\N	+10000833880522	\N	R083388-522	A	CLASS_8	\N	\N
4652	STRESS-083388-523	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 523	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-523	FEMALE	\N	\N	+10000833880523	\N	R083388-523	D	CLASS_9	\N	\N
4653	STRESS-083388-524	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 524	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-524	MALE	\N	\N	+10000833880524	\N	R083388-524	D	CLASS_9	\N	\N
4654	STRESS-083388-525	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 525	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-525	FEMALE	\N	\N	+10000833880525	\N	R083388-525	A	CLASS_7	\N	\N
4655	STRESS-083388-526	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 526	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-526	FEMALE	\N	\N	+10000833880526	\N	R083388-526	A	CLASS_7	\N	\N
4656	STRESS-083388-527	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 527	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-527	MALE	\N	\N	+10000833880527	\N	R083388-527	A	CLASS_9	\N	\N
4657	STRESS-083388-528	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 528	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-528	MALE	\N	\N	+10000833880528	\N	R083388-528	D	CLASS_6	\N	\N
4658	STRESS-083388-529	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 529	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-529	FEMALE	\N	\N	+10000833880529	\N	R083388-529	C	CLASS_6	\N	\N
4659	STRESS-083388-530	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 530	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-530	MALE	\N	\N	+10000833880530	\N	R083388-530	A	CLASS_6	\N	\N
4660	STRESS-083388-531	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 531	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-531	MALE	\N	\N	+10000833880531	\N	R083388-531	C	CLASS_10	\N	\N
4661	STRESS-083388-532	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 532	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-532	MALE	\N	\N	+10000833880532	\N	R083388-532	A	CLASS_7	\N	\N
4662	STRESS-083388-533	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 533	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-533	MALE	\N	\N	+10000833880533	\N	R083388-533	D	CLASS_6	\N	\N
4663	STRESS-083388-534	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 534	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-534	FEMALE	\N	\N	+10000833880534	\N	R083388-534	D	CLASS_9	\N	\N
4664	STRESS-083388-535	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 535	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-535	MALE	\N	\N	+10000833880535	\N	R083388-535	B	CLASS_7	\N	\N
4665	STRESS-083388-536	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 536	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-536	MALE	\N	\N	+10000833880536	\N	R083388-536	A	CLASS_7	\N	\N
4666	STRESS-083388-537	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 537	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-537	FEMALE	\N	\N	+10000833880537	\N	R083388-537	C	CLASS_6	\N	\N
4667	STRESS-083388-538	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 538	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-538	FEMALE	\N	\N	+10000833880538	\N	R083388-538	D	CLASS_8	\N	\N
4668	STRESS-083388-539	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 539	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-539	FEMALE	\N	\N	+10000833880539	\N	R083388-539	C	CLASS_10	\N	\N
4669	STRESS-083388-540	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 540	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-540	MALE	\N	\N	+10000833880540	\N	R083388-540	D	CLASS_8	\N	\N
4670	STRESS-083388-541	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 541	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-541	FEMALE	\N	\N	+10000833880541	\N	R083388-541	D	CLASS_10	\N	\N
4671	STRESS-083388-542	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 542	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-542	FEMALE	\N	\N	+10000833880542	\N	R083388-542	A	CLASS_7	\N	\N
4672	STRESS-083388-543	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 543	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-543	FEMALE	\N	\N	+10000833880543	\N	R083388-543	A	CLASS_8	\N	\N
4673	STRESS-083388-544	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 544	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-544	FEMALE	\N	\N	+10000833880544	\N	R083388-544	D	CLASS_9	\N	\N
4674	STRESS-083388-545	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 545	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-545	FEMALE	\N	\N	+10000833880545	\N	R083388-545	C	CLASS_9	\N	\N
4675	STRESS-083388-546	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 546	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-546	MALE	\N	\N	+10000833880546	\N	R083388-546	D	CLASS_10	\N	\N
4676	STRESS-083388-547	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 547	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-547	FEMALE	\N	\N	+10000833880547	\N	R083388-547	A	CLASS_9	\N	\N
4677	STRESS-083388-548	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 548	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-548	FEMALE	\N	\N	+10000833880548	\N	R083388-548	C	CLASS_7	\N	\N
4678	STRESS-083388-549	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 549	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-549	MALE	\N	\N	+10000833880549	\N	R083388-549	B	CLASS_9	\N	\N
4679	STRESS-083388-550	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 550	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-550	FEMALE	\N	\N	+10000833880550	\N	R083388-550	D	CLASS_8	\N	\N
4680	STRESS-083388-551	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 551	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-551	MALE	\N	\N	+10000833880551	\N	R083388-551	C	CLASS_7	\N	\N
4681	STRESS-083388-552	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 552	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-552	FEMALE	\N	\N	+10000833880552	\N	R083388-552	A	CLASS_7	\N	\N
4682	STRESS-083388-553	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 553	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-553	MALE	\N	\N	+10000833880553	\N	R083388-553	A	CLASS_7	\N	\N
4683	STRESS-083388-554	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 554	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-554	MALE	\N	\N	+10000833880554	\N	R083388-554	B	CLASS_9	\N	\N
4684	STRESS-083388-555	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 555	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-555	MALE	\N	\N	+10000833880555	\N	R083388-555	A	CLASS_7	\N	\N
4685	STRESS-083388-556	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 556	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-556	FEMALE	\N	\N	+10000833880556	\N	R083388-556	C	CLASS_9	\N	\N
4686	STRESS-083388-557	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 557	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-557	FEMALE	\N	\N	+10000833880557	\N	R083388-557	C	CLASS_6	\N	\N
4687	STRESS-083388-558	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 558	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-558	FEMALE	\N	\N	+10000833880558	\N	R083388-558	D	CLASS_6	\N	\N
4688	STRESS-083388-559	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 559	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-559	MALE	\N	\N	+10000833880559	\N	R083388-559	C	CLASS_6	\N	\N
4689	STRESS-083388-560	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 560	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-560	FEMALE	\N	\N	+10000833880560	\N	R083388-560	B	CLASS_10	\N	\N
4690	STRESS-083388-561	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 561	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-561	MALE	\N	\N	+10000833880561	\N	R083388-561	B	CLASS_6	\N	\N
4691	STRESS-083388-562	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 562	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-562	MALE	\N	\N	+10000833880562	\N	R083388-562	C	CLASS_9	\N	\N
4692	STRESS-083388-563	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 563	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-563	FEMALE	\N	\N	+10000833880563	\N	R083388-563	B	CLASS_6	\N	\N
4693	STRESS-083388-564	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 564	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-564	MALE	\N	\N	+10000833880564	\N	R083388-564	B	CLASS_10	\N	\N
4694	STRESS-083388-565	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 565	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-565	FEMALE	\N	\N	+10000833880565	\N	R083388-565	A	CLASS_6	\N	\N
4695	STRESS-083388-566	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 566	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-566	FEMALE	\N	\N	+10000833880566	\N	R083388-566	C	CLASS_9	\N	\N
4696	STRESS-083388-567	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 567	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-567	FEMALE	\N	\N	+10000833880567	\N	R083388-567	A	CLASS_6	\N	\N
4697	STRESS-083388-568	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 568	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-568	FEMALE	\N	\N	+10000833880568	\N	R083388-568	B	CLASS_6	\N	\N
4698	STRESS-083388-569	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 569	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-569	FEMALE	\N	\N	+10000833880569	\N	R083388-569	D	CLASS_6	\N	\N
4699	STRESS-083388-570	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 570	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-570	MALE	\N	\N	+10000833880570	\N	R083388-570	A	CLASS_10	\N	\N
4700	STRESS-083388-571	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 571	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-571	FEMALE	\N	\N	+10000833880571	\N	R083388-571	B	CLASS_7	\N	\N
4701	STRESS-083388-572	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 572	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-572	MALE	\N	\N	+10000833880572	\N	R083388-572	A	CLASS_10	\N	\N
4702	STRESS-083388-573	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 573	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-573	MALE	\N	\N	+10000833880573	\N	R083388-573	B	CLASS_7	\N	\N
4703	STRESS-083388-574	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 574	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-574	FEMALE	\N	\N	+10000833880574	\N	R083388-574	D	CLASS_8	\N	\N
4704	STRESS-083388-575	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 575	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-575	FEMALE	\N	\N	+10000833880575	\N	R083388-575	B	CLASS_9	\N	\N
4705	STRESS-083388-576	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 576	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-576	MALE	\N	\N	+10000833880576	\N	R083388-576	D	CLASS_10	\N	\N
4706	STRESS-083388-577	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 577	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-577	MALE	\N	\N	+10000833880577	\N	R083388-577	D	CLASS_6	\N	\N
4707	STRESS-083388-578	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 578	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-578	FEMALE	\N	\N	+10000833880578	\N	R083388-578	C	CLASS_9	\N	\N
4708	STRESS-083388-579	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 579	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-579	MALE	\N	\N	+10000833880579	\N	R083388-579	C	CLASS_7	\N	\N
4709	STRESS-083388-580	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 580	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-580	MALE	\N	\N	+10000833880580	\N	R083388-580	A	CLASS_6	\N	\N
4710	STRESS-083388-581	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 581	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-581	MALE	\N	\N	+10000833880581	\N	R083388-581	D	CLASS_10	\N	\N
4711	STRESS-083388-582	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 582	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-582	MALE	\N	\N	+10000833880582	\N	R083388-582	C	CLASS_7	\N	\N
4712	STRESS-083388-583	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 583	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-583	MALE	\N	\N	+10000833880583	\N	R083388-583	B	CLASS_8	\N	\N
4713	STRESS-083388-584	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 584	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-584	MALE	\N	\N	+10000833880584	\N	R083388-584	D	CLASS_10	\N	\N
4714	STRESS-083388-585	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 585	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-585	FEMALE	\N	\N	+10000833880585	\N	R083388-585	B	CLASS_6	\N	\N
4715	STRESS-083388-586	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 586	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-586	MALE	\N	\N	+10000833880586	\N	R083388-586	B	CLASS_9	\N	\N
4716	STRESS-083388-587	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 587	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-587	FEMALE	\N	\N	+10000833880587	\N	R083388-587	C	CLASS_6	\N	\N
4717	STRESS-083388-588	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 588	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-588	MALE	\N	\N	+10000833880588	\N	R083388-588	D	CLASS_7	\N	\N
4718	STRESS-083388-589	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 589	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-589	MALE	\N	\N	+10000833880589	\N	R083388-589	C	CLASS_10	\N	\N
4719	STRESS-083388-590	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 590	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-590	MALE	\N	\N	+10000833880590	\N	R083388-590	B	CLASS_8	\N	\N
4720	STRESS-083388-591	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 591	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-591	FEMALE	\N	\N	+10000833880591	\N	R083388-591	A	CLASS_9	\N	\N
4721	STRESS-083388-592	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 592	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-592	MALE	\N	\N	+10000833880592	\N	R083388-592	A	CLASS_9	\N	\N
4722	STRESS-083388-593	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 593	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-593	MALE	\N	\N	+10000833880593	\N	R083388-593	C	CLASS_9	\N	\N
4723	STRESS-083388-594	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 594	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-594	FEMALE	\N	\N	+10000833880594	\N	R083388-594	D	CLASS_8	\N	\N
4724	STRESS-083388-595	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 595	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-595	FEMALE	\N	\N	+10000833880595	\N	R083388-595	D	CLASS_6	\N	\N
4725	STRESS-083388-596	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 596	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-596	MALE	\N	\N	+10000833880596	\N	R083388-596	A	CLASS_6	\N	\N
4726	STRESS-083388-597	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 597	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-597	MALE	\N	\N	+10000833880597	\N	R083388-597	A	CLASS_8	\N	\N
4727	STRESS-083388-598	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 598	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-598	FEMALE	\N	\N	+10000833880598	\N	R083388-598	B	CLASS_9	\N	\N
4728	STRESS-083388-599	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 599	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-599	FEMALE	\N	\N	+10000833880599	\N	R083388-599	A	CLASS_10	\N	\N
4729	STRESS-083388-600	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 600	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-600	MALE	\N	\N	+10000833880600	\N	R083388-600	A	CLASS_9	\N	\N
4730	STRESS-083388-601	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 601	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-601	FEMALE	\N	\N	+10000833880601	\N	R083388-601	B	CLASS_7	\N	\N
4731	STRESS-083388-602	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 602	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-602	MALE	\N	\N	+10000833880602	\N	R083388-602	A	CLASS_6	\N	\N
4732	STRESS-083388-603	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 603	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-603	MALE	\N	\N	+10000833880603	\N	R083388-603	B	CLASS_9	\N	\N
4733	STRESS-083388-604	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 604	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-604	MALE	\N	\N	+10000833880604	\N	R083388-604	D	CLASS_6	\N	\N
4734	STRESS-083388-605	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 605	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-605	MALE	\N	\N	+10000833880605	\N	R083388-605	A	CLASS_7	\N	\N
4735	STRESS-083388-606	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 606	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-606	MALE	\N	\N	+10000833880606	\N	R083388-606	C	CLASS_8	\N	\N
4736	STRESS-083388-607	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 607	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-607	FEMALE	\N	\N	+10000833880607	\N	R083388-607	C	CLASS_10	\N	\N
4737	STRESS-083388-608	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 608	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-608	MALE	\N	\N	+10000833880608	\N	R083388-608	A	CLASS_8	\N	\N
4738	STRESS-083388-609	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 609	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-609	FEMALE	\N	\N	+10000833880609	\N	R083388-609	D	CLASS_10	\N	\N
4739	STRESS-083388-610	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 610	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-610	FEMALE	\N	\N	+10000833880610	\N	R083388-610	D	CLASS_9	\N	\N
4740	STRESS-083388-611	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 611	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-611	MALE	\N	\N	+10000833880611	\N	R083388-611	D	CLASS_9	\N	\N
4741	STRESS-083388-612	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 612	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-612	MALE	\N	\N	+10000833880612	\N	R083388-612	C	CLASS_9	\N	\N
4742	STRESS-083388-613	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 613	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-613	MALE	\N	\N	+10000833880613	\N	R083388-613	D	CLASS_10	\N	\N
4743	STRESS-083388-614	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 614	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-614	FEMALE	\N	\N	+10000833880614	\N	R083388-614	A	CLASS_6	\N	\N
4744	STRESS-083388-615	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 615	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-615	MALE	\N	\N	+10000833880615	\N	R083388-615	B	CLASS_10	\N	\N
4745	STRESS-083388-616	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 616	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-616	FEMALE	\N	\N	+10000833880616	\N	R083388-616	C	CLASS_8	\N	\N
4746	STRESS-083388-617	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 617	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-617	MALE	\N	\N	+10000833880617	\N	R083388-617	A	CLASS_10	\N	\N
4747	STRESS-083388-618	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 618	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-618	FEMALE	\N	\N	+10000833880618	\N	R083388-618	C	CLASS_8	\N	\N
4748	STRESS-083388-619	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 619	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-619	FEMALE	\N	\N	+10000833880619	\N	R083388-619	C	CLASS_8	\N	\N
4749	STRESS-083388-620	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 620	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-620	FEMALE	\N	\N	+10000833880620	\N	R083388-620	D	CLASS_9	\N	\N
4750	STRESS-083388-621	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 621	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-621	FEMALE	\N	\N	+10000833880621	\N	R083388-621	A	CLASS_6	\N	\N
4751	STRESS-083388-622	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 622	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-622	FEMALE	\N	\N	+10000833880622	\N	R083388-622	B	CLASS_7	\N	\N
4752	STRESS-083388-623	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 623	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-623	MALE	\N	\N	+10000833880623	\N	R083388-623	B	CLASS_9	\N	\N
4753	STRESS-083388-624	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 624	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-624	FEMALE	\N	\N	+10000833880624	\N	R083388-624	B	CLASS_10	\N	\N
4754	STRESS-083388-625	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 625	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-625	MALE	\N	\N	+10000833880625	\N	R083388-625	D	CLASS_8	\N	\N
4755	STRESS-083388-626	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 626	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-626	MALE	\N	\N	+10000833880626	\N	R083388-626	D	CLASS_7	\N	\N
4756	STRESS-083388-627	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 627	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-627	FEMALE	\N	\N	+10000833880627	\N	R083388-627	C	CLASS_8	\N	\N
4757	STRESS-083388-628	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 628	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-628	MALE	\N	\N	+10000833880628	\N	R083388-628	B	CLASS_6	\N	\N
4758	STRESS-083388-629	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 629	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-629	MALE	\N	\N	+10000833880629	\N	R083388-629	D	CLASS_9	\N	\N
4759	STRESS-083388-630	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 630	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-630	FEMALE	\N	\N	+10000833880630	\N	R083388-630	B	CLASS_6	\N	\N
4760	STRESS-083388-631	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 631	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-631	MALE	\N	\N	+10000833880631	\N	R083388-631	D	CLASS_10	\N	\N
4761	STRESS-083388-632	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 632	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-632	FEMALE	\N	\N	+10000833880632	\N	R083388-632	D	CLASS_6	\N	\N
4762	STRESS-083388-633	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 633	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-633	FEMALE	\N	\N	+10000833880633	\N	R083388-633	C	CLASS_10	\N	\N
4763	STRESS-083388-634	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 634	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-634	MALE	\N	\N	+10000833880634	\N	R083388-634	B	CLASS_6	\N	\N
4764	STRESS-083388-635	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 635	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-635	MALE	\N	\N	+10000833880635	\N	R083388-635	B	CLASS_8	\N	\N
4765	STRESS-083388-636	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 636	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-636	FEMALE	\N	\N	+10000833880636	\N	R083388-636	A	CLASS_6	\N	\N
4766	STRESS-083388-637	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 637	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-637	MALE	\N	\N	+10000833880637	\N	R083388-637	D	CLASS_9	\N	\N
4767	STRESS-083388-638	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 638	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-638	MALE	\N	\N	+10000833880638	\N	R083388-638	C	CLASS_7	\N	\N
4768	STRESS-083388-639	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 639	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-639	MALE	\N	\N	+10000833880639	\N	R083388-639	C	CLASS_10	\N	\N
4769	STRESS-083388-640	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 640	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-640	MALE	\N	\N	+10000833880640	\N	R083388-640	A	CLASS_10	\N	\N
4770	STRESS-083388-641	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 641	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-641	MALE	\N	\N	+10000833880641	\N	R083388-641	D	CLASS_6	\N	\N
4771	STRESS-083388-642	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 642	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-642	MALE	\N	\N	+10000833880642	\N	R083388-642	B	CLASS_6	\N	\N
4772	STRESS-083388-643	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 643	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-643	MALE	\N	\N	+10000833880643	\N	R083388-643	C	CLASS_7	\N	\N
4773	STRESS-083388-644	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 644	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-644	MALE	\N	\N	+10000833880644	\N	R083388-644	A	CLASS_10	\N	\N
4774	STRESS-083388-645	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 645	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-645	MALE	\N	\N	+10000833880645	\N	R083388-645	D	CLASS_6	\N	\N
4775	STRESS-083388-646	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 646	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-646	FEMALE	\N	\N	+10000833880646	\N	R083388-646	D	CLASS_10	\N	\N
4776	STRESS-083388-647	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 647	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-647	MALE	\N	\N	+10000833880647	\N	R083388-647	C	CLASS_10	\N	\N
4777	STRESS-083388-648	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 648	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-648	FEMALE	\N	\N	+10000833880648	\N	R083388-648	D	CLASS_10	\N	\N
4778	STRESS-083388-649	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 649	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-649	MALE	\N	\N	+10000833880649	\N	R083388-649	D	CLASS_10	\N	\N
4779	STRESS-083388-650	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 650	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-650	FEMALE	\N	\N	+10000833880650	\N	R083388-650	D	CLASS_7	\N	\N
4780	STRESS-083388-651	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 651	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-651	FEMALE	\N	\N	+10000833880651	\N	R083388-651	A	CLASS_6	\N	\N
4781	STRESS-083388-652	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 652	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-652	MALE	\N	\N	+10000833880652	\N	R083388-652	D	CLASS_10	\N	\N
4782	STRESS-083388-653	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 653	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-653	MALE	\N	\N	+10000833880653	\N	R083388-653	B	CLASS_9	\N	\N
4783	STRESS-083388-654	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 654	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-654	FEMALE	\N	\N	+10000833880654	\N	R083388-654	A	CLASS_7	\N	\N
4784	STRESS-083388-655	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 655	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-655	MALE	\N	\N	+10000833880655	\N	R083388-655	D	CLASS_6	\N	\N
4785	STRESS-083388-656	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 656	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-656	FEMALE	\N	\N	+10000833880656	\N	R083388-656	D	CLASS_8	\N	\N
4786	STRESS-083388-657	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 657	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-657	FEMALE	\N	\N	+10000833880657	\N	R083388-657	B	CLASS_9	\N	\N
4787	STRESS-083388-658	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 658	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-658	MALE	\N	\N	+10000833880658	\N	R083388-658	A	CLASS_10	\N	\N
4788	STRESS-083388-659	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 659	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-659	FEMALE	\N	\N	+10000833880659	\N	R083388-659	C	CLASS_9	\N	\N
4789	STRESS-083388-660	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 660	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-660	MALE	\N	\N	+10000833880660	\N	R083388-660	D	CLASS_8	\N	\N
4790	STRESS-083388-661	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 661	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-661	FEMALE	\N	\N	+10000833880661	\N	R083388-661	A	CLASS_6	\N	\N
4791	STRESS-083388-662	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 662	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-662	FEMALE	\N	\N	+10000833880662	\N	R083388-662	C	CLASS_8	\N	\N
4792	STRESS-083388-663	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 663	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-663	FEMALE	\N	\N	+10000833880663	\N	R083388-663	A	CLASS_8	\N	\N
4793	STRESS-083388-664	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 664	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-664	MALE	\N	\N	+10000833880664	\N	R083388-664	A	CLASS_6	\N	\N
4794	STRESS-083388-665	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 665	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-665	FEMALE	\N	\N	+10000833880665	\N	R083388-665	A	CLASS_10	\N	\N
4795	STRESS-083388-666	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 666	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-666	FEMALE	\N	\N	+10000833880666	\N	R083388-666	A	CLASS_10	\N	\N
4796	STRESS-083388-667	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 667	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-667	MALE	\N	\N	+10000833880667	\N	R083388-667	D	CLASS_10	\N	\N
4797	STRESS-083388-668	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 668	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-668	MALE	\N	\N	+10000833880668	\N	R083388-668	D	CLASS_7	\N	\N
4798	STRESS-083388-669	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 669	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-669	FEMALE	\N	\N	+10000833880669	\N	R083388-669	D	CLASS_8	\N	\N
4799	STRESS-083388-670	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 670	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-670	MALE	\N	\N	+10000833880670	\N	R083388-670	D	CLASS_8	\N	\N
4800	STRESS-083388-671	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 671	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-671	MALE	\N	\N	+10000833880671	\N	R083388-671	D	CLASS_7	\N	\N
4801	STRESS-083388-672	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 672	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-672	FEMALE	\N	\N	+10000833880672	\N	R083388-672	A	CLASS_8	\N	\N
4802	STRESS-083388-673	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 673	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-673	MALE	\N	\N	+10000833880673	\N	R083388-673	A	CLASS_6	\N	\N
4803	STRESS-083388-674	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 674	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-674	FEMALE	\N	\N	+10000833880674	\N	R083388-674	D	CLASS_7	\N	\N
4804	STRESS-083388-675	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 675	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-675	FEMALE	\N	\N	+10000833880675	\N	R083388-675	B	CLASS_8	\N	\N
4805	STRESS-083388-676	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 676	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-676	MALE	\N	\N	+10000833880676	\N	R083388-676	C	CLASS_9	\N	\N
4806	STRESS-083388-677	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 677	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-677	FEMALE	\N	\N	+10000833880677	\N	R083388-677	D	CLASS_9	\N	\N
4807	STRESS-083388-678	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 678	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-678	FEMALE	\N	\N	+10000833880678	\N	R083388-678	C	CLASS_10	\N	\N
4808	STRESS-083388-679	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 679	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-679	FEMALE	\N	\N	+10000833880679	\N	R083388-679	A	CLASS_7	\N	\N
4809	STRESS-083388-680	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 680	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-680	FEMALE	\N	\N	+10000833880680	\N	R083388-680	D	CLASS_7	\N	\N
4810	STRESS-083388-681	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 681	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-681	MALE	\N	\N	+10000833880681	\N	R083388-681	A	CLASS_7	\N	\N
4811	STRESS-083388-682	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 682	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-682	FEMALE	\N	\N	+10000833880682	\N	R083388-682	A	CLASS_8	\N	\N
4812	STRESS-083388-683	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 683	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-683	FEMALE	\N	\N	+10000833880683	\N	R083388-683	B	CLASS_8	\N	\N
4813	STRESS-083388-684	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 684	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-684	FEMALE	\N	\N	+10000833880684	\N	R083388-684	D	CLASS_9	\N	\N
4814	STRESS-083388-685	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 685	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-685	FEMALE	\N	\N	+10000833880685	\N	R083388-685	A	CLASS_6	\N	\N
4815	STRESS-083388-686	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 686	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-686	FEMALE	\N	\N	+10000833880686	\N	R083388-686	B	CLASS_6	\N	\N
4816	STRESS-083388-687	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 687	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-687	FEMALE	\N	\N	+10000833880687	\N	R083388-687	B	CLASS_10	\N	\N
4817	STRESS-083388-688	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 688	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-688	FEMALE	\N	\N	+10000833880688	\N	R083388-688	D	CLASS_9	\N	\N
4818	STRESS-083388-689	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 689	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-689	MALE	\N	\N	+10000833880689	\N	R083388-689	D	CLASS_7	\N	\N
4819	STRESS-083388-690	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 690	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-690	FEMALE	\N	\N	+10000833880690	\N	R083388-690	A	CLASS_7	\N	\N
4820	STRESS-083388-691	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 691	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-691	MALE	\N	\N	+10000833880691	\N	R083388-691	A	CLASS_9	\N	\N
4821	STRESS-083388-692	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 692	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-692	FEMALE	\N	\N	+10000833880692	\N	R083388-692	D	CLASS_6	\N	\N
4822	STRESS-083388-693	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 693	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-693	MALE	\N	\N	+10000833880693	\N	R083388-693	B	CLASS_8	\N	\N
4823	STRESS-083388-694	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 694	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-694	MALE	\N	\N	+10000833880694	\N	R083388-694	D	CLASS_8	\N	\N
4824	STRESS-083388-695	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 695	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-695	MALE	\N	\N	+10000833880695	\N	R083388-695	B	CLASS_8	\N	\N
4825	STRESS-083388-696	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 696	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-696	FEMALE	\N	\N	+10000833880696	\N	R083388-696	C	CLASS_6	\N	\N
4826	STRESS-083388-697	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 697	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-697	FEMALE	\N	\N	+10000833880697	\N	R083388-697	C	CLASS_9	\N	\N
4827	STRESS-083388-698	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 698	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-698	MALE	\N	\N	+10000833880698	\N	R083388-698	D	CLASS_10	\N	\N
4828	STRESS-083388-699	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 699	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-699	FEMALE	\N	\N	+10000833880699	\N	R083388-699	A	CLASS_8	\N	\N
4829	STRESS-083388-700	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 700	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-700	MALE	\N	\N	+10000833880700	\N	R083388-700	A	CLASS_7	\N	\N
4830	STRESS-083388-701	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 701	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-701	FEMALE	\N	\N	+10000833880701	\N	R083388-701	C	CLASS_6	\N	\N
4831	STRESS-083388-702	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 702	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-702	MALE	\N	\N	+10000833880702	\N	R083388-702	B	CLASS_10	\N	\N
4832	STRESS-083388-703	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 703	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-703	MALE	\N	\N	+10000833880703	\N	R083388-703	A	CLASS_9	\N	\N
4833	STRESS-083388-704	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 704	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-704	FEMALE	\N	\N	+10000833880704	\N	R083388-704	B	CLASS_9	\N	\N
4834	STRESS-083388-705	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 705	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-705	FEMALE	\N	\N	+10000833880705	\N	R083388-705	A	CLASS_6	\N	\N
4835	STRESS-083388-706	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 706	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-706	MALE	\N	\N	+10000833880706	\N	R083388-706	C	CLASS_8	\N	\N
4836	STRESS-083388-707	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 707	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-707	MALE	\N	\N	+10000833880707	\N	R083388-707	D	CLASS_8	\N	\N
4837	STRESS-083388-708	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 708	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-708	FEMALE	\N	\N	+10000833880708	\N	R083388-708	D	CLASS_7	\N	\N
4838	STRESS-083388-709	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 709	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-709	FEMALE	\N	\N	+10000833880709	\N	R083388-709	A	CLASS_8	\N	\N
4839	STRESS-083388-710	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 710	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-710	MALE	\N	\N	+10000833880710	\N	R083388-710	A	CLASS_10	\N	\N
4840	STRESS-083388-711	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 711	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-711	MALE	\N	\N	+10000833880711	\N	R083388-711	B	CLASS_7	\N	\N
4841	STRESS-083388-712	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 712	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-712	FEMALE	\N	\N	+10000833880712	\N	R083388-712	D	CLASS_9	\N	\N
4842	STRESS-083388-713	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 713	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-713	FEMALE	\N	\N	+10000833880713	\N	R083388-713	C	CLASS_8	\N	\N
4843	STRESS-083388-714	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 714	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-714	MALE	\N	\N	+10000833880714	\N	R083388-714	D	CLASS_6	\N	\N
4844	STRESS-083388-715	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 715	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-715	FEMALE	\N	\N	+10000833880715	\N	R083388-715	A	CLASS_9	\N	\N
4845	STRESS-083388-716	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 716	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-716	FEMALE	\N	\N	+10000833880716	\N	R083388-716	C	CLASS_10	\N	\N
4846	STRESS-083388-717	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 717	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-717	MALE	\N	\N	+10000833880717	\N	R083388-717	B	CLASS_9	\N	\N
4847	STRESS-083388-718	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 718	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-718	FEMALE	\N	\N	+10000833880718	\N	R083388-718	D	CLASS_6	\N	\N
4848	STRESS-083388-719	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 719	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-719	FEMALE	\N	\N	+10000833880719	\N	R083388-719	D	CLASS_8	\N	\N
4849	STRESS-083388-720	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 720	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-720	MALE	\N	\N	+10000833880720	\N	R083388-720	A	CLASS_8	\N	\N
4850	STRESS-083388-721	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 721	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-721	MALE	\N	\N	+10000833880721	\N	R083388-721	C	CLASS_10	\N	\N
4851	STRESS-083388-722	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 722	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-722	FEMALE	\N	\N	+10000833880722	\N	R083388-722	C	CLASS_6	\N	\N
4852	STRESS-083388-723	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 723	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-723	FEMALE	\N	\N	+10000833880723	\N	R083388-723	A	CLASS_7	\N	\N
4853	STRESS-083388-724	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 724	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-724	MALE	\N	\N	+10000833880724	\N	R083388-724	A	CLASS_10	\N	\N
4854	STRESS-083388-725	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 725	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-725	FEMALE	\N	\N	+10000833880725	\N	R083388-725	D	CLASS_10	\N	\N
4855	STRESS-083388-726	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 726	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-726	MALE	\N	\N	+10000833880726	\N	R083388-726	D	CLASS_9	\N	\N
4856	STRESS-083388-727	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 727	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-727	MALE	\N	\N	+10000833880727	\N	R083388-727	B	CLASS_7	\N	\N
4857	STRESS-083388-728	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 728	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-728	FEMALE	\N	\N	+10000833880728	\N	R083388-728	B	CLASS_8	\N	\N
4858	STRESS-083388-729	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 729	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-729	FEMALE	\N	\N	+10000833880729	\N	R083388-729	C	CLASS_10	\N	\N
4859	STRESS-083388-730	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 730	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-730	FEMALE	\N	\N	+10000833880730	\N	R083388-730	D	CLASS_8	\N	\N
4860	STRESS-083388-731	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 731	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-731	MALE	\N	\N	+10000833880731	\N	R083388-731	A	CLASS_9	\N	\N
4861	STRESS-083388-732	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 732	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-732	FEMALE	\N	\N	+10000833880732	\N	R083388-732	A	CLASS_8	\N	\N
4862	STRESS-083388-733	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 733	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-733	FEMALE	\N	\N	+10000833880733	\N	R083388-733	D	CLASS_7	\N	\N
4863	STRESS-083388-734	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 734	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-734	MALE	\N	\N	+10000833880734	\N	R083388-734	C	CLASS_9	\N	\N
4864	STRESS-083388-735	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 735	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-735	FEMALE	\N	\N	+10000833880735	\N	R083388-735	D	CLASS_6	\N	\N
4865	STRESS-083388-736	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 736	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-736	MALE	\N	\N	+10000833880736	\N	R083388-736	B	CLASS_8	\N	\N
4866	STRESS-083388-737	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 737	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-737	FEMALE	\N	\N	+10000833880737	\N	R083388-737	C	CLASS_6	\N	\N
4867	STRESS-083388-738	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 738	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-738	FEMALE	\N	\N	+10000833880738	\N	R083388-738	C	CLASS_8	\N	\N
4868	STRESS-083388-739	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 739	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-739	FEMALE	\N	\N	+10000833880739	\N	R083388-739	C	CLASS_9	\N	\N
4869	STRESS-083388-740	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 740	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-740	FEMALE	\N	\N	+10000833880740	\N	R083388-740	A	CLASS_9	\N	\N
4870	STRESS-083388-741	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 741	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-741	FEMALE	\N	\N	+10000833880741	\N	R083388-741	A	CLASS_9	\N	\N
4871	STRESS-083388-742	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 742	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-742	MALE	\N	\N	+10000833880742	\N	R083388-742	A	CLASS_9	\N	\N
4872	STRESS-083388-743	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 743	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-743	MALE	\N	\N	+10000833880743	\N	R083388-743	C	CLASS_7	\N	\N
4873	STRESS-083388-744	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 744	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-744	FEMALE	\N	\N	+10000833880744	\N	R083388-744	B	CLASS_10	\N	\N
4874	STRESS-083388-745	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 745	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-745	FEMALE	\N	\N	+10000833880745	\N	R083388-745	D	CLASS_6	\N	\N
4875	STRESS-083388-746	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 746	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-746	MALE	\N	\N	+10000833880746	\N	R083388-746	D	CLASS_6	\N	\N
4876	STRESS-083388-747	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 747	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-747	MALE	\N	\N	+10000833880747	\N	R083388-747	C	CLASS_8	\N	\N
4877	STRESS-083388-748	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 748	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-748	MALE	\N	\N	+10000833880748	\N	R083388-748	A	CLASS_9	\N	\N
4878	STRESS-083388-749	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 749	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-749	FEMALE	\N	\N	+10000833880749	\N	R083388-749	C	CLASS_6	\N	\N
4879	STRESS-083388-750	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 750	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-750	FEMALE	\N	\N	+10000833880750	\N	R083388-750	A	CLASS_9	\N	\N
4880	STRESS-083388-751	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 751	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-751	MALE	\N	\N	+10000833880751	\N	R083388-751	C	CLASS_9	\N	\N
4881	STRESS-083388-752	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 752	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-752	FEMALE	\N	\N	+10000833880752	\N	R083388-752	B	CLASS_7	\N	\N
4882	STRESS-083388-753	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 753	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-753	MALE	\N	\N	+10000833880753	\N	R083388-753	A	CLASS_6	\N	\N
4883	STRESS-083388-754	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 754	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-754	MALE	\N	\N	+10000833880754	\N	R083388-754	A	CLASS_7	\N	\N
4884	STRESS-083388-755	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 755	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-755	MALE	\N	\N	+10000833880755	\N	R083388-755	D	CLASS_6	\N	\N
4885	STRESS-083388-756	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 756	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-756	FEMALE	\N	\N	+10000833880756	\N	R083388-756	C	CLASS_8	\N	\N
4886	STRESS-083388-757	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 757	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-757	MALE	\N	\N	+10000833880757	\N	R083388-757	B	CLASS_7	\N	\N
4887	STRESS-083388-758	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 758	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-758	FEMALE	\N	\N	+10000833880758	\N	R083388-758	A	CLASS_9	\N	\N
4888	STRESS-083388-759	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 759	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-759	FEMALE	\N	\N	+10000833880759	\N	R083388-759	B	CLASS_6	\N	\N
4889	STRESS-083388-760	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 760	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-760	MALE	\N	\N	+10000833880760	\N	R083388-760	D	CLASS_8	\N	\N
4890	STRESS-083388-761	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 761	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-761	FEMALE	\N	\N	+10000833880761	\N	R083388-761	C	CLASS_7	\N	\N
4891	STRESS-083388-762	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 762	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-762	MALE	\N	\N	+10000833880762	\N	R083388-762	B	CLASS_7	\N	\N
4892	STRESS-083388-763	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 763	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-763	FEMALE	\N	\N	+10000833880763	\N	R083388-763	B	CLASS_10	\N	\N
4893	STRESS-083388-764	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 764	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-764	MALE	\N	\N	+10000833880764	\N	R083388-764	A	CLASS_6	\N	\N
4894	STRESS-083388-765	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 765	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-765	MALE	\N	\N	+10000833880765	\N	R083388-765	B	CLASS_6	\N	\N
4895	STRESS-083388-766	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 766	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-766	FEMALE	\N	\N	+10000833880766	\N	R083388-766	D	CLASS_9	\N	\N
4896	STRESS-083388-767	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 767	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-767	FEMALE	\N	\N	+10000833880767	\N	R083388-767	C	CLASS_9	\N	\N
4897	STRESS-083388-768	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 768	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-768	FEMALE	\N	\N	+10000833880768	\N	R083388-768	A	CLASS_8	\N	\N
4898	STRESS-083388-769	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 769	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-769	FEMALE	\N	\N	+10000833880769	\N	R083388-769	D	CLASS_10	\N	\N
4899	STRESS-083388-770	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 770	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-770	FEMALE	\N	\N	+10000833880770	\N	R083388-770	D	CLASS_6	\N	\N
4900	STRESS-083388-771	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 771	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-771	MALE	\N	\N	+10000833880771	\N	R083388-771	A	CLASS_9	\N	\N
4901	STRESS-083388-772	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 772	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-772	MALE	\N	\N	+10000833880772	\N	R083388-772	D	CLASS_6	\N	\N
4902	STRESS-083388-773	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 773	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-773	MALE	\N	\N	+10000833880773	\N	R083388-773	B	CLASS_9	\N	\N
4903	STRESS-083388-774	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 774	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-774	FEMALE	\N	\N	+10000833880774	\N	R083388-774	D	CLASS_9	\N	\N
4904	STRESS-083388-775	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 775	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-775	MALE	\N	\N	+10000833880775	\N	R083388-775	C	CLASS_8	\N	\N
4905	STRESS-083388-776	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 776	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-776	FEMALE	\N	\N	+10000833880776	\N	R083388-776	C	CLASS_10	\N	\N
4906	STRESS-083388-777	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 777	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-777	FEMALE	\N	\N	+10000833880777	\N	R083388-777	A	CLASS_7	\N	\N
4907	STRESS-083388-778	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 778	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-778	MALE	\N	\N	+10000833880778	\N	R083388-778	A	CLASS_9	\N	\N
4908	STRESS-083388-779	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 779	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-779	MALE	\N	\N	+10000833880779	\N	R083388-779	D	CLASS_10	\N	\N
4909	STRESS-083388-780	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 780	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-780	FEMALE	\N	\N	+10000833880780	\N	R083388-780	B	CLASS_8	\N	\N
4910	STRESS-083388-781	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 781	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-781	FEMALE	\N	\N	+10000833880781	\N	R083388-781	C	CLASS_6	\N	\N
4911	STRESS-083388-782	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 782	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-782	FEMALE	\N	\N	+10000833880782	\N	R083388-782	C	CLASS_9	\N	\N
4912	STRESS-083388-783	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 783	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-783	MALE	\N	\N	+10000833880783	\N	R083388-783	B	CLASS_10	\N	\N
4913	STRESS-083388-784	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 784	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-784	MALE	\N	\N	+10000833880784	\N	R083388-784	C	CLASS_8	\N	\N
4914	STRESS-083388-785	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 785	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-785	MALE	\N	\N	+10000833880785	\N	R083388-785	A	CLASS_10	\N	\N
4915	STRESS-083388-786	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 786	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-786	MALE	\N	\N	+10000833880786	\N	R083388-786	B	CLASS_7	\N	\N
4916	STRESS-083388-787	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 787	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-787	FEMALE	\N	\N	+10000833880787	\N	R083388-787	A	CLASS_10	\N	\N
4917	STRESS-083388-788	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 788	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-788	FEMALE	\N	\N	+10000833880788	\N	R083388-788	A	CLASS_9	\N	\N
4918	STRESS-083388-789	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 789	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-789	FEMALE	\N	\N	+10000833880789	\N	R083388-789	B	CLASS_8	\N	\N
4919	STRESS-083388-790	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 790	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-790	FEMALE	\N	\N	+10000833880790	\N	R083388-790	B	CLASS_9	\N	\N
4920	STRESS-083388-791	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 791	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-791	FEMALE	\N	\N	+10000833880791	\N	R083388-791	D	CLASS_10	\N	\N
4921	STRESS-083388-792	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 792	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-792	FEMALE	\N	\N	+10000833880792	\N	R083388-792	B	CLASS_7	\N	\N
4922	STRESS-083388-793	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 793	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-793	MALE	\N	\N	+10000833880793	\N	R083388-793	A	CLASS_10	\N	\N
4923	STRESS-083388-794	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 794	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-794	FEMALE	\N	\N	+10000833880794	\N	R083388-794	C	CLASS_9	\N	\N
4924	STRESS-083388-795	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 795	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-795	MALE	\N	\N	+10000833880795	\N	R083388-795	B	CLASS_7	\N	\N
4925	STRESS-083388-796	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 796	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-796	FEMALE	\N	\N	+10000833880796	\N	R083388-796	A	CLASS_7	\N	\N
4926	STRESS-083388-797	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 797	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-797	MALE	\N	\N	+10000833880797	\N	R083388-797	D	CLASS_7	\N	\N
4927	STRESS-083388-798	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 798	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-798	FEMALE	\N	\N	+10000833880798	\N	R083388-798	C	CLASS_8	\N	\N
4928	STRESS-083388-799	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 799	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-799	FEMALE	\N	\N	+10000833880799	\N	R083388-799	B	CLASS_9	\N	\N
4929	STRESS-083388-800	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 800	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-800	MALE	\N	\N	+10000833880800	\N	R083388-800	D	CLASS_10	\N	\N
4930	STRESS-083388-801	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 801	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-801	FEMALE	\N	\N	+10000833880801	\N	R083388-801	D	CLASS_6	\N	\N
4931	STRESS-083388-802	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 802	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-802	FEMALE	\N	\N	+10000833880802	\N	R083388-802	B	CLASS_10	\N	\N
4932	STRESS-083388-803	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 803	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-803	MALE	\N	\N	+10000833880803	\N	R083388-803	A	CLASS_9	\N	\N
4933	STRESS-083388-804	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 804	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-804	FEMALE	\N	\N	+10000833880804	\N	R083388-804	A	CLASS_8	\N	\N
4934	STRESS-083388-805	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 805	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-805	FEMALE	\N	\N	+10000833880805	\N	R083388-805	A	CLASS_7	\N	\N
4935	STRESS-083388-806	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 806	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-806	MALE	\N	\N	+10000833880806	\N	R083388-806	D	CLASS_10	\N	\N
4936	STRESS-083388-807	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 807	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-807	MALE	\N	\N	+10000833880807	\N	R083388-807	D	CLASS_7	\N	\N
4937	STRESS-083388-808	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 808	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-808	MALE	\N	\N	+10000833880808	\N	R083388-808	A	CLASS_8	\N	\N
4938	STRESS-083388-809	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 809	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-809	MALE	\N	\N	+10000833880809	\N	R083388-809	A	CLASS_10	\N	\N
4939	STRESS-083388-810	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 810	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-810	FEMALE	\N	\N	+10000833880810	\N	R083388-810	B	CLASS_10	\N	\N
4940	STRESS-083388-811	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 811	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-811	FEMALE	\N	\N	+10000833880811	\N	R083388-811	B	CLASS_6	\N	\N
4941	STRESS-083388-812	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 812	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-812	MALE	\N	\N	+10000833880812	\N	R083388-812	D	CLASS_7	\N	\N
4942	STRESS-083388-813	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 813	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-813	FEMALE	\N	\N	+10000833880813	\N	R083388-813	C	CLASS_9	\N	\N
4943	STRESS-083388-814	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 814	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-814	FEMALE	\N	\N	+10000833880814	\N	R083388-814	D	CLASS_10	\N	\N
4944	STRESS-083388-815	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 815	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-815	MALE	\N	\N	+10000833880815	\N	R083388-815	B	CLASS_8	\N	\N
4945	STRESS-083388-816	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 816	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-816	MALE	\N	\N	+10000833880816	\N	R083388-816	B	CLASS_8	\N	\N
4946	STRESS-083388-817	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 817	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-817	FEMALE	\N	\N	+10000833880817	\N	R083388-817	B	CLASS_9	\N	\N
4947	STRESS-083388-818	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 818	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-818	FEMALE	\N	\N	+10000833880818	\N	R083388-818	A	CLASS_7	\N	\N
4948	STRESS-083388-819	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 819	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-819	MALE	\N	\N	+10000833880819	\N	R083388-819	D	CLASS_8	\N	\N
4949	STRESS-083388-820	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 820	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-820	FEMALE	\N	\N	+10000833880820	\N	R083388-820	B	CLASS_9	\N	\N
4950	STRESS-083388-821	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 821	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-821	MALE	\N	\N	+10000833880821	\N	R083388-821	D	CLASS_6	\N	\N
4951	STRESS-083388-822	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 822	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-822	FEMALE	\N	\N	+10000833880822	\N	R083388-822	A	CLASS_7	\N	\N
4952	STRESS-083388-823	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 823	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-823	MALE	\N	\N	+10000833880823	\N	R083388-823	B	CLASS_9	\N	\N
4953	STRESS-083388-824	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 824	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-824	MALE	\N	\N	+10000833880824	\N	R083388-824	D	CLASS_7	\N	\N
4954	STRESS-083388-825	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 825	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-825	MALE	\N	\N	+10000833880825	\N	R083388-825	C	CLASS_9	\N	\N
4955	STRESS-083388-826	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 826	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-826	MALE	\N	\N	+10000833880826	\N	R083388-826	D	CLASS_8	\N	\N
4956	STRESS-083388-827	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 827	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-827	FEMALE	\N	\N	+10000833880827	\N	R083388-827	C	CLASS_8	\N	\N
4957	STRESS-083388-828	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 828	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-828	FEMALE	\N	\N	+10000833880828	\N	R083388-828	B	CLASS_10	\N	\N
4958	STRESS-083388-829	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 829	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-829	MALE	\N	\N	+10000833880829	\N	R083388-829	A	CLASS_10	\N	\N
4959	STRESS-083388-830	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 830	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-830	MALE	\N	\N	+10000833880830	\N	R083388-830	B	CLASS_6	\N	\N
4960	STRESS-083388-831	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 831	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-831	MALE	\N	\N	+10000833880831	\N	R083388-831	C	CLASS_9	\N	\N
4961	STRESS-083388-832	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 832	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-832	MALE	\N	\N	+10000833880832	\N	R083388-832	C	CLASS_10	\N	\N
4962	STRESS-083388-833	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 833	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-833	MALE	\N	\N	+10000833880833	\N	R083388-833	B	CLASS_9	\N	\N
4963	STRESS-083388-834	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 834	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-834	MALE	\N	\N	+10000833880834	\N	R083388-834	B	CLASS_8	\N	\N
4964	STRESS-083388-835	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 835	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-835	MALE	\N	\N	+10000833880835	\N	R083388-835	C	CLASS_8	\N	\N
4965	STRESS-083388-836	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 836	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-836	FEMALE	\N	\N	+10000833880836	\N	R083388-836	C	CLASS_10	\N	\N
4966	STRESS-083388-837	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 837	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-837	MALE	\N	\N	+10000833880837	\N	R083388-837	C	CLASS_8	\N	\N
4967	STRESS-083388-838	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 838	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-838	MALE	\N	\N	+10000833880838	\N	R083388-838	D	CLASS_8	\N	\N
4968	STRESS-083388-839	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 839	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-839	MALE	\N	\N	+10000833880839	\N	R083388-839	C	CLASS_8	\N	\N
4969	STRESS-083388-840	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 840	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-840	FEMALE	\N	\N	+10000833880840	\N	R083388-840	C	CLASS_6	\N	\N
4970	STRESS-083388-841	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 841	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-841	FEMALE	\N	\N	+10000833880841	\N	R083388-841	C	CLASS_8	\N	\N
4971	STRESS-083388-842	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 842	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-842	FEMALE	\N	\N	+10000833880842	\N	R083388-842	A	CLASS_7	\N	\N
4972	STRESS-083388-843	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 843	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-843	MALE	\N	\N	+10000833880843	\N	R083388-843	C	CLASS_7	\N	\N
4973	STRESS-083388-844	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 844	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-844	MALE	\N	\N	+10000833880844	\N	R083388-844	B	CLASS_9	\N	\N
4974	STRESS-083388-845	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 845	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-845	MALE	\N	\N	+10000833880845	\N	R083388-845	B	CLASS_10	\N	\N
4975	STRESS-083388-846	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 846	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-846	MALE	\N	\N	+10000833880846	\N	R083388-846	C	CLASS_7	\N	\N
4976	STRESS-083388-847	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 847	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-847	MALE	\N	\N	+10000833880847	\N	R083388-847	B	CLASS_9	\N	\N
4977	STRESS-083388-848	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 848	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-848	MALE	\N	\N	+10000833880848	\N	R083388-848	B	CLASS_7	\N	\N
4978	STRESS-083388-849	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 849	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-849	FEMALE	\N	\N	+10000833880849	\N	R083388-849	A	CLASS_8	\N	\N
4979	STRESS-083388-850	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 850	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-850	FEMALE	\N	\N	+10000833880850	\N	R083388-850	D	CLASS_6	\N	\N
4980	STRESS-083388-851	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 851	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-851	FEMALE	\N	\N	+10000833880851	\N	R083388-851	A	CLASS_7	\N	\N
4981	STRESS-083388-852	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 852	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-852	FEMALE	\N	\N	+10000833880852	\N	R083388-852	B	CLASS_9	\N	\N
4982	STRESS-083388-853	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 853	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-853	FEMALE	\N	\N	+10000833880853	\N	R083388-853	A	CLASS_9	\N	\N
4983	STRESS-083388-854	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 854	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-854	FEMALE	\N	\N	+10000833880854	\N	R083388-854	C	CLASS_8	\N	\N
4984	STRESS-083388-855	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 855	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-855	MALE	\N	\N	+10000833880855	\N	R083388-855	B	CLASS_6	\N	\N
4985	STRESS-083388-856	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 856	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-856	MALE	\N	\N	+10000833880856	\N	R083388-856	A	CLASS_6	\N	\N
4986	STRESS-083388-857	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 857	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-857	MALE	\N	\N	+10000833880857	\N	R083388-857	A	CLASS_10	\N	\N
4987	STRESS-083388-858	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 858	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-858	MALE	\N	\N	+10000833880858	\N	R083388-858	C	CLASS_6	\N	\N
4988	STRESS-083388-859	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 859	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-859	MALE	\N	\N	+10000833880859	\N	R083388-859	C	CLASS_8	\N	\N
4989	STRESS-083388-860	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 860	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-860	MALE	\N	\N	+10000833880860	\N	R083388-860	B	CLASS_9	\N	\N
4990	STRESS-083388-861	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 861	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-861	FEMALE	\N	\N	+10000833880861	\N	R083388-861	B	CLASS_7	\N	\N
4991	STRESS-083388-862	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 862	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-862	MALE	\N	\N	+10000833880862	\N	R083388-862	A	CLASS_6	\N	\N
4992	STRESS-083388-863	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 863	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-863	MALE	\N	\N	+10000833880863	\N	R083388-863	C	CLASS_9	\N	\N
4993	STRESS-083388-864	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 864	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-864	FEMALE	\N	\N	+10000833880864	\N	R083388-864	A	CLASS_6	\N	\N
4994	STRESS-083388-865	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 865	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-865	MALE	\N	\N	+10000833880865	\N	R083388-865	B	CLASS_10	\N	\N
4995	STRESS-083388-866	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 866	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-866	MALE	\N	\N	+10000833880866	\N	R083388-866	D	CLASS_9	\N	\N
4996	STRESS-083388-867	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 867	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-867	FEMALE	\N	\N	+10000833880867	\N	R083388-867	C	CLASS_6	\N	\N
4997	STRESS-083388-868	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 868	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-868	MALE	\N	\N	+10000833880868	\N	R083388-868	D	CLASS_7	\N	\N
4998	STRESS-083388-869	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 869	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-869	FEMALE	\N	\N	+10000833880869	\N	R083388-869	A	CLASS_6	\N	\N
4999	STRESS-083388-870	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 870	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-870	FEMALE	\N	\N	+10000833880870	\N	R083388-870	C	CLASS_9	\N	\N
5000	STRESS-083388-871	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 871	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-871	MALE	\N	\N	+10000833880871	\N	R083388-871	A	CLASS_9	\N	\N
5001	STRESS-083388-872	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 872	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-872	FEMALE	\N	\N	+10000833880872	\N	R083388-872	C	CLASS_8	\N	\N
5002	STRESS-083388-873	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 873	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-873	MALE	\N	\N	+10000833880873	\N	R083388-873	A	CLASS_8	\N	\N
5003	STRESS-083388-874	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 874	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-874	FEMALE	\N	\N	+10000833880874	\N	R083388-874	C	CLASS_6	\N	\N
5004	STRESS-083388-875	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 875	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-875	FEMALE	\N	\N	+10000833880875	\N	R083388-875	D	CLASS_9	\N	\N
5005	STRESS-083388-876	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 876	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-876	MALE	\N	\N	+10000833880876	\N	R083388-876	D	CLASS_9	\N	\N
5006	STRESS-083388-877	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 877	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-877	MALE	\N	\N	+10000833880877	\N	R083388-877	A	CLASS_7	\N	\N
5007	STRESS-083388-878	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 878	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-878	FEMALE	\N	\N	+10000833880878	\N	R083388-878	A	CLASS_10	\N	\N
5008	STRESS-083388-879	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 879	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-879	MALE	\N	\N	+10000833880879	\N	R083388-879	A	CLASS_8	\N	\N
5009	STRESS-083388-880	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 880	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-880	FEMALE	\N	\N	+10000833880880	\N	R083388-880	A	CLASS_7	\N	\N
5010	STRESS-083388-881	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 881	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-881	FEMALE	\N	\N	+10000833880881	\N	R083388-881	C	CLASS_8	\N	\N
5011	STRESS-083388-882	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 882	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-882	FEMALE	\N	\N	+10000833880882	\N	R083388-882	C	CLASS_6	\N	\N
5012	STRESS-083388-883	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 883	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-883	MALE	\N	\N	+10000833880883	\N	R083388-883	D	CLASS_10	\N	\N
5013	STRESS-083388-884	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 884	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-884	FEMALE	\N	\N	+10000833880884	\N	R083388-884	D	CLASS_8	\N	\N
5014	STRESS-083388-885	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 885	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-885	FEMALE	\N	\N	+10000833880885	\N	R083388-885	D	CLASS_9	\N	\N
5015	STRESS-083388-886	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 886	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-886	FEMALE	\N	\N	+10000833880886	\N	R083388-886	C	CLASS_6	\N	\N
5016	STRESS-083388-887	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 887	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-887	FEMALE	\N	\N	+10000833880887	\N	R083388-887	B	CLASS_6	\N	\N
5017	STRESS-083388-888	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 888	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-888	MALE	\N	\N	+10000833880888	\N	R083388-888	C	CLASS_8	\N	\N
5018	STRESS-083388-889	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 889	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-889	MALE	\N	\N	+10000833880889	\N	R083388-889	C	CLASS_10	\N	\N
5019	STRESS-083388-890	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 890	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-890	MALE	\N	\N	+10000833880890	\N	R083388-890	C	CLASS_7	\N	\N
5020	STRESS-083388-891	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 891	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-891	MALE	\N	\N	+10000833880891	\N	R083388-891	A	CLASS_6	\N	\N
5021	STRESS-083388-892	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 892	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-892	MALE	\N	\N	+10000833880892	\N	R083388-892	A	CLASS_9	\N	\N
5022	STRESS-083388-893	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 893	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-893	MALE	\N	\N	+10000833880893	\N	R083388-893	A	CLASS_10	\N	\N
5023	STRESS-083388-894	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 894	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-894	FEMALE	\N	\N	+10000833880894	\N	R083388-894	D	CLASS_7	\N	\N
5024	STRESS-083388-895	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 895	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-895	FEMALE	\N	\N	+10000833880895	\N	R083388-895	C	CLASS_9	\N	\N
5025	STRESS-083388-896	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 896	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-896	MALE	\N	\N	+10000833880896	\N	R083388-896	C	CLASS_10	\N	\N
5026	STRESS-083388-897	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 897	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-897	FEMALE	\N	\N	+10000833880897	\N	R083388-897	D	CLASS_7	\N	\N
5027	STRESS-083388-898	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 898	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-898	MALE	\N	\N	+10000833880898	\N	R083388-898	B	CLASS_9	\N	\N
5028	STRESS-083388-899	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 899	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-899	FEMALE	\N	\N	+10000833880899	\N	R083388-899	A	CLASS_9	\N	\N
5029	STRESS-083388-900	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 900	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-900	FEMALE	\N	\N	+10000833880900	\N	R083388-900	B	CLASS_8	\N	\N
5030	STRESS-083388-901	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 901	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-901	MALE	\N	\N	+10000833880901	\N	R083388-901	C	CLASS_7	\N	\N
5031	STRESS-083388-902	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 902	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-902	FEMALE	\N	\N	+10000833880902	\N	R083388-902	C	CLASS_6	\N	\N
5032	STRESS-083388-903	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 903	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-903	MALE	\N	\N	+10000833880903	\N	R083388-903	C	CLASS_7	\N	\N
5033	STRESS-083388-904	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 904	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-904	FEMALE	\N	\N	+10000833880904	\N	R083388-904	C	CLASS_7	\N	\N
5034	STRESS-083388-905	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 905	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-905	FEMALE	\N	\N	+10000833880905	\N	R083388-905	A	CLASS_6	\N	\N
5035	STRESS-083388-906	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 906	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-906	MALE	\N	\N	+10000833880906	\N	R083388-906	A	CLASS_6	\N	\N
5036	STRESS-083388-907	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 907	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-907	MALE	\N	\N	+10000833880907	\N	R083388-907	D	CLASS_10	\N	\N
5037	STRESS-083388-908	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 908	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-908	FEMALE	\N	\N	+10000833880908	\N	R083388-908	D	CLASS_10	\N	\N
5038	STRESS-083388-909	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 909	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-909	MALE	\N	\N	+10000833880909	\N	R083388-909	C	CLASS_6	\N	\N
5039	STRESS-083388-910	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 910	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-910	MALE	\N	\N	+10000833880910	\N	R083388-910	C	CLASS_10	\N	\N
5040	STRESS-083388-911	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 911	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-911	FEMALE	\N	\N	+10000833880911	\N	R083388-911	C	CLASS_7	\N	\N
5041	STRESS-083388-912	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 912	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-912	MALE	\N	\N	+10000833880912	\N	R083388-912	C	CLASS_10	\N	\N
5042	STRESS-083388-913	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 913	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-913	FEMALE	\N	\N	+10000833880913	\N	R083388-913	A	CLASS_9	\N	\N
5043	STRESS-083388-914	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 914	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-914	MALE	\N	\N	+10000833880914	\N	R083388-914	B	CLASS_9	\N	\N
5044	STRESS-083388-915	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 915	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-915	FEMALE	\N	\N	+10000833880915	\N	R083388-915	A	CLASS_8	\N	\N
5045	STRESS-083388-916	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 916	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-916	FEMALE	\N	\N	+10000833880916	\N	R083388-916	D	CLASS_7	\N	\N
5046	STRESS-083388-917	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 917	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-917	MALE	\N	\N	+10000833880917	\N	R083388-917	B	CLASS_9	\N	\N
5047	STRESS-083388-918	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 918	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-918	FEMALE	\N	\N	+10000833880918	\N	R083388-918	C	CLASS_7	\N	\N
5048	STRESS-083388-919	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 919	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-919	FEMALE	\N	\N	+10000833880919	\N	R083388-919	D	CLASS_8	\N	\N
5049	STRESS-083388-920	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 920	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-920	FEMALE	\N	\N	+10000833880920	\N	R083388-920	B	CLASS_9	\N	\N
5050	STRESS-083388-921	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 921	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-921	MALE	\N	\N	+10000833880921	\N	R083388-921	C	CLASS_9	\N	\N
5051	STRESS-083388-922	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 922	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-922	MALE	\N	\N	+10000833880922	\N	R083388-922	B	CLASS_10	\N	\N
5052	STRESS-083388-923	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 923	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-923	FEMALE	\N	\N	+10000833880923	\N	R083388-923	B	CLASS_9	\N	\N
5053	STRESS-083388-924	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 924	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-924	FEMALE	\N	\N	+10000833880924	\N	R083388-924	A	CLASS_7	\N	\N
5054	STRESS-083388-925	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 925	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-925	FEMALE	\N	\N	+10000833880925	\N	R083388-925	D	CLASS_8	\N	\N
5055	STRESS-083388-926	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 926	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-926	FEMALE	\N	\N	+10000833880926	\N	R083388-926	A	CLASS_10	\N	\N
5056	STRESS-083388-927	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 927	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-927	MALE	\N	\N	+10000833880927	\N	R083388-927	C	CLASS_6	\N	\N
5057	STRESS-083388-928	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 928	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-928	MALE	\N	\N	+10000833880928	\N	R083388-928	C	CLASS_7	\N	\N
5058	STRESS-083388-929	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 929	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-929	MALE	\N	\N	+10000833880929	\N	R083388-929	A	CLASS_7	\N	\N
5059	STRESS-083388-930	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 930	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-930	FEMALE	\N	\N	+10000833880930	\N	R083388-930	D	CLASS_7	\N	\N
5060	STRESS-083388-931	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 931	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-931	MALE	\N	\N	+10000833880931	\N	R083388-931	D	CLASS_8	\N	\N
5061	STRESS-083388-932	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 932	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-932	MALE	\N	\N	+10000833880932	\N	R083388-932	B	CLASS_7	\N	\N
5062	STRESS-083388-933	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 933	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-933	MALE	\N	\N	+10000833880933	\N	R083388-933	D	CLASS_6	\N	\N
5063	STRESS-083388-934	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 934	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-934	FEMALE	\N	\N	+10000833880934	\N	R083388-934	A	CLASS_7	\N	\N
5064	STRESS-083388-935	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 935	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-935	MALE	\N	\N	+10000833880935	\N	R083388-935	C	CLASS_8	\N	\N
5065	STRESS-083388-936	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 936	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-936	MALE	\N	\N	+10000833880936	\N	R083388-936	A	CLASS_7	\N	\N
5066	STRESS-083388-937	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 937	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-937	FEMALE	\N	\N	+10000833880937	\N	R083388-937	D	CLASS_7	\N	\N
5067	STRESS-083388-938	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 938	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-938	MALE	\N	\N	+10000833880938	\N	R083388-938	D	CLASS_9	\N	\N
5068	STRESS-083388-939	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 939	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-939	MALE	\N	\N	+10000833880939	\N	R083388-939	C	CLASS_10	\N	\N
5069	STRESS-083388-940	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 940	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-940	FEMALE	\N	\N	+10000833880940	\N	R083388-940	B	CLASS_7	\N	\N
5070	STRESS-083388-941	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 941	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-941	MALE	\N	\N	+10000833880941	\N	R083388-941	C	CLASS_8	\N	\N
5071	STRESS-083388-942	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 942	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-942	MALE	\N	\N	+10000833880942	\N	R083388-942	B	CLASS_7	\N	\N
5072	STRESS-083388-943	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 943	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-943	MALE	\N	\N	+10000833880943	\N	R083388-943	A	CLASS_9	\N	\N
5073	STRESS-083388-944	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 944	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-944	MALE	\N	\N	+10000833880944	\N	R083388-944	C	CLASS_6	\N	\N
5074	STRESS-083388-945	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 945	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-945	MALE	\N	\N	+10000833880945	\N	R083388-945	B	CLASS_8	\N	\N
5075	STRESS-083388-946	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 946	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-946	FEMALE	\N	\N	+10000833880946	\N	R083388-946	A	CLASS_9	\N	\N
5076	STRESS-083388-947	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 947	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-947	FEMALE	\N	\N	+10000833880947	\N	R083388-947	D	CLASS_6	\N	\N
5077	STRESS-083388-948	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 948	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-948	FEMALE	\N	\N	+10000833880948	\N	R083388-948	D	CLASS_6	\N	\N
5078	STRESS-083388-949	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 949	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-949	MALE	\N	\N	+10000833880949	\N	R083388-949	D	CLASS_6	\N	\N
5079	STRESS-083388-950	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 950	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-950	MALE	\N	\N	+10000833880950	\N	R083388-950	A	CLASS_8	\N	\N
5080	STRESS-083388-951	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 951	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-951	FEMALE	\N	\N	+10000833880951	\N	R083388-951	D	CLASS_8	\N	\N
5081	STRESS-083388-952	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 952	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-952	MALE	\N	\N	+10000833880952	\N	R083388-952	C	CLASS_10	\N	\N
5082	STRESS-083388-953	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 953	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-953	FEMALE	\N	\N	+10000833880953	\N	R083388-953	B	CLASS_10	\N	\N
5083	STRESS-083388-954	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 954	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-954	FEMALE	\N	\N	+10000833880954	\N	R083388-954	B	CLASS_6	\N	\N
5084	STRESS-083388-955	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 955	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-955	FEMALE	\N	\N	+10000833880955	\N	R083388-955	D	CLASS_8	\N	\N
5085	STRESS-083388-956	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 956	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-956	FEMALE	\N	\N	+10000833880956	\N	R083388-956	A	CLASS_10	\N	\N
5086	STRESS-083388-957	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 957	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-957	FEMALE	\N	\N	+10000833880957	\N	R083388-957	A	CLASS_7	\N	\N
5087	STRESS-083388-958	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 958	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-958	FEMALE	\N	\N	+10000833880958	\N	R083388-958	D	CLASS_10	\N	\N
5088	STRESS-083388-959	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 959	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-959	FEMALE	\N	\N	+10000833880959	\N	R083388-959	B	CLASS_7	\N	\N
5089	STRESS-083388-960	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 960	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-960	MALE	\N	\N	+10000833880960	\N	R083388-960	D	CLASS_7	\N	\N
5090	STRESS-083388-961	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 961	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-961	FEMALE	\N	\N	+10000833880961	\N	R083388-961	A	CLASS_6	\N	\N
5091	STRESS-083388-962	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 962	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-962	FEMALE	\N	\N	+10000833880962	\N	R083388-962	B	CLASS_6	\N	\N
5092	STRESS-083388-963	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 963	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-963	MALE	\N	\N	+10000833880963	\N	R083388-963	B	CLASS_7	\N	\N
5093	STRESS-083388-964	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 964	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-964	FEMALE	\N	\N	+10000833880964	\N	R083388-964	C	CLASS_6	\N	\N
5094	STRESS-083388-965	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 965	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-965	MALE	\N	\N	+10000833880965	\N	R083388-965	C	CLASS_10	\N	\N
5095	STRESS-083388-966	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 966	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-966	FEMALE	\N	\N	+10000833880966	\N	R083388-966	C	CLASS_7	\N	\N
5096	STRESS-083388-967	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 967	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-967	FEMALE	\N	\N	+10000833880967	\N	R083388-967	C	CLASS_7	\N	\N
5097	STRESS-083388-968	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 968	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-968	FEMALE	\N	\N	+10000833880968	\N	R083388-968	A	CLASS_10	\N	\N
5098	STRESS-083388-969	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 969	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-969	MALE	\N	\N	+10000833880969	\N	R083388-969	B	CLASS_9	\N	\N
5099	STRESS-083388-970	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 970	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-970	FEMALE	\N	\N	+10000833880970	\N	R083388-970	D	CLASS_7	\N	\N
5100	STRESS-083388-971	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 971	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-971	MALE	\N	\N	+10000833880971	\N	R083388-971	D	CLASS_8	\N	\N
5101	STRESS-083388-972	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 972	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-972	FEMALE	\N	\N	+10000833880972	\N	R083388-972	C	CLASS_8	\N	\N
5102	STRESS-083388-973	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 973	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-973	MALE	\N	\N	+10000833880973	\N	R083388-973	B	CLASS_6	\N	\N
5103	STRESS-083388-974	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 974	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-974	FEMALE	\N	\N	+10000833880974	\N	R083388-974	A	CLASS_10	\N	\N
5104	STRESS-083388-975	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 975	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-975	FEMALE	\N	\N	+10000833880975	\N	R083388-975	A	CLASS_8	\N	\N
5105	STRESS-083388-976	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 976	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-976	MALE	\N	\N	+10000833880976	\N	R083388-976	A	CLASS_8	\N	\N
5106	STRESS-083388-977	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 977	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-977	MALE	\N	\N	+10000833880977	\N	R083388-977	C	CLASS_6	\N	\N
5107	STRESS-083388-978	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 978	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-978	FEMALE	\N	\N	+10000833880978	\N	R083388-978	A	CLASS_8	\N	\N
5108	STRESS-083388-979	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 979	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-979	FEMALE	\N	\N	+10000833880979	\N	R083388-979	B	CLASS_6	\N	\N
5109	STRESS-083388-980	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 980	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-980	FEMALE	\N	\N	+10000833880980	\N	R083388-980	D	CLASS_8	\N	\N
5110	STRESS-083388-981	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 981	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-981	FEMALE	\N	\N	+10000833880981	\N	R083388-981	B	CLASS_10	\N	\N
5111	STRESS-083388-982	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 982	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-982	MALE	\N	\N	+10000833880982	\N	R083388-982	C	CLASS_7	\N	\N
5112	STRESS-083388-983	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 983	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-983	FEMALE	\N	\N	+10000833880983	\N	R083388-983	C	CLASS_6	\N	\N
5113	STRESS-083388-984	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 984	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-984	FEMALE	\N	\N	+10000833880984	\N	R083388-984	D	CLASS_10	\N	\N
5114	STRESS-083388-985	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 985	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-985	FEMALE	\N	\N	+10000833880985	\N	R083388-985	C	CLASS_9	\N	\N
5115	STRESS-083388-986	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 986	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-986	MALE	\N	\N	+10000833880986	\N	R083388-986	A	CLASS_9	\N	\N
5116	STRESS-083388-987	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 987	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-987	FEMALE	\N	\N	+10000833880987	\N	R083388-987	D	CLASS_8	\N	\N
5117	STRESS-083388-988	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 988	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-988	MALE	\N	\N	+10000833880988	\N	R083388-988	D	CLASS_6	\N	\N
5118	STRESS-083388-989	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 989	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-989	FEMALE	\N	\N	+10000833880989	\N	R083388-989	C	CLASS_7	\N	\N
5119	STRESS-083388-990	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 990	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-990	MALE	\N	\N	+10000833880990	\N	R083388-990	D	CLASS_9	\N	\N
5120	STRESS-083388-991	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 991	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-991	MALE	\N	\N	+10000833880991	\N	R083388-991	C	CLASS_8	\N	\N
5121	STRESS-083388-992	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 992	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-992	MALE	\N	\N	+10000833880992	\N	R083388-992	B	CLASS_7	\N	\N
5122	STRESS-083388-993	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 993	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-993	FEMALE	\N	\N	+10000833880993	\N	R083388-993	C	CLASS_10	\N	\N
5123	STRESS-083388-994	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 994	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-994	FEMALE	\N	\N	+10000833880994	\N	R083388-994	C	CLASS_10	\N	\N
5124	STRESS-083388-995	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 995	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-995	FEMALE	\N	\N	+10000833880995	\N	R083388-995	C	CLASS_8	\N	\N
5125	STRESS-083388-996	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 996	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-996	MALE	\N	\N	+10000833880996	\N	R083388-996	B	CLASS_9	\N	\N
5126	STRESS-083388-997	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 997	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-997	FEMALE	\N	\N	+10000833880997	\N	R083388-997	D	CLASS_9	\N	\N
5127	STRESS-083388-998	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 998	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-998	FEMALE	\N	\N	+10000833880998	\N	R083388-998	A	CLASS_7	\N	\N
5128	STRESS-083388-999	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 999	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-999	FEMALE	\N	\N	+10000833880999	\N	R083388-999	A	CLASS_6	\N	\N
5129	STRESS-083388-1000	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1000	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1000	FEMALE	\N	\N	+10000833881000	\N	R083388-1000	C	CLASS_8	\N	\N
5130	STRESS-083388-1001	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1001	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1001	MALE	\N	\N	+10000833881001	\N	R083388-1001	A	CLASS_10	\N	\N
5131	STRESS-083388-1002	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1002	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1002	MALE	\N	\N	+10000833881002	\N	R083388-1002	C	CLASS_10	\N	\N
5132	STRESS-083388-1003	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1003	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1003	FEMALE	\N	\N	+10000833881003	\N	R083388-1003	D	CLASS_10	\N	\N
5133	STRESS-083388-1004	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1004	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1004	MALE	\N	\N	+10000833881004	\N	R083388-1004	B	CLASS_7	\N	\N
5134	STRESS-083388-1005	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1005	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1005	MALE	\N	\N	+10000833881005	\N	R083388-1005	A	CLASS_7	\N	\N
5135	STRESS-083388-1006	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1006	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1006	FEMALE	\N	\N	+10000833881006	\N	R083388-1006	A	CLASS_6	\N	\N
5136	STRESS-083388-1007	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1007	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1007	FEMALE	\N	\N	+10000833881007	\N	R083388-1007	D	CLASS_6	\N	\N
5137	STRESS-083388-1008	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1008	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1008	MALE	\N	\N	+10000833881008	\N	R083388-1008	D	CLASS_6	\N	\N
5138	STRESS-083388-1009	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1009	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1009	MALE	\N	\N	+10000833881009	\N	R083388-1009	A	CLASS_10	\N	\N
5139	STRESS-083388-1010	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1010	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1010	MALE	\N	\N	+10000833881010	\N	R083388-1010	D	CLASS_7	\N	\N
5140	STRESS-083388-1011	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1011	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1011	MALE	\N	\N	+10000833881011	\N	R083388-1011	D	CLASS_10	\N	\N
5141	STRESS-083388-1012	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1012	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1012	FEMALE	\N	\N	+10000833881012	\N	R083388-1012	A	CLASS_9	\N	\N
5142	STRESS-083388-1013	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1013	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1013	MALE	\N	\N	+10000833881013	\N	R083388-1013	D	CLASS_9	\N	\N
5143	STRESS-083388-1014	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1014	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1014	MALE	\N	\N	+10000833881014	\N	R083388-1014	A	CLASS_7	\N	\N
5144	STRESS-083388-1015	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1015	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1015	FEMALE	\N	\N	+10000833881015	\N	R083388-1015	D	CLASS_7	\N	\N
5145	STRESS-083388-1016	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1016	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1016	FEMALE	\N	\N	+10000833881016	\N	R083388-1016	D	CLASS_6	\N	\N
5146	STRESS-083388-1017	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1017	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1017	MALE	\N	\N	+10000833881017	\N	R083388-1017	C	CLASS_7	\N	\N
5147	STRESS-083388-1018	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1018	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1018	FEMALE	\N	\N	+10000833881018	\N	R083388-1018	B	CLASS_10	\N	\N
5148	STRESS-083388-1019	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1019	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1019	MALE	\N	\N	+10000833881019	\N	R083388-1019	C	CLASS_7	\N	\N
5149	STRESS-083388-1020	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1020	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1020	MALE	\N	\N	+10000833881020	\N	R083388-1020	B	CLASS_8	\N	\N
5150	STRESS-083388-1021	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1021	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1021	MALE	\N	\N	+10000833881021	\N	R083388-1021	C	CLASS_6	\N	\N
5151	STRESS-083388-1022	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1022	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1022	FEMALE	\N	\N	+10000833881022	\N	R083388-1022	A	CLASS_9	\N	\N
5152	STRESS-083388-1023	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1023	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1023	FEMALE	\N	\N	+10000833881023	\N	R083388-1023	C	CLASS_9	\N	\N
5153	STRESS-083388-1024	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1024	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1024	MALE	\N	\N	+10000833881024	\N	R083388-1024	A	CLASS_6	\N	\N
5154	STRESS-083388-1025	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1025	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1025	MALE	\N	\N	+10000833881025	\N	R083388-1025	A	CLASS_6	\N	\N
5155	STRESS-083388-1026	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1026	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1026	MALE	\N	\N	+10000833881026	\N	R083388-1026	D	CLASS_7	\N	\N
5156	STRESS-083388-1027	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1027	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1027	FEMALE	\N	\N	+10000833881027	\N	R083388-1027	A	CLASS_8	\N	\N
5157	STRESS-083388-1028	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1028	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1028	MALE	\N	\N	+10000833881028	\N	R083388-1028	C	CLASS_8	\N	\N
5158	STRESS-083388-1029	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1029	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1029	FEMALE	\N	\N	+10000833881029	\N	R083388-1029	C	CLASS_7	\N	\N
5159	STRESS-083388-1030	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1030	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1030	MALE	\N	\N	+10000833881030	\N	R083388-1030	C	CLASS_6	\N	\N
5160	STRESS-083388-1031	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1031	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1031	FEMALE	\N	\N	+10000833881031	\N	R083388-1031	C	CLASS_8	\N	\N
5161	STRESS-083388-1032	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1032	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1032	FEMALE	\N	\N	+10000833881032	\N	R083388-1032	A	CLASS_9	\N	\N
5162	STRESS-083388-1033	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1033	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1033	MALE	\N	\N	+10000833881033	\N	R083388-1033	A	CLASS_6	\N	\N
5163	STRESS-083388-1034	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1034	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1034	FEMALE	\N	\N	+10000833881034	\N	R083388-1034	B	CLASS_9	\N	\N
5164	STRESS-083388-1035	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1035	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1035	MALE	\N	\N	+10000833881035	\N	R083388-1035	D	CLASS_9	\N	\N
5165	STRESS-083388-1036	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1036	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1036	MALE	\N	\N	+10000833881036	\N	R083388-1036	D	CLASS_9	\N	\N
5166	STRESS-083388-1037	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1037	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1037	FEMALE	\N	\N	+10000833881037	\N	R083388-1037	A	CLASS_10	\N	\N
5167	STRESS-083388-1038	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1038	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1038	MALE	\N	\N	+10000833881038	\N	R083388-1038	D	CLASS_7	\N	\N
5168	STRESS-083388-1039	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1039	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1039	FEMALE	\N	\N	+10000833881039	\N	R083388-1039	C	CLASS_7	\N	\N
5169	STRESS-083388-1040	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1040	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1040	MALE	\N	\N	+10000833881040	\N	R083388-1040	A	CLASS_7	\N	\N
5170	STRESS-083388-1041	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1041	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1041	MALE	\N	\N	+10000833881041	\N	R083388-1041	D	CLASS_7	\N	\N
5171	STRESS-083388-1042	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1042	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1042	FEMALE	\N	\N	+10000833881042	\N	R083388-1042	C	CLASS_6	\N	\N
5172	STRESS-083388-1043	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1043	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1043	MALE	\N	\N	+10000833881043	\N	R083388-1043	B	CLASS_8	\N	\N
5173	STRESS-083388-1044	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1044	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1044	MALE	\N	\N	+10000833881044	\N	R083388-1044	A	CLASS_6	\N	\N
5174	STRESS-083388-1045	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1045	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1045	FEMALE	\N	\N	+10000833881045	\N	R083388-1045	D	CLASS_6	\N	\N
5175	STRESS-083388-1046	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1046	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1046	FEMALE	\N	\N	+10000833881046	\N	R083388-1046	A	CLASS_7	\N	\N
5176	STRESS-083388-1047	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1047	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1047	MALE	\N	\N	+10000833881047	\N	R083388-1047	B	CLASS_7	\N	\N
5177	STRESS-083388-1048	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1048	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1048	FEMALE	\N	\N	+10000833881048	\N	R083388-1048	A	CLASS_9	\N	\N
5178	STRESS-083388-1049	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1049	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1049	MALE	\N	\N	+10000833881049	\N	R083388-1049	A	CLASS_10	\N	\N
5179	STRESS-083388-1050	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1050	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1050	MALE	\N	\N	+10000833881050	\N	R083388-1050	C	CLASS_9	\N	\N
5180	STRESS-083388-1051	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1051	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1051	FEMALE	\N	\N	+10000833881051	\N	R083388-1051	C	CLASS_7	\N	\N
5181	STRESS-083388-1052	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1052	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1052	MALE	\N	\N	+10000833881052	\N	R083388-1052	D	CLASS_10	\N	\N
5182	STRESS-083388-1053	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1053	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1053	MALE	\N	\N	+10000833881053	\N	R083388-1053	C	CLASS_7	\N	\N
5183	STRESS-083388-1054	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1054	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1054	MALE	\N	\N	+10000833881054	\N	R083388-1054	D	CLASS_10	\N	\N
5184	STRESS-083388-1055	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1055	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1055	MALE	\N	\N	+10000833881055	\N	R083388-1055	C	CLASS_6	\N	\N
5185	STRESS-083388-1056	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1056	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1056	MALE	\N	\N	+10000833881056	\N	R083388-1056	C	CLASS_9	\N	\N
5186	STRESS-083388-1057	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1057	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1057	MALE	\N	\N	+10000833881057	\N	R083388-1057	A	CLASS_9	\N	\N
5187	STRESS-083388-1058	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1058	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1058	FEMALE	\N	\N	+10000833881058	\N	R083388-1058	D	CLASS_8	\N	\N
5188	STRESS-083388-1059	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1059	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1059	FEMALE	\N	\N	+10000833881059	\N	R083388-1059	A	CLASS_6	\N	\N
5189	STRESS-083388-1060	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1060	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1060	MALE	\N	\N	+10000833881060	\N	R083388-1060	C	CLASS_10	\N	\N
5190	STRESS-083388-1061	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1061	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1061	FEMALE	\N	\N	+10000833881061	\N	R083388-1061	A	CLASS_10	\N	\N
5191	STRESS-083388-1062	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1062	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1062	MALE	\N	\N	+10000833881062	\N	R083388-1062	D	CLASS_6	\N	\N
5192	STRESS-083388-1063	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1063	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1063	FEMALE	\N	\N	+10000833881063	\N	R083388-1063	A	CLASS_10	\N	\N
5193	STRESS-083388-1064	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1064	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1064	FEMALE	\N	\N	+10000833881064	\N	R083388-1064	A	CLASS_8	\N	\N
5194	STRESS-083388-1065	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1065	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1065	MALE	\N	\N	+10000833881065	\N	R083388-1065	D	CLASS_8	\N	\N
5195	STRESS-083388-1066	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1066	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1066	MALE	\N	\N	+10000833881066	\N	R083388-1066	C	CLASS_8	\N	\N
5196	STRESS-083388-1067	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1067	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1067	MALE	\N	\N	+10000833881067	\N	R083388-1067	A	CLASS_6	\N	\N
5197	STRESS-083388-1068	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1068	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1068	FEMALE	\N	\N	+10000833881068	\N	R083388-1068	A	CLASS_10	\N	\N
5198	STRESS-083388-1069	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1069	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1069	FEMALE	\N	\N	+10000833881069	\N	R083388-1069	C	CLASS_9	\N	\N
5199	STRESS-083388-1070	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1070	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1070	MALE	\N	\N	+10000833881070	\N	R083388-1070	A	CLASS_9	\N	\N
5200	STRESS-083388-1071	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1071	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1071	FEMALE	\N	\N	+10000833881071	\N	R083388-1071	D	CLASS_7	\N	\N
5201	STRESS-083388-1072	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1072	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1072	MALE	\N	\N	+10000833881072	\N	R083388-1072	A	CLASS_7	\N	\N
5202	STRESS-083388-1073	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1073	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1073	MALE	\N	\N	+10000833881073	\N	R083388-1073	D	CLASS_8	\N	\N
5203	STRESS-083388-1074	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1074	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1074	MALE	\N	\N	+10000833881074	\N	R083388-1074	C	CLASS_6	\N	\N
5204	STRESS-083388-1075	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1075	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1075	MALE	\N	\N	+10000833881075	\N	R083388-1075	A	CLASS_7	\N	\N
5205	STRESS-083388-1076	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1076	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1076	FEMALE	\N	\N	+10000833881076	\N	R083388-1076	C	CLASS_8	\N	\N
5206	STRESS-083388-1077	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1077	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1077	FEMALE	\N	\N	+10000833881077	\N	R083388-1077	A	CLASS_7	\N	\N
5207	STRESS-083388-1078	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1078	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1078	MALE	\N	\N	+10000833881078	\N	R083388-1078	B	CLASS_10	\N	\N
5208	STRESS-083388-1079	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1079	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1079	FEMALE	\N	\N	+10000833881079	\N	R083388-1079	B	CLASS_6	\N	\N
5209	STRESS-083388-1080	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1080	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1080	FEMALE	\N	\N	+10000833881080	\N	R083388-1080	B	CLASS_8	\N	\N
5210	STRESS-083388-1081	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1081	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1081	MALE	\N	\N	+10000833881081	\N	R083388-1081	D	CLASS_8	\N	\N
5211	STRESS-083388-1082	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1082	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1082	MALE	\N	\N	+10000833881082	\N	R083388-1082	B	CLASS_10	\N	\N
5212	STRESS-083388-1083	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1083	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1083	MALE	\N	\N	+10000833881083	\N	R083388-1083	B	CLASS_8	\N	\N
5213	STRESS-083388-1084	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1084	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1084	MALE	\N	\N	+10000833881084	\N	R083388-1084	B	CLASS_10	\N	\N
5214	STRESS-083388-1085	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1085	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1085	FEMALE	\N	\N	+10000833881085	\N	R083388-1085	D	CLASS_7	\N	\N
5215	STRESS-083388-1086	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1086	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1086	FEMALE	\N	\N	+10000833881086	\N	R083388-1086	A	CLASS_10	\N	\N
5216	STRESS-083388-1087	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1087	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1087	MALE	\N	\N	+10000833881087	\N	R083388-1087	C	CLASS_8	\N	\N
5217	STRESS-083388-1088	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1088	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1088	MALE	\N	\N	+10000833881088	\N	R083388-1088	B	CLASS_7	\N	\N
5218	STRESS-083388-1089	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1089	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1089	MALE	\N	\N	+10000833881089	\N	R083388-1089	D	CLASS_8	\N	\N
5219	STRESS-083388-1090	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1090	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1090	FEMALE	\N	\N	+10000833881090	\N	R083388-1090	C	CLASS_10	\N	\N
5220	STRESS-083388-1091	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1091	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1091	FEMALE	\N	\N	+10000833881091	\N	R083388-1091	B	CLASS_10	\N	\N
5221	STRESS-083388-1092	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1092	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1092	FEMALE	\N	\N	+10000833881092	\N	R083388-1092	A	CLASS_9	\N	\N
5222	STRESS-083388-1093	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1093	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1093	FEMALE	\N	\N	+10000833881093	\N	R083388-1093	D	CLASS_6	\N	\N
5223	STRESS-083388-1094	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1094	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1094	MALE	\N	\N	+10000833881094	\N	R083388-1094	C	CLASS_9	\N	\N
5224	STRESS-083388-1095	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1095	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1095	MALE	\N	\N	+10000833881095	\N	R083388-1095	A	CLASS_8	\N	\N
5225	STRESS-083388-1096	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1096	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1096	MALE	\N	\N	+10000833881096	\N	R083388-1096	A	CLASS_10	\N	\N
5226	STRESS-083388-1097	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1097	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1097	FEMALE	\N	\N	+10000833881097	\N	R083388-1097	B	CLASS_8	\N	\N
5227	STRESS-083388-1098	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1098	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1098	FEMALE	\N	\N	+10000833881098	\N	R083388-1098	A	CLASS_10	\N	\N
5228	STRESS-083388-1099	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1099	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1099	FEMALE	\N	\N	+10000833881099	\N	R083388-1099	D	CLASS_8	\N	\N
5229	STRESS-083388-1100	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1100	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1100	FEMALE	\N	\N	+10000833881100	\N	R083388-1100	C	CLASS_8	\N	\N
5230	STRESS-083388-1101	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1101	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1101	FEMALE	\N	\N	+10000833881101	\N	R083388-1101	A	CLASS_6	\N	\N
5231	STRESS-083388-1102	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1102	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1102	FEMALE	\N	\N	+10000833881102	\N	R083388-1102	D	CLASS_10	\N	\N
5232	STRESS-083388-1103	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1103	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1103	MALE	\N	\N	+10000833881103	\N	R083388-1103	A	CLASS_10	\N	\N
5233	STRESS-083388-1104	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1104	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1104	MALE	\N	\N	+10000833881104	\N	R083388-1104	A	CLASS_8	\N	\N
5234	STRESS-083388-1105	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1105	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1105	MALE	\N	\N	+10000833881105	\N	R083388-1105	C	CLASS_9	\N	\N
5235	STRESS-083388-1106	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1106	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1106	FEMALE	\N	\N	+10000833881106	\N	R083388-1106	B	CLASS_9	\N	\N
5236	STRESS-083388-1107	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1107	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1107	MALE	\N	\N	+10000833881107	\N	R083388-1107	C	CLASS_6	\N	\N
5237	STRESS-083388-1108	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1108	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1108	MALE	\N	\N	+10000833881108	\N	R083388-1108	C	CLASS_7	\N	\N
5238	STRESS-083388-1109	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1109	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1109	FEMALE	\N	\N	+10000833881109	\N	R083388-1109	C	CLASS_6	\N	\N
5239	STRESS-083388-1110	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1110	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1110	FEMALE	\N	\N	+10000833881110	\N	R083388-1110	A	CLASS_9	\N	\N
5240	STRESS-083388-1111	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1111	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1111	MALE	\N	\N	+10000833881111	\N	R083388-1111	D	CLASS_7	\N	\N
5241	STRESS-083388-1112	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1112	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1112	MALE	\N	\N	+10000833881112	\N	R083388-1112	B	CLASS_8	\N	\N
5242	STRESS-083388-1113	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1113	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1113	MALE	\N	\N	+10000833881113	\N	R083388-1113	D	CLASS_7	\N	\N
5243	STRESS-083388-1114	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1114	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1114	FEMALE	\N	\N	+10000833881114	\N	R083388-1114	A	CLASS_8	\N	\N
5244	STRESS-083388-1115	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1115	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1115	MALE	\N	\N	+10000833881115	\N	R083388-1115	A	CLASS_10	\N	\N
5245	STRESS-083388-1116	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1116	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1116	MALE	\N	\N	+10000833881116	\N	R083388-1116	A	CLASS_10	\N	\N
5246	STRESS-083388-1117	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1117	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1117	FEMALE	\N	\N	+10000833881117	\N	R083388-1117	D	CLASS_10	\N	\N
5247	STRESS-083388-1118	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1118	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1118	FEMALE	\N	\N	+10000833881118	\N	R083388-1118	B	CLASS_8	\N	\N
5248	STRESS-083388-1119	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1119	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1119	MALE	\N	\N	+10000833881119	\N	R083388-1119	A	CLASS_6	\N	\N
5249	STRESS-083388-1120	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1120	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1120	MALE	\N	\N	+10000833881120	\N	R083388-1120	C	CLASS_6	\N	\N
5250	STRESS-083388-1121	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1121	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1121	MALE	\N	\N	+10000833881121	\N	R083388-1121	B	CLASS_7	\N	\N
5251	STRESS-083388-1122	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1122	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1122	MALE	\N	\N	+10000833881122	\N	R083388-1122	C	CLASS_6	\N	\N
5252	STRESS-083388-1123	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1123	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1123	FEMALE	\N	\N	+10000833881123	\N	R083388-1123	B	CLASS_7	\N	\N
5253	STRESS-083388-1124	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1124	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1124	MALE	\N	\N	+10000833881124	\N	R083388-1124	D	CLASS_10	\N	\N
5254	STRESS-083388-1125	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1125	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1125	MALE	\N	\N	+10000833881125	\N	R083388-1125	A	CLASS_10	\N	\N
5255	STRESS-083388-1126	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1126	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1126	MALE	\N	\N	+10000833881126	\N	R083388-1126	B	CLASS_9	\N	\N
5256	STRESS-083388-1127	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1127	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1127	FEMALE	\N	\N	+10000833881127	\N	R083388-1127	C	CLASS_9	\N	\N
5257	STRESS-083388-1128	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1128	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1128	MALE	\N	\N	+10000833881128	\N	R083388-1128	D	CLASS_9	\N	\N
5258	STRESS-083388-1129	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1129	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1129	FEMALE	\N	\N	+10000833881129	\N	R083388-1129	A	CLASS_6	\N	\N
5259	STRESS-083388-1130	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1130	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1130	FEMALE	\N	\N	+10000833881130	\N	R083388-1130	C	CLASS_8	\N	\N
5260	STRESS-083388-1131	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1131	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1131	MALE	\N	\N	+10000833881131	\N	R083388-1131	B	CLASS_10	\N	\N
5261	STRESS-083388-1132	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1132	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1132	FEMALE	\N	\N	+10000833881132	\N	R083388-1132	A	CLASS_10	\N	\N
5262	STRESS-083388-1133	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1133	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1133	MALE	\N	\N	+10000833881133	\N	R083388-1133	B	CLASS_8	\N	\N
5263	STRESS-083388-1134	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1134	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1134	MALE	\N	\N	+10000833881134	\N	R083388-1134	B	CLASS_9	\N	\N
5264	STRESS-083388-1135	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1135	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1135	FEMALE	\N	\N	+10000833881135	\N	R083388-1135	D	CLASS_10	\N	\N
5265	STRESS-083388-1136	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1136	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1136	MALE	\N	\N	+10000833881136	\N	R083388-1136	C	CLASS_6	\N	\N
5266	STRESS-083388-1137	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1137	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1137	MALE	\N	\N	+10000833881137	\N	R083388-1137	A	CLASS_10	\N	\N
5267	STRESS-083388-1138	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1138	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1138	FEMALE	\N	\N	+10000833881138	\N	R083388-1138	B	CLASS_7	\N	\N
5268	STRESS-083388-1139	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1139	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1139	MALE	\N	\N	+10000833881139	\N	R083388-1139	C	CLASS_9	\N	\N
5269	STRESS-083388-1140	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1140	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1140	FEMALE	\N	\N	+10000833881140	\N	R083388-1140	A	CLASS_6	\N	\N
5270	STRESS-083388-1141	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1141	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1141	FEMALE	\N	\N	+10000833881141	\N	R083388-1141	A	CLASS_7	\N	\N
5271	STRESS-083388-1142	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1142	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1142	FEMALE	\N	\N	+10000833881142	\N	R083388-1142	D	CLASS_10	\N	\N
5272	STRESS-083388-1143	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1143	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1143	FEMALE	\N	\N	+10000833881143	\N	R083388-1143	A	CLASS_9	\N	\N
5273	STRESS-083388-1144	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1144	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1144	FEMALE	\N	\N	+10000833881144	\N	R083388-1144	C	CLASS_6	\N	\N
5274	STRESS-083388-1145	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1145	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1145	MALE	\N	\N	+10000833881145	\N	R083388-1145	C	CLASS_6	\N	\N
5275	STRESS-083388-1146	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1146	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1146	FEMALE	\N	\N	+10000833881146	\N	R083388-1146	C	CLASS_9	\N	\N
5276	STRESS-083388-1147	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1147	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1147	MALE	\N	\N	+10000833881147	\N	R083388-1147	C	CLASS_8	\N	\N
5277	STRESS-083388-1148	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1148	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1148	FEMALE	\N	\N	+10000833881148	\N	R083388-1148	B	CLASS_9	\N	\N
5278	STRESS-083388-1149	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1149	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1149	FEMALE	\N	\N	+10000833881149	\N	R083388-1149	A	CLASS_9	\N	\N
5279	STRESS-083388-1150	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1150	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1150	FEMALE	\N	\N	+10000833881150	\N	R083388-1150	D	CLASS_10	\N	\N
5280	STRESS-083388-1151	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1151	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1151	FEMALE	\N	\N	+10000833881151	\N	R083388-1151	A	CLASS_7	\N	\N
5281	STRESS-083388-1152	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1152	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1152	FEMALE	\N	\N	+10000833881152	\N	R083388-1152	B	CLASS_7	\N	\N
5282	STRESS-083388-1153	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1153	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1153	FEMALE	\N	\N	+10000833881153	\N	R083388-1153	C	CLASS_7	\N	\N
5283	STRESS-083388-1154	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1154	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1154	MALE	\N	\N	+10000833881154	\N	R083388-1154	A	CLASS_9	\N	\N
5284	STRESS-083388-1155	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1155	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1155	FEMALE	\N	\N	+10000833881155	\N	R083388-1155	B	CLASS_10	\N	\N
5285	STRESS-083388-1156	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1156	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1156	MALE	\N	\N	+10000833881156	\N	R083388-1156	C	CLASS_10	\N	\N
5286	STRESS-083388-1157	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1157	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1157	MALE	\N	\N	+10000833881157	\N	R083388-1157	C	CLASS_8	\N	\N
5287	STRESS-083388-1158	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1158	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1158	FEMALE	\N	\N	+10000833881158	\N	R083388-1158	A	CLASS_10	\N	\N
5288	STRESS-083388-1159	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1159	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1159	FEMALE	\N	\N	+10000833881159	\N	R083388-1159	C	CLASS_8	\N	\N
5289	STRESS-083388-1160	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1160	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1160	MALE	\N	\N	+10000833881160	\N	R083388-1160	D	CLASS_8	\N	\N
5290	STRESS-083388-1161	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1161	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1161	MALE	\N	\N	+10000833881161	\N	R083388-1161	B	CLASS_6	\N	\N
5291	STRESS-083388-1162	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1162	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1162	MALE	\N	\N	+10000833881162	\N	R083388-1162	D	CLASS_9	\N	\N
5292	STRESS-083388-1163	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1163	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1163	MALE	\N	\N	+10000833881163	\N	R083388-1163	A	CLASS_9	\N	\N
5293	STRESS-083388-1164	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1164	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1164	MALE	\N	\N	+10000833881164	\N	R083388-1164	A	CLASS_9	\N	\N
5294	STRESS-083388-1165	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1165	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1165	FEMALE	\N	\N	+10000833881165	\N	R083388-1165	D	CLASS_10	\N	\N
5295	STRESS-083388-1166	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1166	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1166	MALE	\N	\N	+10000833881166	\N	R083388-1166	D	CLASS_9	\N	\N
5296	STRESS-083388-1167	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1167	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1167	MALE	\N	\N	+10000833881167	\N	R083388-1167	A	CLASS_9	\N	\N
5297	STRESS-083388-1168	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1168	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1168	FEMALE	\N	\N	+10000833881168	\N	R083388-1168	A	CLASS_9	\N	\N
5298	STRESS-083388-1169	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1169	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1169	FEMALE	\N	\N	+10000833881169	\N	R083388-1169	B	CLASS_8	\N	\N
5299	STRESS-083388-1170	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1170	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1170	FEMALE	\N	\N	+10000833881170	\N	R083388-1170	C	CLASS_8	\N	\N
5300	STRESS-083388-1171	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1171	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1171	MALE	\N	\N	+10000833881171	\N	R083388-1171	A	CLASS_10	\N	\N
5301	STRESS-083388-1172	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1172	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1172	MALE	\N	\N	+10000833881172	\N	R083388-1172	C	CLASS_6	\N	\N
5302	STRESS-083388-1173	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1173	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1173	FEMALE	\N	\N	+10000833881173	\N	R083388-1173	D	CLASS_9	\N	\N
5303	STRESS-083388-1174	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1174	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1174	MALE	\N	\N	+10000833881174	\N	R083388-1174	C	CLASS_6	\N	\N
5304	STRESS-083388-1175	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1175	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1175	FEMALE	\N	\N	+10000833881175	\N	R083388-1175	D	CLASS_10	\N	\N
5305	STRESS-083388-1176	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1176	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1176	FEMALE	\N	\N	+10000833881176	\N	R083388-1176	B	CLASS_7	\N	\N
5306	STRESS-083388-1177	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1177	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1177	FEMALE	\N	\N	+10000833881177	\N	R083388-1177	D	CLASS_6	\N	\N
5307	STRESS-083388-1178	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1178	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1178	MALE	\N	\N	+10000833881178	\N	R083388-1178	B	CLASS_10	\N	\N
5308	STRESS-083388-1179	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1179	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1179	MALE	\N	\N	+10000833881179	\N	R083388-1179	A	CLASS_9	\N	\N
5309	STRESS-083388-1180	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1180	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1180	MALE	\N	\N	+10000833881180	\N	R083388-1180	D	CLASS_7	\N	\N
5310	STRESS-083388-1181	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1181	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1181	FEMALE	\N	\N	+10000833881181	\N	R083388-1181	C	CLASS_10	\N	\N
5311	STRESS-083388-1182	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1182	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1182	FEMALE	\N	\N	+10000833881182	\N	R083388-1182	C	CLASS_9	\N	\N
5312	STRESS-083388-1183	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1183	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1183	MALE	\N	\N	+10000833881183	\N	R083388-1183	B	CLASS_8	\N	\N
5313	STRESS-083388-1184	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1184	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1184	MALE	\N	\N	+10000833881184	\N	R083388-1184	D	CLASS_10	\N	\N
5314	STRESS-083388-1185	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1185	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1185	FEMALE	\N	\N	+10000833881185	\N	R083388-1185	B	CLASS_9	\N	\N
5315	STRESS-083388-1186	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1186	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1186	MALE	\N	\N	+10000833881186	\N	R083388-1186	D	CLASS_10	\N	\N
5316	STRESS-083388-1187	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1187	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1187	MALE	\N	\N	+10000833881187	\N	R083388-1187	C	CLASS_6	\N	\N
5317	STRESS-083388-1188	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1188	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1188	FEMALE	\N	\N	+10000833881188	\N	R083388-1188	C	CLASS_9	\N	\N
5318	STRESS-083388-1189	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1189	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1189	MALE	\N	\N	+10000833881189	\N	R083388-1189	C	CLASS_6	\N	\N
5319	STRESS-083388-1190	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1190	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1190	FEMALE	\N	\N	+10000833881190	\N	R083388-1190	B	CLASS_10	\N	\N
5320	STRESS-083388-1191	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1191	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1191	MALE	\N	\N	+10000833881191	\N	R083388-1191	A	CLASS_8	\N	\N
5321	STRESS-083388-1192	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1192	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1192	MALE	\N	\N	+10000833881192	\N	R083388-1192	B	CLASS_10	\N	\N
5322	STRESS-083388-1193	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1193	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1193	MALE	\N	\N	+10000833881193	\N	R083388-1193	B	CLASS_10	\N	\N
5323	STRESS-083388-1194	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1194	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1194	MALE	\N	\N	+10000833881194	\N	R083388-1194	D	CLASS_9	\N	\N
5324	STRESS-083388-1195	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1195	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1195	FEMALE	\N	\N	+10000833881195	\N	R083388-1195	C	CLASS_6	\N	\N
5325	STRESS-083388-1196	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1196	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1196	FEMALE	\N	\N	+10000833881196	\N	R083388-1196	C	CLASS_6	\N	\N
5326	STRESS-083388-1197	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1197	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1197	FEMALE	\N	\N	+10000833881197	\N	R083388-1197	B	CLASS_10	\N	\N
5327	STRESS-083388-1198	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1198	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1198	MALE	\N	\N	+10000833881198	\N	R083388-1198	C	CLASS_10	\N	\N
5328	STRESS-083388-1199	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1199	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1199	MALE	\N	\N	+10000833881199	\N	R083388-1199	D	CLASS_6	\N	\N
5329	STRESS-083388-1200	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1200	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1200	MALE	\N	\N	+10000833881200	\N	R083388-1200	D	CLASS_9	\N	\N
5330	STRESS-083388-1201	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1201	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1201	FEMALE	\N	\N	+10000833881201	\N	R083388-1201	A	CLASS_7	\N	\N
5331	STRESS-083388-1202	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1202	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1202	FEMALE	\N	\N	+10000833881202	\N	R083388-1202	C	CLASS_6	\N	\N
5332	STRESS-083388-1203	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1203	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1203	FEMALE	\N	\N	+10000833881203	\N	R083388-1203	B	CLASS_9	\N	\N
5333	STRESS-083388-1204	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1204	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1204	MALE	\N	\N	+10000833881204	\N	R083388-1204	A	CLASS_6	\N	\N
5334	STRESS-083388-1205	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1205	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1205	FEMALE	\N	\N	+10000833881205	\N	R083388-1205	B	CLASS_7	\N	\N
5335	STRESS-083388-1206	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1206	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1206	MALE	\N	\N	+10000833881206	\N	R083388-1206	C	CLASS_7	\N	\N
5336	STRESS-083388-1207	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1207	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1207	FEMALE	\N	\N	+10000833881207	\N	R083388-1207	A	CLASS_8	\N	\N
5337	STRESS-083388-1208	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1208	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1208	MALE	\N	\N	+10000833881208	\N	R083388-1208	B	CLASS_8	\N	\N
5338	STRESS-083388-1209	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1209	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1209	FEMALE	\N	\N	+10000833881209	\N	R083388-1209	D	CLASS_9	\N	\N
5339	STRESS-083388-1210	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1210	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1210	FEMALE	\N	\N	+10000833881210	\N	R083388-1210	A	CLASS_8	\N	\N
5340	STRESS-083388-1211	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1211	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1211	MALE	\N	\N	+10000833881211	\N	R083388-1211	D	CLASS_10	\N	\N
5341	STRESS-083388-1212	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1212	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1212	MALE	\N	\N	+10000833881212	\N	R083388-1212	B	CLASS_8	\N	\N
5342	STRESS-083388-1213	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1213	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1213	MALE	\N	\N	+10000833881213	\N	R083388-1213	A	CLASS_8	\N	\N
5343	STRESS-083388-1214	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1214	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1214	MALE	\N	\N	+10000833881214	\N	R083388-1214	B	CLASS_7	\N	\N
5344	STRESS-083388-1215	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1215	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1215	MALE	\N	\N	+10000833881215	\N	R083388-1215	B	CLASS_9	\N	\N
5345	STRESS-083388-1216	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1216	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1216	MALE	\N	\N	+10000833881216	\N	R083388-1216	C	CLASS_6	\N	\N
5346	STRESS-083388-1217	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1217	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1217	MALE	\N	\N	+10000833881217	\N	R083388-1217	C	CLASS_8	\N	\N
5347	STRESS-083388-1218	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1218	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1218	MALE	\N	\N	+10000833881218	\N	R083388-1218	D	CLASS_9	\N	\N
5348	STRESS-083388-1219	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1219	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1219	FEMALE	\N	\N	+10000833881219	\N	R083388-1219	C	CLASS_9	\N	\N
5349	STRESS-083388-1220	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1220	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1220	MALE	\N	\N	+10000833881220	\N	R083388-1220	B	CLASS_8	\N	\N
5350	STRESS-083388-1221	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1221	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1221	MALE	\N	\N	+10000833881221	\N	R083388-1221	B	CLASS_8	\N	\N
5351	STRESS-083388-1222	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1222	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1222	FEMALE	\N	\N	+10000833881222	\N	R083388-1222	D	CLASS_9	\N	\N
5352	STRESS-083388-1223	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1223	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1223	FEMALE	\N	\N	+10000833881223	\N	R083388-1223	B	CLASS_10	\N	\N
5353	STRESS-083388-1224	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1224	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1224	MALE	\N	\N	+10000833881224	\N	R083388-1224	B	CLASS_8	\N	\N
5354	STRESS-083388-1225	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1225	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1225	FEMALE	\N	\N	+10000833881225	\N	R083388-1225	B	CLASS_6	\N	\N
5355	STRESS-083388-1226	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1226	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1226	FEMALE	\N	\N	+10000833881226	\N	R083388-1226	D	CLASS_9	\N	\N
5356	STRESS-083388-1227	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1227	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1227	FEMALE	\N	\N	+10000833881227	\N	R083388-1227	C	CLASS_6	\N	\N
5357	STRESS-083388-1228	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1228	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1228	FEMALE	\N	\N	+10000833881228	\N	R083388-1228	D	CLASS_7	\N	\N
5358	STRESS-083388-1229	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1229	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1229	MALE	\N	\N	+10000833881229	\N	R083388-1229	C	CLASS_7	\N	\N
5359	STRESS-083388-1230	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1230	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1230	FEMALE	\N	\N	+10000833881230	\N	R083388-1230	B	CLASS_9	\N	\N
5360	STRESS-083388-1231	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1231	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1231	FEMALE	\N	\N	+10000833881231	\N	R083388-1231	B	CLASS_6	\N	\N
5361	STRESS-083388-1232	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1232	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1232	MALE	\N	\N	+10000833881232	\N	R083388-1232	B	CLASS_6	\N	\N
5362	STRESS-083388-1233	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1233	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1233	FEMALE	\N	\N	+10000833881233	\N	R083388-1233	A	CLASS_9	\N	\N
5363	STRESS-083388-1234	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1234	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1234	FEMALE	\N	\N	+10000833881234	\N	R083388-1234	C	CLASS_10	\N	\N
5364	STRESS-083388-1235	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1235	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1235	FEMALE	\N	\N	+10000833881235	\N	R083388-1235	B	CLASS_7	\N	\N
5365	STRESS-083388-1236	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1236	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1236	FEMALE	\N	\N	+10000833881236	\N	R083388-1236	A	CLASS_7	\N	\N
5366	STRESS-083388-1237	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1237	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1237	MALE	\N	\N	+10000833881237	\N	R083388-1237	A	CLASS_6	\N	\N
5367	STRESS-083388-1238	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1238	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1238	FEMALE	\N	\N	+10000833881238	\N	R083388-1238	D	CLASS_9	\N	\N
5368	STRESS-083388-1239	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1239	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1239	FEMALE	\N	\N	+10000833881239	\N	R083388-1239	A	CLASS_6	\N	\N
5369	STRESS-083388-1240	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1240	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1240	FEMALE	\N	\N	+10000833881240	\N	R083388-1240	B	CLASS_9	\N	\N
5370	STRESS-083388-1241	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1241	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1241	FEMALE	\N	\N	+10000833881241	\N	R083388-1241	B	CLASS_9	\N	\N
5371	STRESS-083388-1242	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1242	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1242	FEMALE	\N	\N	+10000833881242	\N	R083388-1242	D	CLASS_9	\N	\N
5372	STRESS-083388-1243	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1243	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1243	MALE	\N	\N	+10000833881243	\N	R083388-1243	A	CLASS_6	\N	\N
5373	STRESS-083388-1244	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1244	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1244	FEMALE	\N	\N	+10000833881244	\N	R083388-1244	B	CLASS_8	\N	\N
5374	STRESS-083388-1245	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1245	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1245	FEMALE	\N	\N	+10000833881245	\N	R083388-1245	B	CLASS_6	\N	\N
5375	STRESS-083388-1246	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1246	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1246	MALE	\N	\N	+10000833881246	\N	R083388-1246	C	CLASS_7	\N	\N
5376	STRESS-083388-1247	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1247	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1247	MALE	\N	\N	+10000833881247	\N	R083388-1247	A	CLASS_9	\N	\N
5377	STRESS-083388-1248	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1248	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1248	MALE	\N	\N	+10000833881248	\N	R083388-1248	C	CLASS_10	\N	\N
5378	STRESS-083388-1249	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1249	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1249	MALE	\N	\N	+10000833881249	\N	R083388-1249	B	CLASS_9	\N	\N
5379	STRESS-083388-1250	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1250	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1250	MALE	\N	\N	+10000833881250	\N	R083388-1250	C	CLASS_6	\N	\N
5380	STRESS-083388-1251	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1251	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1251	FEMALE	\N	\N	+10000833881251	\N	R083388-1251	D	CLASS_8	\N	\N
5381	STRESS-083388-1252	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1252	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1252	FEMALE	\N	\N	+10000833881252	\N	R083388-1252	C	CLASS_7	\N	\N
5382	STRESS-083388-1253	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1253	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1253	MALE	\N	\N	+10000833881253	\N	R083388-1253	B	CLASS_7	\N	\N
5383	STRESS-083388-1254	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1254	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1254	FEMALE	\N	\N	+10000833881254	\N	R083388-1254	D	CLASS_10	\N	\N
5384	STRESS-083388-1255	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1255	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1255	FEMALE	\N	\N	+10000833881255	\N	R083388-1255	B	CLASS_9	\N	\N
5385	STRESS-083388-1256	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1256	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1256	FEMALE	\N	\N	+10000833881256	\N	R083388-1256	C	CLASS_9	\N	\N
5386	STRESS-083388-1257	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1257	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1257	FEMALE	\N	\N	+10000833881257	\N	R083388-1257	D	CLASS_6	\N	\N
5387	STRESS-083388-1258	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1258	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1258	FEMALE	\N	\N	+10000833881258	\N	R083388-1258	B	CLASS_10	\N	\N
5388	STRESS-083388-1259	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1259	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1259	MALE	\N	\N	+10000833881259	\N	R083388-1259	C	CLASS_8	\N	\N
5389	STRESS-083388-1260	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1260	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1260	FEMALE	\N	\N	+10000833881260	\N	R083388-1260	B	CLASS_6	\N	\N
5390	STRESS-083388-1261	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1261	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1261	MALE	\N	\N	+10000833881261	\N	R083388-1261	C	CLASS_7	\N	\N
5391	STRESS-083388-1262	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1262	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1262	MALE	\N	\N	+10000833881262	\N	R083388-1262	B	CLASS_6	\N	\N
5392	STRESS-083388-1263	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1263	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1263	FEMALE	\N	\N	+10000833881263	\N	R083388-1263	C	CLASS_6	\N	\N
5393	STRESS-083388-1264	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1264	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1264	FEMALE	\N	\N	+10000833881264	\N	R083388-1264	D	CLASS_10	\N	\N
5394	STRESS-083388-1265	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1265	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1265	FEMALE	\N	\N	+10000833881265	\N	R083388-1265	B	CLASS_10	\N	\N
5395	STRESS-083388-1266	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1266	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1266	MALE	\N	\N	+10000833881266	\N	R083388-1266	A	CLASS_9	\N	\N
5396	STRESS-083388-1267	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1267	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1267	MALE	\N	\N	+10000833881267	\N	R083388-1267	D	CLASS_9	\N	\N
5397	STRESS-083388-1268	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1268	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1268	FEMALE	\N	\N	+10000833881268	\N	R083388-1268	C	CLASS_6	\N	\N
5398	STRESS-083388-1269	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1269	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1269	FEMALE	\N	\N	+10000833881269	\N	R083388-1269	A	CLASS_7	\N	\N
5399	STRESS-083388-1270	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1270	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1270	FEMALE	\N	\N	+10000833881270	\N	R083388-1270	C	CLASS_7	\N	\N
5400	STRESS-083388-1271	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1271	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1271	FEMALE	\N	\N	+10000833881271	\N	R083388-1271	C	CLASS_9	\N	\N
5401	STRESS-083388-1272	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1272	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1272	MALE	\N	\N	+10000833881272	\N	R083388-1272	D	CLASS_7	\N	\N
5402	STRESS-083388-1273	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1273	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1273	FEMALE	\N	\N	+10000833881273	\N	R083388-1273	D	CLASS_10	\N	\N
5403	STRESS-083388-1274	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1274	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1274	MALE	\N	\N	+10000833881274	\N	R083388-1274	A	CLASS_6	\N	\N
5404	STRESS-083388-1275	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1275	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1275	FEMALE	\N	\N	+10000833881275	\N	R083388-1275	B	CLASS_6	\N	\N
5405	STRESS-083388-1276	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1276	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1276	MALE	\N	\N	+10000833881276	\N	R083388-1276	A	CLASS_6	\N	\N
5406	STRESS-083388-1277	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1277	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1277	MALE	\N	\N	+10000833881277	\N	R083388-1277	C	CLASS_6	\N	\N
5407	STRESS-083388-1278	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1278	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1278	MALE	\N	\N	+10000833881278	\N	R083388-1278	B	CLASS_6	\N	\N
5408	STRESS-083388-1279	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1279	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1279	MALE	\N	\N	+10000833881279	\N	R083388-1279	C	CLASS_7	\N	\N
5409	STRESS-083388-1280	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1280	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1280	MALE	\N	\N	+10000833881280	\N	R083388-1280	D	CLASS_6	\N	\N
5410	STRESS-083388-1281	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1281	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1281	MALE	\N	\N	+10000833881281	\N	R083388-1281	C	CLASS_7	\N	\N
5411	STRESS-083388-1282	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1282	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1282	MALE	\N	\N	+10000833881282	\N	R083388-1282	B	CLASS_6	\N	\N
5412	STRESS-083388-1283	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1283	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1283	FEMALE	\N	\N	+10000833881283	\N	R083388-1283	A	CLASS_8	\N	\N
5413	STRESS-083388-1284	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1284	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1284	MALE	\N	\N	+10000833881284	\N	R083388-1284	A	CLASS_7	\N	\N
5414	STRESS-083388-1285	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1285	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1285	MALE	\N	\N	+10000833881285	\N	R083388-1285	A	CLASS_9	\N	\N
5415	STRESS-083388-1286	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1286	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1286	FEMALE	\N	\N	+10000833881286	\N	R083388-1286	B	CLASS_6	\N	\N
5416	STRESS-083388-1287	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1287	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1287	MALE	\N	\N	+10000833881287	\N	R083388-1287	B	CLASS_8	\N	\N
5417	STRESS-083388-1288	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1288	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1288	FEMALE	\N	\N	+10000833881288	\N	R083388-1288	D	CLASS_10	\N	\N
5418	STRESS-083388-1289	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1289	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1289	FEMALE	\N	\N	+10000833881289	\N	R083388-1289	C	CLASS_10	\N	\N
5419	STRESS-083388-1290	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1290	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1290	MALE	\N	\N	+10000833881290	\N	R083388-1290	C	CLASS_6	\N	\N
5420	STRESS-083388-1291	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1291	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1291	FEMALE	\N	\N	+10000833881291	\N	R083388-1291	A	CLASS_10	\N	\N
5421	STRESS-083388-1292	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1292	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1292	FEMALE	\N	\N	+10000833881292	\N	R083388-1292	D	CLASS_10	\N	\N
5422	STRESS-083388-1293	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1293	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1293	FEMALE	\N	\N	+10000833881293	\N	R083388-1293	C	CLASS_7	\N	\N
5423	STRESS-083388-1294	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1294	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1294	MALE	\N	\N	+10000833881294	\N	R083388-1294	D	CLASS_9	\N	\N
5424	STRESS-083388-1295	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1295	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1295	MALE	\N	\N	+10000833881295	\N	R083388-1295	D	CLASS_7	\N	\N
5425	STRESS-083388-1296	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1296	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1296	MALE	\N	\N	+10000833881296	\N	R083388-1296	A	CLASS_6	\N	\N
5426	STRESS-083388-1297	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1297	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1297	MALE	\N	\N	+10000833881297	\N	R083388-1297	A	CLASS_8	\N	\N
5427	STRESS-083388-1298	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1298	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1298	FEMALE	\N	\N	+10000833881298	\N	R083388-1298	C	CLASS_8	\N	\N
5428	STRESS-083388-1299	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1299	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1299	MALE	\N	\N	+10000833881299	\N	R083388-1299	C	CLASS_8	\N	\N
5429	STRESS-083388-1300	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1300	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1300	FEMALE	\N	\N	+10000833881300	\N	R083388-1300	B	CLASS_6	\N	\N
5430	STRESS-083388-1301	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1301	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1301	FEMALE	\N	\N	+10000833881301	\N	R083388-1301	C	CLASS_7	\N	\N
5431	STRESS-083388-1302	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1302	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1302	MALE	\N	\N	+10000833881302	\N	R083388-1302	A	CLASS_7	\N	\N
5432	STRESS-083388-1303	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1303	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1303	MALE	\N	\N	+10000833881303	\N	R083388-1303	A	CLASS_8	\N	\N
5433	STRESS-083388-1304	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1304	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1304	MALE	\N	\N	+10000833881304	\N	R083388-1304	C	CLASS_6	\N	\N
5434	STRESS-083388-1305	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1305	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1305	MALE	\N	\N	+10000833881305	\N	R083388-1305	A	CLASS_10	\N	\N
5435	STRESS-083388-1306	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1306	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1306	MALE	\N	\N	+10000833881306	\N	R083388-1306	C	CLASS_8	\N	\N
5436	STRESS-083388-1307	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1307	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1307	FEMALE	\N	\N	+10000833881307	\N	R083388-1307	B	CLASS_7	\N	\N
5437	STRESS-083388-1308	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1308	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1308	FEMALE	\N	\N	+10000833881308	\N	R083388-1308	D	CLASS_7	\N	\N
5438	STRESS-083388-1309	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1309	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1309	MALE	\N	\N	+10000833881309	\N	R083388-1309	D	CLASS_9	\N	\N
5439	STRESS-083388-1310	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1310	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1310	FEMALE	\N	\N	+10000833881310	\N	R083388-1310	C	CLASS_10	\N	\N
5440	STRESS-083388-1311	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1311	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1311	MALE	\N	\N	+10000833881311	\N	R083388-1311	C	CLASS_7	\N	\N
5441	STRESS-083388-1312	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1312	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1312	FEMALE	\N	\N	+10000833881312	\N	R083388-1312	A	CLASS_8	\N	\N
5442	STRESS-083388-1313	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1313	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1313	MALE	\N	\N	+10000833881313	\N	R083388-1313	C	CLASS_7	\N	\N
5443	STRESS-083388-1314	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1314	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1314	FEMALE	\N	\N	+10000833881314	\N	R083388-1314	B	CLASS_8	\N	\N
5444	STRESS-083388-1315	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1315	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1315	FEMALE	\N	\N	+10000833881315	\N	R083388-1315	B	CLASS_9	\N	\N
5445	STRESS-083388-1316	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1316	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1316	MALE	\N	\N	+10000833881316	\N	R083388-1316	D	CLASS_7	\N	\N
5446	STRESS-083388-1317	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1317	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1317	MALE	\N	\N	+10000833881317	\N	R083388-1317	D	CLASS_9	\N	\N
5447	STRESS-083388-1318	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1318	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1318	MALE	\N	\N	+10000833881318	\N	R083388-1318	C	CLASS_6	\N	\N
5448	STRESS-083388-1319	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1319	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1319	MALE	\N	\N	+10000833881319	\N	R083388-1319	B	CLASS_9	\N	\N
5449	STRESS-083388-1320	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1320	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1320	MALE	\N	\N	+10000833881320	\N	R083388-1320	D	CLASS_8	\N	\N
5450	STRESS-083388-1321	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1321	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1321	MALE	\N	\N	+10000833881321	\N	R083388-1321	A	CLASS_9	\N	\N
5451	STRESS-083388-1322	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1322	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1322	FEMALE	\N	\N	+10000833881322	\N	R083388-1322	D	CLASS_6	\N	\N
5452	STRESS-083388-1323	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1323	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1323	MALE	\N	\N	+10000833881323	\N	R083388-1323	C	CLASS_6	\N	\N
5453	STRESS-083388-1324	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1324	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1324	FEMALE	\N	\N	+10000833881324	\N	R083388-1324	D	CLASS_10	\N	\N
5454	STRESS-083388-1325	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1325	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1325	FEMALE	\N	\N	+10000833881325	\N	R083388-1325	A	CLASS_8	\N	\N
5455	STRESS-083388-1326	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1326	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1326	MALE	\N	\N	+10000833881326	\N	R083388-1326	A	CLASS_10	\N	\N
5456	STRESS-083388-1327	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1327	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1327	MALE	\N	\N	+10000833881327	\N	R083388-1327	C	CLASS_10	\N	\N
5457	STRESS-083388-1328	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1328	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1328	MALE	\N	\N	+10000833881328	\N	R083388-1328	A	CLASS_10	\N	\N
5458	STRESS-083388-1329	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1329	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1329	MALE	\N	\N	+10000833881329	\N	R083388-1329	C	CLASS_10	\N	\N
5459	STRESS-083388-1330	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1330	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1330	FEMALE	\N	\N	+10000833881330	\N	R083388-1330	B	CLASS_9	\N	\N
5460	STRESS-083388-1331	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1331	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1331	MALE	\N	\N	+10000833881331	\N	R083388-1331	A	CLASS_10	\N	\N
5461	STRESS-083388-1332	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1332	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1332	MALE	\N	\N	+10000833881332	\N	R083388-1332	A	CLASS_7	\N	\N
5462	STRESS-083388-1333	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1333	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1333	MALE	\N	\N	+10000833881333	\N	R083388-1333	A	CLASS_9	\N	\N
5463	STRESS-083388-1334	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1334	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1334	FEMALE	\N	\N	+10000833881334	\N	R083388-1334	C	CLASS_6	\N	\N
5464	STRESS-083388-1335	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1335	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1335	FEMALE	\N	\N	+10000833881335	\N	R083388-1335	C	CLASS_7	\N	\N
5465	STRESS-083388-1336	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1336	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1336	MALE	\N	\N	+10000833881336	\N	R083388-1336	D	CLASS_8	\N	\N
5466	STRESS-083388-1337	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1337	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1337	FEMALE	\N	\N	+10000833881337	\N	R083388-1337	C	CLASS_9	\N	\N
5467	STRESS-083388-1338	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1338	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1338	MALE	\N	\N	+10000833881338	\N	R083388-1338	D	CLASS_9	\N	\N
5468	STRESS-083388-1339	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1339	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1339	MALE	\N	\N	+10000833881339	\N	R083388-1339	D	CLASS_7	\N	\N
5469	STRESS-083388-1340	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1340	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1340	MALE	\N	\N	+10000833881340	\N	R083388-1340	B	CLASS_8	\N	\N
5470	STRESS-083388-1341	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1341	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1341	FEMALE	\N	\N	+10000833881341	\N	R083388-1341	B	CLASS_6	\N	\N
5471	STRESS-083388-1342	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1342	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1342	MALE	\N	\N	+10000833881342	\N	R083388-1342	B	CLASS_6	\N	\N
5472	STRESS-083388-1343	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1343	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1343	MALE	\N	\N	+10000833881343	\N	R083388-1343	A	CLASS_6	\N	\N
5473	STRESS-083388-1344	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1344	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1344	MALE	\N	\N	+10000833881344	\N	R083388-1344	A	CLASS_9	\N	\N
5474	STRESS-083388-1345	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1345	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1345	MALE	\N	\N	+10000833881345	\N	R083388-1345	D	CLASS_8	\N	\N
5475	STRESS-083388-1346	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1346	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1346	FEMALE	\N	\N	+10000833881346	\N	R083388-1346	D	CLASS_6	\N	\N
5476	STRESS-083388-1347	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1347	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1347	MALE	\N	\N	+10000833881347	\N	R083388-1347	A	CLASS_9	\N	\N
5477	STRESS-083388-1348	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1348	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1348	MALE	\N	\N	+10000833881348	\N	R083388-1348	A	CLASS_10	\N	\N
5478	STRESS-083388-1349	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1349	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1349	MALE	\N	\N	+10000833881349	\N	R083388-1349	A	CLASS_9	\N	\N
5479	STRESS-083388-1350	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1350	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1350	MALE	\N	\N	+10000833881350	\N	R083388-1350	A	CLASS_7	\N	\N
5480	STRESS-083388-1351	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1351	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1351	MALE	\N	\N	+10000833881351	\N	R083388-1351	B	CLASS_8	\N	\N
5481	STRESS-083388-1352	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1352	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1352	FEMALE	\N	\N	+10000833881352	\N	R083388-1352	D	CLASS_10	\N	\N
5482	STRESS-083388-1353	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1353	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1353	MALE	\N	\N	+10000833881353	\N	R083388-1353	A	CLASS_6	\N	\N
5483	STRESS-083388-1354	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1354	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1354	FEMALE	\N	\N	+10000833881354	\N	R083388-1354	B	CLASS_8	\N	\N
5484	STRESS-083388-1355	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1355	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1355	MALE	\N	\N	+10000833881355	\N	R083388-1355	C	CLASS_10	\N	\N
5485	STRESS-083388-1356	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1356	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1356	FEMALE	\N	\N	+10000833881356	\N	R083388-1356	C	CLASS_8	\N	\N
5486	STRESS-083388-1357	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1357	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1357	FEMALE	\N	\N	+10000833881357	\N	R083388-1357	C	CLASS_6	\N	\N
5487	STRESS-083388-1358	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1358	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1358	FEMALE	\N	\N	+10000833881358	\N	R083388-1358	C	CLASS_6	\N	\N
5488	STRESS-083388-1359	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1359	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1359	MALE	\N	\N	+10000833881359	\N	R083388-1359	C	CLASS_7	\N	\N
5489	STRESS-083388-1360	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1360	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1360	MALE	\N	\N	+10000833881360	\N	R083388-1360	A	CLASS_10	\N	\N
5490	STRESS-083388-1361	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1361	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1361	MALE	\N	\N	+10000833881361	\N	R083388-1361	B	CLASS_6	\N	\N
5491	STRESS-083388-1362	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1362	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1362	MALE	\N	\N	+10000833881362	\N	R083388-1362	B	CLASS_9	\N	\N
5492	STRESS-083388-1363	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1363	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1363	FEMALE	\N	\N	+10000833881363	\N	R083388-1363	C	CLASS_6	\N	\N
5493	STRESS-083388-1364	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1364	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1364	MALE	\N	\N	+10000833881364	\N	R083388-1364	A	CLASS_7	\N	\N
5494	STRESS-083388-1365	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1365	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1365	MALE	\N	\N	+10000833881365	\N	R083388-1365	B	CLASS_8	\N	\N
5495	STRESS-083388-1366	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1366	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1366	FEMALE	\N	\N	+10000833881366	\N	R083388-1366	A	CLASS_6	\N	\N
5496	STRESS-083388-1367	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1367	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1367	MALE	\N	\N	+10000833881367	\N	R083388-1367	D	CLASS_8	\N	\N
5497	STRESS-083388-1368	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1368	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1368	MALE	\N	\N	+10000833881368	\N	R083388-1368	B	CLASS_10	\N	\N
5498	STRESS-083388-1369	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1369	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1369	FEMALE	\N	\N	+10000833881369	\N	R083388-1369	A	CLASS_8	\N	\N
5499	STRESS-083388-1370	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1370	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1370	MALE	\N	\N	+10000833881370	\N	R083388-1370	A	CLASS_6	\N	\N
5500	STRESS-083388-1371	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1371	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1371	MALE	\N	\N	+10000833881371	\N	R083388-1371	A	CLASS_9	\N	\N
5501	STRESS-083388-1372	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1372	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1372	FEMALE	\N	\N	+10000833881372	\N	R083388-1372	D	CLASS_6	\N	\N
5502	STRESS-083388-1373	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1373	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1373	FEMALE	\N	\N	+10000833881373	\N	R083388-1373	B	CLASS_7	\N	\N
5503	STRESS-083388-1374	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1374	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1374	MALE	\N	\N	+10000833881374	\N	R083388-1374	D	CLASS_8	\N	\N
5504	STRESS-083388-1375	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1375	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1375	FEMALE	\N	\N	+10000833881375	\N	R083388-1375	D	CLASS_9	\N	\N
5505	STRESS-083388-1376	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1376	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1376	MALE	\N	\N	+10000833881376	\N	R083388-1376	D	CLASS_10	\N	\N
5506	STRESS-083388-1377	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1377	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1377	FEMALE	\N	\N	+10000833881377	\N	R083388-1377	A	CLASS_9	\N	\N
5507	STRESS-083388-1378	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1378	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1378	MALE	\N	\N	+10000833881378	\N	R083388-1378	B	CLASS_6	\N	\N
5508	STRESS-083388-1379	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1379	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1379	MALE	\N	\N	+10000833881379	\N	R083388-1379	A	CLASS_7	\N	\N
5509	STRESS-083388-1380	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1380	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1380	FEMALE	\N	\N	+10000833881380	\N	R083388-1380	D	CLASS_10	\N	\N
5510	STRESS-083388-1381	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1381	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1381	MALE	\N	\N	+10000833881381	\N	R083388-1381	A	CLASS_9	\N	\N
5511	STRESS-083388-1382	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1382	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1382	FEMALE	\N	\N	+10000833881382	\N	R083388-1382	D	CLASS_6	\N	\N
5512	STRESS-083388-1383	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1383	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1383	FEMALE	\N	\N	+10000833881383	\N	R083388-1383	C	CLASS_7	\N	\N
5513	STRESS-083388-1384	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1384	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1384	FEMALE	\N	\N	+10000833881384	\N	R083388-1384	A	CLASS_9	\N	\N
5514	STRESS-083388-1385	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1385	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1385	MALE	\N	\N	+10000833881385	\N	R083388-1385	C	CLASS_7	\N	\N
5515	STRESS-083388-1386	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1386	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1386	FEMALE	\N	\N	+10000833881386	\N	R083388-1386	B	CLASS_6	\N	\N
5516	STRESS-083388-1387	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1387	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1387	FEMALE	\N	\N	+10000833881387	\N	R083388-1387	C	CLASS_6	\N	\N
5517	STRESS-083388-1388	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1388	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1388	FEMALE	\N	\N	+10000833881388	\N	R083388-1388	C	CLASS_8	\N	\N
5518	STRESS-083388-1389	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1389	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1389	MALE	\N	\N	+10000833881389	\N	R083388-1389	C	CLASS_6	\N	\N
5519	STRESS-083388-1390	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1390	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1390	MALE	\N	\N	+10000833881390	\N	R083388-1390	A	CLASS_6	\N	\N
5520	STRESS-083388-1391	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1391	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1391	MALE	\N	\N	+10000833881391	\N	R083388-1391	C	CLASS_7	\N	\N
5521	STRESS-083388-1392	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1392	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1392	FEMALE	\N	\N	+10000833881392	\N	R083388-1392	A	CLASS_6	\N	\N
5522	STRESS-083388-1393	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1393	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1393	FEMALE	\N	\N	+10000833881393	\N	R083388-1393	A	CLASS_9	\N	\N
5523	STRESS-083388-1394	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1394	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1394	MALE	\N	\N	+10000833881394	\N	R083388-1394	B	CLASS_6	\N	\N
5524	STRESS-083388-1395	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1395	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1395	FEMALE	\N	\N	+10000833881395	\N	R083388-1395	A	CLASS_8	\N	\N
5525	STRESS-083388-1396	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1396	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1396	FEMALE	\N	\N	+10000833881396	\N	R083388-1396	C	CLASS_8	\N	\N
5526	STRESS-083388-1397	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1397	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1397	MALE	\N	\N	+10000833881397	\N	R083388-1397	C	CLASS_9	\N	\N
5527	STRESS-083388-1398	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1398	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1398	MALE	\N	\N	+10000833881398	\N	R083388-1398	A	CLASS_8	\N	\N
5528	STRESS-083388-1399	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1399	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1399	FEMALE	\N	\N	+10000833881399	\N	R083388-1399	B	CLASS_6	\N	\N
5529	STRESS-083388-1400	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1400	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1400	MALE	\N	\N	+10000833881400	\N	R083388-1400	C	CLASS_6	\N	\N
5530	STRESS-083388-1401	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1401	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1401	FEMALE	\N	\N	+10000833881401	\N	R083388-1401	A	CLASS_6	\N	\N
5531	STRESS-083388-1402	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1402	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1402	MALE	\N	\N	+10000833881402	\N	R083388-1402	D	CLASS_9	\N	\N
5532	STRESS-083388-1403	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1403	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1403	MALE	\N	\N	+10000833881403	\N	R083388-1403	B	CLASS_8	\N	\N
5533	STRESS-083388-1404	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1404	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1404	MALE	\N	\N	+10000833881404	\N	R083388-1404	B	CLASS_8	\N	\N
5534	STRESS-083388-1405	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1405	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1405	FEMALE	\N	\N	+10000833881405	\N	R083388-1405	D	CLASS_9	\N	\N
5535	STRESS-083388-1406	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1406	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1406	FEMALE	\N	\N	+10000833881406	\N	R083388-1406	A	CLASS_7	\N	\N
5536	STRESS-083388-1407	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1407	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1407	FEMALE	\N	\N	+10000833881407	\N	R083388-1407	A	CLASS_8	\N	\N
5537	STRESS-083388-1408	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1408	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1408	FEMALE	\N	\N	+10000833881408	\N	R083388-1408	A	CLASS_6	\N	\N
5538	STRESS-083388-1409	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1409	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1409	FEMALE	\N	\N	+10000833881409	\N	R083388-1409	D	CLASS_10	\N	\N
5539	STRESS-083388-1410	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1410	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1410	FEMALE	\N	\N	+10000833881410	\N	R083388-1410	C	CLASS_8	\N	\N
5540	STRESS-083388-1411	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1411	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1411	MALE	\N	\N	+10000833881411	\N	R083388-1411	B	CLASS_7	\N	\N
5541	STRESS-083388-1412	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1412	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1412	MALE	\N	\N	+10000833881412	\N	R083388-1412	C	CLASS_9	\N	\N
5542	STRESS-083388-1413	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1413	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1413	FEMALE	\N	\N	+10000833881413	\N	R083388-1413	C	CLASS_7	\N	\N
5543	STRESS-083388-1414	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1414	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1414	MALE	\N	\N	+10000833881414	\N	R083388-1414	D	CLASS_8	\N	\N
5544	STRESS-083388-1415	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1415	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1415	MALE	\N	\N	+10000833881415	\N	R083388-1415	D	CLASS_9	\N	\N
5545	STRESS-083388-1416	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1416	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1416	MALE	\N	\N	+10000833881416	\N	R083388-1416	D	CLASS_6	\N	\N
5546	STRESS-083388-1417	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1417	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1417	MALE	\N	\N	+10000833881417	\N	R083388-1417	D	CLASS_6	\N	\N
5547	STRESS-083388-1418	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1418	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1418	MALE	\N	\N	+10000833881418	\N	R083388-1418	C	CLASS_6	\N	\N
5548	STRESS-083388-1419	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1419	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1419	FEMALE	\N	\N	+10000833881419	\N	R083388-1419	D	CLASS_8	\N	\N
5549	STRESS-083388-1420	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1420	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1420	MALE	\N	\N	+10000833881420	\N	R083388-1420	A	CLASS_8	\N	\N
5550	STRESS-083388-1421	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1421	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1421	MALE	\N	\N	+10000833881421	\N	R083388-1421	B	CLASS_6	\N	\N
5551	STRESS-083388-1422	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1422	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1422	FEMALE	\N	\N	+10000833881422	\N	R083388-1422	C	CLASS_7	\N	\N
5552	STRESS-083388-1423	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1423	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1423	MALE	\N	\N	+10000833881423	\N	R083388-1423	C	CLASS_9	\N	\N
5553	STRESS-083388-1424	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1424	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1424	MALE	\N	\N	+10000833881424	\N	R083388-1424	A	CLASS_10	\N	\N
5554	STRESS-083388-1425	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1425	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1425	FEMALE	\N	\N	+10000833881425	\N	R083388-1425	A	CLASS_9	\N	\N
5555	STRESS-083388-1426	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1426	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1426	MALE	\N	\N	+10000833881426	\N	R083388-1426	C	CLASS_10	\N	\N
5556	STRESS-083388-1427	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1427	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1427	FEMALE	\N	\N	+10000833881427	\N	R083388-1427	B	CLASS_9	\N	\N
5557	STRESS-083388-1428	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1428	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1428	MALE	\N	\N	+10000833881428	\N	R083388-1428	C	CLASS_9	\N	\N
5558	STRESS-083388-1429	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1429	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1429	FEMALE	\N	\N	+10000833881429	\N	R083388-1429	D	CLASS_9	\N	\N
5559	STRESS-083388-1430	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1430	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1430	FEMALE	\N	\N	+10000833881430	\N	R083388-1430	B	CLASS_10	\N	\N
5560	STRESS-083388-1431	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1431	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1431	MALE	\N	\N	+10000833881431	\N	R083388-1431	B	CLASS_7	\N	\N
5561	STRESS-083388-1432	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1432	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1432	FEMALE	\N	\N	+10000833881432	\N	R083388-1432	A	CLASS_10	\N	\N
5562	STRESS-083388-1433	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1433	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1433	FEMALE	\N	\N	+10000833881433	\N	R083388-1433	C	CLASS_10	\N	\N
5563	STRESS-083388-1434	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1434	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1434	FEMALE	\N	\N	+10000833881434	\N	R083388-1434	D	CLASS_9	\N	\N
5564	STRESS-083388-1435	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1435	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1435	MALE	\N	\N	+10000833881435	\N	R083388-1435	B	CLASS_10	\N	\N
5565	STRESS-083388-1436	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1436	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1436	FEMALE	\N	\N	+10000833881436	\N	R083388-1436	B	CLASS_10	\N	\N
5566	STRESS-083388-1437	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1437	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1437	MALE	\N	\N	+10000833881437	\N	R083388-1437	B	CLASS_6	\N	\N
5567	STRESS-083388-1438	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1438	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1438	FEMALE	\N	\N	+10000833881438	\N	R083388-1438	B	CLASS_9	\N	\N
5568	STRESS-083388-1439	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1439	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1439	FEMALE	\N	\N	+10000833881439	\N	R083388-1439	D	CLASS_10	\N	\N
5569	STRESS-083388-1440	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1440	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1440	MALE	\N	\N	+10000833881440	\N	R083388-1440	B	CLASS_7	\N	\N
5570	STRESS-083388-1441	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1441	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1441	FEMALE	\N	\N	+10000833881441	\N	R083388-1441	C	CLASS_6	\N	\N
5571	STRESS-083388-1442	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1442	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1442	MALE	\N	\N	+10000833881442	\N	R083388-1442	B	CLASS_6	\N	\N
5572	STRESS-083388-1443	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1443	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1443	FEMALE	\N	\N	+10000833881443	\N	R083388-1443	C	CLASS_10	\N	\N
5573	STRESS-083388-1444	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1444	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1444	MALE	\N	\N	+10000833881444	\N	R083388-1444	C	CLASS_10	\N	\N
5574	STRESS-083388-1445	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1445	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1445	MALE	\N	\N	+10000833881445	\N	R083388-1445	B	CLASS_7	\N	\N
5575	STRESS-083388-1446	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1446	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1446	FEMALE	\N	\N	+10000833881446	\N	R083388-1446	B	CLASS_9	\N	\N
5576	STRESS-083388-1447	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1447	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1447	MALE	\N	\N	+10000833881447	\N	R083388-1447	A	CLASS_10	\N	\N
5577	STRESS-083388-1448	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1448	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1448	MALE	\N	\N	+10000833881448	\N	R083388-1448	B	CLASS_6	\N	\N
5578	STRESS-083388-1449	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1449	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1449	FEMALE	\N	\N	+10000833881449	\N	R083388-1449	D	CLASS_7	\N	\N
5579	STRESS-083388-1450	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1450	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1450	MALE	\N	\N	+10000833881450	\N	R083388-1450	C	CLASS_8	\N	\N
5580	STRESS-083388-1451	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1451	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1451	MALE	\N	\N	+10000833881451	\N	R083388-1451	B	CLASS_7	\N	\N
5581	STRESS-083388-1452	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1452	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1452	FEMALE	\N	\N	+10000833881452	\N	R083388-1452	D	CLASS_9	\N	\N
5582	STRESS-083388-1453	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1453	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1453	MALE	\N	\N	+10000833881453	\N	R083388-1453	B	CLASS_10	\N	\N
5583	STRESS-083388-1454	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1454	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1454	MALE	\N	\N	+10000833881454	\N	R083388-1454	B	CLASS_7	\N	\N
5584	STRESS-083388-1455	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1455	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1455	MALE	\N	\N	+10000833881455	\N	R083388-1455	A	CLASS_9	\N	\N
5585	STRESS-083388-1456	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1456	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1456	FEMALE	\N	\N	+10000833881456	\N	R083388-1456	B	CLASS_7	\N	\N
5586	STRESS-083388-1457	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1457	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1457	FEMALE	\N	\N	+10000833881457	\N	R083388-1457	B	CLASS_9	\N	\N
5587	STRESS-083388-1458	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1458	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1458	FEMALE	\N	\N	+10000833881458	\N	R083388-1458	A	CLASS_6	\N	\N
5588	STRESS-083388-1459	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1459	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1459	MALE	\N	\N	+10000833881459	\N	R083388-1459	C	CLASS_10	\N	\N
5589	STRESS-083388-1460	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1460	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1460	FEMALE	\N	\N	+10000833881460	\N	R083388-1460	D	CLASS_6	\N	\N
5590	STRESS-083388-1461	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1461	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1461	MALE	\N	\N	+10000833881461	\N	R083388-1461	D	CLASS_6	\N	\N
5591	STRESS-083388-1462	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1462	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1462	FEMALE	\N	\N	+10000833881462	\N	R083388-1462	C	CLASS_8	\N	\N
5592	STRESS-083388-1463	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1463	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1463	MALE	\N	\N	+10000833881463	\N	R083388-1463	B	CLASS_9	\N	\N
5593	STRESS-083388-1464	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1464	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1464	FEMALE	\N	\N	+10000833881464	\N	R083388-1464	C	CLASS_8	\N	\N
5594	STRESS-083388-1465	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1465	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1465	FEMALE	\N	\N	+10000833881465	\N	R083388-1465	C	CLASS_10	\N	\N
5595	STRESS-083388-1466	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1466	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1466	MALE	\N	\N	+10000833881466	\N	R083388-1466	C	CLASS_8	\N	\N
5596	STRESS-083388-1467	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1467	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1467	MALE	\N	\N	+10000833881467	\N	R083388-1467	D	CLASS_6	\N	\N
5597	STRESS-083388-1468	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1468	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1468	FEMALE	\N	\N	+10000833881468	\N	R083388-1468	A	CLASS_6	\N	\N
5598	STRESS-083388-1469	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1469	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1469	FEMALE	\N	\N	+10000833881469	\N	R083388-1469	D	CLASS_7	\N	\N
5599	STRESS-083388-1470	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1470	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1470	MALE	\N	\N	+10000833881470	\N	R083388-1470	D	CLASS_10	\N	\N
5600	STRESS-083388-1471	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1471	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1471	FEMALE	\N	\N	+10000833881471	\N	R083388-1471	D	CLASS_6	\N	\N
5601	STRESS-083388-1472	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1472	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1472	FEMALE	\N	\N	+10000833881472	\N	R083388-1472	B	CLASS_7	\N	\N
5602	STRESS-083388-1473	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1473	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1473	MALE	\N	\N	+10000833881473	\N	R083388-1473	D	CLASS_9	\N	\N
5603	STRESS-083388-1474	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1474	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1474	FEMALE	\N	\N	+10000833881474	\N	R083388-1474	C	CLASS_10	\N	\N
5604	STRESS-083388-1475	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1475	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1475	FEMALE	\N	\N	+10000833881475	\N	R083388-1475	A	CLASS_9	\N	\N
5605	STRESS-083388-1476	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1476	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1476	MALE	\N	\N	+10000833881476	\N	R083388-1476	B	CLASS_10	\N	\N
5606	STRESS-083388-1477	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1477	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1477	MALE	\N	\N	+10000833881477	\N	R083388-1477	C	CLASS_10	\N	\N
5607	STRESS-083388-1478	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1478	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1478	FEMALE	\N	\N	+10000833881478	\N	R083388-1478	B	CLASS_7	\N	\N
5608	STRESS-083388-1479	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1479	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1479	MALE	\N	\N	+10000833881479	\N	R083388-1479	A	CLASS_6	\N	\N
5609	STRESS-083388-1480	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1480	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1480	FEMALE	\N	\N	+10000833881480	\N	R083388-1480	A	CLASS_8	\N	\N
5610	STRESS-083388-1481	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1481	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1481	MALE	\N	\N	+10000833881481	\N	R083388-1481	B	CLASS_8	\N	\N
5611	STRESS-083388-1482	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1482	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1482	MALE	\N	\N	+10000833881482	\N	R083388-1482	B	CLASS_7	\N	\N
5612	STRESS-083388-1483	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1483	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1483	FEMALE	\N	\N	+10000833881483	\N	R083388-1483	A	CLASS_6	\N	\N
5613	STRESS-083388-1484	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1484	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1484	MALE	\N	\N	+10000833881484	\N	R083388-1484	A	CLASS_10	\N	\N
5614	STRESS-083388-1485	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1485	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1485	FEMALE	\N	\N	+10000833881485	\N	R083388-1485	C	CLASS_7	\N	\N
5615	STRESS-083388-1486	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1486	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1486	MALE	\N	\N	+10000833881486	\N	R083388-1486	D	CLASS_10	\N	\N
5616	STRESS-083388-1487	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1487	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1487	MALE	\N	\N	+10000833881487	\N	R083388-1487	B	CLASS_8	\N	\N
5617	STRESS-083388-1488	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1488	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1488	MALE	\N	\N	+10000833881488	\N	R083388-1488	C	CLASS_7	\N	\N
5618	STRESS-083388-1489	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1489	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1489	FEMALE	\N	\N	+10000833881489	\N	R083388-1489	C	CLASS_9	\N	\N
5619	STRESS-083388-1490	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1490	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1490	MALE	\N	\N	+10000833881490	\N	R083388-1490	D	CLASS_6	\N	\N
5620	STRESS-083388-1491	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1491	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1491	MALE	\N	\N	+10000833881491	\N	R083388-1491	C	CLASS_8	\N	\N
5621	STRESS-083388-1492	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1492	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1492	MALE	\N	\N	+10000833881492	\N	R083388-1492	D	CLASS_10	\N	\N
5622	STRESS-083388-1493	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1493	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1493	MALE	\N	\N	+10000833881493	\N	R083388-1493	C	CLASS_8	\N	\N
5623	STRESS-083388-1494	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1494	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1494	MALE	\N	\N	+10000833881494	\N	R083388-1494	A	CLASS_9	\N	\N
5624	STRESS-083388-1495	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1495	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1495	FEMALE	\N	\N	+10000833881495	\N	R083388-1495	B	CLASS_7	\N	\N
5625	STRESS-083388-1496	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1496	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1496	FEMALE	\N	\N	+10000833881496	\N	R083388-1496	B	CLASS_10	\N	\N
5626	STRESS-083388-1497	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1497	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1497	FEMALE	\N	\N	+10000833881497	\N	R083388-1497	D	CLASS_9	\N	\N
5627	STRESS-083388-1498	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1498	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1498	MALE	\N	\N	+10000833881498	\N	R083388-1498	D	CLASS_8	\N	\N
5628	STRESS-083388-1499	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1499	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1499	MALE	\N	\N	+10000833881499	\N	R083388-1499	C	CLASS_6	\N	\N
5629	STRESS-083388-1500	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1500	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1500	FEMALE	\N	\N	+10000833881500	\N	R083388-1500	D	CLASS_8	\N	\N
5630	STRESS-083388-1501	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1501	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1501	FEMALE	\N	\N	+10000833881501	\N	R083388-1501	C	CLASS_10	\N	\N
5631	STRESS-083388-1502	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1502	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1502	MALE	\N	\N	+10000833881502	\N	R083388-1502	B	CLASS_6	\N	\N
5632	STRESS-083388-1503	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1503	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1503	FEMALE	\N	\N	+10000833881503	\N	R083388-1503	A	CLASS_7	\N	\N
5633	STRESS-083388-1504	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1504	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1504	MALE	\N	\N	+10000833881504	\N	R083388-1504	D	CLASS_9	\N	\N
5634	STRESS-083388-1505	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1505	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1505	FEMALE	\N	\N	+10000833881505	\N	R083388-1505	B	CLASS_7	\N	\N
5635	STRESS-083388-1506	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1506	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1506	MALE	\N	\N	+10000833881506	\N	R083388-1506	A	CLASS_6	\N	\N
5636	STRESS-083388-1507	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1507	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1507	FEMALE	\N	\N	+10000833881507	\N	R083388-1507	D	CLASS_8	\N	\N
5637	STRESS-083388-1508	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1508	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1508	MALE	\N	\N	+10000833881508	\N	R083388-1508	D	CLASS_7	\N	\N
5638	STRESS-083388-1509	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1509	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1509	FEMALE	\N	\N	+10000833881509	\N	R083388-1509	D	CLASS_9	\N	\N
5639	STRESS-083388-1510	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1510	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1510	MALE	\N	\N	+10000833881510	\N	R083388-1510	D	CLASS_7	\N	\N
5640	STRESS-083388-1511	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1511	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1511	MALE	\N	\N	+10000833881511	\N	R083388-1511	A	CLASS_7	\N	\N
5641	STRESS-083388-1512	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1512	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1512	MALE	\N	\N	+10000833881512	\N	R083388-1512	B	CLASS_6	\N	\N
5642	STRESS-083388-1513	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1513	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1513	MALE	\N	\N	+10000833881513	\N	R083388-1513	B	CLASS_7	\N	\N
5643	STRESS-083388-1514	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1514	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1514	MALE	\N	\N	+10000833881514	\N	R083388-1514	A	CLASS_6	\N	\N
5644	STRESS-083388-1515	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1515	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1515	MALE	\N	\N	+10000833881515	\N	R083388-1515	A	CLASS_10	\N	\N
5645	STRESS-083388-1516	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1516	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1516	MALE	\N	\N	+10000833881516	\N	R083388-1516	B	CLASS_7	\N	\N
5646	STRESS-083388-1517	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1517	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1517	MALE	\N	\N	+10000833881517	\N	R083388-1517	B	CLASS_6	\N	\N
5647	STRESS-083388-1518	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1518	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1518	MALE	\N	\N	+10000833881518	\N	R083388-1518	D	CLASS_10	\N	\N
5648	STRESS-083388-1519	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1519	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1519	MALE	\N	\N	+10000833881519	\N	R083388-1519	D	CLASS_6	\N	\N
5649	STRESS-083388-1520	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1520	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1520	MALE	\N	\N	+10000833881520	\N	R083388-1520	B	CLASS_7	\N	\N
5650	STRESS-083388-1521	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1521	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1521	FEMALE	\N	\N	+10000833881521	\N	R083388-1521	A	CLASS_10	\N	\N
5651	STRESS-083388-1522	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1522	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1522	FEMALE	\N	\N	+10000833881522	\N	R083388-1522	B	CLASS_6	\N	\N
5652	STRESS-083388-1523	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1523	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1523	FEMALE	\N	\N	+10000833881523	\N	R083388-1523	C	CLASS_7	\N	\N
5653	STRESS-083388-1524	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1524	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1524	MALE	\N	\N	+10000833881524	\N	R083388-1524	C	CLASS_9	\N	\N
5654	STRESS-083388-1525	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1525	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1525	MALE	\N	\N	+10000833881525	\N	R083388-1525	B	CLASS_8	\N	\N
5655	STRESS-083388-1526	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1526	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1526	FEMALE	\N	\N	+10000833881526	\N	R083388-1526	C	CLASS_9	\N	\N
5656	STRESS-083388-1527	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1527	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1527	FEMALE	\N	\N	+10000833881527	\N	R083388-1527	D	CLASS_9	\N	\N
5657	STRESS-083388-1528	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1528	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1528	MALE	\N	\N	+10000833881528	\N	R083388-1528	A	CLASS_10	\N	\N
5658	STRESS-083388-1529	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1529	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1529	MALE	\N	\N	+10000833881529	\N	R083388-1529	B	CLASS_10	\N	\N
5659	STRESS-083388-1530	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1530	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1530	MALE	\N	\N	+10000833881530	\N	R083388-1530	D	CLASS_7	\N	\N
5660	STRESS-083388-1531	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1531	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1531	FEMALE	\N	\N	+10000833881531	\N	R083388-1531	A	CLASS_6	\N	\N
5661	STRESS-083388-1532	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1532	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1532	FEMALE	\N	\N	+10000833881532	\N	R083388-1532	D	CLASS_6	\N	\N
5662	STRESS-083388-1533	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1533	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1533	FEMALE	\N	\N	+10000833881533	\N	R083388-1533	C	CLASS_6	\N	\N
5663	STRESS-083388-1534	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1534	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1534	FEMALE	\N	\N	+10000833881534	\N	R083388-1534	C	CLASS_10	\N	\N
5664	STRESS-083388-1535	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1535	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1535	MALE	\N	\N	+10000833881535	\N	R083388-1535	C	CLASS_8	\N	\N
5665	STRESS-083388-1536	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1536	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1536	FEMALE	\N	\N	+10000833881536	\N	R083388-1536	B	CLASS_7	\N	\N
5666	STRESS-083388-1537	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1537	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1537	MALE	\N	\N	+10000833881537	\N	R083388-1537	C	CLASS_9	\N	\N
5667	STRESS-083388-1538	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1538	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1538	MALE	\N	\N	+10000833881538	\N	R083388-1538	B	CLASS_6	\N	\N
5668	STRESS-083388-1539	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1539	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1539	MALE	\N	\N	+10000833881539	\N	R083388-1539	D	CLASS_9	\N	\N
5669	STRESS-083388-1540	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1540	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1540	FEMALE	\N	\N	+10000833881540	\N	R083388-1540	C	CLASS_9	\N	\N
5670	STRESS-083388-1541	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1541	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1541	FEMALE	\N	\N	+10000833881541	\N	R083388-1541	C	CLASS_10	\N	\N
5671	STRESS-083388-1542	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1542	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1542	FEMALE	\N	\N	+10000833881542	\N	R083388-1542	D	CLASS_6	\N	\N
5672	STRESS-083388-1543	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1543	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1543	MALE	\N	\N	+10000833881543	\N	R083388-1543	B	CLASS_8	\N	\N
5673	STRESS-083388-1544	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1544	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1544	MALE	\N	\N	+10000833881544	\N	R083388-1544	B	CLASS_6	\N	\N
5674	STRESS-083388-1545	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1545	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1545	FEMALE	\N	\N	+10000833881545	\N	R083388-1545	B	CLASS_9	\N	\N
5675	STRESS-083388-1546	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1546	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1546	FEMALE	\N	\N	+10000833881546	\N	R083388-1546	A	CLASS_9	\N	\N
5676	STRESS-083388-1547	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1547	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1547	FEMALE	\N	\N	+10000833881547	\N	R083388-1547	A	CLASS_7	\N	\N
5677	STRESS-083388-1548	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1548	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1548	MALE	\N	\N	+10000833881548	\N	R083388-1548	A	CLASS_10	\N	\N
5678	STRESS-083388-1549	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1549	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1549	MALE	\N	\N	+10000833881549	\N	R083388-1549	D	CLASS_6	\N	\N
5679	STRESS-083388-1550	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1550	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1550	FEMALE	\N	\N	+10000833881550	\N	R083388-1550	D	CLASS_10	\N	\N
5680	STRESS-083388-1551	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1551	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1551	MALE	\N	\N	+10000833881551	\N	R083388-1551	D	CLASS_9	\N	\N
5681	STRESS-083388-1552	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1552	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1552	FEMALE	\N	\N	+10000833881552	\N	R083388-1552	A	CLASS_9	\N	\N
5682	STRESS-083388-1553	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1553	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1553	FEMALE	\N	\N	+10000833881553	\N	R083388-1553	C	CLASS_10	\N	\N
5683	STRESS-083388-1554	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1554	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1554	FEMALE	\N	\N	+10000833881554	\N	R083388-1554	C	CLASS_7	\N	\N
5684	STRESS-083388-1555	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1555	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1555	MALE	\N	\N	+10000833881555	\N	R083388-1555	C	CLASS_7	\N	\N
5685	STRESS-083388-1556	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1556	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1556	MALE	\N	\N	+10000833881556	\N	R083388-1556	A	CLASS_8	\N	\N
5686	STRESS-083388-1557	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1557	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1557	FEMALE	\N	\N	+10000833881557	\N	R083388-1557	B	CLASS_9	\N	\N
5687	STRESS-083388-1558	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1558	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1558	FEMALE	\N	\N	+10000833881558	\N	R083388-1558	B	CLASS_8	\N	\N
5688	STRESS-083388-1559	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1559	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1559	MALE	\N	\N	+10000833881559	\N	R083388-1559	D	CLASS_6	\N	\N
5689	STRESS-083388-1560	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1560	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1560	MALE	\N	\N	+10000833881560	\N	R083388-1560	D	CLASS_10	\N	\N
5690	STRESS-083388-1561	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1561	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1561	MALE	\N	\N	+10000833881561	\N	R083388-1561	A	CLASS_10	\N	\N
5691	STRESS-083388-1562	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1562	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1562	FEMALE	\N	\N	+10000833881562	\N	R083388-1562	C	CLASS_10	\N	\N
5692	STRESS-083388-1563	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1563	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1563	FEMALE	\N	\N	+10000833881563	\N	R083388-1563	B	CLASS_7	\N	\N
5693	STRESS-083388-1564	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1564	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1564	FEMALE	\N	\N	+10000833881564	\N	R083388-1564	A	CLASS_8	\N	\N
5694	STRESS-083388-1565	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1565	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1565	MALE	\N	\N	+10000833881565	\N	R083388-1565	D	CLASS_9	\N	\N
5695	STRESS-083388-1566	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1566	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1566	MALE	\N	\N	+10000833881566	\N	R083388-1566	A	CLASS_10	\N	\N
5696	STRESS-083388-1567	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1567	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1567	FEMALE	\N	\N	+10000833881567	\N	R083388-1567	B	CLASS_7	\N	\N
5697	STRESS-083388-1568	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1568	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1568	FEMALE	\N	\N	+10000833881568	\N	R083388-1568	A	CLASS_6	\N	\N
5698	STRESS-083388-1569	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1569	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1569	MALE	\N	\N	+10000833881569	\N	R083388-1569	C	CLASS_7	\N	\N
5699	STRESS-083388-1570	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1570	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1570	MALE	\N	\N	+10000833881570	\N	R083388-1570	B	CLASS_6	\N	\N
5700	STRESS-083388-1571	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1571	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1571	MALE	\N	\N	+10000833881571	\N	R083388-1571	C	CLASS_7	\N	\N
5701	STRESS-083388-1572	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1572	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1572	FEMALE	\N	\N	+10000833881572	\N	R083388-1572	D	CLASS_7	\N	\N
5702	STRESS-083388-1573	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1573	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1573	FEMALE	\N	\N	+10000833881573	\N	R083388-1573	B	CLASS_6	\N	\N
5703	STRESS-083388-1574	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1574	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1574	FEMALE	\N	\N	+10000833881574	\N	R083388-1574	D	CLASS_8	\N	\N
5704	STRESS-083388-1575	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1575	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1575	MALE	\N	\N	+10000833881575	\N	R083388-1575	C	CLASS_7	\N	\N
5705	STRESS-083388-1576	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1576	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1576	FEMALE	\N	\N	+10000833881576	\N	R083388-1576	B	CLASS_6	\N	\N
5706	STRESS-083388-1577	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1577	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1577	FEMALE	\N	\N	+10000833881577	\N	R083388-1577	B	CLASS_7	\N	\N
5707	STRESS-083388-1578	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1578	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1578	FEMALE	\N	\N	+10000833881578	\N	R083388-1578	C	CLASS_10	\N	\N
5708	STRESS-083388-1579	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1579	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1579	FEMALE	\N	\N	+10000833881579	\N	R083388-1579	B	CLASS_7	\N	\N
5709	STRESS-083388-1580	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1580	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1580	MALE	\N	\N	+10000833881580	\N	R083388-1580	D	CLASS_6	\N	\N
5710	STRESS-083388-1581	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1581	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1581	FEMALE	\N	\N	+10000833881581	\N	R083388-1581	B	CLASS_7	\N	\N
5711	STRESS-083388-1582	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1582	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1582	FEMALE	\N	\N	+10000833881582	\N	R083388-1582	C	CLASS_10	\N	\N
5712	STRESS-083388-1583	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1583	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1583	MALE	\N	\N	+10000833881583	\N	R083388-1583	A	CLASS_9	\N	\N
5713	STRESS-083388-1584	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1584	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1584	FEMALE	\N	\N	+10000833881584	\N	R083388-1584	C	CLASS_8	\N	\N
5714	STRESS-083388-1585	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1585	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1585	FEMALE	\N	\N	+10000833881585	\N	R083388-1585	A	CLASS_7	\N	\N
5715	STRESS-083388-1586	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1586	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1586	FEMALE	\N	\N	+10000833881586	\N	R083388-1586	D	CLASS_10	\N	\N
5716	STRESS-083388-1587	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1587	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1587	FEMALE	\N	\N	+10000833881587	\N	R083388-1587	C	CLASS_8	\N	\N
5717	STRESS-083388-1588	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1588	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1588	FEMALE	\N	\N	+10000833881588	\N	R083388-1588	D	CLASS_8	\N	\N
5718	STRESS-083388-1589	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1589	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1589	MALE	\N	\N	+10000833881589	\N	R083388-1589	B	CLASS_7	\N	\N
5719	STRESS-083388-1590	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1590	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1590	MALE	\N	\N	+10000833881590	\N	R083388-1590	B	CLASS_6	\N	\N
5720	STRESS-083388-1591	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1591	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1591	MALE	\N	\N	+10000833881591	\N	R083388-1591	B	CLASS_9	\N	\N
5721	STRESS-083388-1592	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1592	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1592	MALE	\N	\N	+10000833881592	\N	R083388-1592	D	CLASS_6	\N	\N
5722	STRESS-083388-1593	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1593	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1593	MALE	\N	\N	+10000833881593	\N	R083388-1593	A	CLASS_6	\N	\N
5723	STRESS-083388-1594	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1594	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1594	FEMALE	\N	\N	+10000833881594	\N	R083388-1594	C	CLASS_6	\N	\N
5724	STRESS-083388-1595	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1595	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1595	MALE	\N	\N	+10000833881595	\N	R083388-1595	B	CLASS_10	\N	\N
5725	STRESS-083388-1596	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1596	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1596	FEMALE	\N	\N	+10000833881596	\N	R083388-1596	C	CLASS_7	\N	\N
5726	STRESS-083388-1597	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1597	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1597	MALE	\N	\N	+10000833881597	\N	R083388-1597	B	CLASS_10	\N	\N
5727	STRESS-083388-1598	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1598	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1598	FEMALE	\N	\N	+10000833881598	\N	R083388-1598	D	CLASS_6	\N	\N
5728	STRESS-083388-1599	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1599	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1599	FEMALE	\N	\N	+10000833881599	\N	R083388-1599	B	CLASS_6	\N	\N
5729	STRESS-083388-1600	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1600	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1600	FEMALE	\N	\N	+10000833881600	\N	R083388-1600	C	CLASS_9	\N	\N
5730	STRESS-083388-1601	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1601	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1601	FEMALE	\N	\N	+10000833881601	\N	R083388-1601	A	CLASS_6	\N	\N
5731	STRESS-083388-1602	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1602	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1602	FEMALE	\N	\N	+10000833881602	\N	R083388-1602	A	CLASS_10	\N	\N
5732	STRESS-083388-1603	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1603	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1603	FEMALE	\N	\N	+10000833881603	\N	R083388-1603	D	CLASS_9	\N	\N
5733	STRESS-083388-1604	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1604	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1604	MALE	\N	\N	+10000833881604	\N	R083388-1604	D	CLASS_9	\N	\N
5734	STRESS-083388-1605	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1605	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1605	MALE	\N	\N	+10000833881605	\N	R083388-1605	A	CLASS_10	\N	\N
5735	STRESS-083388-1606	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1606	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1606	MALE	\N	\N	+10000833881606	\N	R083388-1606	B	CLASS_10	\N	\N
5736	STRESS-083388-1607	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1607	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1607	MALE	\N	\N	+10000833881607	\N	R083388-1607	A	CLASS_9	\N	\N
5737	STRESS-083388-1608	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1608	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1608	MALE	\N	\N	+10000833881608	\N	R083388-1608	A	CLASS_8	\N	\N
5738	STRESS-083388-1609	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1609	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1609	MALE	\N	\N	+10000833881609	\N	R083388-1609	B	CLASS_9	\N	\N
5739	STRESS-083388-1610	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1610	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1610	MALE	\N	\N	+10000833881610	\N	R083388-1610	C	CLASS_8	\N	\N
5740	STRESS-083388-1611	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1611	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1611	MALE	\N	\N	+10000833881611	\N	R083388-1611	D	CLASS_10	\N	\N
5741	STRESS-083388-1612	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1612	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1612	MALE	\N	\N	+10000833881612	\N	R083388-1612	D	CLASS_9	\N	\N
5742	STRESS-083388-1613	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1613	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1613	MALE	\N	\N	+10000833881613	\N	R083388-1613	C	CLASS_8	\N	\N
5743	STRESS-083388-1614	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1614	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1614	MALE	\N	\N	+10000833881614	\N	R083388-1614	C	CLASS_8	\N	\N
5744	STRESS-083388-1615	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1615	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1615	MALE	\N	\N	+10000833881615	\N	R083388-1615	A	CLASS_10	\N	\N
5745	STRESS-083388-1616	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1616	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1616	FEMALE	\N	\N	+10000833881616	\N	R083388-1616	C	CLASS_7	\N	\N
5746	STRESS-083388-1617	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1617	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1617	FEMALE	\N	\N	+10000833881617	\N	R083388-1617	D	CLASS_7	\N	\N
5747	STRESS-083388-1618	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1618	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1618	FEMALE	\N	\N	+10000833881618	\N	R083388-1618	C	CLASS_8	\N	\N
5748	STRESS-083388-1619	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1619	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1619	FEMALE	\N	\N	+10000833881619	\N	R083388-1619	A	CLASS_7	\N	\N
5749	STRESS-083388-1620	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1620	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1620	MALE	\N	\N	+10000833881620	\N	R083388-1620	B	CLASS_10	\N	\N
5750	STRESS-083388-1621	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1621	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1621	MALE	\N	\N	+10000833881621	\N	R083388-1621	C	CLASS_10	\N	\N
5751	STRESS-083388-1622	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1622	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1622	FEMALE	\N	\N	+10000833881622	\N	R083388-1622	D	CLASS_9	\N	\N
5752	STRESS-083388-1623	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1623	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1623	MALE	\N	\N	+10000833881623	\N	R083388-1623	A	CLASS_6	\N	\N
5753	STRESS-083388-1624	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1624	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1624	FEMALE	\N	\N	+10000833881624	\N	R083388-1624	D	CLASS_9	\N	\N
5754	STRESS-083388-1625	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1625	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1625	FEMALE	\N	\N	+10000833881625	\N	R083388-1625	A	CLASS_6	\N	\N
5755	STRESS-083388-1626	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1626	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1626	FEMALE	\N	\N	+10000833881626	\N	R083388-1626	A	CLASS_10	\N	\N
5756	STRESS-083388-1627	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1627	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1627	FEMALE	\N	\N	+10000833881627	\N	R083388-1627	A	CLASS_6	\N	\N
5757	STRESS-083388-1628	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1628	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1628	FEMALE	\N	\N	+10000833881628	\N	R083388-1628	B	CLASS_10	\N	\N
5758	STRESS-083388-1629	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1629	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1629	FEMALE	\N	\N	+10000833881629	\N	R083388-1629	B	CLASS_7	\N	\N
5759	STRESS-083388-1630	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1630	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1630	FEMALE	\N	\N	+10000833881630	\N	R083388-1630	A	CLASS_10	\N	\N
5760	STRESS-083388-1631	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1631	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1631	FEMALE	\N	\N	+10000833881631	\N	R083388-1631	A	CLASS_10	\N	\N
5761	STRESS-083388-1632	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1632	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1632	FEMALE	\N	\N	+10000833881632	\N	R083388-1632	B	CLASS_10	\N	\N
5762	STRESS-083388-1633	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1633	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1633	FEMALE	\N	\N	+10000833881633	\N	R083388-1633	D	CLASS_7	\N	\N
5763	STRESS-083388-1634	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1634	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1634	FEMALE	\N	\N	+10000833881634	\N	R083388-1634	B	CLASS_9	\N	\N
5764	STRESS-083388-1635	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1635	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1635	MALE	\N	\N	+10000833881635	\N	R083388-1635	B	CLASS_7	\N	\N
5765	STRESS-083388-1636	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1636	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1636	MALE	\N	\N	+10000833881636	\N	R083388-1636	C	CLASS_9	\N	\N
5766	STRESS-083388-1637	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1637	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1637	MALE	\N	\N	+10000833881637	\N	R083388-1637	D	CLASS_7	\N	\N
5767	STRESS-083388-1638	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1638	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1638	MALE	\N	\N	+10000833881638	\N	R083388-1638	D	CLASS_7	\N	\N
5768	STRESS-083388-1639	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1639	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1639	MALE	\N	\N	+10000833881639	\N	R083388-1639	C	CLASS_6	\N	\N
5769	STRESS-083388-1640	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1640	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1640	MALE	\N	\N	+10000833881640	\N	R083388-1640	D	CLASS_7	\N	\N
5770	STRESS-083388-1641	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1641	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1641	FEMALE	\N	\N	+10000833881641	\N	R083388-1641	A	CLASS_7	\N	\N
5771	STRESS-083388-1642	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1642	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1642	FEMALE	\N	\N	+10000833881642	\N	R083388-1642	C	CLASS_10	\N	\N
5772	STRESS-083388-1643	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1643	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1643	MALE	\N	\N	+10000833881643	\N	R083388-1643	D	CLASS_6	\N	\N
5773	STRESS-083388-1644	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1644	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1644	MALE	\N	\N	+10000833881644	\N	R083388-1644	D	CLASS_6	\N	\N
5774	STRESS-083388-1645	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1645	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1645	MALE	\N	\N	+10000833881645	\N	R083388-1645	B	CLASS_8	\N	\N
5775	STRESS-083388-1646	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1646	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1646	FEMALE	\N	\N	+10000833881646	\N	R083388-1646	A	CLASS_10	\N	\N
5776	STRESS-083388-1647	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1647	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1647	MALE	\N	\N	+10000833881647	\N	R083388-1647	B	CLASS_7	\N	\N
5777	STRESS-083388-1648	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1648	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1648	FEMALE	\N	\N	+10000833881648	\N	R083388-1648	B	CLASS_10	\N	\N
5778	STRESS-083388-1649	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1649	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1649	FEMALE	\N	\N	+10000833881649	\N	R083388-1649	A	CLASS_6	\N	\N
5779	STRESS-083388-1650	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1650	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1650	MALE	\N	\N	+10000833881650	\N	R083388-1650	D	CLASS_10	\N	\N
5780	STRESS-083388-1651	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1651	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1651	MALE	\N	\N	+10000833881651	\N	R083388-1651	C	CLASS_6	\N	\N
5781	STRESS-083388-1652	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1652	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1652	MALE	\N	\N	+10000833881652	\N	R083388-1652	D	CLASS_9	\N	\N
5782	STRESS-083388-1653	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1653	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1653	MALE	\N	\N	+10000833881653	\N	R083388-1653	B	CLASS_8	\N	\N
5783	STRESS-083388-1654	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1654	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1654	FEMALE	\N	\N	+10000833881654	\N	R083388-1654	C	CLASS_8	\N	\N
5784	STRESS-083388-1655	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1655	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1655	FEMALE	\N	\N	+10000833881655	\N	R083388-1655	C	CLASS_8	\N	\N
5785	STRESS-083388-1656	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1656	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1656	MALE	\N	\N	+10000833881656	\N	R083388-1656	B	CLASS_8	\N	\N
5786	STRESS-083388-1657	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1657	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1657	FEMALE	\N	\N	+10000833881657	\N	R083388-1657	B	CLASS_7	\N	\N
5787	STRESS-083388-1658	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1658	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1658	FEMALE	\N	\N	+10000833881658	\N	R083388-1658	D	CLASS_8	\N	\N
5788	STRESS-083388-1659	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1659	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1659	MALE	\N	\N	+10000833881659	\N	R083388-1659	B	CLASS_8	\N	\N
5789	STRESS-083388-1660	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1660	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1660	FEMALE	\N	\N	+10000833881660	\N	R083388-1660	C	CLASS_8	\N	\N
5790	STRESS-083388-1661	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1661	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1661	FEMALE	\N	\N	+10000833881661	\N	R083388-1661	D	CLASS_9	\N	\N
5791	STRESS-083388-1662	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1662	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1662	MALE	\N	\N	+10000833881662	\N	R083388-1662	A	CLASS_7	\N	\N
5792	STRESS-083388-1663	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1663	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1663	MALE	\N	\N	+10000833881663	\N	R083388-1663	A	CLASS_7	\N	\N
5793	STRESS-083388-1664	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1664	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1664	FEMALE	\N	\N	+10000833881664	\N	R083388-1664	C	CLASS_9	\N	\N
5794	STRESS-083388-1665	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1665	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1665	FEMALE	\N	\N	+10000833881665	\N	R083388-1665	C	CLASS_9	\N	\N
5795	STRESS-083388-1666	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1666	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1666	FEMALE	\N	\N	+10000833881666	\N	R083388-1666	B	CLASS_7	\N	\N
5796	STRESS-083388-1667	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1667	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1667	MALE	\N	\N	+10000833881667	\N	R083388-1667	B	CLASS_8	\N	\N
5797	STRESS-083388-1668	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1668	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1668	FEMALE	\N	\N	+10000833881668	\N	R083388-1668	A	CLASS_9	\N	\N
5798	STRESS-083388-1669	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1669	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1669	MALE	\N	\N	+10000833881669	\N	R083388-1669	C	CLASS_10	\N	\N
5799	STRESS-083388-1670	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1670	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1670	MALE	\N	\N	+10000833881670	\N	R083388-1670	B	CLASS_8	\N	\N
5800	STRESS-083388-1671	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1671	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1671	MALE	\N	\N	+10000833881671	\N	R083388-1671	A	CLASS_10	\N	\N
5801	STRESS-083388-1672	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1672	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1672	FEMALE	\N	\N	+10000833881672	\N	R083388-1672	B	CLASS_9	\N	\N
5802	STRESS-083388-1673	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1673	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1673	FEMALE	\N	\N	+10000833881673	\N	R083388-1673	D	CLASS_6	\N	\N
5803	STRESS-083388-1674	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1674	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1674	MALE	\N	\N	+10000833881674	\N	R083388-1674	C	CLASS_6	\N	\N
5804	STRESS-083388-1675	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1675	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1675	MALE	\N	\N	+10000833881675	\N	R083388-1675	A	CLASS_7	\N	\N
5805	STRESS-083388-1676	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1676	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1676	FEMALE	\N	\N	+10000833881676	\N	R083388-1676	B	CLASS_6	\N	\N
5806	STRESS-083388-1677	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1677	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1677	MALE	\N	\N	+10000833881677	\N	R083388-1677	B	CLASS_7	\N	\N
5807	STRESS-083388-1678	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1678	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1678	FEMALE	\N	\N	+10000833881678	\N	R083388-1678	C	CLASS_7	\N	\N
5808	STRESS-083388-1679	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1679	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1679	MALE	\N	\N	+10000833881679	\N	R083388-1679	B	CLASS_6	\N	\N
5809	STRESS-083388-1680	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1680	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1680	MALE	\N	\N	+10000833881680	\N	R083388-1680	B	CLASS_6	\N	\N
5810	STRESS-083388-1681	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1681	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1681	MALE	\N	\N	+10000833881681	\N	R083388-1681	B	CLASS_7	\N	\N
5811	STRESS-083388-1682	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1682	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1682	MALE	\N	\N	+10000833881682	\N	R083388-1682	A	CLASS_8	\N	\N
5812	STRESS-083388-1683	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1683	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1683	MALE	\N	\N	+10000833881683	\N	R083388-1683	D	CLASS_6	\N	\N
5813	STRESS-083388-1684	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1684	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1684	MALE	\N	\N	+10000833881684	\N	R083388-1684	D	CLASS_7	\N	\N
5814	STRESS-083388-1685	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1685	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1685	MALE	\N	\N	+10000833881685	\N	R083388-1685	D	CLASS_9	\N	\N
5815	STRESS-083388-1686	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1686	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1686	MALE	\N	\N	+10000833881686	\N	R083388-1686	A	CLASS_7	\N	\N
5816	STRESS-083388-1687	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1687	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1687	FEMALE	\N	\N	+10000833881687	\N	R083388-1687	A	CLASS_8	\N	\N
5817	STRESS-083388-1688	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1688	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1688	FEMALE	\N	\N	+10000833881688	\N	R083388-1688	C	CLASS_8	\N	\N
5818	STRESS-083388-1689	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1689	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1689	MALE	\N	\N	+10000833881689	\N	R083388-1689	C	CLASS_9	\N	\N
5819	STRESS-083388-1690	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1690	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1690	MALE	\N	\N	+10000833881690	\N	R083388-1690	A	CLASS_8	\N	\N
5820	STRESS-083388-1691	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1691	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1691	FEMALE	\N	\N	+10000833881691	\N	R083388-1691	D	CLASS_6	\N	\N
5821	STRESS-083388-1692	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1692	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1692	MALE	\N	\N	+10000833881692	\N	R083388-1692	D	CLASS_8	\N	\N
5822	STRESS-083388-1693	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1693	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1693	FEMALE	\N	\N	+10000833881693	\N	R083388-1693	A	CLASS_9	\N	\N
5823	STRESS-083388-1694	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1694	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1694	MALE	\N	\N	+10000833881694	\N	R083388-1694	A	CLASS_10	\N	\N
5824	STRESS-083388-1695	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1695	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1695	MALE	\N	\N	+10000833881695	\N	R083388-1695	D	CLASS_9	\N	\N
5825	STRESS-083388-1696	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1696	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1696	MALE	\N	\N	+10000833881696	\N	R083388-1696	C	CLASS_7	\N	\N
5826	STRESS-083388-1697	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1697	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1697	MALE	\N	\N	+10000833881697	\N	R083388-1697	A	CLASS_7	\N	\N
5827	STRESS-083388-1698	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1698	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1698	MALE	\N	\N	+10000833881698	\N	R083388-1698	C	CLASS_9	\N	\N
5828	STRESS-083388-1699	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1699	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1699	FEMALE	\N	\N	+10000833881699	\N	R083388-1699	A	CLASS_10	\N	\N
5829	STRESS-083388-1700	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1700	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1700	MALE	\N	\N	+10000833881700	\N	R083388-1700	B	CLASS_9	\N	\N
5830	STRESS-083388-1701	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1701	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1701	FEMALE	\N	\N	+10000833881701	\N	R083388-1701	D	CLASS_10	\N	\N
5831	STRESS-083388-1702	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1702	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1702	MALE	\N	\N	+10000833881702	\N	R083388-1702	B	CLASS_6	\N	\N
5832	STRESS-083388-1703	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1703	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1703	MALE	\N	\N	+10000833881703	\N	R083388-1703	D	CLASS_7	\N	\N
5833	STRESS-083388-1704	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1704	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1704	FEMALE	\N	\N	+10000833881704	\N	R083388-1704	C	CLASS_7	\N	\N
5834	STRESS-083388-1705	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1705	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1705	MALE	\N	\N	+10000833881705	\N	R083388-1705	C	CLASS_7	\N	\N
5835	STRESS-083388-1706	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1706	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1706	FEMALE	\N	\N	+10000833881706	\N	R083388-1706	C	CLASS_9	\N	\N
5836	STRESS-083388-1707	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1707	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1707	FEMALE	\N	\N	+10000833881707	\N	R083388-1707	D	CLASS_6	\N	\N
5837	STRESS-083388-1708	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1708	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1708	MALE	\N	\N	+10000833881708	\N	R083388-1708	C	CLASS_6	\N	\N
5838	STRESS-083388-1709	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1709	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1709	MALE	\N	\N	+10000833881709	\N	R083388-1709	A	CLASS_7	\N	\N
5839	STRESS-083388-1710	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1710	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1710	FEMALE	\N	\N	+10000833881710	\N	R083388-1710	C	CLASS_7	\N	\N
5840	STRESS-083388-1711	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1711	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1711	FEMALE	\N	\N	+10000833881711	\N	R083388-1711	B	CLASS_9	\N	\N
5841	STRESS-083388-1712	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1712	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1712	MALE	\N	\N	+10000833881712	\N	R083388-1712	C	CLASS_9	\N	\N
5842	STRESS-083388-1713	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1713	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1713	FEMALE	\N	\N	+10000833881713	\N	R083388-1713	A	CLASS_8	\N	\N
5843	STRESS-083388-1714	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1714	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1714	FEMALE	\N	\N	+10000833881714	\N	R083388-1714	C	CLASS_7	\N	\N
5844	STRESS-083388-1715	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1715	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1715	FEMALE	\N	\N	+10000833881715	\N	R083388-1715	C	CLASS_7	\N	\N
5845	STRESS-083388-1716	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1716	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1716	MALE	\N	\N	+10000833881716	\N	R083388-1716	C	CLASS_6	\N	\N
5846	STRESS-083388-1717	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1717	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1717	MALE	\N	\N	+10000833881717	\N	R083388-1717	D	CLASS_9	\N	\N
5847	STRESS-083388-1718	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1718	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1718	MALE	\N	\N	+10000833881718	\N	R083388-1718	B	CLASS_9	\N	\N
5848	STRESS-083388-1719	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1719	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1719	MALE	\N	\N	+10000833881719	\N	R083388-1719	B	CLASS_10	\N	\N
5849	STRESS-083388-1720	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1720	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1720	MALE	\N	\N	+10000833881720	\N	R083388-1720	B	CLASS_9	\N	\N
5850	STRESS-083388-1721	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1721	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1721	MALE	\N	\N	+10000833881721	\N	R083388-1721	B	CLASS_6	\N	\N
5851	STRESS-083388-1722	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1722	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1722	MALE	\N	\N	+10000833881722	\N	R083388-1722	D	CLASS_6	\N	\N
5852	STRESS-083388-1723	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1723	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1723	FEMALE	\N	\N	+10000833881723	\N	R083388-1723	A	CLASS_10	\N	\N
5853	STRESS-083388-1724	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1724	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1724	FEMALE	\N	\N	+10000833881724	\N	R083388-1724	C	CLASS_10	\N	\N
5854	STRESS-083388-1725	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1725	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1725	FEMALE	\N	\N	+10000833881725	\N	R083388-1725	A	CLASS_10	\N	\N
5855	STRESS-083388-1726	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1726	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1726	MALE	\N	\N	+10000833881726	\N	R083388-1726	A	CLASS_10	\N	\N
5856	STRESS-083388-1727	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1727	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1727	MALE	\N	\N	+10000833881727	\N	R083388-1727	B	CLASS_9	\N	\N
5857	STRESS-083388-1728	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1728	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1728	MALE	\N	\N	+10000833881728	\N	R083388-1728	A	CLASS_7	\N	\N
5858	STRESS-083388-1729	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1729	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1729	MALE	\N	\N	+10000833881729	\N	R083388-1729	C	CLASS_9	\N	\N
5859	STRESS-083388-1730	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1730	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1730	MALE	\N	\N	+10000833881730	\N	R083388-1730	A	CLASS_9	\N	\N
5860	STRESS-083388-1731	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1731	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1731	FEMALE	\N	\N	+10000833881731	\N	R083388-1731	B	CLASS_7	\N	\N
5861	STRESS-083388-1732	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1732	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1732	FEMALE	\N	\N	+10000833881732	\N	R083388-1732	A	CLASS_7	\N	\N
5862	STRESS-083388-1733	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1733	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1733	MALE	\N	\N	+10000833881733	\N	R083388-1733	C	CLASS_9	\N	\N
5863	STRESS-083388-1734	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1734	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1734	FEMALE	\N	\N	+10000833881734	\N	R083388-1734	D	CLASS_9	\N	\N
5864	STRESS-083388-1735	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1735	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1735	FEMALE	\N	\N	+10000833881735	\N	R083388-1735	A	CLASS_10	\N	\N
5865	STRESS-083388-1736	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1736	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1736	MALE	\N	\N	+10000833881736	\N	R083388-1736	B	CLASS_8	\N	\N
5866	STRESS-083388-1737	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1737	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1737	MALE	\N	\N	+10000833881737	\N	R083388-1737	B	CLASS_6	\N	\N
5867	STRESS-083388-1738	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1738	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1738	MALE	\N	\N	+10000833881738	\N	R083388-1738	C	CLASS_7	\N	\N
5868	STRESS-083388-1739	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1739	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1739	MALE	\N	\N	+10000833881739	\N	R083388-1739	A	CLASS_8	\N	\N
5869	STRESS-083388-1740	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1740	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1740	FEMALE	\N	\N	+10000833881740	\N	R083388-1740	B	CLASS_8	\N	\N
5870	STRESS-083388-1741	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1741	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1741	MALE	\N	\N	+10000833881741	\N	R083388-1741	B	CLASS_8	\N	\N
5871	STRESS-083388-1742	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1742	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1742	MALE	\N	\N	+10000833881742	\N	R083388-1742	A	CLASS_6	\N	\N
5872	STRESS-083388-1743	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1743	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1743	MALE	\N	\N	+10000833881743	\N	R083388-1743	B	CLASS_6	\N	\N
5873	STRESS-083388-1744	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1744	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1744	MALE	\N	\N	+10000833881744	\N	R083388-1744	B	CLASS_7	\N	\N
5874	STRESS-083388-1745	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1745	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1745	MALE	\N	\N	+10000833881745	\N	R083388-1745	A	CLASS_10	\N	\N
5875	STRESS-083388-1746	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1746	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1746	FEMALE	\N	\N	+10000833881746	\N	R083388-1746	C	CLASS_9	\N	\N
5876	STRESS-083388-1747	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1747	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1747	MALE	\N	\N	+10000833881747	\N	R083388-1747	B	CLASS_6	\N	\N
5877	STRESS-083388-1748	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1748	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1748	FEMALE	\N	\N	+10000833881748	\N	R083388-1748	B	CLASS_7	\N	\N
5878	STRESS-083388-1749	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1749	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1749	FEMALE	\N	\N	+10000833881749	\N	R083388-1749	C	CLASS_10	\N	\N
5879	STRESS-083388-1750	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1750	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1750	MALE	\N	\N	+10000833881750	\N	R083388-1750	D	CLASS_7	\N	\N
5880	STRESS-083388-1751	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1751	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1751	MALE	\N	\N	+10000833881751	\N	R083388-1751	D	CLASS_8	\N	\N
5881	STRESS-083388-1752	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1752	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1752	FEMALE	\N	\N	+10000833881752	\N	R083388-1752	C	CLASS_8	\N	\N
5882	STRESS-083388-1753	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1753	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1753	MALE	\N	\N	+10000833881753	\N	R083388-1753	D	CLASS_7	\N	\N
5883	STRESS-083388-1754	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1754	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1754	FEMALE	\N	\N	+10000833881754	\N	R083388-1754	A	CLASS_6	\N	\N
5884	STRESS-083388-1755	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1755	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1755	MALE	\N	\N	+10000833881755	\N	R083388-1755	D	CLASS_8	\N	\N
5885	STRESS-083388-1756	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1756	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1756	FEMALE	\N	\N	+10000833881756	\N	R083388-1756	A	CLASS_10	\N	\N
5886	STRESS-083388-1757	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1757	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1757	MALE	\N	\N	+10000833881757	\N	R083388-1757	B	CLASS_6	\N	\N
5887	STRESS-083388-1758	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1758	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1758	MALE	\N	\N	+10000833881758	\N	R083388-1758	C	CLASS_8	\N	\N
5888	STRESS-083388-1759	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1759	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1759	FEMALE	\N	\N	+10000833881759	\N	R083388-1759	C	CLASS_6	\N	\N
5889	STRESS-083388-1760	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1760	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1760	FEMALE	\N	\N	+10000833881760	\N	R083388-1760	B	CLASS_9	\N	\N
5890	STRESS-083388-1761	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1761	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1761	MALE	\N	\N	+10000833881761	\N	R083388-1761	A	CLASS_7	\N	\N
5891	STRESS-083388-1762	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1762	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1762	FEMALE	\N	\N	+10000833881762	\N	R083388-1762	C	CLASS_6	\N	\N
5892	STRESS-083388-1763	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1763	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1763	FEMALE	\N	\N	+10000833881763	\N	R083388-1763	D	CLASS_9	\N	\N
5893	STRESS-083388-1764	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1764	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1764	FEMALE	\N	\N	+10000833881764	\N	R083388-1764	C	CLASS_6	\N	\N
5894	STRESS-083388-1765	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1765	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1765	MALE	\N	\N	+10000833881765	\N	R083388-1765	B	CLASS_6	\N	\N
5895	STRESS-083388-1766	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1766	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1766	FEMALE	\N	\N	+10000833881766	\N	R083388-1766	D	CLASS_9	\N	\N
5896	STRESS-083388-1767	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1767	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1767	FEMALE	\N	\N	+10000833881767	\N	R083388-1767	D	CLASS_9	\N	\N
5897	STRESS-083388-1768	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1768	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1768	FEMALE	\N	\N	+10000833881768	\N	R083388-1768	A	CLASS_8	\N	\N
5898	STRESS-083388-1769	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1769	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1769	FEMALE	\N	\N	+10000833881769	\N	R083388-1769	A	CLASS_10	\N	\N
5899	STRESS-083388-1770	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1770	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1770	MALE	\N	\N	+10000833881770	\N	R083388-1770	A	CLASS_7	\N	\N
5900	STRESS-083388-1771	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1771	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1771	FEMALE	\N	\N	+10000833881771	\N	R083388-1771	B	CLASS_7	\N	\N
5901	STRESS-083388-1772	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1772	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1772	FEMALE	\N	\N	+10000833881772	\N	R083388-1772	B	CLASS_6	\N	\N
5902	STRESS-083388-1773	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1773	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1773	FEMALE	\N	\N	+10000833881773	\N	R083388-1773	D	CLASS_10	\N	\N
5903	STRESS-083388-1774	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1774	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1774	FEMALE	\N	\N	+10000833881774	\N	R083388-1774	B	CLASS_7	\N	\N
5904	STRESS-083388-1775	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1775	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1775	MALE	\N	\N	+10000833881775	\N	R083388-1775	A	CLASS_6	\N	\N
5905	STRESS-083388-1776	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1776	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1776	MALE	\N	\N	+10000833881776	\N	R083388-1776	D	CLASS_10	\N	\N
5906	STRESS-083388-1777	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1777	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1777	MALE	\N	\N	+10000833881777	\N	R083388-1777	A	CLASS_6	\N	\N
5907	STRESS-083388-1778	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1778	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1778	MALE	\N	\N	+10000833881778	\N	R083388-1778	A	CLASS_8	\N	\N
5908	STRESS-083388-1779	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1779	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1779	FEMALE	\N	\N	+10000833881779	\N	R083388-1779	C	CLASS_8	\N	\N
5909	STRESS-083388-1780	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1780	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1780	MALE	\N	\N	+10000833881780	\N	R083388-1780	A	CLASS_7	\N	\N
5910	STRESS-083388-1781	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1781	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1781	MALE	\N	\N	+10000833881781	\N	R083388-1781	D	CLASS_6	\N	\N
5911	STRESS-083388-1782	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1782	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1782	FEMALE	\N	\N	+10000833881782	\N	R083388-1782	A	CLASS_9	\N	\N
5912	STRESS-083388-1783	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1783	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1783	FEMALE	\N	\N	+10000833881783	\N	R083388-1783	C	CLASS_7	\N	\N
5913	STRESS-083388-1784	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1784	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1784	MALE	\N	\N	+10000833881784	\N	R083388-1784	D	CLASS_10	\N	\N
5914	STRESS-083388-1785	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1785	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1785	MALE	\N	\N	+10000833881785	\N	R083388-1785	C	CLASS_10	\N	\N
5915	STRESS-083388-1786	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1786	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1786	MALE	\N	\N	+10000833881786	\N	R083388-1786	A	CLASS_8	\N	\N
5916	STRESS-083388-1787	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1787	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1787	MALE	\N	\N	+10000833881787	\N	R083388-1787	B	CLASS_10	\N	\N
5917	STRESS-083388-1788	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1788	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1788	FEMALE	\N	\N	+10000833881788	\N	R083388-1788	C	CLASS_8	\N	\N
5918	STRESS-083388-1789	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1789	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1789	MALE	\N	\N	+10000833881789	\N	R083388-1789	B	CLASS_8	\N	\N
5919	STRESS-083388-1790	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1790	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1790	FEMALE	\N	\N	+10000833881790	\N	R083388-1790	C	CLASS_9	\N	\N
5920	STRESS-083388-1791	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1791	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1791	MALE	\N	\N	+10000833881791	\N	R083388-1791	A	CLASS_9	\N	\N
5921	STRESS-083388-1792	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1792	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1792	MALE	\N	\N	+10000833881792	\N	R083388-1792	A	CLASS_9	\N	\N
5922	STRESS-083388-1793	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1793	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1793	MALE	\N	\N	+10000833881793	\N	R083388-1793	A	CLASS_9	\N	\N
5923	STRESS-083388-1794	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1794	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1794	FEMALE	\N	\N	+10000833881794	\N	R083388-1794	B	CLASS_9	\N	\N
5924	STRESS-083388-1795	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1795	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1795	FEMALE	\N	\N	+10000833881795	\N	R083388-1795	D	CLASS_10	\N	\N
5925	STRESS-083388-1796	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1796	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1796	MALE	\N	\N	+10000833881796	\N	R083388-1796	A	CLASS_9	\N	\N
5926	STRESS-083388-1797	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1797	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1797	MALE	\N	\N	+10000833881797	\N	R083388-1797	D	CLASS_8	\N	\N
5927	STRESS-083388-1798	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1798	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1798	MALE	\N	\N	+10000833881798	\N	R083388-1798	B	CLASS_10	\N	\N
5928	STRESS-083388-1799	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1799	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1799	MALE	\N	\N	+10000833881799	\N	R083388-1799	C	CLASS_6	\N	\N
5929	STRESS-083388-1800	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1800	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1800	MALE	\N	\N	+10000833881800	\N	R083388-1800	A	CLASS_10	\N	\N
5930	STRESS-083388-1801	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1801	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1801	MALE	\N	\N	+10000833881801	\N	R083388-1801	B	CLASS_6	\N	\N
5931	STRESS-083388-1802	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1802	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1802	FEMALE	\N	\N	+10000833881802	\N	R083388-1802	A	CLASS_10	\N	\N
5932	STRESS-083388-1803	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1803	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1803	MALE	\N	\N	+10000833881803	\N	R083388-1803	C	CLASS_8	\N	\N
5933	STRESS-083388-1804	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1804	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1804	FEMALE	\N	\N	+10000833881804	\N	R083388-1804	C	CLASS_8	\N	\N
5934	STRESS-083388-1805	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1805	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1805	MALE	\N	\N	+10000833881805	\N	R083388-1805	A	CLASS_8	\N	\N
5935	STRESS-083388-1806	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1806	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1806	MALE	\N	\N	+10000833881806	\N	R083388-1806	B	CLASS_6	\N	\N
5936	STRESS-083388-1807	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1807	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1807	MALE	\N	\N	+10000833881807	\N	R083388-1807	C	CLASS_7	\N	\N
5937	STRESS-083388-1808	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1808	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1808	MALE	\N	\N	+10000833881808	\N	R083388-1808	A	CLASS_10	\N	\N
5938	STRESS-083388-1809	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1809	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1809	FEMALE	\N	\N	+10000833881809	\N	R083388-1809	A	CLASS_6	\N	\N
5939	STRESS-083388-1810	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1810	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1810	MALE	\N	\N	+10000833881810	\N	R083388-1810	A	CLASS_10	\N	\N
5940	STRESS-083388-1811	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1811	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1811	FEMALE	\N	\N	+10000833881811	\N	R083388-1811	A	CLASS_7	\N	\N
5941	STRESS-083388-1812	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1812	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1812	FEMALE	\N	\N	+10000833881812	\N	R083388-1812	A	CLASS_6	\N	\N
5942	STRESS-083388-1813	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1813	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1813	MALE	\N	\N	+10000833881813	\N	R083388-1813	B	CLASS_9	\N	\N
5943	STRESS-083388-1814	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1814	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1814	MALE	\N	\N	+10000833881814	\N	R083388-1814	C	CLASS_6	\N	\N
5944	STRESS-083388-1815	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1815	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1815	FEMALE	\N	\N	+10000833881815	\N	R083388-1815	A	CLASS_9	\N	\N
5945	STRESS-083388-1816	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1816	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1816	FEMALE	\N	\N	+10000833881816	\N	R083388-1816	D	CLASS_7	\N	\N
5946	STRESS-083388-1817	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1817	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1817	FEMALE	\N	\N	+10000833881817	\N	R083388-1817	C	CLASS_7	\N	\N
5947	STRESS-083388-1818	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1818	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1818	MALE	\N	\N	+10000833881818	\N	R083388-1818	B	CLASS_8	\N	\N
5948	STRESS-083388-1819	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1819	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1819	MALE	\N	\N	+10000833881819	\N	R083388-1819	C	CLASS_9	\N	\N
5949	STRESS-083388-1820	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1820	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1820	MALE	\N	\N	+10000833881820	\N	R083388-1820	B	CLASS_10	\N	\N
5950	STRESS-083388-1821	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1821	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1821	FEMALE	\N	\N	+10000833881821	\N	R083388-1821	A	CLASS_6	\N	\N
5951	STRESS-083388-1822	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1822	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1822	MALE	\N	\N	+10000833881822	\N	R083388-1822	B	CLASS_8	\N	\N
5952	STRESS-083388-1823	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1823	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1823	MALE	\N	\N	+10000833881823	\N	R083388-1823	B	CLASS_10	\N	\N
5953	STRESS-083388-1824	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1824	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1824	MALE	\N	\N	+10000833881824	\N	R083388-1824	A	CLASS_8	\N	\N
5954	STRESS-083388-1825	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1825	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1825	MALE	\N	\N	+10000833881825	\N	R083388-1825	C	CLASS_10	\N	\N
5955	STRESS-083388-1826	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1826	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1826	FEMALE	\N	\N	+10000833881826	\N	R083388-1826	D	CLASS_7	\N	\N
5956	STRESS-083388-1827	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1827	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1827	FEMALE	\N	\N	+10000833881827	\N	R083388-1827	A	CLASS_9	\N	\N
5957	STRESS-083388-1828	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1828	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1828	FEMALE	\N	\N	+10000833881828	\N	R083388-1828	C	CLASS_6	\N	\N
5958	STRESS-083388-1829	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1829	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1829	MALE	\N	\N	+10000833881829	\N	R083388-1829	C	CLASS_9	\N	\N
5959	STRESS-083388-1830	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1830	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1830	FEMALE	\N	\N	+10000833881830	\N	R083388-1830	A	CLASS_8	\N	\N
5960	STRESS-083388-1831	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1831	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1831	FEMALE	\N	\N	+10000833881831	\N	R083388-1831	D	CLASS_8	\N	\N
5961	STRESS-083388-1832	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1832	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1832	MALE	\N	\N	+10000833881832	\N	R083388-1832	B	CLASS_10	\N	\N
5962	STRESS-083388-1833	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1833	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1833	FEMALE	\N	\N	+10000833881833	\N	R083388-1833	B	CLASS_9	\N	\N
5963	STRESS-083388-1834	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1834	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1834	FEMALE	\N	\N	+10000833881834	\N	R083388-1834	B	CLASS_9	\N	\N
5964	STRESS-083388-1835	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1835	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1835	MALE	\N	\N	+10000833881835	\N	R083388-1835	A	CLASS_7	\N	\N
5965	STRESS-083388-1836	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1836	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1836	FEMALE	\N	\N	+10000833881836	\N	R083388-1836	A	CLASS_6	\N	\N
5966	STRESS-083388-1837	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1837	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1837	FEMALE	\N	\N	+10000833881837	\N	R083388-1837	B	CLASS_9	\N	\N
5967	STRESS-083388-1838	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1838	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1838	MALE	\N	\N	+10000833881838	\N	R083388-1838	A	CLASS_6	\N	\N
5968	STRESS-083388-1839	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1839	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1839	MALE	\N	\N	+10000833881839	\N	R083388-1839	B	CLASS_10	\N	\N
5969	STRESS-083388-1840	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1840	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1840	MALE	\N	\N	+10000833881840	\N	R083388-1840	C	CLASS_7	\N	\N
5970	STRESS-083388-1841	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1841	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1841	MALE	\N	\N	+10000833881841	\N	R083388-1841	C	CLASS_9	\N	\N
5971	STRESS-083388-1842	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1842	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1842	FEMALE	\N	\N	+10000833881842	\N	R083388-1842	A	CLASS_10	\N	\N
5972	STRESS-083388-1843	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1843	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1843	MALE	\N	\N	+10000833881843	\N	R083388-1843	B	CLASS_7	\N	\N
5973	STRESS-083388-1844	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1844	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1844	FEMALE	\N	\N	+10000833881844	\N	R083388-1844	A	CLASS_8	\N	\N
5974	STRESS-083388-1845	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1845	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1845	FEMALE	\N	\N	+10000833881845	\N	R083388-1845	B	CLASS_10	\N	\N
5975	STRESS-083388-1846	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1846	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1846	MALE	\N	\N	+10000833881846	\N	R083388-1846	D	CLASS_8	\N	\N
5976	STRESS-083388-1847	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1847	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1847	MALE	\N	\N	+10000833881847	\N	R083388-1847	A	CLASS_10	\N	\N
5977	STRESS-083388-1848	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1848	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1848	FEMALE	\N	\N	+10000833881848	\N	R083388-1848	A	CLASS_7	\N	\N
5978	STRESS-083388-1849	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1849	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1849	FEMALE	\N	\N	+10000833881849	\N	R083388-1849	C	CLASS_10	\N	\N
5979	STRESS-083388-1850	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1850	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1850	MALE	\N	\N	+10000833881850	\N	R083388-1850	A	CLASS_7	\N	\N
5980	STRESS-083388-1851	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1851	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1851	FEMALE	\N	\N	+10000833881851	\N	R083388-1851	C	CLASS_6	\N	\N
5981	STRESS-083388-1852	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1852	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1852	FEMALE	\N	\N	+10000833881852	\N	R083388-1852	C	CLASS_10	\N	\N
5982	STRESS-083388-1853	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1853	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1853	MALE	\N	\N	+10000833881853	\N	R083388-1853	D	CLASS_6	\N	\N
5983	STRESS-083388-1854	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1854	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1854	MALE	\N	\N	+10000833881854	\N	R083388-1854	D	CLASS_6	\N	\N
5984	STRESS-083388-1855	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1855	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1855	FEMALE	\N	\N	+10000833881855	\N	R083388-1855	A	CLASS_7	\N	\N
5985	STRESS-083388-1856	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1856	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1856	FEMALE	\N	\N	+10000833881856	\N	R083388-1856	B	CLASS_8	\N	\N
5986	STRESS-083388-1857	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1857	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1857	FEMALE	\N	\N	+10000833881857	\N	R083388-1857	C	CLASS_10	\N	\N
5987	STRESS-083388-1858	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1858	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1858	FEMALE	\N	\N	+10000833881858	\N	R083388-1858	C	CLASS_8	\N	\N
5988	STRESS-083388-1859	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1859	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1859	MALE	\N	\N	+10000833881859	\N	R083388-1859	A	CLASS_9	\N	\N
5989	STRESS-083388-1860	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1860	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1860	MALE	\N	\N	+10000833881860	\N	R083388-1860	B	CLASS_7	\N	\N
5990	STRESS-083388-1861	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1861	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1861	MALE	\N	\N	+10000833881861	\N	R083388-1861	B	CLASS_10	\N	\N
5991	STRESS-083388-1862	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1862	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1862	FEMALE	\N	\N	+10000833881862	\N	R083388-1862	A	CLASS_10	\N	\N
5992	STRESS-083388-1863	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1863	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1863	FEMALE	\N	\N	+10000833881863	\N	R083388-1863	A	CLASS_10	\N	\N
5993	STRESS-083388-1864	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1864	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1864	MALE	\N	\N	+10000833881864	\N	R083388-1864	B	CLASS_10	\N	\N
5994	STRESS-083388-1865	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1865	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1865	MALE	\N	\N	+10000833881865	\N	R083388-1865	B	CLASS_6	\N	\N
5995	STRESS-083388-1866	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1866	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1866	MALE	\N	\N	+10000833881866	\N	R083388-1866	B	CLASS_6	\N	\N
5996	STRESS-083388-1867	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1867	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1867	FEMALE	\N	\N	+10000833881867	\N	R083388-1867	B	CLASS_7	\N	\N
5997	STRESS-083388-1868	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1868	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1868	FEMALE	\N	\N	+10000833881868	\N	R083388-1868	D	CLASS_10	\N	\N
5998	STRESS-083388-1869	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1869	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1869	MALE	\N	\N	+10000833881869	\N	R083388-1869	D	CLASS_10	\N	\N
5999	STRESS-083388-1870	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1870	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1870	MALE	\N	\N	+10000833881870	\N	R083388-1870	D	CLASS_10	\N	\N
6000	STRESS-083388-1871	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1871	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1871	FEMALE	\N	\N	+10000833881871	\N	R083388-1871	C	CLASS_10	\N	\N
6001	STRESS-083388-1872	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1872	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1872	FEMALE	\N	\N	+10000833881872	\N	R083388-1872	A	CLASS_6	\N	\N
6002	STRESS-083388-1873	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1873	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1873	FEMALE	\N	\N	+10000833881873	\N	R083388-1873	A	CLASS_9	\N	\N
6003	STRESS-083388-1874	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1874	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1874	FEMALE	\N	\N	+10000833881874	\N	R083388-1874	C	CLASS_6	\N	\N
6004	STRESS-083388-1875	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1875	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1875	MALE	\N	\N	+10000833881875	\N	R083388-1875	D	CLASS_6	\N	\N
6005	STRESS-083388-1876	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1876	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1876	MALE	\N	\N	+10000833881876	\N	R083388-1876	B	CLASS_8	\N	\N
6006	STRESS-083388-1877	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1877	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1877	MALE	\N	\N	+10000833881877	\N	R083388-1877	C	CLASS_7	\N	\N
6007	STRESS-083388-1878	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1878	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1878	FEMALE	\N	\N	+10000833881878	\N	R083388-1878	B	CLASS_7	\N	\N
6008	STRESS-083388-1879	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1879	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1879	FEMALE	\N	\N	+10000833881879	\N	R083388-1879	B	CLASS_9	\N	\N
6009	STRESS-083388-1880	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1880	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1880	MALE	\N	\N	+10000833881880	\N	R083388-1880	D	CLASS_6	\N	\N
6010	STRESS-083388-1881	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1881	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1881	MALE	\N	\N	+10000833881881	\N	R083388-1881	B	CLASS_7	\N	\N
6011	STRESS-083388-1882	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1882	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1882	MALE	\N	\N	+10000833881882	\N	R083388-1882	C	CLASS_9	\N	\N
6012	STRESS-083388-1883	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1883	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1883	FEMALE	\N	\N	+10000833881883	\N	R083388-1883	B	CLASS_8	\N	\N
6013	STRESS-083388-1884	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1884	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1884	MALE	\N	\N	+10000833881884	\N	R083388-1884	D	CLASS_9	\N	\N
6014	STRESS-083388-1885	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1885	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1885	MALE	\N	\N	+10000833881885	\N	R083388-1885	C	CLASS_7	\N	\N
6015	STRESS-083388-1886	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1886	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1886	MALE	\N	\N	+10000833881886	\N	R083388-1886	C	CLASS_7	\N	\N
6016	STRESS-083388-1887	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1887	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1887	FEMALE	\N	\N	+10000833881887	\N	R083388-1887	A	CLASS_6	\N	\N
6017	STRESS-083388-1888	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1888	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1888	MALE	\N	\N	+10000833881888	\N	R083388-1888	A	CLASS_8	\N	\N
6018	STRESS-083388-1889	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1889	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1889	MALE	\N	\N	+10000833881889	\N	R083388-1889	C	CLASS_7	\N	\N
6019	STRESS-083388-1890	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1890	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1890	FEMALE	\N	\N	+10000833881890	\N	R083388-1890	A	CLASS_9	\N	\N
6020	STRESS-083388-1891	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1891	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1891	MALE	\N	\N	+10000833881891	\N	R083388-1891	D	CLASS_7	\N	\N
6021	STRESS-083388-1892	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1892	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1892	MALE	\N	\N	+10000833881892	\N	R083388-1892	A	CLASS_6	\N	\N
6022	STRESS-083388-1893	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1893	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1893	FEMALE	\N	\N	+10000833881893	\N	R083388-1893	C	CLASS_10	\N	\N
6023	STRESS-083388-1894	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1894	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1894	FEMALE	\N	\N	+10000833881894	\N	R083388-1894	A	CLASS_8	\N	\N
6024	STRESS-083388-1895	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1895	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1895	MALE	\N	\N	+10000833881895	\N	R083388-1895	C	CLASS_9	\N	\N
6025	STRESS-083388-1896	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1896	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1896	FEMALE	\N	\N	+10000833881896	\N	R083388-1896	A	CLASS_6	\N	\N
6026	STRESS-083388-1897	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1897	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1897	FEMALE	\N	\N	+10000833881897	\N	R083388-1897	A	CLASS_7	\N	\N
6027	STRESS-083388-1898	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1898	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1898	MALE	\N	\N	+10000833881898	\N	R083388-1898	A	CLASS_7	\N	\N
6028	STRESS-083388-1899	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1899	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1899	MALE	\N	\N	+10000833881899	\N	R083388-1899	C	CLASS_9	\N	\N
6029	STRESS-083388-1900	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1900	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1900	FEMALE	\N	\N	+10000833881900	\N	R083388-1900	A	CLASS_9	\N	\N
6030	STRESS-083388-1901	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1901	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1901	FEMALE	\N	\N	+10000833881901	\N	R083388-1901	D	CLASS_8	\N	\N
6031	STRESS-083388-1902	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1902	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1902	MALE	\N	\N	+10000833881902	\N	R083388-1902	B	CLASS_7	\N	\N
6032	STRESS-083388-1903	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1903	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1903	FEMALE	\N	\N	+10000833881903	\N	R083388-1903	B	CLASS_9	\N	\N
6033	STRESS-083388-1904	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1904	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1904	FEMALE	\N	\N	+10000833881904	\N	R083388-1904	A	CLASS_6	\N	\N
6034	STRESS-083388-1905	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1905	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1905	FEMALE	\N	\N	+10000833881905	\N	R083388-1905	C	CLASS_8	\N	\N
6035	STRESS-083388-1906	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1906	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1906	FEMALE	\N	\N	+10000833881906	\N	R083388-1906	C	CLASS_9	\N	\N
6036	STRESS-083388-1907	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1907	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1907	MALE	\N	\N	+10000833881907	\N	R083388-1907	C	CLASS_9	\N	\N
6037	STRESS-083388-1908	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1908	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1908	MALE	\N	\N	+10000833881908	\N	R083388-1908	B	CLASS_10	\N	\N
6038	STRESS-083388-1909	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1909	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1909	MALE	\N	\N	+10000833881909	\N	R083388-1909	D	CLASS_10	\N	\N
6039	STRESS-083388-1910	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1910	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1910	FEMALE	\N	\N	+10000833881910	\N	R083388-1910	A	CLASS_7	\N	\N
6040	STRESS-083388-1911	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1911	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1911	MALE	\N	\N	+10000833881911	\N	R083388-1911	A	CLASS_8	\N	\N
6041	STRESS-083388-1912	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1912	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1912	FEMALE	\N	\N	+10000833881912	\N	R083388-1912	B	CLASS_9	\N	\N
6042	STRESS-083388-1913	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1913	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1913	FEMALE	\N	\N	+10000833881913	\N	R083388-1913	A	CLASS_9	\N	\N
6043	STRESS-083388-1914	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1914	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1914	FEMALE	\N	\N	+10000833881914	\N	R083388-1914	A	CLASS_7	\N	\N
6044	STRESS-083388-1915	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1915	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1915	MALE	\N	\N	+10000833881915	\N	R083388-1915	B	CLASS_6	\N	\N
6045	STRESS-083388-1916	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1916	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1916	FEMALE	\N	\N	+10000833881916	\N	R083388-1916	A	CLASS_10	\N	\N
6046	STRESS-083388-1917	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1917	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1917	MALE	\N	\N	+10000833881917	\N	R083388-1917	B	CLASS_10	\N	\N
6047	STRESS-083388-1918	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1918	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1918	FEMALE	\N	\N	+10000833881918	\N	R083388-1918	A	CLASS_9	\N	\N
6048	STRESS-083388-1919	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1919	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1919	FEMALE	\N	\N	+10000833881919	\N	R083388-1919	D	CLASS_10	\N	\N
6049	STRESS-083388-1920	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1920	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1920	MALE	\N	\N	+10000833881920	\N	R083388-1920	D	CLASS_7	\N	\N
6050	STRESS-083388-1921	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1921	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1921	FEMALE	\N	\N	+10000833881921	\N	R083388-1921	B	CLASS_8	\N	\N
6051	STRESS-083388-1922	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1922	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1922	FEMALE	\N	\N	+10000833881922	\N	R083388-1922	A	CLASS_7	\N	\N
6052	STRESS-083388-1923	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1923	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1923	MALE	\N	\N	+10000833881923	\N	R083388-1923	D	CLASS_9	\N	\N
6053	STRESS-083388-1924	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1924	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1924	FEMALE	\N	\N	+10000833881924	\N	R083388-1924	D	CLASS_9	\N	\N
6054	STRESS-083388-1925	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1925	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1925	MALE	\N	\N	+10000833881925	\N	R083388-1925	A	CLASS_7	\N	\N
6055	STRESS-083388-1926	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1926	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1926	FEMALE	\N	\N	+10000833881926	\N	R083388-1926	A	CLASS_10	\N	\N
6056	STRESS-083388-1927	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1927	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1927	MALE	\N	\N	+10000833881927	\N	R083388-1927	B	CLASS_8	\N	\N
6057	STRESS-083388-1928	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1928	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1928	FEMALE	\N	\N	+10000833881928	\N	R083388-1928	D	CLASS_9	\N	\N
6058	STRESS-083388-1929	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1929	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1929	FEMALE	\N	\N	+10000833881929	\N	R083388-1929	B	CLASS_6	\N	\N
6059	STRESS-083388-1930	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1930	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1930	MALE	\N	\N	+10000833881930	\N	R083388-1930	D	CLASS_7	\N	\N
6060	STRESS-083388-1931	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1931	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1931	MALE	\N	\N	+10000833881931	\N	R083388-1931	D	CLASS_7	\N	\N
6061	STRESS-083388-1932	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1932	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1932	MALE	\N	\N	+10000833881932	\N	R083388-1932	D	CLASS_10	\N	\N
6062	STRESS-083388-1933	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1933	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1933	FEMALE	\N	\N	+10000833881933	\N	R083388-1933	A	CLASS_8	\N	\N
6063	STRESS-083388-1934	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1934	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1934	FEMALE	\N	\N	+10000833881934	\N	R083388-1934	C	CLASS_8	\N	\N
6064	STRESS-083388-1935	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1935	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1935	FEMALE	\N	\N	+10000833881935	\N	R083388-1935	D	CLASS_10	\N	\N
6065	STRESS-083388-1936	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1936	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1936	MALE	\N	\N	+10000833881936	\N	R083388-1936	C	CLASS_9	\N	\N
6066	STRESS-083388-1937	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1937	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1937	FEMALE	\N	\N	+10000833881937	\N	R083388-1937	B	CLASS_10	\N	\N
6067	STRESS-083388-1938	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1938	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1938	FEMALE	\N	\N	+10000833881938	\N	R083388-1938	D	CLASS_7	\N	\N
6068	STRESS-083388-1939	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1939	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1939	FEMALE	\N	\N	+10000833881939	\N	R083388-1939	A	CLASS_10	\N	\N
6069	STRESS-083388-1940	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1940	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1940	FEMALE	\N	\N	+10000833881940	\N	R083388-1940	B	CLASS_8	\N	\N
6070	STRESS-083388-1941	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1941	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1941	FEMALE	\N	\N	+10000833881941	\N	R083388-1941	A	CLASS_6	\N	\N
6071	STRESS-083388-1942	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1942	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1942	FEMALE	\N	\N	+10000833881942	\N	R083388-1942	C	CLASS_8	\N	\N
6072	STRESS-083388-1943	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1943	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1943	FEMALE	\N	\N	+10000833881943	\N	R083388-1943	D	CLASS_6	\N	\N
6073	STRESS-083388-1944	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1944	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1944	FEMALE	\N	\N	+10000833881944	\N	R083388-1944	D	CLASS_10	\N	\N
6074	STRESS-083388-1945	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1945	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1945	FEMALE	\N	\N	+10000833881945	\N	R083388-1945	D	CLASS_6	\N	\N
6075	STRESS-083388-1946	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1946	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1946	MALE	\N	\N	+10000833881946	\N	R083388-1946	A	CLASS_8	\N	\N
6076	STRESS-083388-1947	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1947	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1947	MALE	\N	\N	+10000833881947	\N	R083388-1947	A	CLASS_9	\N	\N
6077	STRESS-083388-1948	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1948	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1948	MALE	\N	\N	+10000833881948	\N	R083388-1948	D	CLASS_10	\N	\N
6078	STRESS-083388-1949	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1949	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1949	FEMALE	\N	\N	+10000833881949	\N	R083388-1949	B	CLASS_10	\N	\N
6079	STRESS-083388-1950	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1950	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1950	FEMALE	\N	\N	+10000833881950	\N	R083388-1950	B	CLASS_10	\N	\N
6080	STRESS-083388-1951	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1951	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1951	FEMALE	\N	\N	+10000833881951	\N	R083388-1951	D	CLASS_6	\N	\N
6081	STRESS-083388-1952	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1952	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1952	MALE	\N	\N	+10000833881952	\N	R083388-1952	C	CLASS_7	\N	\N
6082	STRESS-083388-1953	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1953	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1953	FEMALE	\N	\N	+10000833881953	\N	R083388-1953	A	CLASS_8	\N	\N
6083	STRESS-083388-1954	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1954	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1954	MALE	\N	\N	+10000833881954	\N	R083388-1954	C	CLASS_7	\N	\N
6084	STRESS-083388-1955	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1955	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1955	MALE	\N	\N	+10000833881955	\N	R083388-1955	D	CLASS_8	\N	\N
6085	STRESS-083388-1956	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1956	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1956	MALE	\N	\N	+10000833881956	\N	R083388-1956	B	CLASS_9	\N	\N
6086	STRESS-083388-1957	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1957	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1957	FEMALE	\N	\N	+10000833881957	\N	R083388-1957	A	CLASS_7	\N	\N
6087	STRESS-083388-1958	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1958	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1958	MALE	\N	\N	+10000833881958	\N	R083388-1958	C	CLASS_8	\N	\N
6088	STRESS-083388-1959	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1959	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1959	MALE	\N	\N	+10000833881959	\N	R083388-1959	A	CLASS_7	\N	\N
6089	STRESS-083388-1960	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1960	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1960	MALE	\N	\N	+10000833881960	\N	R083388-1960	B	CLASS_10	\N	\N
6090	STRESS-083388-1961	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1961	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1961	MALE	\N	\N	+10000833881961	\N	R083388-1961	D	CLASS_8	\N	\N
6091	STRESS-083388-1962	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1962	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1962	MALE	\N	\N	+10000833881962	\N	R083388-1962	D	CLASS_6	\N	\N
6092	STRESS-083388-1963	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1963	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1963	MALE	\N	\N	+10000833881963	\N	R083388-1963	C	CLASS_9	\N	\N
6093	STRESS-083388-1964	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1964	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1964	FEMALE	\N	\N	+10000833881964	\N	R083388-1964	B	CLASS_9	\N	\N
6094	STRESS-083388-1965	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1965	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1965	FEMALE	\N	\N	+10000833881965	\N	R083388-1965	B	CLASS_9	\N	\N
6095	STRESS-083388-1966	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1966	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1966	FEMALE	\N	\N	+10000833881966	\N	R083388-1966	C	CLASS_7	\N	\N
6096	STRESS-083388-1967	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1967	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1967	MALE	\N	\N	+10000833881967	\N	R083388-1967	D	CLASS_7	\N	\N
6097	STRESS-083388-1968	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1968	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1968	MALE	\N	\N	+10000833881968	\N	R083388-1968	C	CLASS_10	\N	\N
6098	STRESS-083388-1969	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1969	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1969	MALE	\N	\N	+10000833881969	\N	R083388-1969	D	CLASS_7	\N	\N
6099	STRESS-083388-1970	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1970	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1970	FEMALE	\N	\N	+10000833881970	\N	R083388-1970	A	CLASS_6	\N	\N
6100	STRESS-083388-1971	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1971	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1971	FEMALE	\N	\N	+10000833881971	\N	R083388-1971	C	CLASS_7	\N	\N
6101	STRESS-083388-1972	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1972	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1972	FEMALE	\N	\N	+10000833881972	\N	R083388-1972	B	CLASS_9	\N	\N
6102	STRESS-083388-1973	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1973	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1973	MALE	\N	\N	+10000833881973	\N	R083388-1973	B	CLASS_8	\N	\N
6103	STRESS-083388-1974	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1974	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1974	FEMALE	\N	\N	+10000833881974	\N	R083388-1974	B	CLASS_9	\N	\N
6104	STRESS-083388-1975	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1975	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1975	FEMALE	\N	\N	+10000833881975	\N	R083388-1975	D	CLASS_6	\N	\N
6105	STRESS-083388-1976	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1976	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1976	FEMALE	\N	\N	+10000833881976	\N	R083388-1976	C	CLASS_9	\N	\N
6106	STRESS-083388-1977	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1977	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1977	FEMALE	\N	\N	+10000833881977	\N	R083388-1977	B	CLASS_8	\N	\N
6107	STRESS-083388-1978	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1978	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1978	MALE	\N	\N	+10000833881978	\N	R083388-1978	C	CLASS_10	\N	\N
6108	STRESS-083388-1979	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1979	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1979	MALE	\N	\N	+10000833881979	\N	R083388-1979	D	CLASS_7	\N	\N
6109	STRESS-083388-1980	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1980	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1980	FEMALE	\N	\N	+10000833881980	\N	R083388-1980	C	CLASS_6	\N	\N
6110	STRESS-083388-1981	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1981	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1981	MALE	\N	\N	+10000833881981	\N	R083388-1981	C	CLASS_8	\N	\N
6111	STRESS-083388-1982	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1982	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1982	FEMALE	\N	\N	+10000833881982	\N	R083388-1982	C	CLASS_10	\N	\N
6112	STRESS-083388-1983	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1983	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1983	MALE	\N	\N	+10000833881983	\N	R083388-1983	A	CLASS_9	\N	\N
6113	STRESS-083388-1984	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1984	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1984	MALE	\N	\N	+10000833881984	\N	R083388-1984	D	CLASS_7	\N	\N
6114	STRESS-083388-1985	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1985	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1985	MALE	\N	\N	+10000833881985	\N	R083388-1985	B	CLASS_10	\N	\N
6115	STRESS-083388-1986	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1986	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1986	FEMALE	\N	\N	+10000833881986	\N	R083388-1986	C	CLASS_7	\N	\N
6116	STRESS-083388-1987	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1987	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1987	MALE	\N	\N	+10000833881987	\N	R083388-1987	A	CLASS_10	\N	\N
6117	STRESS-083388-1988	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1988	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1988	FEMALE	\N	\N	+10000833881988	\N	R083388-1988	B	CLASS_7	\N	\N
6118	STRESS-083388-1989	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1989	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1989	MALE	\N	\N	+10000833881989	\N	R083388-1989	C	CLASS_8	\N	\N
6119	STRESS-083388-1990	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1990	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1990	MALE	\N	\N	+10000833881990	\N	R083388-1990	B	CLASS_10	\N	\N
6120	STRESS-083388-1991	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1991	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1991	FEMALE	\N	\N	+10000833881991	\N	R083388-1991	B	CLASS_10	\N	\N
6121	STRESS-083388-1992	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1992	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1992	FEMALE	\N	\N	+10000833881992	\N	R083388-1992	B	CLASS_7	\N	\N
6122	STRESS-083388-1993	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1993	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1993	FEMALE	\N	\N	+10000833881993	\N	R083388-1993	C	CLASS_9	\N	\N
6123	STRESS-083388-1994	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1994	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1994	FEMALE	\N	\N	+10000833881994	\N	R083388-1994	D	CLASS_10	\N	\N
6124	STRESS-083388-1995	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1995	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1995	FEMALE	\N	\N	+10000833881995	\N	R083388-1995	D	CLASS_9	\N	\N
6125	STRESS-083388-1996	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1996	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1996	FEMALE	\N	\N	+10000833881996	\N	R083388-1996	B	CLASS_6	\N	\N
6126	STRESS-083388-1997	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1997	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1997	FEMALE	\N	\N	+10000833881997	\N	R083388-1997	C	CLASS_6	\N	\N
6127	STRESS-083388-1998	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1998	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1998	MALE	\N	\N	+10000833881998	\N	R083388-1998	D	CLASS_7	\N	\N
6128	STRESS-083388-1999	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 1999	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-1999	FEMALE	\N	\N	+10000833881999	\N	R083388-1999	C	CLASS_7	\N	\N
6129	STRESS-083388-2000	\N	\N	2026-06-14 19:08:03.656	2026-06-14 19:08:03.656	123 Stress Test Ave, City 2000	2026-06-14 19:08:03.656	\N	Stress Test Student 083388-2000	FEMALE	\N	\N	+10000833882000	\N	R083388-2000	A	CLASS_7	\N	\N
\.


--
-- Data for Name: Subject; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Subject" (name) FROM stdin;
BANGLA
ENGLISH
MATH
SCIENCE
ICT
RELIGION
SOCIAL_SCIENCE
\.


--
-- Data for Name: SystemSetting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SystemSetting" (key, value) FROM stdin;
LICENSE_KEY	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnROYW1lIjoiVGVzdCBTY2hvb2wiLCJ0eXBlIjoiYW5udWFsIiwiaWF0IjoxNzgwODIwOTg1LCJleHAiOjE4MTIzNTY5ODV9.nxn-vmAVWDQq6lsB5oVg_dtoDjt8ouKV5TZkX76sLfo
lastBackupRun	2026-06-13T09:09:27.905Z
\.


--
-- Data for Name: TermResult; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TermResult" (id, "studentId", "examType", "totalMarks", "obtainedMarks", percentage, grade, gpa, "position", "teacherRemarks", status, "createdAt", "updatedAt") FROM stdin;
1	20	TERM_1	500	352	70.39999999999999	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.483	2026-06-14 19:04:58.483
2	20	TERM_2	500	330	66	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.487	2026-06-14 19:04:58.487
3	20	TERM_3	500	372	74.4	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.489	2026-06-14 19:04:58.489
4	37	TERM_1	500	304	60.8	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.516	2026-06-14 19:04:58.516
5	37	TERM_2	500	382	76.4	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.517	2026-06-14 19:04:58.517
6	37	TERM_3	500	341	68.2	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.519	2026-06-14 19:04:58.519
7	75	TERM_1	500	338	67.60000000000001	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.54	2026-06-14 19:04:58.54
8	75	TERM_2	500	372	74.4	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.541	2026-06-14 19:04:58.541
9	75	TERM_3	500	366	73.2	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.542	2026-06-14 19:04:58.542
10	79	TERM_1	500	361	72.2	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.561	2026-06-14 19:04:58.561
11	79	TERM_2	500	324	64.8	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.562	2026-06-14 19:04:58.562
12	79	TERM_3	500	347	69.39999999999999	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.563	2026-06-14 19:04:58.563
13	87	TERM_1	500	354	70.8	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.582	2026-06-14 19:04:58.582
14	87	TERM_2	500	358	71.6	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.583	2026-06-14 19:04:58.583
15	87	TERM_3	500	362	72.39999999999999	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.584	2026-06-14 19:04:58.584
16	88	TERM_1	500	348	69.6	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.602	2026-06-14 19:04:58.602
17	88	TERM_2	500	370	74	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.603	2026-06-14 19:04:58.603
18	88	TERM_3	500	387	77.4	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.605	2026-06-14 19:04:58.605
19	102	TERM_1	500	351	70.19999999999999	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.624	2026-06-14 19:04:58.624
20	102	TERM_2	500	333	66.60000000000001	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.625	2026-06-14 19:04:58.625
21	102	TERM_3	500	373	74.6	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.626	2026-06-14 19:04:58.626
22	103	TERM_1	500	349	69.8	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.65	2026-06-14 19:04:58.65
23	103	TERM_2	500	320	64	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.651	2026-06-14 19:04:58.651
24	103	TERM_3	500	351	70.19999999999999	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.653	2026-06-14 19:04:58.653
25	104	TERM_1	500	364	72.8	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.671	2026-06-14 19:04:58.671
26	104	TERM_2	500	358	71.6	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.672	2026-06-14 19:04:58.672
27	104	TERM_3	500	331	66.2	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.673	2026-06-14 19:04:58.673
28	105	TERM_1	500	333	66.60000000000001	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.69	2026-06-14 19:04:58.69
29	105	TERM_2	500	354	70.8	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.691	2026-06-14 19:04:58.691
30	105	TERM_3	500	336	67.2	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.692	2026-06-14 19:04:58.692
31	106	TERM_1	500	333	66.60000000000001	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.711	2026-06-14 19:04:58.711
32	106	TERM_2	500	361	72.2	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.711	2026-06-14 19:04:58.711
33	106	TERM_3	500	339	67.80000000000001	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.712	2026-06-14 19:04:58.712
34	126	TERM_1	500	358	71.6	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.729	2026-06-14 19:04:58.729
35	126	TERM_2	500	382	76.4	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.73	2026-06-14 19:04:58.73
36	126	TERM_3	500	349	69.8	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.731	2026-06-14 19:04:58.731
37	127	TERM_1	500	369	73.8	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.748	2026-06-14 19:04:58.748
38	127	TERM_2	500	343	68.60000000000001	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.749	2026-06-14 19:04:58.749
39	127	TERM_3	500	348	69.6	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.75	2026-06-14 19:04:58.75
40	128	TERM_1	500	366	73.2	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.77	2026-06-14 19:04:58.77
41	128	TERM_2	500	343	68.60000000000001	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.771	2026-06-14 19:04:58.771
42	128	TERM_3	500	356	71.2	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.771	2026-06-14 19:04:58.771
43	129	TERM_1	500	317	63.4	B	3.5	\N	\N	PUBLISHED	2026-06-14 19:04:58.788	2026-06-14 19:04:58.788
44	129	TERM_2	500	386	77.2	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.789	2026-06-14 19:04:58.789
45	129	TERM_3	500	397	79.4	A	4	\N	\N	PUBLISHED	2026-06-14 19:04:58.789	2026-06-14 19:04:58.789
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, name, "createdAt", "updatedAt", address, "canLogin", nid, phone, "profileImage", role) FROM stdin;
1	admin@edutracker.com	$2b$10$0zT.TcZXpgVkdwsKAfi0IOdFxslefx0QhrR3VT6m6Gtuz9cn7HVpK	Admin User	2026-06-07 08:28:55.601	2026-06-07 08:28:55.601	\N	t	\N	\N	\N	ADMIN
2	principal@edutracker.com	$2b$10$0zT.TcZXpgVkdwsKAfi0IOdFxslefx0QhrR3VT6m6Gtuz9cn7HVpK	Principal User	2026-06-07 08:28:55.604	2026-06-07 08:28:55.604	\N	t	\N	\N	\N	PRINCIPAL
3	teacher@edutracker.com	$2b$10$0zT.TcZXpgVkdwsKAfi0IOdFxslefx0QhrR3VT6m6Gtuz9cn7HVpK	Teacher User	2026-06-07 08:28:55.605	2026-06-07 08:28:55.605	\N	t	\N	\N	\N	TEACHER
4	staff@edutracker.com	$2b$10$0zT.TcZXpgVkdwsKAfi0IOdFxslefx0QhrR3VT6m6Gtuz9cn7HVpK	Staff User	2026-06-07 08:28:55.606	2026-06-07 08:28:55.606	\N	t	\N	\N	\N	STAFF
5	librarian@edutracker.com	$2b$10$0zT.TcZXpgVkdwsKAfi0IOdFxslefx0QhrR3VT6m6Gtuz9cn7HVpK	Librarian User	2026-06-07 08:28:55.607	2026-06-07 08:28:55.607	\N	t	\N	\N	\N	LIBRARIAN
6	accountant@edutracker.com	$2b$10$0zT.TcZXpgVkdwsKAfi0IOdFxslefx0QhrR3VT6m6Gtuz9cn7HVpK	Accountant User	2026-06-07 08:28:55.608	2026-06-07 08:28:55.608	\N	t	\N	\N	\N	ACCOUNTANT
7	clerk@edutracker.com	$2b$10$0zT.TcZXpgVkdwsKAfi0IOdFxslefx0QhrR3VT6m6Gtuz9cn7HVpK	Clerk User	2026-06-07 08:28:55.609	2026-06-07 08:28:55.609	\N	t	\N	\N	\N	CLERK
8	security@edutracker.com	$2b$10$0zT.TcZXpgVkdwsKAfi0IOdFxslefx0QhrR3VT6m6Gtuz9cn7HVpK	Security User	2026-06-07 08:28:55.611	2026-06-07 08:28:55.611	\N	t	\N	\N	\N	SECURITY
9	cleaner@edutracker.com	$2b$10$0zT.TcZXpgVkdwsKAfi0IOdFxslefx0QhrR3VT6m6Gtuz9cn7HVpK	Cleaner User	2026-06-07 08:28:55.611	2026-06-07 08:28:55.611	\N	t	\N	\N	\N	CLEANER
10	teacher.093501@school.com	$2b$10$BakS4faVgtwILyUyK4Xj7egQWK9iR2op8P07xQTpPNvlrF09yYXru	New Teacher	2026-06-10 20:58:14.788	2026-06-10 20:58:14.788	\N	t	\N	\N	\N	TEACHER
11	teacher.134523@school.com	$2b$10$z3FJbpsSBzlhfw8C.0kqd.5IKfKD.oqL/8SrzP.ZUwOt8BZDl7h8m	New Teacher	2026-06-10 20:58:55.813	2026-06-10 20:58:55.813	\N	t	\N	\N	\N	TEACHER
12	teacher.213507@school.com	$2b$10$grhhE0fwpC34XpzR.ZKk0O4Tv7EvN1vo.8MSfXceuek4Dlp/qXJBe	New Teacher	2026-06-10 21:00:14.888	2026-06-10 21:00:14.888	\N	t	\N	\N	\N	TEACHER
13	teacher.314830@school.com	$2b$10$kl5nrXrVhmRM3o0QUuMGZObh/F9.zJJoQ0W378vw3KeUSD4m.lb.W	New Teacher	2026-06-10 21:01:56.127	2026-06-10 21:01:56.127	\N	t	\N	\N	\N	TEACHER
14	teacher.413900@school.com	$2b$10$9nGAh2J3xm2gujDS.VE50O7Eb.9ai/GotHfcemJlbaaS4qsmoqRXG	New Teacher	2026-06-10 21:03:35.212	2026-06-10 21:03:35.212	\N	t	\N	\N	\N	TEACHER
15	teacher.461970@school.com	$2b$10$fHcA38HCVfLwia1esoL3huYv8rEK2oEAzhK7F1zWFGRle6DL2WMkm	New Teacher	2026-06-10 21:04:23.269	2026-06-10 21:04:23.269	\N	t	\N	\N	\N	TEACHER
16	teacher.530849@school.com	$2b$10$jfV5tZVTOhqGUjHbDJHizevNd/lyjfe84utrfoOXvEBseM7zmVQzC	New Teacher	2026-06-10 21:05:32.192	2026-06-10 21:05:32.192	\N	t	\N	\N	\N	TEACHER
17	teacher1@stress.test	password123	Teacher 1	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000001	\N	TEACHER
18	teacher2@stress.test	password123	Teacher 2	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000002	\N	TEACHER
19	teacher3@stress.test	password123	Teacher 3	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000003	\N	TEACHER
20	teacher4@stress.test	password123	Teacher 4	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000004	\N	TEACHER
21	teacher5@stress.test	password123	Teacher 5	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000005	\N	TEACHER
22	teacher6@stress.test	password123	Teacher 6	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000006	\N	TEACHER
23	teacher7@stress.test	password123	Teacher 7	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000007	\N	TEACHER
24	teacher8@stress.test	password123	Teacher 8	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000008	\N	TEACHER
25	teacher9@stress.test	password123	Teacher 9	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000009	\N	TEACHER
26	teacher10@stress.test	password123	Teacher 10	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000010	\N	TEACHER
27	teacher11@stress.test	password123	Teacher 11	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000011	\N	TEACHER
28	teacher12@stress.test	password123	Teacher 12	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000012	\N	TEACHER
29	teacher13@stress.test	password123	Teacher 13	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000013	\N	TEACHER
30	teacher14@stress.test	password123	Teacher 14	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000014	\N	TEACHER
31	teacher15@stress.test	password123	Teacher 15	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000015	\N	TEACHER
32	teacher16@stress.test	password123	Teacher 16	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000016	\N	TEACHER
33	teacher17@stress.test	password123	Teacher 17	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000017	\N	TEACHER
34	teacher18@stress.test	password123	Teacher 18	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000018	\N	TEACHER
35	teacher19@stress.test	password123	Teacher 19	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000019	\N	TEACHER
36	teacher20@stress.test	password123	Teacher 20	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000020	\N	TEACHER
37	teacher21@stress.test	password123	Teacher 21	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000021	\N	TEACHER
38	teacher22@stress.test	password123	Teacher 22	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000022	\N	TEACHER
39	teacher23@stress.test	password123	Teacher 23	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000023	\N	TEACHER
40	teacher24@stress.test	password123	Teacher 24	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000024	\N	TEACHER
41	teacher25@stress.test	password123	Teacher 25	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000025	\N	TEACHER
42	teacher26@stress.test	password123	Teacher 26	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000026	\N	TEACHER
43	teacher27@stress.test	password123	Teacher 27	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000027	\N	TEACHER
44	teacher28@stress.test	password123	Teacher 28	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000028	\N	TEACHER
45	teacher29@stress.test	password123	Teacher 29	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000029	\N	TEACHER
46	teacher30@stress.test	password123	Teacher 30	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000030	\N	TEACHER
47	teacher31@stress.test	password123	Teacher 31	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000031	\N	TEACHER
48	teacher32@stress.test	password123	Teacher 32	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000032	\N	TEACHER
49	teacher33@stress.test	password123	Teacher 33	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000033	\N	TEACHER
50	teacher34@stress.test	password123	Teacher 34	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000034	\N	TEACHER
51	teacher35@stress.test	password123	Teacher 35	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000035	\N	TEACHER
52	teacher36@stress.test	password123	Teacher 36	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000036	\N	TEACHER
53	teacher37@stress.test	password123	Teacher 37	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000037	\N	TEACHER
54	teacher38@stress.test	password123	Teacher 38	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000038	\N	TEACHER
55	teacher39@stress.test	password123	Teacher 39	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000039	\N	TEACHER
56	teacher40@stress.test	password123	Teacher 40	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000040	\N	TEACHER
57	teacher41@stress.test	password123	Teacher 41	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000041	\N	TEACHER
58	teacher42@stress.test	password123	Teacher 42	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000042	\N	TEACHER
59	teacher43@stress.test	password123	Teacher 43	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000043	\N	TEACHER
60	teacher44@stress.test	password123	Teacher 44	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000044	\N	TEACHER
61	teacher45@stress.test	password123	Teacher 45	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000045	\N	TEACHER
62	teacher46@stress.test	password123	Teacher 46	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000046	\N	TEACHER
63	teacher47@stress.test	password123	Teacher 47	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000047	\N	TEACHER
64	teacher48@stress.test	password123	Teacher 48	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000048	\N	TEACHER
65	teacher49@stress.test	password123	Teacher 49	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000049	\N	TEACHER
66	teacher50@stress.test	password123	Teacher 50	2026-06-14 19:06:10.38	2026-06-14 19:06:10.38	\N	t	\N	+1900000050	\N	TEACHER
67	teacher011073-1@stress.test	password123	Teacher 011073-1	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730001	\N	TEACHER
68	teacher011073-2@stress.test	password123	Teacher 011073-2	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730002	\N	TEACHER
69	teacher011073-3@stress.test	password123	Teacher 011073-3	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730003	\N	TEACHER
70	teacher011073-4@stress.test	password123	Teacher 011073-4	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730004	\N	TEACHER
71	teacher011073-5@stress.test	password123	Teacher 011073-5	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730005	\N	TEACHER
72	teacher011073-6@stress.test	password123	Teacher 011073-6	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730006	\N	TEACHER
73	teacher011073-7@stress.test	password123	Teacher 011073-7	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730007	\N	TEACHER
74	teacher011073-8@stress.test	password123	Teacher 011073-8	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730008	\N	TEACHER
75	teacher011073-9@stress.test	password123	Teacher 011073-9	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730009	\N	TEACHER
76	teacher011073-10@stress.test	password123	Teacher 011073-10	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730010	\N	TEACHER
77	teacher011073-11@stress.test	password123	Teacher 011073-11	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730011	\N	TEACHER
78	teacher011073-12@stress.test	password123	Teacher 011073-12	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730012	\N	TEACHER
79	teacher011073-13@stress.test	password123	Teacher 011073-13	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730013	\N	TEACHER
80	teacher011073-14@stress.test	password123	Teacher 011073-14	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730014	\N	TEACHER
81	teacher011073-15@stress.test	password123	Teacher 011073-15	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730015	\N	TEACHER
82	teacher011073-16@stress.test	password123	Teacher 011073-16	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730016	\N	TEACHER
83	teacher011073-17@stress.test	password123	Teacher 011073-17	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730017	\N	TEACHER
84	teacher011073-18@stress.test	password123	Teacher 011073-18	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730018	\N	TEACHER
85	teacher011073-19@stress.test	password123	Teacher 011073-19	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730019	\N	TEACHER
86	teacher011073-20@stress.test	password123	Teacher 011073-20	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730020	\N	TEACHER
87	teacher011073-21@stress.test	password123	Teacher 011073-21	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730021	\N	TEACHER
88	teacher011073-22@stress.test	password123	Teacher 011073-22	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730022	\N	TEACHER
89	teacher011073-23@stress.test	password123	Teacher 011073-23	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730023	\N	TEACHER
90	teacher011073-24@stress.test	password123	Teacher 011073-24	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730024	\N	TEACHER
91	teacher011073-25@stress.test	password123	Teacher 011073-25	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730025	\N	TEACHER
92	teacher011073-26@stress.test	password123	Teacher 011073-26	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730026	\N	TEACHER
93	teacher011073-27@stress.test	password123	Teacher 011073-27	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730027	\N	TEACHER
94	teacher011073-28@stress.test	password123	Teacher 011073-28	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730028	\N	TEACHER
95	teacher011073-29@stress.test	password123	Teacher 011073-29	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730029	\N	TEACHER
96	teacher011073-30@stress.test	password123	Teacher 011073-30	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730030	\N	TEACHER
97	teacher011073-31@stress.test	password123	Teacher 011073-31	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730031	\N	TEACHER
98	teacher011073-32@stress.test	password123	Teacher 011073-32	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730032	\N	TEACHER
99	teacher011073-33@stress.test	password123	Teacher 011073-33	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730033	\N	TEACHER
100	teacher011073-34@stress.test	password123	Teacher 011073-34	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730034	\N	TEACHER
101	teacher011073-35@stress.test	password123	Teacher 011073-35	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730035	\N	TEACHER
102	teacher011073-36@stress.test	password123	Teacher 011073-36	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730036	\N	TEACHER
103	teacher011073-37@stress.test	password123	Teacher 011073-37	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730037	\N	TEACHER
104	teacher011073-38@stress.test	password123	Teacher 011073-38	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730038	\N	TEACHER
105	teacher011073-39@stress.test	password123	Teacher 011073-39	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730039	\N	TEACHER
106	teacher011073-40@stress.test	password123	Teacher 011073-40	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730040	\N	TEACHER
107	teacher011073-41@stress.test	password123	Teacher 011073-41	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730041	\N	TEACHER
108	teacher011073-42@stress.test	password123	Teacher 011073-42	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730042	\N	TEACHER
109	teacher011073-43@stress.test	password123	Teacher 011073-43	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730043	\N	TEACHER
110	teacher011073-44@stress.test	password123	Teacher 011073-44	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730044	\N	TEACHER
111	teacher011073-45@stress.test	password123	Teacher 011073-45	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730045	\N	TEACHER
112	teacher011073-46@stress.test	password123	Teacher 011073-46	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730046	\N	TEACHER
113	teacher011073-47@stress.test	password123	Teacher 011073-47	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730047	\N	TEACHER
114	teacher011073-48@stress.test	password123	Teacher 011073-48	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730048	\N	TEACHER
115	teacher011073-49@stress.test	password123	Teacher 011073-49	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730049	\N	TEACHER
116	teacher011073-50@stress.test	password123	Teacher 011073-50	2026-06-14 19:06:51.588	2026-06-14 19:06:51.588	\N	t	\N	+19000110730050	\N	TEACHER
117	teacher083388-1@stress.test	password123	Teacher 083388-1	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880001	\N	TEACHER
118	teacher083388-2@stress.test	password123	Teacher 083388-2	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880002	\N	TEACHER
119	teacher083388-3@stress.test	password123	Teacher 083388-3	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880003	\N	TEACHER
120	teacher083388-4@stress.test	password123	Teacher 083388-4	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880004	\N	TEACHER
121	teacher083388-5@stress.test	password123	Teacher 083388-5	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880005	\N	TEACHER
122	teacher083388-6@stress.test	password123	Teacher 083388-6	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880006	\N	TEACHER
123	teacher083388-7@stress.test	password123	Teacher 083388-7	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880007	\N	TEACHER
124	teacher083388-8@stress.test	password123	Teacher 083388-8	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880008	\N	TEACHER
125	teacher083388-9@stress.test	password123	Teacher 083388-9	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880009	\N	TEACHER
126	teacher083388-10@stress.test	password123	Teacher 083388-10	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880010	\N	TEACHER
127	teacher083388-11@stress.test	password123	Teacher 083388-11	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880011	\N	TEACHER
128	teacher083388-12@stress.test	password123	Teacher 083388-12	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880012	\N	TEACHER
129	teacher083388-13@stress.test	password123	Teacher 083388-13	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880013	\N	TEACHER
130	teacher083388-14@stress.test	password123	Teacher 083388-14	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880014	\N	TEACHER
131	teacher083388-15@stress.test	password123	Teacher 083388-15	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880015	\N	TEACHER
132	teacher083388-16@stress.test	password123	Teacher 083388-16	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880016	\N	TEACHER
133	teacher083388-17@stress.test	password123	Teacher 083388-17	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880017	\N	TEACHER
134	teacher083388-18@stress.test	password123	Teacher 083388-18	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880018	\N	TEACHER
135	teacher083388-19@stress.test	password123	Teacher 083388-19	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880019	\N	TEACHER
136	teacher083388-20@stress.test	password123	Teacher 083388-20	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880020	\N	TEACHER
137	teacher083388-21@stress.test	password123	Teacher 083388-21	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880021	\N	TEACHER
138	teacher083388-22@stress.test	password123	Teacher 083388-22	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880022	\N	TEACHER
139	teacher083388-23@stress.test	password123	Teacher 083388-23	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880023	\N	TEACHER
140	teacher083388-24@stress.test	password123	Teacher 083388-24	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880024	\N	TEACHER
141	teacher083388-25@stress.test	password123	Teacher 083388-25	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880025	\N	TEACHER
142	teacher083388-26@stress.test	password123	Teacher 083388-26	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880026	\N	TEACHER
143	teacher083388-27@stress.test	password123	Teacher 083388-27	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880027	\N	TEACHER
144	teacher083388-28@stress.test	password123	Teacher 083388-28	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880028	\N	TEACHER
145	teacher083388-29@stress.test	password123	Teacher 083388-29	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880029	\N	TEACHER
146	teacher083388-30@stress.test	password123	Teacher 083388-30	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880030	\N	TEACHER
147	teacher083388-31@stress.test	password123	Teacher 083388-31	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880031	\N	TEACHER
148	teacher083388-32@stress.test	password123	Teacher 083388-32	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880032	\N	TEACHER
149	teacher083388-33@stress.test	password123	Teacher 083388-33	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880033	\N	TEACHER
150	teacher083388-34@stress.test	password123	Teacher 083388-34	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880034	\N	TEACHER
151	teacher083388-35@stress.test	password123	Teacher 083388-35	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880035	\N	TEACHER
152	teacher083388-36@stress.test	password123	Teacher 083388-36	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880036	\N	TEACHER
153	teacher083388-37@stress.test	password123	Teacher 083388-37	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880037	\N	TEACHER
154	teacher083388-38@stress.test	password123	Teacher 083388-38	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880038	\N	TEACHER
155	teacher083388-39@stress.test	password123	Teacher 083388-39	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880039	\N	TEACHER
156	teacher083388-40@stress.test	password123	Teacher 083388-40	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880040	\N	TEACHER
157	teacher083388-41@stress.test	password123	Teacher 083388-41	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880041	\N	TEACHER
158	teacher083388-42@stress.test	password123	Teacher 083388-42	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880042	\N	TEACHER
159	teacher083388-43@stress.test	password123	Teacher 083388-43	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880043	\N	TEACHER
160	teacher083388-44@stress.test	password123	Teacher 083388-44	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880044	\N	TEACHER
161	teacher083388-45@stress.test	password123	Teacher 083388-45	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880045	\N	TEACHER
162	teacher083388-46@stress.test	password123	Teacher 083388-46	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880046	\N	TEACHER
163	teacher083388-47@stress.test	password123	Teacher 083388-47	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880047	\N	TEACHER
164	teacher083388-48@stress.test	password123	Teacher 083388-48	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880048	\N	TEACHER
165	teacher083388-49@stress.test	password123	Teacher 083388-49	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880049	\N	TEACHER
166	teacher083388-50@stress.test	password123	Teacher 083388-50	2026-06-14 19:08:03.821	2026-06-14 19:08:03.821	\N	t	\N	+19000833880050	\N	TEACHER
\.


--
-- Data for Name: Vehicle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Vehicle" (id, "registrationNumber", make, model, capacity, status, "insuranceExpiry", "nextServiceDate", "createdAt", "updatedAt", "vehicleId") FROM stdin;
\.


--
-- Data for Name: VehicleMaintenance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VehicleMaintenance" (id, "vehicleId", date, description, cost, type, "reportedBy") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
9881996e-3ab1-4a67-ab31-e54ca95e0a72	f0ccf1a69c100d0f5315f6322554f9a91aff92b5565f6916d1133001e957df7a	2026-06-07 14:22:12.92911+06	20260523101138_add_hr_payroll_models	\N	\N	2026-06-07 14:22:12.915333+06	1
7a3b83f9-c83e-4614-9e87-a5cde93ce25f	966d56d6df8355be1bf47c2702f6db0dddafb3c30ae3c415ce22e75df6c7607c	2026-06-07 14:22:12.676671+06	20260509081017_init_database	\N	\N	2026-06-07 14:22:12.639503+06	1
5533f939-1a9d-43d4-ae00-faa89ff41dad	fb9a2f7701558ad1453945378c4e8800fba4100cca91468b4c1eb160ec22d039	2026-06-07 14:22:12.787309+06	20260514082439_align_question_paper_fields	\N	\N	2026-06-07 14:22:12.785225+06	1
7330a6bd-8bce-49aa-8330-c4f4b11eb81d	433e58de30fd864f83737780bb93b82f4d13d48e0ff85b084a411c29104afb09	2026-06-07 14:22:12.679325+06	20260509200328_rename_class_to_classname	\N	\N	2026-06-07 14:22:12.677072+06	1
afa372ca-3475-4802-a51f-2b2afbe6d4bd	bf8b66608394e4019664c23a3fef87873e0abfb9c1cae53fe4e7edff01da88ce	2026-06-07 14:22:12.717467+06	20260510061131_init_new_schema	\N	\N	2026-06-07 14:22:12.679687+06	1
b6b3b7df-b3ab-47d2-ae6e-a668d28edd19	d93bf46ace511c24db4e3f09a8e89caf9b3b87c2667056fe41c9a09b6d8d0200	2026-06-07 14:22:12.868582+06	20260522185946_add_library_management_system	\N	\N	2026-06-07 14:22:12.848007+06	1
26899228-54a8-413a-9647-1ef427101434	b753b15447d6467f622b3a86240420d3c9e3975f6dccce57e67b66c608e774e2	2026-06-07 14:22:12.725414+06	20260510074104_add_academic_report	\N	\N	2026-06-07 14:22:12.71782+06	1
b83e3abf-5100-43c6-9fea-24af7f9f5482	b86e7776704afd50992845ec4319ffba53372aa05914678e5814b9db9d98760d	2026-06-07 14:22:12.792691+06	20260515134018_add_bank_question	\N	\N	2026-06-07 14:22:12.787651+06	1
0d1214f6-c317-4049-b3e6-f2a2246583d6	50fbe3e5851e66d35b1d2ee2a988f518da577f7239890c517583f42625121320	2026-06-07 14:22:12.733008+06	20260510084214_add_settings_models	\N	\N	2026-06-07 14:22:12.725784+06	1
6950c7ff-ffc4-4561-833f-18ad23bc0f8b	87557d5b7f9707eea4bbbcc5a171eff390b42d57fd49cda245ae1c01df747377	2026-06-07 14:22:12.740111+06	20260510094735_add_mark_lock	\N	\N	2026-06-07 14:22:12.733392+06	1
38daa3bd-4e7a-424d-b52f-151044d31fd8	70c19ff76f5c853c00acd9c2948b189fd89cbe7459cd6bc4ea075dd18eee64ee	2026-06-07 14:22:12.74174+06	20260510114102_add_exam_type_basemark	\N	\N	2026-06-07 14:22:12.740452+06	1
159c2563-c706-4878-b33d-ac1dc69d7ba4	19f8c79d424a1b8540c10f83471c6a7c158b257eb5e05d4da8753058926cfdd6	2026-06-07 14:22:12.795295+06	20260515165627_add_templates_to_question_papers	\N	\N	2026-06-07 14:22:12.793017+06	1
569dbbc3-fb6b-4ba5-b6cf-2917a86ac7fd	c008327c6e5928a749df2f5f656d90b16c4f58a731a0515f3ccac953a88edb70	2026-06-07 14:22:12.747883+06	20260510122043_add_date_to_marks_unique_constraint	\N	\N	2026-06-07 14:22:12.742098+06	1
2bae4c47-bb98-412e-b036-134bc9263c5a	eb22d7b3deb4d90d82c7fad30733095eba6386708c5067d450302212271d4b5a	2026-06-07 14:22:12.754011+06	20260510143130_add_audit_log	\N	\N	2026-06-07 14:22:12.74826+06	1
c4cfad23-aa35-4790-a3e9-62f7aaf1151a	782c3f6fce7a6e456860c2534c6f68d03cd4c6074c77d0decb8bad876d69d027	2026-06-07 14:22:12.761264+06	20260510170513_add_refresh_token	\N	\N	2026-06-07 14:22:12.754388+06	1
682c502f-7e46-403f-bc2c-37ecf7fe6d92	193542d2d5c0d715d46971e9c022356baabcb9cb31e819b2c59bc935bdc0035c	2026-06-07 14:22:12.84063+06	20260515203750_init_enterprise_schema	\N	\N	2026-06-07 14:22:12.795669+06	1
d503f15b-acd5-4ab1-885d-94ce3cec4484	0b7b546a991e751cda5af5042456f77fae2325c02d37a68ef96c89f45d725644	2026-06-07 14:22:12.765847+06	20260511095622_expand_staff_fields	\N	\N	2026-06-07 14:22:12.761627+06	1
9f07ae29-20fb-4572-964b-e1e8ee195c8c	cbcb1a0e3fde6d727099d5ae011ab1ee18fef13386ef126788b3617032eaf82e	2026-06-07 14:22:12.77265+06	20260511103147_add_notifications	\N	\N	2026-06-07 14:22:12.766312+06	1
3daf3f30-63f5-429c-aa0e-751a3c467e68	3931e1dab296ca91488feff7ee23c104a0f8c36db8fe3b310f3f26e43a59c166	2026-06-07 14:22:12.900418+06	20260522201433_add_transport_management	\N	\N	2026-06-07 14:22:12.868965+06	1
bd2511c2-150f-401c-adc1-d89b0750957c	d815952a35aee399103ddeb3a519234c367269b6d027f46230f316f8938c5b65	2026-06-07 14:22:12.78487+06	20260513191441_add_question_paper_generator	\N	\N	2026-06-07 14:22:12.773029+06	1
f1cdd232-c3ac-4a73-9299-018792bb94fd	136284e6fe46c42849ce2955dec410cf01fd5dc88d070a95963967e06103778c	2026-06-07 14:22:12.842347+06	20260515204847_add_website_to_school_profile	\N	\N	2026-06-07 14:22:12.841185+06	1
d9d8a313-85c1-46b4-a1d9-382a6152c4ef	8b5bf4b3d0e4caacdb4889d9dff079bcc49953cd6ff3ea5a5a1466390b9efeb6	2026-06-07 14:22:12.843769+06	20260516075905_add_principal_role	\N	\N	2026-06-07 14:22:12.842715+06	1
671f8dc6-b114-42ad-981f-521d44ccb685	409257e8e73f4618d3327fe84543f0a1661796aee27ce6025ba2a455a9f52883	2026-06-07 14:22:12.969968+06	20260528030136_enhance_exam_types_for_bd_standard	\N	\N	2026-06-07 14:22:12.968553+06	1
58d5ee90-0985-4d32-b66f-c8c43a8cdf69	25a2b798b6b6dd58a2aef9f5fbe7ab82063f59c55ff08d1260cbd6a7e2792949	2026-06-07 14:22:12.84597+06	20260518101730_add_student_notification_preferences	\N	\N	2026-06-07 14:22:12.844085+06	1
c5d101cb-e997-4b3a-aa83-ac963f0490b7	56a8cac042ddaaf0c2991bb6a80a9eb665a217ba851234e020dd91b7f82ef316	2026-06-07 14:22:12.90488+06	20260522203635_enhance_transport_ids	\N	\N	2026-06-07 14:22:12.900832+06	1
e725b7f5-20d7-4891-8b9f-e791034e2657	2e0b1ef290cd2f99b885332159b66461ca0cac50d8253d8a35823b902ce7832c	2026-06-07 14:22:12.847648+06	20260518180605_remove_student_notification_preferences	\N	\N	2026-06-07 14:22:12.846337+06	1
ef61b50a-7b63-4c63-9e40-194349aeff6d	47c4d8c38594440ed6ea668ceec66a9700ae6e64210395485e546f23a1ce7760	2026-06-07 14:22:12.942132+06	20260523165244_add_inventory_management	\N	\N	2026-06-07 14:22:12.929465+06	1
704ccbab-3620-4d7b-9a49-233d5efe6d58	eb7b886cba661834c7ea5ad30490f9e032cdd1e9c9991880a694dc182b953d51	2026-06-07 14:22:12.906769+06	20260522203839	\N	\N	2026-06-07 14:22:12.905239+06	1
e83222d0-6062-4929-8bca-4aa7d00b7909	e1ac5c786ccdaa3e6b8511708be3c1fe64e665408305e4e0d99a3f6fa156fe7f	2026-06-07 14:22:12.915+06	20260523090654_add_admissions_inquiry_model	\N	\N	2026-06-07 14:22:12.907119+06	1
8aaa6173-458e-45a2-89b1-719755d27627	8f4dbe41372cd6b23fcc54dd7ba85a434eb30d530ef1f602bf3870c5b1d4f8ff	2026-06-07 14:22:12.963511+06	20260523190243_rename_template_to_document_template	\N	\N	2026-06-07 14:22:12.955628+06	1
056a46be-824c-4bf0-8509-6d17894c1276	c9903efa9b4b6afebc862c7c5a9a8bfb2265a692d81ad7b51fe634b0633155a4	2026-06-07 14:22:12.949958+06	20260523170802_change_role_to_table	\N	\N	2026-06-07 14:22:12.942499+06	1
5cf166d4-d554-492f-8505-aae816eb8c81	a8593c2744e99e01b22f7b53e7787563b9820b22f146e2fdde9ccd1bc44aaa48	2026-06-07 14:22:12.968232+06	20260527202106_add_exam_weightage	\N	\N	2026-06-07 14:22:12.966555+06	1
b0334455-d234-4dd9-8c42-8c9c2078ed50	27f78fcbeb1717957a6fbbc6955a17d906aa79241b8969b9adfc7ccea54e1635	2026-06-07 14:22:12.955251+06	20260523184201_add_document_templates	\N	\N	2026-06-07 14:22:12.950341+06	1
b7ae6320-4079-4e97-88f2-6c21e5565d02	1a965887081a350a365c41a0ed253b2081f1a21f796aa4ac82f8207d9d54c397	2026-06-07 14:22:12.96584+06	20260527191108_remove_student_email_unique	\N	\N	2026-06-07 14:22:12.963901+06	1
8aa08137-5436-433a-a77f-7645350bef9b	be393449b1f0fece7c3a76bd7763e10473793a7d3fd6aad0e2d42d347ee6a6df	2026-06-07 14:22:12.976879+06	20260529173557_add_attendance_lock	\N	\N	2026-06-07 14:22:12.970369+06	1
59a65131-776e-4882-828a-09076eb6931f	96298fdae044fed2e56c0d55b3a1809554fb5d0e762d4fbd4ee524f4e3b5faa7	2026-06-07 14:22:12.984138+06	20260531101009_lock_by_year_instead_of_date	\N	\N	2026-06-07 14:22:12.977313+06	1
\.


--
-- Name: AcademicReport_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AcademicReport_id_seq"', 1, false);


--
-- Name: AssetMaintenance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AssetMaintenance_id_seq"', 1, false);


--
-- Name: Asset_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Asset_id_seq"', 1, false);


--
-- Name: AttendanceLock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AttendanceLock_id_seq"', 3, true);


--
-- Name: Attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Attendance_id_seq"', 211, true);


--
-- Name: AuditLog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AuditLog_id_seq"', 97, true);


--
-- Name: BookIssue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BookIssue_id_seq"', 4, true);


--
-- Name: Book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Book_id_seq"', 6, true);


--
-- Name: BusRoute_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BusRoute_id_seq"', 3, true);


--
-- Name: BusStop_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BusStop_id_seq"', 6, true);


--
-- Name: ClassSection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ClassSection_id_seq"', 31, true);


--
-- Name: DocumentTemplate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DocumentTemplate_id_seq"', 15, true);


--
-- Name: Driver_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Driver_id_seq"', 1, false);


--
-- Name: FeeStructure_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."FeeStructure_id_seq"', 9, true);


--
-- Name: FeeType_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."FeeType_id_seq"', 10, true);


--
-- Name: FeeVoucherItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."FeeVoucherItem_id_seq"', 59, true);


--
-- Name: GradeScale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."GradeScale_id_seq"', 1, false);


--
-- Name: Inquiry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Inquiry_id_seq"', 1, false);


--
-- Name: LeaveRequest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."LeaveRequest_id_seq"', 1, false);


--
-- Name: LibraryMember_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."LibraryMember_id_seq"', 4, true);


--
-- Name: MarkLock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MarkLock_id_seq"', 11, true);


--
-- Name: Mark_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Mark_id_seq"', 507, true);


--
-- Name: Notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Notification_id_seq"', 31, true);


--
-- Name: Period_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Period_id_seq"', 1, false);


--
-- Name: RefreshToken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."RefreshToken_id_seq"', 45, true);


--
-- Name: Role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Role_id_seq"', 9, true);


--
-- Name: Routine_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Routine_id_seq"', 1, false);


--
-- Name: StaffAttendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."StaffAttendance_id_seq"', 1, false);


--
-- Name: Student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Student_id_seq"', 6129, true);


--
-- Name: TermResult_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TermResult_id_seq"', 45, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 166, true);


--
-- Name: VehicleMaintenance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."VehicleMaintenance_id_seq"', 1, false);


--
-- Name: Vehicle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Vehicle_id_seq"', 1, false);


--
-- Name: AcademicReport AcademicReport_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AcademicReport"
    ADD CONSTRAINT "AcademicReport_pkey" PRIMARY KEY (id);


--
-- Name: AssetMaintenance AssetMaintenance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AssetMaintenance"
    ADD CONSTRAINT "AssetMaintenance_pkey" PRIMARY KEY (id);


--
-- Name: Asset Asset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Asset"
    ADD CONSTRAINT "Asset_pkey" PRIMARY KEY (id);


--
-- Name: AttendanceLock AttendanceLock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AttendanceLock"
    ADD CONSTRAINT "AttendanceLock_pkey" PRIMARY KEY (id);


--
-- Name: Attendance Attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: BankQuestion BankQuestion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BankQuestion"
    ADD CONSTRAINT "BankQuestion_pkey" PRIMARY KEY (id);


--
-- Name: BookIssue BookIssue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookIssue"
    ADD CONSTRAINT "BookIssue_pkey" PRIMARY KEY (id);


--
-- Name: Book Book_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Book"
    ADD CONSTRAINT "Book_pkey" PRIMARY KEY (id);


--
-- Name: BusRoute BusRoute_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BusRoute"
    ADD CONSTRAINT "BusRoute_pkey" PRIMARY KEY (id);


--
-- Name: BusStop BusStop_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BusStop"
    ADD CONSTRAINT "BusStop_pkey" PRIMARY KEY (id);


--
-- Name: ClassSection ClassSection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClassSection"
    ADD CONSTRAINT "ClassSection_pkey" PRIMARY KEY (id);


--
-- Name: DocumentTemplate DocumentTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DocumentTemplate"
    ADD CONSTRAINT "DocumentTemplate_pkey" PRIMARY KEY (id);


--
-- Name: Driver Driver_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Driver"
    ADD CONSTRAINT "Driver_pkey" PRIMARY KEY (id);


--
-- Name: ExamType ExamType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExamType"
    ADD CONSTRAINT "ExamType_pkey" PRIMARY KEY (name);


--
-- Name: FeePayment FeePayment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeePayment"
    ADD CONSTRAINT "FeePayment_pkey" PRIMARY KEY (id);


--
-- Name: FeeStructure FeeStructure_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeeStructure"
    ADD CONSTRAINT "FeeStructure_pkey" PRIMARY KEY (id);


--
-- Name: FeeType FeeType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeeType"
    ADD CONSTRAINT "FeeType_pkey" PRIMARY KEY (id);


--
-- Name: FeeVoucherItem FeeVoucherItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeeVoucherItem"
    ADD CONSTRAINT "FeeVoucherItem_pkey" PRIMARY KEY (id);


--
-- Name: FeeVoucher FeeVoucher_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeeVoucher"
    ADD CONSTRAINT "FeeVoucher_pkey" PRIMARY KEY (id);


--
-- Name: GradeScale GradeScale_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GradeScale"
    ADD CONSTRAINT "GradeScale_pkey" PRIMARY KEY (id);


--
-- Name: Inquiry Inquiry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Inquiry"
    ADD CONSTRAINT "Inquiry_pkey" PRIMARY KEY (id);


--
-- Name: LeaveRequest LeaveRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LeaveRequest"
    ADD CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY (id);


--
-- Name: LibraryMember LibraryMember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LibraryMember"
    ADD CONSTRAINT "LibraryMember_pkey" PRIMARY KEY (id);


--
-- Name: MarkLock MarkLock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MarkLock"
    ADD CONSTRAINT "MarkLock_pkey" PRIMARY KEY (id);


--
-- Name: Mark Mark_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mark"
    ADD CONSTRAINT "Mark_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: PayrollRecord PayrollRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PayrollRecord"
    ADD CONSTRAINT "PayrollRecord_pkey" PRIMARY KEY (id);


--
-- Name: Period Period_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Period"
    ADD CONSTRAINT "Period_pkey" PRIMARY KEY (id);


--
-- Name: QuestionPaper QuestionPaper_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuestionPaper"
    ADD CONSTRAINT "QuestionPaper_pkey" PRIMARY KEY (id);


--
-- Name: Question Question_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_pkey" PRIMARY KEY (id);


--
-- Name: RefreshToken RefreshToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_pkey" PRIMARY KEY (id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: Routine Routine_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Routine"
    ADD CONSTRAINT "Routine_pkey" PRIMARY KEY (id);


--
-- Name: SchoolClass SchoolClass_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SchoolClass"
    ADD CONSTRAINT "SchoolClass_pkey" PRIMARY KEY (name);


--
-- Name: SchoolProfile SchoolProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SchoolProfile"
    ADD CONSTRAINT "SchoolProfile_pkey" PRIMARY KEY (id);


--
-- Name: StaffAttendance StaffAttendance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StaffAttendance"
    ADD CONSTRAINT "StaffAttendance_pkey" PRIMARY KEY (id);


--
-- Name: StaffSalary StaffSalary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StaffSalary"
    ADD CONSTRAINT "StaffSalary_pkey" PRIMARY KEY ("userId");


--
-- Name: Student Student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (id);


--
-- Name: Subject Subject_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subject"
    ADD CONSTRAINT "Subject_pkey" PRIMARY KEY (name);


--
-- Name: SystemSetting SystemSetting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemSetting"
    ADD CONSTRAINT "SystemSetting_pkey" PRIMARY KEY (key);


--
-- Name: TermResult TermResult_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TermResult"
    ADD CONSTRAINT "TermResult_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VehicleMaintenance VehicleMaintenance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VehicleMaintenance"
    ADD CONSTRAINT "VehicleMaintenance_pkey" PRIMARY KEY (id);


--
-- Name: Vehicle Vehicle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vehicle"
    ADD CONSTRAINT "Vehicle_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: AcademicReport_studentId_examType_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AcademicReport_studentId_examType_key" ON public."AcademicReport" USING btree ("studentId", "examType");


--
-- Name: Asset_assetId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Asset_assetId_key" ON public."Asset" USING btree ("assetId");


--
-- Name: Asset_serialNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Asset_serialNumber_key" ON public."Asset" USING btree ("serialNumber");


--
-- Name: AttendanceLock_className_section_date_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AttendanceLock_className_section_date_key" ON public."AttendanceLock" USING btree ("className", section, date);


--
-- Name: Attendance_studentId_date_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Attendance_studentId_date_key" ON public."Attendance" USING btree ("studentId", date);


--
-- Name: BankQuestion_className_subject_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BankQuestion_className_subject_idx" ON public."BankQuestion" USING btree ("className", subject);


--
-- Name: Book_isbn_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Book_isbn_key" ON public."Book" USING btree (isbn);


--
-- Name: BusRoute_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BusRoute_name_key" ON public."BusRoute" USING btree (name);


--
-- Name: ClassSection_className_section_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ClassSection_className_section_key" ON public."ClassSection" USING btree ("className", section);


--
-- Name: Driver_driverId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Driver_driverId_key" ON public."Driver" USING btree ("driverId");


--
-- Name: Driver_licenseNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Driver_licenseNumber_key" ON public."Driver" USING btree ("licenseNumber");


--
-- Name: Driver_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Driver_userId_key" ON public."Driver" USING btree ("userId");


--
-- Name: FeeStructure_className_feeTypeId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "FeeStructure_className_feeTypeId_key" ON public."FeeStructure" USING btree ("className", "feeTypeId");


--
-- Name: FeeType_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "FeeType_name_key" ON public."FeeType" USING btree (name);


--
-- Name: Inquiry_inquiryNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Inquiry_inquiryNumber_key" ON public."Inquiry" USING btree ("inquiryNumber");


--
-- Name: LibraryMember_memberId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "LibraryMember_memberId_key" ON public."LibraryMember" USING btree ("memberId");


--
-- Name: LibraryMember_studentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "LibraryMember_studentId_key" ON public."LibraryMember" USING btree ("studentId");


--
-- Name: LibraryMember_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "LibraryMember_userId_key" ON public."LibraryMember" USING btree ("userId");


--
-- Name: MarkLock_className_subject_examType_year_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "MarkLock_className_subject_examType_year_key" ON public."MarkLock" USING btree ("className", subject, "examType", year);


--
-- Name: Mark_studentId_subject_examType_year_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Mark_studentId_subject_examType_year_key" ON public."Mark" USING btree ("studentId", subject, "examType", year);


--
-- Name: PayrollRecord_userId_month_year_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PayrollRecord_userId_month_year_key" ON public."PayrollRecord" USING btree ("userId", month, year);


--
-- Name: QuestionPaper_className_subject_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "QuestionPaper_className_subject_idx" ON public."QuestionPaper" USING btree ("className", subject);


--
-- Name: QuestionPaper_examDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "QuestionPaper_examDate_idx" ON public."QuestionPaper" USING btree ("examDate");


--
-- Name: Question_questionPaperId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Question_questionPaperId_idx" ON public."Question" USING btree ("questionPaperId");


--
-- Name: RefreshToken_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RefreshToken_token_key" ON public."RefreshToken" USING btree (token);


--
-- Name: Role_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Role_name_key" ON public."Role" USING btree (name);


--
-- Name: Routine_classSectionId_dayOfWeek_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Routine_classSectionId_dayOfWeek_key" ON public."Routine" USING btree ("classSectionId", "dayOfWeek");


--
-- Name: StaffAttendance_userId_date_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StaffAttendance_userId_date_key" ON public."StaffAttendance" USING btree ("userId", date);


--
-- Name: Student_className_section_rollNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Student_className_section_rollNumber_key" ON public."Student" USING btree ("className", section, "rollNumber");


--
-- Name: Student_studentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Student_studentId_key" ON public."Student" USING btree ("studentId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_nid_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_nid_key" ON public."User" USING btree (nid);


--
-- Name: Vehicle_registrationNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Vehicle_registrationNumber_key" ON public."Vehicle" USING btree ("registrationNumber");


--
-- Name: Vehicle_vehicleId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Vehicle_vehicleId_key" ON public."Vehicle" USING btree ("vehicleId");


--
-- Name: AcademicReport AcademicReport_examType_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AcademicReport"
    ADD CONSTRAINT "AcademicReport_examType_fkey" FOREIGN KEY ("examType") REFERENCES public."ExamType"(name) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AcademicReport AcademicReport_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AcademicReport"
    ADD CONSTRAINT "AcademicReport_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AssetMaintenance AssetMaintenance_assetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AssetMaintenance"
    ADD CONSTRAINT "AssetMaintenance_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES public."Asset"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Attendance Attendance_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AuditLog AuditLog_performedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: BookIssue BookIssue_bookId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookIssue"
    ADD CONSTRAINT "BookIssue_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES public."Book"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BookIssue BookIssue_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookIssue"
    ADD CONSTRAINT "BookIssue_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public."LibraryMember"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BusRoute BusRoute_driverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BusRoute"
    ADD CONSTRAINT "BusRoute_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES public."Driver"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: BusRoute BusRoute_vehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BusRoute"
    ADD CONSTRAINT "BusRoute_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES public."Vehicle"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: BusStop BusStop_routeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BusStop"
    ADD CONSTRAINT "BusStop_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES public."BusRoute"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ClassSection ClassSection_className_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClassSection"
    ADD CONSTRAINT "ClassSection_className_fkey" FOREIGN KEY ("className") REFERENCES public."SchoolClass"(name) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ClassSection ClassSection_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClassSection"
    ADD CONSTRAINT "ClassSection_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Driver Driver_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Driver"
    ADD CONSTRAINT "Driver_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FeePayment FeePayment_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeePayment"
    ADD CONSTRAINT "FeePayment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FeePayment FeePayment_voucherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeePayment"
    ADD CONSTRAINT "FeePayment_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES public."FeeVoucher"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FeeStructure FeeStructure_className_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeeStructure"
    ADD CONSTRAINT "FeeStructure_className_fkey" FOREIGN KEY ("className") REFERENCES public."SchoolClass"(name) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FeeStructure FeeStructure_feeTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeeStructure"
    ADD CONSTRAINT "FeeStructure_feeTypeId_fkey" FOREIGN KEY ("feeTypeId") REFERENCES public."FeeType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FeeVoucherItem FeeVoucherItem_feeTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeeVoucherItem"
    ADD CONSTRAINT "FeeVoucherItem_feeTypeId_fkey" FOREIGN KEY ("feeTypeId") REFERENCES public."FeeType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FeeVoucherItem FeeVoucherItem_voucherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeeVoucherItem"
    ADD CONSTRAINT "FeeVoucherItem_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES public."FeeVoucher"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeeVoucher FeeVoucher_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeeVoucher"
    ADD CONSTRAINT "FeeVoucher_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Inquiry Inquiry_assignedToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Inquiry"
    ADD CONSTRAINT "Inquiry_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LeaveRequest LeaveRequest_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LeaveRequest"
    ADD CONSTRAINT "LeaveRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryMember LibraryMember_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LibraryMember"
    ADD CONSTRAINT "LibraryMember_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryMember LibraryMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LibraryMember"
    ADD CONSTRAINT "LibraryMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Mark Mark_examType_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mark"
    ADD CONSTRAINT "Mark_examType_fkey" FOREIGN KEY ("examType") REFERENCES public."ExamType"(name) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Mark Mark_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mark"
    ADD CONSTRAINT "Mark_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Mark Mark_subject_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mark"
    ADD CONSTRAINT "Mark_subject_fkey" FOREIGN KEY (subject) REFERENCES public."Subject"(name) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PayrollRecord PayrollRecord_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PayrollRecord"
    ADD CONSTRAINT "PayrollRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Period Period_routineId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Period"
    ADD CONSTRAINT "Period_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES public."Routine"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Period Period_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Period"
    ADD CONSTRAINT "Period_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subject"(name) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Period Period_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Period"
    ADD CONSTRAINT "Period_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: QuestionPaper QuestionPaper_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuestionPaper"
    ADD CONSTRAINT "QuestionPaper_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: QuestionPaper QuestionPaper_templateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuestionPaper"
    ADD CONSTRAINT "QuestionPaper_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES public."QuestionPaper"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Question Question_questionPaperId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_questionPaperId_fkey" FOREIGN KEY ("questionPaperId") REFERENCES public."QuestionPaper"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RefreshToken RefreshToken_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Routine Routine_classSectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Routine"
    ADD CONSTRAINT "Routine_classSectionId_fkey" FOREIGN KEY ("classSectionId") REFERENCES public."ClassSection"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StaffAttendance StaffAttendance_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StaffAttendance"
    ADD CONSTRAINT "StaffAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StaffSalary StaffSalary_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StaffSalary"
    ADD CONSTRAINT "StaffSalary_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Student Student_busRouteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_busRouteId_fkey" FOREIGN KEY ("busRouteId") REFERENCES public."BusRoute"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Student Student_busStopId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_busStopId_fkey" FOREIGN KEY ("busStopId") REFERENCES public."BusStop"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Student Student_className_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_className_fkey" FOREIGN KEY ("className") REFERENCES public."SchoolClass"(name) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Student Student_className_section_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_className_section_fkey" FOREIGN KEY ("className", section) REFERENCES public."ClassSection"("className", section) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TermResult TermResult_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TermResult"
    ADD CONSTRAINT "TermResult_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_role_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_role_fkey" FOREIGN KEY (role) REFERENCES public."Role"(name) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: VehicleMaintenance VehicleMaintenance_vehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VehicleMaintenance"
    ADD CONSTRAINT "VehicleMaintenance_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES public."Vehicle"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict dvCFqPkhxhT5gfyEa82yIJFHXWv0PW14ENeqSDhym7Ai1b48HSH9v8O7TQIhzXN

