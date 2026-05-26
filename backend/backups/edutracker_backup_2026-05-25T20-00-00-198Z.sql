--
-- PostgreSQL database dump
--

\restrict VQ59vT3HC8PB82JFjaW8qKrKzpIMHWviJCHU8rQVMBcPdmQguZiO05ii2QFcizq

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
    "baseMark" double precision DEFAULT 100 NOT NULL
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
    "examType" text NOT NULL
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
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
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
1	AST-0001	PC	Computer	2026-05-25 00:00:00	100000	NEW	Startech	ACTIVE		\N	\N		2026-05-23 19:40:33.099	2026-05-23 19:40:33.099
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
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuditLog" (id, action, "entityType", "entityId", "oldValue", "newValue", "performedBy", "timestamp") FROM stdin;
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
\.


--
-- Data for Name: BookIssue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BookIssue" (id, "bookId", "memberId", "issueDate", "dueDate", "returnDate", status, "fineAmount", notes) FROM stdin;
\.


--
-- Data for Name: BusRoute; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BusRoute" (id, name, description, "vehicleId", "driverId", fare, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: BusStop; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BusStop" (id, "routeId", name, "pickupTime", "dropTime", fare) FROM stdin;
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
\.


--
-- Data for Name: DocumentTemplate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DocumentTemplate" (id, name, type, config, "isDefault", "createdAt", "updatedAt") FROM stdin;
11	Classic Blue	ID_CARD	{"layout": "portrait", "textColor": "#1e293b", "primaryColor": "#1e40af", "secondaryColor": "#ffffff", "showExpiryDate": true, "showSchoolPhone": true, "showSchoolAddress": true}	t	2026-05-23 19:55:27.619	2026-05-23 19:55:27.619
12	Modern Dark	ID_CARD	{"layout": "landscape", "textColor": "#334155", "primaryColor": "#0f172a", "secondaryColor": "#f8fafc", "showExpiryDate": true, "showSchoolPhone": false, "showSchoolAddress": true}	f	2026-05-23 19:55:27.624	2026-05-23 19:55:27.624
13	Emerald Professional	ID_CARD	{"layout": "portrait", "textColor": "#064e3b", "primaryColor": "#059669", "secondaryColor": "#ecfdf5", "showExpiryDate": false, "showSchoolPhone": true, "showSchoolAddress": true}	f	2026-05-23 19:55:27.625	2026-05-23 19:55:27.625
14	Sunset Minimal	ID_CARD	{"layout": "portrait", "textColor": "#431407", "primaryColor": "#ea580c", "secondaryColor": "#fff7ed", "showExpiryDate": true, "showSchoolPhone": false, "showSchoolAddress": false}	f	2026-05-23 19:55:27.626	2026-05-23 19:55:27.626
15	Royal Purple	ID_CARD	{"layout": "landscape", "textColor": "#1e1b4b", "primaryColor": "#7c3aed", "secondaryColor": "#f5f3ff", "showExpiryDate": true, "showSchoolPhone": true, "showSchoolAddress": true}	f	2026-05-23 19:55:27.627	2026-05-23 19:55:27.627
16	Formal Gold	CHARACTER_CERTIFICATE	{"titleFont": "Georgia", "borderStyle": "double", "primaryColor": "#b45309"}	t	2026-05-23 19:55:27.628	2026-05-23 19:55:27.628
17	Modern Clean	CHARACTER_CERTIFICATE	{"titleFont": "Arial", "borderStyle": "solid", "primaryColor": "#2563eb"}	f	2026-05-23 19:55:27.629	2026-05-23 19:55:27.629
18	Elegant Silver	CHARACTER_CERTIFICATE	{"titleFont": "Courier New", "borderStyle": "dashed", "primaryColor": "#475569"}	f	2026-05-23 19:55:27.63	2026-05-23 19:55:27.63
19	Royal Blue	CHARACTER_CERTIFICATE	{"titleFont": "Verdana", "borderStyle": "double", "primaryColor": "#1e3a8a"}	f	2026-05-23 19:55:27.631	2026-05-23 19:55:27.631
20	Traditional Green	CHARACTER_CERTIFICATE	{"titleFont": "Times New Roman", "borderStyle": "solid", "primaryColor": "#15803d"}	f	2026-05-23 19:55:27.632	2026-05-23 19:55:27.632
21	Vintage Script	LEAVING_CERTIFICATE	{"titleFont": "Times New Roman", "borderStyle": "double", "primaryColor": "#78350f"}	t	2026-05-23 19:55:27.632	2026-05-23 19:55:27.632
22	Corporate Blue	LEAVING_CERTIFICATE	{"titleFont": "Verdana", "borderStyle": "solid", "primaryColor": "#1e3a8a"}	f	2026-05-23 19:55:27.633	2026-05-23 19:55:27.633
23	Simple Professional	LEAVING_CERTIFICATE	{"titleFont": "Arial", "borderStyle": "solid", "primaryColor": "#334155"}	f	2026-05-23 19:55:27.634	2026-05-23 19:55:27.634
24	Academic Red	LEAVING_CERTIFICATE	{"titleFont": "Georgia", "borderStyle": "double", "primaryColor": "#b91c1c"}	f	2026-05-23 19:55:27.635	2026-05-23 19:55:27.635
25	Classic Slate	LEAVING_CERTIFICATE	{"titleFont": "Courier New", "borderStyle": "dashed", "primaryColor": "#475569"}	f	2026-05-23 19:55:27.636	2026-05-23 19:55:27.636
\.


--
-- Data for Name: Driver; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Driver" (id, "userId", "licenseNumber", phone, status, "createdAt", "updatedAt", "driverId", name) FROM stdin;
\.


--
-- Data for Name: ExamType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ExamType" (name, "baseMark") FROM stdin;
CLASS_TEST	100
MONTHLY_EXAM	100
MID_TERM	100
FINAL_EXAM	100
\.


--
-- Data for Name: FeePayment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FeePayment" (id, "voucherId", "studentId", amount, "paymentDate", "paymentMethod", "transactionId", "receivedBy") FROM stdin;
\.


--
-- Data for Name: FeeStructure; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FeeStructure" (id, "className", "feeTypeId", amount) FROM stdin;
\.


