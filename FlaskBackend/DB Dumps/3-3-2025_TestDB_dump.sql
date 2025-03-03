--
-- PostgreSQL database dump
--

-- Dumped from database version 17.3
-- Dumped by pg_dump version 17.3

-- Started on 2025-03-03 10:52:13

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

DROP DATABASE IF EXISTS "TestDB";
--
-- TOC entry 4829 (class 1262 OID 16387)
-- Name: TestDB; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "TestDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';


ALTER DATABASE "TestDB" OWNER TO postgres;

\connect "TestDB"

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
-- TOC entry 217 (class 1259 OID 16388)
-- Name: building; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.building (
    buildingcode character varying(10) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL
);


ALTER TABLE public.building OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16391)
-- Name: claimeditems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.claimeditems (
    id integer NOT NULL,
    itemtype character varying(10) NOT NULL,
    locationfound character varying(255),
    itemdescription text,
    datefound date NOT NULL,
    dateclaimed date NOT NULL,
    lflocation character varying(50) NOT NULL
);


ALTER TABLE public.claimeditems OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16396)
-- Name: claimeditems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.claimeditems_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.claimeditems_id_seq OWNER TO postgres;

--
-- TOC entry 4830 (class 0 OID 0)
-- Dependencies: 219
-- Name: claimeditems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.claimeditems_id_seq OWNED BY public.claimeditems.id;


--
-- TOC entry 220 (class 1259 OID 16397)
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    id integer NOT NULL,
    itemtype character varying(10) NOT NULL,
    locationfound character varying(255),
    itemdescription text,
    datefound date NOT NULL,
    lflocation character varying(50) NOT NULL,
    image_path character varying(255)
);


ALTER TABLE public.items OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16402)
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_id_seq OWNER TO postgres;

--
-- TOC entry 4831 (class 0 OID 0)
-- Dependencies: 221
-- Name: items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.items_id_seq OWNED BY public.items.id;


--
-- TOC entry 222 (class 1259 OID 16403)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    email text NOT NULL,
    role character varying(15),
    building character varying(7)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16408)
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
-- TOC entry 4832 (class 0 OID 0)
-- Dependencies: 223
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4655 (class 2604 OID 16409)
-- Name: claimeditems id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claimeditems ALTER COLUMN id SET DEFAULT nextval('public.claimeditems_id_seq'::regclass);


--
-- TOC entry 4656 (class 2604 OID 16410)
-- Name: items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.items_id_seq'::regclass);


--
-- TOC entry 4657 (class 2604 OID 16411)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4817 (class 0 OID 16388)
-- Dependencies: 217
-- Data for Name: building; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.building (buildingcode, latitude, longitude) VALUES ('SEM', 39.53997066634282, -119.81337585204943);
INSERT INTO public.building (buildingcode, latitude, longitude) VALUES ('DMSC', 39.5389777947623, -119.81243707896208);
INSERT INTO public.building (buildingcode, latitude, longitude) VALUES ('AB', 39.54009930458632, -119.81476669193907);


--
-- TOC entry 4818 (class 0 OID 16391)
-- Dependencies: 218
-- Data for Name: claimeditems; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.claimeditems (id, itemtype, locationfound, itemdescription, datefound, dateclaimed, lflocation) VALUES (1, 'technology', 'AB 2nd floor', 'Iphone', '2024-11-13', '2024-11-26', 'SEM');
INSERT INTO public.claimeditems (id, itemtype, locationfound, itemdescription, datefound, dateclaimed, lflocation) VALUES (2, 'misc', 'AB 2nd floor', 'Wallet', '2024-12-17', '2024-12-03', 'SEM');
INSERT INTO public.claimeditems (id, itemtype, locationfound, itemdescription, datefound, dateclaimed, lflocation) VALUES (3, 'technology', 'AB 2nd floor', 'Pink iphone 16', '2024-12-12', '2024-12-03', 'SEM');


