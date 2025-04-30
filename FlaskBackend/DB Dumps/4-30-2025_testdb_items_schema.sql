--
-- PostgreSQL database dump
--

-- Dumped from database version 17.3
-- Dumped by pg_dump version 17.3

-- Started on 2025-04-30 13:30:29

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 25802)
-- Name: accountlogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accountlogs (
    id integer NOT NULL,
    actiontype character varying(50),
    email character varying(255),
    dateperformed timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    role character varying(10)
);


ALTER TABLE public.accountlogs OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 25806)
-- Name: accountlogs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accountlogs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accountlogs_id_seq OWNER TO postgres;

--
-- TOC entry 4871 (class 0 OID 0)
-- Dependencies: 218
-- Name: accountlogs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accountlogs_id_seq OWNED BY public.accountlogs.id;


--
-- TOC entry 219 (class 1259 OID 25807)
-- Name: building; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.building (
    bid integer NOT NULL,
    buildingcode character varying(10),
    latitude double precision,
    longitude double precision
);


ALTER TABLE public.building OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 25810)
-- Name: building2_BID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.building ALTER COLUMN bid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."building2_BID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 25811)
-- Name: claimeditems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.claimeditems (
    id integer NOT NULL,
    itemtype character varying(255) NOT NULL,
    locationfound character varying(255),
    itemdescription text,
    datefound timestamp with time zone NOT NULL,
    dateclaimed timestamp with time zone NOT NULL,
    lflocation character varying(50) NOT NULL,
    fid integer,
    rid integer,
    subcategory character varying(50)
);


ALTER TABLE public.claimeditems OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 25817)
-- Name: claimeditems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.claimeditems ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.claimeditems_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 25818)
-- Name: floors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.floors (
    fid integer NOT NULL,
    bid integer NOT NULL,
    floornumber integer NOT NULL
);


ALTER TABLE public.floors OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 25821)
-- Name: floors_fid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.floors ALTER COLUMN fid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.floors_fid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 225 (class 1259 OID 25822)
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    id integer NOT NULL,
    itemtype character varying(255) NOT NULL,
    locationfound character varying(255),
    itemdescription text,
    datefound timestamp with time zone NOT NULL,
    lflocation character varying(50) NOT NULL,
    image_path character varying(255),
    fid integer,
    rid integer,
    subcategory character varying(50)
);


ALTER TABLE public.items OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 25828)
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.items ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 227 (class 1259 OID 25829)
-- Name: operationslogitems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.operationslogitems (
    id integer NOT NULL,
    actiontype character varying(50),
    itemtype character varying(255),
    locationfound character varying(255),
    description text,
    datefound timestamp with time zone,
    dateperformed timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    performedby character varying(255),
    lflocation character varying(50),
    subcategory character varying(50)
);


ALTER TABLE public.operationslogitems OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 25835)
-- Name: operationslogitems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.operationslogitems_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.operationslogitems_id_seq OWNER TO postgres;

--
-- TOC entry 4872 (class 0 OID 0)
-- Dependencies: 228
-- Name: operationslogitems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.operationslogitems_id_seq OWNED BY public.operationslogitems.id;


--
-- TOC entry 229 (class 1259 OID 25836)
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    pid integer NOT NULL,
    bid integer NOT NULL,
    uid integer NOT NULL
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 25839)
-- Name: permissions_pid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.permissions ALTER COLUMN pid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.permissions_pid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 231 (class 1259 OID 25840)
-- Name: rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms (
    rid integer NOT NULL,
    bid integer NOT NULL,
    floornumber integer NOT NULL,
    roomnumber integer NOT NULL
);


ALTER TABLE public.rooms OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 25843)
-- Name: rooms_rid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.rooms ALTER COLUMN rid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.rooms_rid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 233 (class 1259 OID 25844)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    uid integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    email text NOT NULL,
    role character varying(15),
    active boolean DEFAULT true NOT NULL,
    authtoken text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 25850)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4873 (class 0 OID 0)
-- Dependencies: 234
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.uid;


--
-- TOC entry 235 (class 1259 OID 25851)
-- Name: users_uid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN uid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_uid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    CYCLE
);


