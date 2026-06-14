--
-- PostgreSQL database dump
--

\restrict i8AHUL4BWp28wilb3f3LuVuADCkX0pGlHszf2ZgCtowyVe9wIGL0GtI54qPqakp

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
125	STU-530849	\N	\N	2026-06-10 21:05:31.127	2026-06-10 21:05:32.278	\N	2026-06-10 21:05:31.127	\N	Test Student Updated	MALE	\N	\N	\N	\N	530849	Z	CLASS_10	3	5
126	STU-TEST-999	\N	\N	2026-06-13 09:55:50.611	2026-06-13 09:55:50.611	\N	2026-06-13 09:55:50.611	\N	Test Student	MALE	\N	\N	\N	\N	999	A	CLASS_5	\N	\N
127	STU-UNIQUE-TEST-0001	\N	\N	2026-06-13 09:58:01.279	2026-06-13 09:58:01.279	\N	2026-06-13 09:58:01.279	\N	Test Student	MALE	\N	\N	\N	\N	9999	A	CLASS_5	\N	\N
128	STU-TEST-1781344772615	\N	\N	2026-06-13 09:59:32.631	2026-06-13 09:59:32.631	\N	2026-06-13 09:59:32.631	\N	Test Student	MALE	\N	\N	\N	\N	2615	A	CLASS_5	\N	\N
129	STU-TEST-1781458229839	\N	\N	2026-06-14 17:30:29.919	2026-06-14 17:30:29.919	\N	2026-06-14 17:30:29.919	\N	Test Student	MALE	\N	\N	\N	\N	9839	A	CLASS_5	\N	\N
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

SELECT pg_catalog.setval('public."ClassSection_id_seq"', 21, true);


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

SELECT pg_catalog.setval('public."Student_id_seq"', 4129, true);


--
-- Name: TermResult_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TermResult_id_seq"', 45, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 116, true);


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

\unrestrict i8AHUL4BWp28wilb3f3LuVuADCkX0pGlHszf2ZgCtowyVe9wIGL0GtI54qPqakp