--
-- TOC entry 4820 (class 0 OID 16397)
-- Dependencies: 220
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.items (id, itemtype, locationfound, itemdescription, datefound, lflocation, image_path) VALUES (1, 'misc', 'Gym 3rd floor', 'Wallet', '2024-11-06', 'DMSC', '\N');
INSERT INTO public.items (id, itemtype, locationfound, itemdescription, datefound, lflocation, image_path) VALUES (2, 'technology', 'AB 2nd floor', 'iphone', '2024-11-20', 'DMSC', '\N');
INSERT INTO public.items (id, itemtype, locationfound, itemdescription, datefound, lflocation, image_path) VALUES (3, 'misc', 'SEM 1st floor', 'notebook', '2025-01-22', 'SEM', '\N');
INSERT INTO public.items (id, itemtype, locationfound, itemdescription, datefound, lflocation, image_path) VALUES (4, 'technology', 'DMSC 1st floor', 'apple pencil', '2025-01-27', 'DMSC', '\N');
INSERT INTO public.items (id, itemtype, locationfound, itemdescription, datefound, lflocation, image_path) VALUES (5, 'clothing', 'AB 2nd floor', 'gloves', '2025-01-10', 'AB', '\N');
INSERT INTO public.items (id, itemtype, locationfound, itemdescription, datefound, lflocation, image_path) VALUES (6, 'technology', 'DMSC', 'calculator', '2023-03-20', 'DMSC', '\N');


--
-- TOC entry 4822 (class 0 OID 16403)
-- Dependencies: 222
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, username, password, email, role, building) VALUES (1, 'admin', 'scrypt:32768:8:1$VU932aYSMdYtiEMQ$8a38c7cb9c649fe61b9c0368ed76551539925c2cf51fc96f3e8c35e272d40d0c57e683b69ff062de7598fe5f9ca54cc83df50b6b8c1dcfc2d4dc2600db617636', 'admin@unr.edu', 'admin', '\N');
INSERT INTO public.users (id, username, password, email, role, building) VALUES (2, 'super', 'scrypt:32768:8:1$JwNf0F4jpMl7K6TC$e88358a47ef4d9b1b66be5b85f5a48953eba94761a965abd0044e158c02a8fb8a113b32ab1988377d3f771381d3d13cf16855bdb4826c661e33b77498b7e8f32', 'super@unr.edu', 'superadmin', '\N');
INSERT INTO public.users (id, username, password, email, role, building) VALUES (3, 'user', 'scrypt:32768:8:1$SS85Bq1FUmVJ6B7V$6ca32f30524123025ed013c9a5def0dad55a50ab06dc75137080dc755f76cd2955ef46ddb912a67504d40068e712863bbb21e24c7ffe504fa7974b7bd1e90383', 'user@unr.edu', 'user', 'SEM');


--
-- TOC entry 4833 (class 0 OID 0)
-- Dependencies: 219
-- Name: claimeditems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.claimeditems_id_seq', 16, true);


--
-- TOC entry 4834 (class 0 OID 0)
-- Dependencies: 221
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_id_seq', 24, true);


--
-- TOC entry 4835 (class 0 OID 0)
-- Dependencies: 223
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 42, true);


--
-- TOC entry 4659 (class 2606 OID 16413)
-- Name: building building_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.building
    ADD CONSTRAINT building_pkey PRIMARY KEY (buildingcode);


--
-- TOC entry 4661 (class 2606 OID 16415)
-- Name: claimeditems claimeditems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claimeditems
    ADD CONSTRAINT claimeditems_pkey PRIMARY KEY (id);


--
-- TOC entry 4663 (class 2606 OID 16417)
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- TOC entry 4665 (class 2606 OID 16419)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4667 (class 2606 OID 16421)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4669 (class 2606 OID 16423)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4670 (class 2606 OID 16424)
-- Name: claimeditems claimeditems_lflocation_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.claimeditems
    ADD CONSTRAINT claimeditems_lflocation_fkey FOREIGN KEY (lflocation) REFERENCES public.building(buildingcode) ON DELETE CASCADE;


--
-- TOC entry 4671 (class 2606 OID 16429)
-- Name: items items_lflocation_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_lflocation_fkey FOREIGN KEY (lflocation) REFERENCES public.building(buildingcode) ON DELETE CASCADE;


-- Completed on 2025-03-03 10:52:14

--
-- PostgreSQL database dump complete
--