--
-- Data for Name: FeeType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FeeType" (id, name, "isMonthly", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: FeeVoucher; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FeeVoucher" (id, "studentId", month, year, "dueDate", "totalAmount", "paidAmount", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: FeeVoucherItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FeeVoucherItem" (id, "voucherId", "feeTypeId", amount) FROM stdin;
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
1	INQ-2026-001	Farhan	Shamol Ahmed	+880 1533-973114	khannnaim@gmail.com	CLASS_5	Basic creative school	WALK_IN	ADMITTED		\N	\N	2026-05-23 18:39:15.406	2026-05-23 18:39:29.736
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
\.


--
-- Data for Name: Mark; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Mark" (id, "studentId", subject, score, "maxScore", date, "createdAt", "updatedAt", "examType") FROM stdin;
\.


--
-- Data for Name: MarkLock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MarkLock" (id, "className", subject, "examType", "lockedAt", "lockedBy", date) FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, "userId", title, message, type, "isRead", link, "createdAt") FROM stdin;
\.


--
-- Data for Name: PayrollRecord; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PayrollRecord" (id, "userId", month, year, "paymentDate", status, allowances, "baseSalary", deductions, "netPay", "paymentMethod") FROM stdin;
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
\.


--
-- Data for Name: RefreshToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RefreshToken" (id, token, "userId", "expiresAt", "createdAt") FROM stdin;
3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc5NTYxNDk4LCJleHAiOjE3ODAxNjYyOTh9.xVP7CH94t0rwg5enigHVzh5de5XJozvOfERk-syViKU	3	2026-05-30 18:38:18.91	2026-05-23 18:38:18.911
8	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc5NTY2MTY0LCJleHAiOjE3ODAxNzA5NjR9.1k-BonMBzVh9OvE1M0hfV7RwNc4BFYznguTxySp7tx4	1	2026-05-30 19:56:04.125	2026-05-23 19:56:04.128
11	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc5NjE3Mjg5LCJleHAiOjE3ODAyMjIwODl9.1SHb2YC1AP2-EHCyUpK_fnUWSZ7zxuXe106AwKbFvTk	1	2026-05-31 10:08:09.873	2026-05-24 10:08:09.882
14	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc5NjE4NjgyLCJleHAiOjE3ODAyMjM0ODJ9.qbxC7hNi7VIYo0BP1i9mZFYaMwaRiBxICSW-FSPU2AA	1	2026-05-31 10:31:22.606	2026-05-24 10:31:22.608
17	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc5NjIxMjY3LCJleHAiOjE3ODAyMjYwNjd9.BeEiUqLnBiA8cwXZW7YN1IBHirRWN1xNcMtnFkgacLo	1	2026-05-31 11:14:27.287	2026-05-24 11:14:27.288
20	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc5NzM2NDQ1LCJleHAiOjE3ODAzNDEyNDV9.neKFwz2EfhMndY2ul0w9seHkcsT-7WoGn_eiZsHoS9E	1	2026-06-01 19:14:05.272	2026-05-25 19:14:05.274
21	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc5NzM2NDYxLCJleHAiOjE3ODAzNDEyNjF9.te2Otv3N6W3zmlTR1vf0_3RGEyXbz12C7Vnd7P-IoqQ	1	2026-06-01 19:14:21.52	2026-05-25 19:14:21.521
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Role" (id, name, description, "createdAt", "updatedAt") FROM stdin;
1	ADMIN	Full system access	2026-05-23 18:21:54.761	2026-05-23 19:55:27.644
2	PRINCIPAL	Academic and administrative oversight	2026-05-23 18:21:54.84	2026-05-23 19:55:27.645
3	TEACHER	Class and student management	2026-05-23 18:21:54.841	2026-05-23 19:55:27.646
4	STAFF	General school staff	2026-05-23 18:21:54.842	2026-05-23 19:55:27.647
5	LIBRARIAN	Library management	2026-05-23 18:21:54.843	2026-05-23 19:55:27.648
6	ACCOUNTANT	Financial management	2026-05-23 18:21:54.844	2026-05-23 19:55:27.649
7	CLERK	Front desk and admissions	2026-05-23 18:21:54.845	2026-05-23 19:55:27.65
8	SECURITY	Campus security	2026-05-23 18:21:54.845	2026-05-23 19:55:27.65
9	CLEANER	Maintenance staff	2026-05-23 18:21:54.846	2026-05-23 19:55:27.651
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
1	EduTracker Enterprise Academy	123 Education Lane, Tech City	+880123456789	info@edutracker.com	2026-2027	\N	2026-05-23 18:21:55.095	www.edutracker.com	\N
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
\.


--
-- Data for Name: Student; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Student" (id, "studentId", email, "dateOfBirth", "createdAt", "updatedAt", address, "admissionDate", "bloodGroup", "fullName", gender, "parentName", "parentPhone", phone, "profileImage", "rollNumber", section, "className", "busRouteId", "busStopId") FROM stdin;
1	STU-2026-0001	\N	\N	2026-05-23 18:21:54.987	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:54.986	\N	Jennifer Wilson	FEMALE	\N	\N	01792968694	http://localhost:5000/uploads/default-student-pic.png	01	A	CLASS_2	\N	\N
2	STU-2026-0002	\N	\N	2026-05-23 18:21:54.991	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:54.99	\N	John Brown	MALE	\N	\N	01782859910	http://localhost:5000/uploads/default-student-pic.png	01	B	CLASS_1	\N	\N
3	STU-2026-0003	\N	\N	2026-05-23 18:21:54.993	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:54.993	\N	James Davis	MALE	\N	\N	01746343854	http://localhost:5000/uploads/default-student-pic.png	01	A	CLASS_3	\N	\N
4	STU-2026-0004	\N	\N	2026-05-23 18:21:54.994	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:54.994	\N	Michael Gonzalez	FEMALE	\N	\N	01726812121	http://localhost:5000/uploads/default-student-pic.png	01	A	CLASS_6	\N	\N
5	STU-2026-0005	\N	\N	2026-05-23 18:21:54.996	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:54.996	\N	Jennifer Miller	MALE	\N	\N	01748895837	http://localhost:5000/uploads/default-student-pic.png	02	A	CLASS_6	\N	\N
6	STU-2026-0006	\N	\N	2026-05-23 18:21:54.997	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:54.997	\N	Joseph Williams	MALE	\N	\N	01720243715	http://localhost:5000/uploads/default-student-pic.png	01	B	CLASS_2	\N	\N
7	STU-2026-0007	\N	\N	2026-05-23 18:21:54.998	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:54.998	\N	Robert Miller	MALE	\N	\N	01797569473	http://localhost:5000/uploads/default-student-pic.png	02	A	CLASS_3	\N	\N
8	STU-2026-0008	\N	\N	2026-05-23 18:21:54.999	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:54.999	\N	Jessica Lopez	MALE	\N	\N	01736597267	http://localhost:5000/uploads/default-student-pic.png	01	B	CLASS_6	\N	\N
9	STU-2026-0009	\N	\N	2026-05-23 18:21:55	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55	\N	Thomas Wilson	FEMALE	\N	\N	01791717339	http://localhost:5000/uploads/default-student-pic.png	01	B	CLASS_10	\N	\N
10	STU-2026-0010	\N	\N	2026-05-23 18:21:55.001	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.001	\N	Richard Martin	FEMALE	\N	\N	01745421419	http://localhost:5000/uploads/default-student-pic.png	01	B	CLASS_9	\N	\N
11	STU-2026-0011	\N	\N	2026-05-23 18:21:55.002	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.002	\N	Karen Jones	FEMALE	\N	\N	01762218514	http://localhost:5000/uploads/default-student-pic.png	01	B	CLASS_8	\N	\N
12	STU-2026-0012	\N	\N	2026-05-23 18:21:55.003	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.003	\N	William Jones	FEMALE	\N	\N	01730646148	http://localhost:5000/uploads/default-student-pic.png	02	B	CLASS_6	\N	\N
13	STU-2026-0013	\N	\N	2026-05-23 18:21:55.004	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.004	\N	Linda Gonzalez	FEMALE	\N	\N	01722591399	http://localhost:5000/uploads/default-student-pic.png	01	A	CLASS_4	\N	\N
14	STU-2026-0014	\N	\N	2026-05-23 18:21:55.005	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.005	\N	William Wilson	FEMALE	\N	\N	01744406782	http://localhost:5000/uploads/default-student-pic.png	02	B	CLASS_8	\N	\N
15	STU-2026-0015	\N	\N	2026-05-23 18:21:55.006	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.006	\N	Joseph Lopez	FEMALE	\N	\N	01795490026	http://localhost:5000/uploads/default-student-pic.png	01	A	CLASS_1	\N	\N
16	STU-2026-0016	\N	\N	2026-05-23 18:21:55.007	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.007	\N	Linda Miller	MALE	\N	\N	01750371730	http://localhost:5000/uploads/default-student-pic.png	03	B	CLASS_8	\N	\N
17	STU-2026-0017	\N	\N	2026-05-23 18:21:55.008	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.008	\N	Mary Smith	MALE	\N	\N	01732499475	http://localhost:5000/uploads/default-student-pic.png	01	B	CLASS_7	\N	\N
18	STU-2026-0018	\N	\N	2026-05-23 18:21:55.009	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.009	\N	Susan Thomas	MALE	\N	\N	01794959366	http://localhost:5000/uploads/default-student-pic.png	02	B	CLASS_7	\N	\N
19	STU-2026-0019	\N	\N	2026-05-23 18:21:55.01	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.009	\N	Charles Davis	MALE	\N	\N	01731329971	http://localhost:5000/uploads/default-student-pic.png	01	B	CLASS_3	\N	\N
20	STU-2026-0020	\N	\N	2026-05-23 18:21:55.011	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.01	\N	David Smith	FEMALE	\N	\N	01726168072	http://localhost:5000/uploads/default-student-pic.png	04	B	CLASS_8	\N	\N
21	STU-2026-0021	\N	\N	2026-05-23 18:21:55.011	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.011	\N	Joseph Garcia	MALE	\N	\N	01732315516	http://localhost:5000/uploads/default-student-pic.png	03	A	CLASS_3	\N	\N
22	STU-2026-0022	\N	\N	2026-05-23 18:21:55.012	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.012	\N	Thomas Brown	FEMALE	\N	\N	01786393585	http://localhost:5000/uploads/default-student-pic.png	02	B	CLASS_1	\N	\N
23	STU-2026-0023	\N	\N	2026-05-23 18:21:55.013	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.013	\N	Michael Brown	MALE	\N	\N	01718244608	http://localhost:5000/uploads/default-student-pic.png	03	B	CLASS_1	\N	\N
24	STU-2026-0024	\N	\N	2026-05-23 18:21:55.014	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.014	\N	Jennifer Thomas	FEMALE	\N	\N	01775103256	http://localhost:5000/uploads/default-student-pic.png	02	B	CLASS_9	\N	\N
25	STU-2026-0025	\N	\N	2026-05-23 18:21:55.015	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.015	\N	Linda Wilson	MALE	\N	\N	01750763695	http://localhost:5000/uploads/default-student-pic.png	02	A	CLASS_2	\N	\N
26	STU-2026-0026	\N	\N	2026-05-23 18:21:55.016	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.016	\N	Mary Rodriguez	FEMALE	\N	\N	01796800255	http://localhost:5000/uploads/default-student-pic.png	02	B	CLASS_3	\N	\N
27	STU-2026-0027	\N	\N	2026-05-23 18:21:55.017	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.017	\N	Charles Moore	FEMALE	\N	\N	01759082742	http://localhost:5000/uploads/default-student-pic.png	02	B	CLASS_2	\N	\N
28	STU-2026-0028	\N	\N	2026-05-23 18:21:55.018	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.018	\N	Susan Anderson	FEMALE	\N	\N	01747010769	http://localhost:5000/uploads/default-student-pic.png	03	B	CLASS_3	\N	\N
29	STU-2026-0029	\N	\N	2026-05-23 18:21:55.019	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.019	\N	Linda Hernandez	MALE	\N	\N	01742465234	http://localhost:5000/uploads/default-student-pic.png	03	B	CLASS_2	\N	\N
30	STU-2026-0030	\N	\N	2026-05-23 18:21:55.02	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.02	\N	William Garcia	FEMALE	\N	\N	01765336625	http://localhost:5000/uploads/default-student-pic.png	01	B	CLASS_5	\N	\N
31	STU-2026-0031	\N	\N	2026-05-23 18:21:55.021	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.021	\N	Jennifer Martin	MALE	\N	\N	01797722822	http://localhost:5000/uploads/default-student-pic.png	01	B	CLASS_4	\N	\N
32	STU-2026-0032	\N	\N	2026-05-23 18:21:55.022	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.021	\N	Jessica Wilson	FEMALE	\N	\N	01798428527	http://localhost:5000/uploads/default-student-pic.png	03	B	CLASS_6	\N	\N
33	STU-2026-0033	\N	\N	2026-05-23 18:21:55.022	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.022	\N	Sarah Martin	FEMALE	\N	\N	01787130193	http://localhost:5000/uploads/default-student-pic.png	02	B	CLASS_4	\N	\N
34	STU-2026-0034	\N	\N	2026-05-23 18:21:55.023	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.023	\N	Michael Johnson	FEMALE	\N	\N	01737144682	http://localhost:5000/uploads/default-student-pic.png	04	B	CLASS_1	\N	\N
35	STU-2026-0035	\N	\N	2026-05-23 18:21:55.024	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.024	\N	Linda Martinez	MALE	\N	\N	01778325134	http://localhost:5000/uploads/default-student-pic.png	02	A	CLASS_1	\N	\N
36	STU-2026-0036	\N	\N	2026-05-23 18:21:55.025	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.025	\N	John Lopez	FEMALE	\N	\N	01766969765	http://localhost:5000/uploads/default-student-pic.png	03	B	CLASS_9	\N	\N
37	STU-2026-0037	\N	\N	2026-05-23 18:21:55.026	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.026	\N	William Hernandez	FEMALE	\N	\N	01799037203	http://localhost:5000/uploads/default-student-pic.png	03	A	CLASS_6	\N	\N
38	STU-2026-0038	\N	\N	2026-05-23 18:21:55.027	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.027	\N	William Gonzalez	FEMALE	\N	\N	01736866812	http://localhost:5000/uploads/default-student-pic.png	04	A	CLASS_6	\N	\N
39	STU-2026-0039	\N	\N	2026-05-23 18:21:55.036	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.036	\N	Patricia Smith	MALE	\N	\N	01736541071	http://localhost:5000/uploads/default-student-pic.png	05	B	CLASS_8	\N	\N
40	STU-2026-0040	\N	\N	2026-05-23 18:21:55.037	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.037	\N	Robert Taylor	FEMALE	\N	\N	01729546346	http://localhost:5000/uploads/default-student-pic.png	04	B	CLASS_9	\N	\N
41	STU-2026-0041	\N	\N	2026-05-23 18:21:55.038	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.038	\N	Sarah Wilson	MALE	\N	\N	01719098070	http://localhost:5000/uploads/default-student-pic.png	03	A	CLASS_2	\N	\N
42	STU-2026-0042	\N	\N	2026-05-23 18:21:55.039	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.039	\N	Elizabeth Davis	MALE	\N	\N	01726476350	http://localhost:5000/uploads/default-student-pic.png	03	B	CLASS_7	\N	\N
43	STU-2026-0043	\N	\N	2026-05-23 18:21:55.04	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.04	\N	Susan Rodriguez	MALE	\N	\N	01716808870	http://localhost:5000/uploads/default-student-pic.png	01	A	CLASS_5	\N	\N
44	STU-2026-0044	\N	\N	2026-05-23 18:21:55.041	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.041	\N	Linda Jackson	MALE	\N	\N	01720040313	http://localhost:5000/uploads/default-student-pic.png	06	B	CLASS_8	\N	\N
45	STU-2026-0045	\N	\N	2026-05-23 18:21:55.042	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.042	\N	Jessica Lopez	MALE	\N	\N	01742061318	http://localhost:5000/uploads/default-student-pic.png	04	B	CLASS_3	\N	\N
46	STU-2026-0046	\N	\N	2026-05-23 18:21:55.043	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.043	\N	Elizabeth Davis	MALE	\N	\N	01762993080	http://localhost:5000/uploads/default-student-pic.png	01	A	CLASS_10	\N	\N
47	STU-2026-0047	\N	\N	2026-05-23 18:21:55.044	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.044	\N	James Martin	FEMALE	\N	\N	01773725831	http://localhost:5000/uploads/default-student-pic.png	04	B	CLASS_6	\N	\N
48	STU-2026-0048	\N	\N	2026-05-23 18:21:55.045	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.045	\N	David Anderson	MALE	\N	\N	01734013085	http://localhost:5000/uploads/default-student-pic.png	04	A	CLASS_2	\N	\N
49	STU-2026-0049	\N	\N	2026-05-23 18:21:55.046	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.045	\N	John Martin	FEMALE	\N	\N	01713553726	http://localhost:5000/uploads/default-student-pic.png	01	A	CLASS_9	\N	\N
50	STU-2026-0050	\N	\N	2026-05-23 18:21:55.047	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.047	\N	Thomas Gonzalez	FEMALE	\N	\N	01769905088	http://localhost:5000/uploads/default-student-pic.png	03	A	CLASS_1	\N	\N
51	STU-2026-0051	\N	\N	2026-05-23 18:21:55.048	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.048	\N	Michael Garcia	FEMALE	\N	\N	01740916712	http://localhost:5000/uploads/default-student-pic.png	04	A	CLASS_1	\N	\N
52	STU-2026-0052	\N	\N	2026-05-23 18:21:55.049	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.049	\N	Richard Martinez	FEMALE	\N	\N	01764334403	http://localhost:5000/uploads/default-student-pic.png	02	B	CLASS_5	\N	\N
53	STU-2026-0053	\N	\N	2026-05-23 18:21:55.05	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.049	\N	Elizabeth Lopez	MALE	\N	\N	01772024876	http://localhost:5000/uploads/default-student-pic.png	05	B	CLASS_6	\N	\N
54	STU-2026-0054	\N	\N	2026-05-23 18:21:55.05	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.05	\N	Joseph Thomas	FEMALE	\N	\N	01794750098	http://localhost:5000/uploads/default-student-pic.png	05	A	CLASS_6	\N	\N
55	STU-2026-0055	\N	\N	2026-05-23 18:21:55.051	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.051	\N	William Jackson	MALE	\N	\N	01712569599	http://localhost:5000/uploads/default-student-pic.png	05	B	CLASS_3	\N	\N
56	STU-2026-0056	\N	\N	2026-05-23 18:21:55.052	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.052	\N	David Johnson	MALE	\N	\N	01721393664	http://localhost:5000/uploads/default-student-pic.png	06	B	CLASS_3	\N	\N
57	STU-2026-0057	\N	\N	2026-05-23 18:21:55.053	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.053	\N	James Miller	FEMALE	\N	\N	01775128090	http://localhost:5000/uploads/default-student-pic.png	05	A	CLASS_2	\N	\N
58	STU-2026-0058	\N	\N	2026-05-23 18:21:55.054	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.054	\N	James Rodriguez	MALE	\N	\N	01796111022	http://localhost:5000/uploads/default-student-pic.png	01	A	CLASS_8	\N	\N
59	STU-2026-0059	\N	\N	2026-05-23 18:21:55.055	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.055	\N	Karen Hernandez	FEMALE	\N	\N	01784015787	http://localhost:5000/uploads/default-student-pic.png	03	B	CLASS_4	\N	\N
60	STU-2026-0060	\N	\N	2026-05-23 18:21:55.056	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.056	\N	Jessica Rodriguez	MALE	\N	\N	01723427688	http://localhost:5000/uploads/default-student-pic.png	07	B	CLASS_3	\N	\N
61	STU-2026-0061	\N	\N	2026-05-23 18:21:55.057	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.057	\N	Patricia Johnson	MALE	\N	\N	01744124731	http://localhost:5000/uploads/default-student-pic.png	06	A	CLASS_2	\N	\N
62	STU-2026-0062	\N	\N	2026-05-23 18:21:55.058	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.058	\N	William Jackson	MALE	\N	\N	01752132540	http://localhost:5000/uploads/default-student-pic.png	02	B	CLASS_10	\N	\N
63	STU-2026-0063	\N	\N	2026-05-23 18:21:55.06	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.059	\N	Elizabeth Hernandez	FEMALE	\N	\N	01738171660	http://localhost:5000/uploads/default-student-pic.png	02	A	CLASS_8	\N	\N
64	STU-2026-0064	\N	\N	2026-05-23 18:21:55.061	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.06	\N	Michael Brown	FEMALE	\N	\N	01735268554	http://localhost:5000/uploads/default-student-pic.png	04	B	CLASS_7	\N	\N
65	STU-2026-0065	\N	\N	2026-05-23 18:21:55.061	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.061	\N	Thomas Martinez	FEMALE	\N	\N	01765340095	http://localhost:5000/uploads/default-student-pic.png	01	A	CLASS_7	\N	\N
66	STU-2026-0066	\N	\N	2026-05-23 18:21:55.062	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.062	\N	William Johnson	MALE	\N	\N	01718729770	http://localhost:5000/uploads/default-student-pic.png	02	A	CLASS_10	\N	\N
67	STU-2026-0067	\N	\N	2026-05-23 18:21:55.063	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.063	\N	Karen Martinez	MALE	\N	\N	01725942317	http://localhost:5000/uploads/default-student-pic.png	02	A	CLASS_4	\N	\N
68	STU-2026-0068	\N	\N	2026-05-23 18:21:55.064	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.064	\N	William Anderson	FEMALE	\N	\N	01722229060	http://localhost:5000/uploads/default-student-pic.png	03	A	CLASS_8	\N	\N
69	STU-2026-0069	\N	\N	2026-05-23 18:21:55.065	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.065	\N	Elizabeth Martin	FEMALE	\N	\N	01793428833	http://localhost:5000/uploads/default-student-pic.png	02	A	CLASS_7	\N	\N
70	STU-2026-0070	\N	\N	2026-05-23 18:21:55.065	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.065	\N	William Moore	MALE	\N	\N	01759423924	http://localhost:5000/uploads/default-student-pic.png	07	B	CLASS_8	\N	\N
71	STU-2026-0071	\N	\N	2026-05-23 18:21:55.066	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.066	\N	Jessica Thomas	MALE	\N	\N	01767101936	http://localhost:5000/uploads/default-student-pic.png	03	A	CLASS_4	\N	\N
72	STU-2026-0072	\N	\N	2026-05-23 18:21:55.067	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.067	\N	Jennifer Wilson	MALE	\N	\N	01752367743	http://localhost:5000/uploads/default-student-pic.png	06	A	CLASS_6	\N	\N
73	STU-2026-0073	\N	\N	2026-05-23 18:21:55.068	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.068	\N	Robert Martinez	MALE	\N	\N	01766299391	http://localhost:5000/uploads/default-student-pic.png	05	B	CLASS_9	\N	\N
74	STU-2026-0074	\N	\N	2026-05-23 18:21:55.069	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.069	\N	Charles Gonzalez	FEMALE	\N	\N	01744623312	http://localhost:5000/uploads/default-student-pic.png	04	B	CLASS_2	\N	\N
75	STU-2026-0075	\N	\N	2026-05-23 18:21:55.069	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.069	\N	Joseph Thomas	MALE	\N	\N	01756849206	http://localhost:5000/uploads/default-student-pic.png	03	B	CLASS_5	\N	\N
76	STU-2026-0076	\N	\N	2026-05-23 18:21:55.07	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.07	\N	William Anderson	MALE	\N	\N	01731950448	http://localhost:5000/uploads/default-student-pic.png	04	B	CLASS_4	\N	\N
77	STU-2026-0077	\N	\N	2026-05-23 18:21:55.071	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.071	\N	Barbara Rodriguez	FEMALE	\N	\N	01738954333	http://localhost:5000/uploads/default-student-pic.png	04	A	CLASS_4	\N	\N
78	STU-2026-0078	\N	\N	2026-05-23 18:21:55.072	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.072	\N	Joseph Garcia	MALE	\N	\N	01714409509	http://localhost:5000/uploads/default-student-pic.png	05	B	CLASS_1	\N	\N
79	STU-2026-0079	\N	\N	2026-05-23 18:21:55.073	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.073	\N	Richard Jackson	FEMALE	\N	\N	01792699814	http://localhost:5000/uploads/default-student-pic.png	08	B	CLASS_8	\N	\N
80	STU-2026-0080	\N	\N	2026-05-23 18:21:55.074	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.074	\N	Thomas Miller	MALE	\N	\N	01772184698	http://localhost:5000/uploads/default-student-pic.png	04	B	CLASS_5	\N	\N
81	STU-2026-0081	\N	\N	2026-05-23 18:21:55.075	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.075	\N	William Anderson	FEMALE	\N	\N	01742189690	http://localhost:5000/uploads/default-student-pic.png	03	B	CLASS_10	\N	\N
82	STU-2026-0082	\N	\N	2026-05-23 18:21:55.076	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.076	\N	Charles Martin	MALE	\N	\N	01786626581	http://localhost:5000/uploads/default-student-pic.png	02	A	CLASS_9	\N	\N
83	STU-2026-0083	\N	\N	2026-05-23 18:21:55.077	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.077	\N	Joseph Rodriguez	FEMALE	\N	\N	01735640853	http://localhost:5000/uploads/default-student-pic.png	06	B	CLASS_9	\N	\N
84	STU-2026-0084	\N	\N	2026-05-23 18:21:55.078	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.078	\N	Jessica Lopez	FEMALE	\N	\N	01739380571	http://localhost:5000/uploads/default-student-pic.png	05	B	CLASS_7	\N	\N
85	STU-2026-0085	\N	\N	2026-05-23 18:21:55.079	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.079	\N	Linda Martin	MALE	\N	\N	01781557683	http://localhost:5000/uploads/default-student-pic.png	05	B	CLASS_4	\N	\N
86	STU-2026-0086	\N	\N	2026-05-23 18:21:55.08	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.08	\N	Thomas Miller	MALE	\N	\N	01777944364	http://localhost:5000/uploads/default-student-pic.png	07	B	CLASS_9	\N	\N
87	STU-2026-0087	\N	\N	2026-05-23 18:21:55.081	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.081	\N	Mary Martinez	FEMALE	\N	\N	01763789581	http://localhost:5000/uploads/default-student-pic.png	05	B	CLASS_5	\N	\N
88	STU-2026-0088	\N	\N	2026-05-23 18:21:55.081	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.081	\N	Joseph Lopez	FEMALE	\N	\N	01784112241	http://localhost:5000/uploads/default-student-pic.png	04	A	CLASS_3	\N	\N
89	STU-2026-0089	\N	\N	2026-05-23 18:21:55.082	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.082	\N	Jennifer Moore	MALE	\N	\N	01782134659	http://localhost:5000/uploads/default-student-pic.png	08	B	CLASS_9	\N	\N
90	STU-2026-0090	\N	\N	2026-05-23 18:21:55.083	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.083	\N	Patricia Martinez	FEMALE	\N	\N	01711829137	http://localhost:5000/uploads/default-student-pic.png	07	A	CLASS_2	\N	\N
91	STU-2026-0091	\N	\N	2026-05-23 18:21:55.084	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.084	\N	Jennifer Brown	FEMALE	\N	\N	01758739029	http://localhost:5000/uploads/default-student-pic.png	02	A	CLASS_5	\N	\N
92	STU-2026-0092	\N	\N	2026-05-23 18:21:55.085	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.085	\N	Jennifer Martin	MALE	\N	\N	01721524868	http://localhost:5000/uploads/default-student-pic.png	03	A	CLASS_10	\N	\N
93	STU-2026-0093	\N	\N	2026-05-23 18:21:55.086	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.086	\N	Elizabeth Rodriguez	FEMALE	\N	\N	01773282040	http://localhost:5000/uploads/default-student-pic.png	04	A	CLASS_10	\N	\N
94	STU-2026-0094	\N	\N	2026-05-23 18:21:55.087	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.087	\N	Richard Gonzalez	FEMALE	\N	\N	01761303501	http://localhost:5000/uploads/default-student-pic.png	05	A	CLASS_4	\N	\N
95	STU-2026-0095	\N	\N	2026-05-23 18:21:55.088	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.088	\N	Charles Johnson	MALE	\N	\N	01751740076	http://localhost:5000/uploads/default-student-pic.png	06	B	CLASS_6	\N	\N
96	STU-2026-0096	\N	\N	2026-05-23 18:21:55.089	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.089	\N	Elizabeth Gonzalez	FEMALE	\N	\N	01757466526	http://localhost:5000/uploads/default-student-pic.png	03	A	CLASS_5	\N	\N
97	STU-2026-0097	\N	\N	2026-05-23 18:21:55.09	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.09	\N	Elizabeth Jones	MALE	\N	\N	01771161957	http://localhost:5000/uploads/default-student-pic.png	09	B	CLASS_9	\N	\N
98	STU-2026-0098	\N	\N	2026-05-23 18:21:55.091	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.091	\N	Thomas Gonzalez	FEMALE	\N	\N	01763016031	http://localhost:5000/uploads/default-student-pic.png	08	B	CLASS_3	\N	\N
99	STU-2026-0099	\N	\N	2026-05-23 18:21:55.092	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.092	\N	Linda Smith	FEMALE	\N	\N	01761651822	http://localhost:5000/uploads/default-student-pic.png	07	A	CLASS_6	\N	\N
100	STU-2026-0100	\N	\N	2026-05-23 18:21:55.093	2026-05-24 10:13:27.383	\N	2026-05-23 18:21:55.093	\N	Charles Miller	MALE	\N	\N	01728677576	http://localhost:5000/uploads/default-student-pic.png	09	B	CLASS_8	\N	\N
101	STU-2026-0101	khannnaim@gmail.com	\N	2026-05-23 18:39:29.722	2026-05-24 10:13:27.383		2026-05-23 18:39:29.721		Farhan	MALE	Shamol Ahmed	+880 1533-973114	+880 1533-973114	http://localhost:5000/uploads/default-student-pic.png	4	A	CLASS_5	\N	\N
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
lastBackupRun	2026-05-23T20:00:00.513Z
\.


--
-- Data for Name: TermResult; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TermResult" (id, "studentId", "examType", "totalMarks", "obtainedMarks", percentage, grade, gpa, "position", "teacherRemarks", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, name, "createdAt", "updatedAt", address, "canLogin", nid, phone, "profileImage", role) FROM stdin;
1	admin@edutracker.com	$2b$10$d7ZxtDUc4VX2C2MriT/K/uzig9eAoLs08qTTE/eGjUS4eNDn16jCy	Admin User	2026-05-23 18:21:54.9	2026-05-23 19:55:27.707	\N	t	\N	\N	\N	ADMIN
2	principal@edutracker.com	$2b$10$d7ZxtDUc4VX2C2MriT/K/uzig9eAoLs08qTTE/eGjUS4eNDn16jCy	Principal User	2026-05-23 18:21:54.904	2026-05-23 19:55:27.708	\N	t	\N	\N	\N	PRINCIPAL
3	teacher@edutracker.com	$2b$10$d7ZxtDUc4VX2C2MriT/K/uzig9eAoLs08qTTE/eGjUS4eNDn16jCy	Teacher User	2026-05-23 18:21:54.905	2026-05-23 19:55:27.709	\N	t	\N	\N	\N	TEACHER
4	staff@edutracker.com	$2b$10$d7ZxtDUc4VX2C2MriT/K/uzig9eAoLs08qTTE/eGjUS4eNDn16jCy	Staff User	2026-05-23 18:21:54.906	2026-05-23 19:55:27.71	\N	t	\N	\N	\N	STAFF
5	librarian@edutracker.com	$2b$10$d7ZxtDUc4VX2C2MriT/K/uzig9eAoLs08qTTE/eGjUS4eNDn16jCy	Librarian User	2026-05-23 18:21:54.907	2026-05-23 19:55:27.71	\N	t	\N	\N	\N	LIBRARIAN
6	accountant@edutracker.com	$2b$10$d7ZxtDUc4VX2C2MriT/K/uzig9eAoLs08qTTE/eGjUS4eNDn16jCy	Accountant User	2026-05-23 18:21:54.908	2026-05-23 19:55:27.711	\N	t	\N	\N	\N	ACCOUNTANT
7	clerk@edutracker.com	$2b$10$d7ZxtDUc4VX2C2MriT/K/uzig9eAoLs08qTTE/eGjUS4eNDn16jCy	Clerk User	2026-05-23 18:21:54.908	2026-05-23 19:55:27.712	\N	t	\N	\N	\N	CLERK
8	security@edutracker.com	$2b$10$d7ZxtDUc4VX2C2MriT/K/uzig9eAoLs08qTTE/eGjUS4eNDn16jCy	Security User	2026-05-23 18:21:54.91	2026-05-23 19:55:27.712	\N	t	\N	\N	\N	SECURITY
9	cleaner@edutracker.com	$2b$10$d7ZxtDUc4VX2C2MriT/K/uzig9eAoLs08qTTE/eGjUS4eNDn16jCy	Cleaner User	2026-05-23 18:21:54.911	2026-05-23 19:55:27.713	\N	t	\N	\N	\N	CLEANER
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
08d8e32f-80ec-4192-9500-ff8c97ef3d9b	f0ccf1a69c100d0f5315f6322554f9a91aff92b5565f6916d1133001e957df7a	2026-05-24 00:20:51.193826+06	20260523101138_add_hr_payroll_models	\N	\N	2026-05-24 00:20:51.180384+06	1
8dcfbaec-dc49-4da3-95fb-c703ea85ed2f	966d56d6df8355be1bf47c2702f6db0dddafb3c30ae3c415ce22e75df6c7607c	2026-05-24 00:20:50.953392+06	20260509081017_init_database	\N	\N	2026-05-24 00:20:50.929812+06	1
9c2f336f-eea4-4bb3-ba1f-45284f292153	fb9a2f7701558ad1453945378c4e8800fba4100cca91468b4c1eb160ec22d039	2026-05-24 00:20:51.062139+06	20260514082439_align_question_paper_fields	\N	\N	2026-05-24 00:20:51.059939+06	1
4390690a-d087-42f0-9917-07d0bf0609a8	433e58de30fd864f83737780bb93b82f4d13d48e0ff85b084a411c29104afb09	2026-05-24 00:20:50.955566+06	20260509200328_rename_class_to_classname	\N	\N	2026-05-24 00:20:50.953746+06	1
4308ca9b-7c10-4e74-8d59-7e910341b9f7	bf8b66608394e4019664c23a3fef87873e0abfb9c1cae53fe4e7edff01da88ce	2026-05-24 00:20:50.98815+06	20260510061131_init_new_schema	\N	\N	2026-05-24 00:20:50.95591+06	1
9db21e57-7c7e-4b13-be23-739ac49c9c89	d93bf46ace511c24db4e3f09a8e89caf9b3b87c2667056fe41c9a09b6d8d0200	2026-05-24 00:20:51.136364+06	20260522185946_add_library_management_system	\N	\N	2026-05-24 00:20:51.116466+06	1
b1b15355-c4e0-4b31-8f93-7a1495cb4d98	b753b15447d6467f622b3a86240420d3c9e3975f6dccce57e67b66c608e774e2	2026-05-24 00:20:50.995774+06	20260510074104_add_academic_report	\N	\N	2026-05-24 00:20:50.988506+06	1
504398c3-d3a3-4fe7-8a05-085433366b53	b86e7776704afd50992845ec4319ffba53372aa05914678e5814b9db9d98760d	2026-05-24 00:20:51.068286+06	20260515134018_add_bank_question	\N	\N	2026-05-24 00:20:51.062516+06	1
f110012a-4b86-4894-8e11-22f2c2be0c33	50fbe3e5851e66d35b1d2ee2a988f518da577f7239890c517583f42625121320	2026-05-24 00:20:51.004832+06	20260510084214_add_settings_models	\N	\N	2026-05-24 00:20:50.996217+06	1
35d814cd-d59f-4401-9de1-621cb0850539	87557d5b7f9707eea4bbbcc5a171eff390b42d57fd49cda245ae1c01df747377	2026-05-24 00:20:51.010417+06	20260510094735_add_mark_lock	\N	\N	2026-05-24 00:20:51.005204+06	1
115b361e-0fe4-48d9-a001-ccf9c255cea7	70c19ff76f5c853c00acd9c2948b189fd89cbe7459cd6bc4ea075dd18eee64ee	2026-05-24 00:20:51.012203+06	20260510114102_add_exam_type_basemark	\N	\N	2026-05-24 00:20:51.01077+06	1
1aeaeef9-ca45-4cca-9dc4-3cdc53b1bc8c	19f8c79d424a1b8540c10f83471c6a7c158b257eb5e05d4da8753058926cfdd6	2026-05-24 00:20:51.07081+06	20260515165627_add_templates_to_question_papers	\N	\N	2026-05-24 00:20:51.068659+06	1
ded5cb90-b54d-4e8f-bd78-12b580f34f58	c008327c6e5928a749df2f5f656d90b16c4f58a731a0515f3ccac953a88edb70	2026-05-24 00:20:51.017667+06	20260510122043_add_date_to_marks_unique_constraint	\N	\N	2026-05-24 00:20:51.012509+06	1
0d6a45c8-eee8-4766-9095-eb850b02fe63	eb22d7b3deb4d90d82c7fad30733095eba6386708c5067d450302212271d4b5a	2026-05-24 00:20:51.0242+06	20260510143130_add_audit_log	\N	\N	2026-05-24 00:20:51.018007+06	1
09ece51b-c059-4e08-a226-48ae27feedac	782c3f6fce7a6e456860c2534c6f68d03cd4c6074c77d0decb8bad876d69d027	2026-05-24 00:20:51.031834+06	20260510170513_add_refresh_token	\N	\N	2026-05-24 00:20:51.024562+06	1
48959abc-0ccf-4685-adf3-fb841b102bfb	193542d2d5c0d715d46971e9c022356baabcb9cb31e819b2c59bc935bdc0035c	2026-05-24 00:20:51.109859+06	20260515203750_init_enterprise_schema	\N	\N	2026-05-24 00:20:51.071207+06	1
0b990566-235d-4715-a3e7-4e8a7f3a2714	0b7b546a991e751cda5af5042456f77fae2325c02d37a68ef96c89f45d725644	2026-05-24 00:20:51.036373+06	20260511095622_expand_staff_fields	\N	\N	2026-05-24 00:20:51.03223+06	1
ad0ba6c5-0dff-4c8f-b7a9-a6b0699bf4d6	cbcb1a0e3fde6d727099d5ae011ab1ee18fef13386ef126788b3617032eaf82e	2026-05-24 00:20:51.045221+06	20260511103147_add_notifications	\N	\N	2026-05-24 00:20:51.037077+06	1
83d4ae6d-c1d8-4667-a76c-2734e4c52781	3931e1dab296ca91488feff7ee23c104a0f8c36db8fe3b310f3f26e43a59c166	2026-05-24 00:20:51.166917+06	20260522201433_add_transport_management	\N	\N	2026-05-24 00:20:51.136761+06	1
170af0f1-6c08-4905-aa68-0aa314a8def3	d815952a35aee399103ddeb3a519234c367269b6d027f46230f316f8938c5b65	2026-05-24 00:20:51.05954+06	20260513191441_add_question_paper_generator	\N	\N	2026-05-24 00:20:51.045637+06	1
0f593a5f-5634-4484-9a31-4858657d5ef9	136284e6fe46c42849ce2955dec410cf01fd5dc88d070a95963967e06103778c	2026-05-24 00:20:51.11146+06	20260515204847_add_website_to_school_profile	\N	\N	2026-05-24 00:20:51.110251+06	1
e1a07fc9-e9b1-417c-bc76-6d67811e31c1	8b5bf4b3d0e4caacdb4889d9dff079bcc49953cd6ff3ea5a5a1466390b9efeb6	2026-05-24 00:20:51.112805+06	20260516075905_add_principal_role	\N	\N	2026-05-24 00:20:51.11178+06	1
0ea4bb1c-6f93-4dc9-810b-feafd163cc47	25a2b798b6b6dd58a2aef9f5fbe7ab82063f59c55ff08d1260cbd6a7e2792949	2026-05-24 00:20:51.11447+06	20260518101730_add_student_notification_preferences	\N	\N	2026-05-24 00:20:51.113119+06	1
9e4434ac-5490-4ac9-a955-c01e40b746a1	56a8cac042ddaaf0c2991bb6a80a9eb665a217ba851234e020dd91b7f82ef316	2026-05-24 00:20:51.171154+06	20260522203635_enhance_transport_ids	\N	\N	2026-05-24 00:20:51.167293+06	1
5037292f-ebf1-48b4-9b15-227bae259121	2e0b1ef290cd2f99b885332159b66461ca0cac50d8253d8a35823b902ce7832c	2026-05-24 00:20:51.115986+06	20260518180605_remove_student_notification_preferences	\N	\N	2026-05-24 00:20:51.114778+06	1
bc5ca8a1-9344-4c21-ae28-f49b624759e7	47c4d8c38594440ed6ea668ceec66a9700ae6e64210395485e546f23a1ce7760	2026-05-24 00:20:51.207787+06	20260523165244_add_inventory_management	\N	\N	2026-05-24 00:20:51.194205+06	1
4b47b4f5-195a-416b-93e5-7f4aeda47577	eb7b886cba661834c7ea5ad30490f9e032cdd1e9c9991880a694dc182b953d51	2026-05-24 00:20:51.172905+06	20260522203839	\N	\N	2026-05-24 00:20:51.17151+06	1
a3247ded-f185-48ab-9ec5-321685a8e750	e1ac5c786ccdaa3e6b8511708be3c1fe64e665408305e4e0d99a3f6fa156fe7f	2026-05-24 00:20:51.180037+06	20260523090654_add_admissions_inquiry_model	\N	\N	2026-05-24 00:20:51.173214+06	1
b4d12936-1e1c-4fe3-b0b2-2dedb3db2896	8f4dbe41372cd6b23fcc54dd7ba85a434eb30d530ef1f602bf3870c5b1d4f8ff	2026-05-24 01:02:43.484747+06	20260523190243_rename_template_to_document_template	\N	\N	2026-05-24 01:02:43.409279+06	1
4d452639-3360-4710-9755-63c153b21dbe	c9903efa9b4b6afebc862c7c5a9a8bfb2265a692d81ad7b51fe634b0633155a4	2026-05-24 00:20:51.215752+06	20260523170802_change_role_to_table	\N	\N	2026-05-24 00:20:51.20814+06	1
b2d7ed3b-d461-446d-866f-47ec4914e217	27f78fcbeb1717957a6fbbc6955a17d906aa79241b8969b9adfc7ccea54e1635	2026-05-24 00:42:01.968774+06	20260523184201_add_document_templates	\N	\N	2026-05-24 00:42:01.901452+06	1
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

SELECT pg_catalog.setval('public."Asset_id_seq"', 1, true);


--
-- Name: Attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Attendance_id_seq"', 1, false);


--
-- Name: AuditLog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AuditLog_id_seq"', 1, false);


--
-- Name: BookIssue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BookIssue_id_seq"', 1, false);


--
-- Name: Book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Book_id_seq"', 1, false);


--
-- Name: BusRoute_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BusRoute_id_seq"', 1, false);


--
-- Name: BusStop_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BusStop_id_seq"', 1, false);


--
-- Name: ClassSection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ClassSection_id_seq"', 20, true);


--
-- Name: DocumentTemplate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DocumentTemplate_id_seq"', 25, true);


--
-- Name: Driver_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Driver_id_seq"', 1, false);


--
-- Name: FeeStructure_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."FeeStructure_id_seq"', 1, false);


--
-- Name: FeeType_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."FeeType_id_seq"', 1, false);


--
-- Name: FeeVoucherItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."FeeVoucherItem_id_seq"', 1, false);


--
-- Name: GradeScale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."GradeScale_id_seq"', 1, false);


--
-- Name: Inquiry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Inquiry_id_seq"', 1, true);


--
-- Name: LeaveRequest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."LeaveRequest_id_seq"', 1, false);


--
-- Name: LibraryMember_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."LibraryMember_id_seq"', 1, false);


--
-- Name: MarkLock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MarkLock_id_seq"', 1, false);


--
-- Name: Mark_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Mark_id_seq"', 1, false);


--
-- Name: Notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Notification_id_seq"', 1, false);


--
-- Name: Period_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Period_id_seq"', 1, false);


--
-- Name: RefreshToken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."RefreshToken_id_seq"', 21, true);


--
-- Name: Role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Role_id_seq"', 36, true);


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

SELECT pg_catalog.setval('public."Student_id_seq"', 102, true);


--
-- Name: TermResult_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TermResult_id_seq"', 1, false);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 36, true);


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
-- Name: MarkLock_className_subject_examType_date_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "MarkLock_className_subject_examType_date_key" ON public."MarkLock" USING btree ("className", subject, "examType", date);


--
-- Name: Mark_studentId_subject_examType_date_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Mark_studentId_subject_examType_date_key" ON public."Mark" USING btree ("studentId", subject, "examType", date);


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
-- Name: Student_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Student_email_key" ON public."Student" USING btree (email);


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

\unrestrict VQ59vT3HC8PB82JFjaW8qKrKzpIMHWviJCHU8rQVMBcPdmQguZiO05ii2QFcizq