--
-- TOC entry 4682 (class 2604 OID 25852)
-- Name: accountlogs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accountlogs ALTER COLUMN id SET DEFAULT nextval('public.accountlogs_id_seq'::regclass);


--
-- TOC entry 4684 (class 2604 OID 25853)
-- Name: operationslogitems id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.operationslogitems ALTER COLUMN id SET DEFAULT nextval('public.operationslogitems_id_seq'::regclass);


--
-- TOC entry 4696 (class 2606 OID 25855)
-- Name: floors Building Floors ; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.floors
    ADD CONSTRAINT "Building Floors " UNIQUE (bid, floornumber);


--
-- TOC entry 4688 (class 2606 OID 25857)
-- Name: accountlogs accountlogs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accountlogs
    ADD CONSTRAINT accountlogs_pkey PRIMARY KEY (id);


--
-- TOC entry 4690 (class 2606 OID 25859)
-- Name: building building2_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.building
    ADD CONSTRAINT building2_pkey PRIMARY KEY (bid);


--
-- TOC entry 4692 (class 2606 OID 25861)
-- Name: building buildingcode; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.building
    ADD CONSTRAINT buildingcode UNIQUE (buildingcode);


--
-- TOC entry 4694 (class 2606 OID 25863)
-- Name: claimeditems claimeditems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claimeditems
    ADD CONSTRAINT claimeditems_pkey PRIMARY KEY (id);


--
-- TOC entry 4698 (class 2606 OID 25865)
-- Name: floors floors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.floors
    ADD CONSTRAINT floors_pkey PRIMARY KEY (fid);


--
-- TOC entry 4700 (class 2606 OID 25867)
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- TOC entry 4702 (class 2606 OID 25869)
-- Name: operationslogitems operationslogitems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.operationslogitems
    ADD CONSTRAINT operationslogitems_pkey PRIMARY KEY (id);


--
-- TOC entry 4704 (class 2606 OID 25871)
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (pid);


--
-- TOC entry 4706 (class 2606 OID 25873)
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (rid);


--
-- TOC entry 4708 (class 2606 OID 25875)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4710 (class 2606 OID 25877)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (uid);


--
-- TOC entry 4712 (class 2606 OID 25879)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4719 (class 2606 OID 25880)
-- Name: permissions BFK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT "BFK" FOREIGN KEY (bid) REFERENCES public.building(bid) NOT VALID;


--
-- TOC entry 4720 (class 2606 OID 25885)
-- Name: permissions UFK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT "UFK" FOREIGN KEY (uid) REFERENCES public.users(uid) NOT VALID;


--
-- TOC entry 4716 (class 2606 OID 25890)
-- Name: floors buildingReference; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.floors
    ADD CONSTRAINT "buildingReference" FOREIGN KEY (bid) REFERENCES public.building(bid) NOT VALID;


--
-- TOC entry 4713 (class 2606 OID 25895)
-- Name: claimeditems claimeditems_lflocation_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claimeditems
    ADD CONSTRAINT claimeditems_lflocation_fkey FOREIGN KEY (lflocation) REFERENCES public.building(buildingcode) NOT VALID;


--
-- TOC entry 4717 (class 2606 OID 25900)
-- Name: items fk_floor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT fk_floor FOREIGN KEY (fid) REFERENCES public.floors(fid);


--
-- TOC entry 4714 (class 2606 OID 25905)
-- Name: claimeditems fk_floor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claimeditems
    ADD CONSTRAINT fk_floor FOREIGN KEY (fid) REFERENCES public.floors(fid);


--
-- TOC entry 4718 (class 2606 OID 25910)
-- Name: items fk_room; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT fk_room FOREIGN KEY (rid) REFERENCES public.rooms(rid);


--
-- TOC entry 4715 (class 2606 OID 25915)
-- Name: claimeditems fk_room; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claimeditems
    ADD CONSTRAINT fk_room FOREIGN KEY (rid) REFERENCES public.rooms(rid);


-- Completed on 2025-04-30 13:30:29

--
-- PostgreSQL database dump complete
--

