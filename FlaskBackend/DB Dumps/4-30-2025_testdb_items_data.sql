--
-- PostgreSQL database dump
--

-- Dumped from database version 17.3
-- Dumped by pg_dump version 17.3

-- Started on 2025-04-30 18:54:58

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
-- TOC entry 4860 (class 0 OID 26515)
-- Dependencies: 217
-- Data for Name: accountlogs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4862 (class 0 OID 26520)
-- Dependencies: 219
-- Data for Name: building; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.building OVERRIDING SYSTEM VALUE VALUES (1, 'AB', 39.54009930458632, -119.8147667);
INSERT INTO public.building OVERRIDING SYSTEM VALUE VALUES (2, 'DMSC', 39.53897779, -119.8124371);
INSERT INTO public.building OVERRIDING SYSTEM VALUE VALUES (3, 'SEM', 39.53997066634282, -119.8133759);
INSERT INTO public.building OVERRIDING SYSTEM VALUE VALUES (4, 'WFC', 39.54367255269794, -119.8174417);
INSERT INTO public.building OVERRIDING SYSTEM VALUE VALUES (5, 'CFA', 39.54131494062608, -119.8166946);
INSERT INTO public.building OVERRIDING SYSTEM VALUE VALUES (6, 'JCSU', 39.544720859083924, -119.81598851154206);
INSERT INTO public.building OVERRIDING SYSTEM VALUE VALUES (7, 'WPEB', 39.53986374555423, -119.81198315732013);


--
-- TOC entry 4866 (class 0 OID 26530)
-- Dependencies: 223
-- Data for Name: floors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (1, 1, 1);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (2, 1, 2);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (3, 1, 3);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (4, 1, 4);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (5, 2, 1);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (6, 2, 2);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (7, 2, 3);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (8, 2, 4);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (9, 3, 1);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (10, 3, 2);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (11, 3, 3);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (12, 3, 4);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (13, 4, 1);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (14, 4, 2);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (15, 4, 3);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (16, 4, 4);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (17, 6, 1);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (18, 6, 2);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (19, 6, 3);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (20, 6, 4);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (21, 7, 1);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (22, 7, 2);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (23, 7, 3);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (24, 7, 4);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (25, 5, 1);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (26, 5, 2);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (27, 5, 3);
INSERT INTO public.floors OVERRIDING SYSTEM VALUE VALUES (28, 5, 4);


--
-- TOC entry 4874 (class 0 OID 26551)
-- Dependencies: 231
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 101);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (2, 1, 1, 102);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (3, 1, 1, 103);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (4, 1, 1, 104);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (5, 1, 2, 201);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (6, 1, 2, 202);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (7, 1, 2, 203);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (8, 1, 2, 204);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (9, 1, 3, 301);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (10, 1, 3, 302);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (11, 1, 3, 303);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (12, 1, 3, 304);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (13, 1, 4, 401);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (14, 1, 4, 402);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (15, 1, 4, 403);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (16, 1, 4, 404);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (17, 2, 1, 101);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (18, 2, 1, 102);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (19, 2, 1, 103);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (20, 2, 1, 104);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (21, 2, 2, 201);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (22, 2, 2, 202);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (23, 2, 2, 203);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (24, 2, 2, 204);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (25, 2, 3, 301);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (26, 2, 3, 302);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (27, 2, 3, 303);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (28, 2, 3, 304);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (29, 2, 4, 401);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (30, 2, 4, 402);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (31, 2, 4, 403);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (32, 2, 4, 404);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (33, 3, 1, 101);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (34, 3, 1, 102);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (35, 3, 1, 103);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (36, 3, 1, 104);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (37, 3, 2, 201);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (38, 3, 2, 202);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (39, 3, 2, 203);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (40, 3, 2, 204);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (41, 3, 3, 301);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (42, 3, 3, 302);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (43, 3, 3, 303);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (44, 3, 3, 304);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (45, 3, 4, 401);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (46, 3, 4, 402);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (47, 3, 4, 403);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (48, 3, 4, 404);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (49, 4, 1, 101);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (50, 4, 1, 102);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (51, 4, 1, 103);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (52, 4, 1, 104);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (53, 4, 2, 201);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (54, 4, 2, 202);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (55, 4, 2, 203);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (56, 4, 2, 204);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (57, 4, 3, 301);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (58, 4, 3, 302);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (59, 4, 3, 303);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (60, 4, 3, 304);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (61, 4, 4, 401);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (62, 4, 4, 402);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (63, 4, 4, 403);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (64, 4, 4, 404);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (65, 6, 1, 101);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (66, 6, 1, 102);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (67, 6, 1, 103);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (68, 6, 1, 104);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (69, 6, 2, 201);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (70, 6, 2, 202);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (71, 6, 2, 203);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (72, 6, 2, 204);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (73, 6, 3, 301);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (74, 6, 3, 302);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (75, 6, 3, 303);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (76, 6, 3, 304);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (77, 6, 4, 401);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (78, 6, 4, 402);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (79, 6, 4, 403);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (80, 6, 4, 404);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (81, 7, 1, 101);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (82, 7, 1, 102);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (83, 7, 1, 103);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (84, 7, 1, 104);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (85, 7, 2, 201);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (86, 7, 2, 202);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (87, 7, 2, 203);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (88, 7, 2, 204);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (89, 7, 3, 301);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (90, 7, 3, 302);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (91, 7, 3, 303);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (92, 7, 3, 304);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (93, 7, 4, 401);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (94, 7, 4, 402);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (95, 7, 4, 403);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (96, 7, 4, 404);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (97, 5, 1, 101);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (98, 5, 1, 102);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (99, 5, 1, 103);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (100, 5, 1, 104);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (101, 5, 2, 201);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (102, 5, 2, 202);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (103, 5, 2, 203);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (104, 5, 2, 204);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (105, 5, 3, 301);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (106, 5, 3, 302);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (107, 5, 3, 303);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (108, 5, 3, 304);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (109, 5, 4, 401);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (110, 5, 4, 402);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (111, 5, 4, 403);
INSERT INTO public.rooms OVERRIDING SYSTEM VALUE VALUES (112, 5, 4, 404);


--
-- TOC entry 4864 (class 0 OID 26524)
-- Dependencies: 221
-- Data for Name: claimeditems; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4868 (class 0 OID 26534)
-- Dependencies: 225
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (1, 'technology', 'AB Floor 1', 'iPhone 13 Pro Max with blue silicone case.', '2025-04-29 17:36:23.772011-07', 'AB', NULL, 1, 1, 'Phones');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (2, 'clothing', 'AB Floor 2', 'UNR Engineering Club grey hoodie (size M).', '2025-04-29 17:38:26.686159-07', 'AB', NULL, 2, 5, 'Hoodies & Sweatshirts');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (3, 'bags', 'AB Floor 3', 'Black North Face Borealis backpack with red zipper pulls.', '2025-04-29 17:39:40.981573-07', 'AB', NULL, 3, 9, 'Backpacks');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (4, 'medical_health', 'AB Floor 1', 'Ray-Ban prescription glasses in brown tortoise-shell frame.', '2025-04-29 17:53:05.991917-07', 'AB', NULL, 1, 1, 'Glasses & Contacts');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (5, 'school', 'AB Floor 2', 'Five Star college-ruled spiral notebook, blue cover.', '2025-04-29 17:54:13.328296-07', 'AB', NULL, 2, 5, 'Notebooks');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (6, 'clothing', 'DMSC Floor 1', 'White Nike Air Force 1 sneakers (size 10.5).', '2025-04-29 17:55:44.491064-07', 'DMSC', NULL, 5, 17, 'Footwear');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (7, 'sports_rec', 'DMSC Floor 2', '32 oz Hydro Flask with sticker-covered exterior.', '2025-04-29 17:58:28.501981-07', 'DMSC', NULL, 6, 21, 'Water Bottles');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (8, 'technology', 'DMSC Floor 3', 'SanDisk 64GB USB 3.0 drive with keyring loop.', '2025-04-29 18:00:54.179908-07', 'DMSC', NULL, 7, 25, 'USB Drives');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (9, 'miscellaneous', 'DMSC Floor 4', 'Gold chain necklace with small heart pendant.', '2025-04-29 18:03:09.455743-07', 'DMSC', NULL, 8, 29, 'Jewelry');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (10, 'Keys_IDs', 'DMSC Floor 1', 'Honda Civic key fob with pink puff keychain.', '2025-04-29 18:04:42.867793-07', 'DMSC', NULL, 5, 17, 'Car Keys');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (11, 'clothing', 'SEM Floor 1', 'UNR Wolf Pack navy blue beanie with logo patch.', '2025-04-29 18:06:08.332056-07', 'SEM', NULL, 9, 33, 'Hats & Beanies');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (12, 'technology', 'SEM Floor 2', 'TI-84 Plus graphing calculator with cracked screen protector.', '2025-04-29 18:07:20.991712-07', 'SEM', NULL, 10, 37, 'Calculators');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (13, 'medical_health', 'SEM Floor 3', 'Blue Ventolin inhaler (albuterol sulfate).', '2025-04-29 18:07:51.13462-07', 'SEM', NULL, 11, 41, 'Inhalers');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (14, 'bags', 'SEM Floor 4', 'Brown leather Fossil wallet with multiple card slots.', '2025-04-29 18:08:36.365307-07', 'SEM', NULL, 12, 45, 'Wallets');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (15, 'school', 'SEM Floor 3', 'Calculus: Early Transcendentals by James Stewart (8th Edition).', '2025-04-29 18:09:16.443327-07', 'SEM', NULL, 11, 41, 'Textbooks');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (16, 'sports_rec', 'Found outside the WFC', 'Razor A5 Lux scooter with worn black grips.', '2025-04-29 18:12:10.097485-07', 'WFC', NULL, 13, 49, 'Skateboards/Scooters');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (17, 'technology', 'Found at the treadmill area', 'Apple AirPods Pro (2nd Gen) in white case.', '2025-04-29 18:16:09.255542-07', 'WFC', NULL, 13, 51, 'Headphones & Earbuds');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (18, 'clothing', 'Found on the first floor ', 'Knitted grey scarf with matching touchscreen gloves.', '2025-04-29 18:17:10.492475-07', 'WFC', NULL, 15, 57, 'Scarves & Gloves');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (19, 'Keys_IDs', 'Found on the 3rd floor', 'University of Nevada student ID card with WolfCard holder.', '2025-04-29 18:18:54.240537-07', 'WFC', NULL, 13, 50, 'Student ID');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (20, 'miscellaneous', 'Main floor ', 'Compact black umbrella with automatic open/close button.', '2025-04-29 18:20:37.782229-07', 'WFC', NULL, 14, 53, 'Umbrellas');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (21, 'technology', 'Found at Los Trojes', 'Fitbit Charge 5 with teal band.', '2025-04-29 18:23:58.458241-07', 'CFA', NULL, 25, 97, 'Smartwatches & Wearables');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (22, 'clothing', 'CFA first floor ', 'Levi’s 511 slim-fit jeans (dark wash, size 32x32).', '2025-04-29 18:25:05.551194-07', 'CFA', NULL, 26, 103, 'Pants & Shorts');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (23, 'bags', 'CFA floor 2', 'Canvas Trader Joe’s tote with floral design.', '2025-04-29 18:26:50.407382-07', 'CFA', NULL, 27, 105, 'Tote Bags');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (24, 'medical_health', 'CFA auditorium ', 'Mini first aid kit in red zip pouch with white cross symbol.', '2025-04-29 18:27:35.653352-07', 'CFA', NULL, 26, 101, 'First Aid Items');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (25, 'school', 'CFA first floor', 'Pack of 10 Pilot G2 gel pens (black ink).', '2025-04-29 18:28:06.944378-07', 'CFA', NULL, 25, 99, 'Pens & Pencils');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (26, 'sports_rec', 'Found on the 2nd floor''s bathroom', 'Black Under Armour football mouthguard in case.', '2025-04-29 18:29:34.881153-07', 'JCSU', NULL, 17, 65, 'Protective Gear');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (27, 'Keys_IDs', 'Found on one of the tables in front of Taco Bell', 'UNR dorm access fob (blue with silver trim).', '2025-04-29 18:30:38.757009-07', 'JCSU', NULL, 19, 73, 'Fobs or Access Cards');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (28, 'miscellaneous', 'Found on the 4th floor''s auditorium ', 'The Midnight Library by Matt Haig (paperback edition).', '2025-04-29 18:32:04.723814-07', 'JCSU', NULL, 20, 77, 'Books & Novels');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (29, 'technology', 'Found on the 4th floor', 'Anker 6ft braided USB-C to USB-C charging cable (red).', '2025-04-29 18:33:07.624834-07', 'JCSU', NULL, 17, 65, 'Chargers & Cables');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (30, 'clothing', 'Found in the bathroom on the 4th floor', 'UNR Nursing student scrub top (navy blue, size S).', '2025-04-29 18:33:38.269647-07', 'JCSU', NULL, 17, 65, 'Uniforms');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (31, 'sports_rec', 'Found at the basketball quad', 'Spalding basketball ', '2025-04-30 10:46:19.143294-07', 'WFC', NULL, 13, 49, 'Balls');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (32, 'clothing', 'WFC first floor''s bathroom ', 'Chequered white and blue sweatshirt', '2025-04-30 10:50:02.097074-07', 'WFC', NULL, 13, 49, 'Hoodies & Sweatshirts');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (33, 'sports_rec', 'Found by the water fountain on the first floor of the WFC', 'White hustle shaker bottle ', '2025-04-30 10:51:18.78085-07', 'WFC', NULL, 13, 49, 'Water Bottles');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (34, 'sports_rec', 'Found by the weight area on the WFC ', 'Gymreaper workout belt ', '2025-04-30 10:53:12.009633-07', 'WFC', NULL, 13, 49, 'Workout Equipment');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (35, 'sports_rec', 'Found by the water fountain on the first floor ', 'Starbucks acrylic bottle with a pink animal sticker ', '2025-04-30 10:54:19.124274-07', 'WFC', NULL, 13, 49, 'Water Bottles');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (36, 'sports_rec', 'Found at a water fountain at the first floor ', 'Starbucks acrylic bottle with a Hello Kitty My Melody sticker ', '2025-04-30 10:55:34.520204-07', 'WFC', NULL, 13, 49, 'Water Bottles');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (37, 'sports_rec', 'Found by the treadmil area ', 'Black blender bottle ', '2025-04-30 10:56:07.499449-07', 'WFC', NULL, 13, 49, 'Water Bottles');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (38, 'sports_rec', 'Found by the lifting area ', 'Light blue hydroiflask ', '2025-04-30 10:56:38.316007-07', 'WFC', NULL, 13, 49, 'Water Bottles');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (39, 'sports_rec', 'Found at the basketball quad', 'Light green/blue stanley water bottle ', '2025-04-30 10:57:16.578294-07', 'WFC', NULL, 13, 49, 'Water Bottles');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (40, 'sports_rec', 'Found at the basketball quad', 'Black hydroflask ', '2025-04-30 10:57:36.938301-07', 'WFC', NULL, 13, 49, 'Water Bottles');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (41, 'clothing', 'Found in the first floor''s bathroom', 'Blue hoodie with text Our filed, our game text', '2025-04-30 10:59:04.922433-07', 'WFC', NULL, 13, 49, 'Jackets & Coats');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (42, 'sports_rec', 'Found in the first floor''s bathroom', 'Green hydroflask ', '2025-04-30 10:59:28.427925-07', 'WFC', NULL, 13, 49, 'Water Bottles');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (43, 'clothing', 'Found in the first floor''s bathroom', 'Black sewatpants ', '2025-04-30 11:00:31.331666-07', 'WFC', NULL, 13, 49, 'Pants & Shorts');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (44, 'clothing', 'Found at the basketball quad', 'Gray hoodie ', '2025-04-30 11:01:00.355854-07', 'WFC', NULL, 13, 49, 'Hoodies & Sweatshirts');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (45, 'sports_rec', 'WFC first floor''s bathroom ', 'Black shaker bottle (Blender bottle brand)', '2025-04-30 11:01:34.565225-07', 'WFC', NULL, 13, 49, 'Water Bottles');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (46, 'clothing', 'Found at the basketball quad', 'Black hoodie ', '2025-04-30 11:02:00.487551-07', 'WFC', NULL, 13, 49, 'Hoodies & Sweatshirts');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (47, 'clothing', 'WFC first floor''s bathroom ', 'Blue UNR hoodie (has Nevada text with UNR''s wolf)', '2025-04-30 11:02:30.815663-07', 'WFC', NULL, 13, 49, 'Hoodies & Sweatshirts');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (48, 'sports_rec', 'Found in the first floor''s bathroom', 'Gatorade face towell ', '2025-04-30 11:03:45.13939-07', 'WFC', NULL, 13, 49, 'Other Recreational Items');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (49, 'clothing', 'WFC first floor''s bathroom ', 'Bass Pro Shop hat', '2025-04-30 11:04:03.230599-07', 'WFC', NULL, 13, 49, 'Hats & Beanies');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (50, 'sports_rec', 'Found in the first floor ', 'Orange racket ', '2025-04-30 11:04:34.861441-07', 'WFC', NULL, 13, 49, 'Rackets & Bats');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (51, 'clothing', 'Found at the basketball quad', 'Green hat with text Im just out here trusting God', '2025-04-30 11:05:16.005093-07', 'WFC', NULL, 13, 49, 'Hats & Beanies');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (52, 'clothing', 'Found in the first floor''s bathroom', 'Gray sweatpants ', '2025-04-30 11:05:38.191121-07', 'WFC', NULL, 13, 49, 'Pants & Shorts');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (53, 'clothing', 'Found in the first floor''s bathroom', 'Black hat with a lightning design ', '2025-04-30 11:06:16.466841-07', 'WFC', NULL, 13, 49, 'Hats & Beanies');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (54, 'technology', 'Found at the basketball quad', 'Beige sony headphones ', '2025-04-30 11:06:46.232513-07', 'WFC', NULL, 13, 49, 'Headphones & Earbuds');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (55, 'clothing', 'Found in the first floor''s bathroom', 'Gray shorts ', '2025-04-30 11:07:04.206666-07', 'WFC', NULL, 13, 49, 'Pants & Shorts');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (56, 'technology', 'Found in the first floor''s bathroom', 'Apple watch with gray wristband ', '2025-04-30 11:07:35.778537-07', 'WFC', NULL, 13, 49, 'Smartwatches & Wearables');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (57, 'sports_rec', 'Found by a water fountain on the first floor ', 'Light blue water bottle with United by success text ', '2025-04-30 11:08:32.736064-07', 'WFC', NULL, 13, 49, 'Water Bottles');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (58, 'technology', 'Found at the basketball quad', 'Pink apple watch with no wristband ', '2025-04-30 11:08:57.896354-07', 'WFC', NULL, 13, 49, 'Smartwatches & Wearables');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (59, 'technology', 'WFC first floor''s bathroom ', 'Earbuds with pink case', '2025-04-30 11:10:03.094834-07', 'WFC', NULL, 13, 49, 'Headphones & Earbuds');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (60, 'technology', 'WFC first floor''s bathroom ', 'Blue Tozo earbuds case', '2025-04-30 11:10:38.521288-07', 'WFC', NULL, 13, 49, 'Headphones & Earbuds');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (61, 'miscellaneous', 'WFC first floor''s bathroom ', 'Transparent hairclip ', '2025-04-30 11:11:10.500704-07', 'WFC', NULL, 13, 49, 'Misc. Personal Items');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (62, 'miscellaneous', 'WFC first floor''s bathroom ', 'Black sunglasses', '2025-04-30 11:11:42.969168-07', 'WFC', NULL, 13, 49, 'Sunglasses');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (63, 'miscellaneous', 'WFC first floor''s bathroom ', 'Dark green sunglasses', '2025-04-30 11:12:02.015579-07', 'WFC', NULL, 13, 49, 'Sunglasses');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (64, 'miscellaneous', 'Found at the basketball quad', 'Black sun glasses ', '2025-04-30 11:12:34.535886-07', 'WFC', NULL, 13, 49, 'Sunglasses');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (65, 'technology', 'Found in the first floor''s bathroom', 'White apple earbuds first model ', '2025-04-30 11:13:05.352752-07', 'WFC', NULL, 13, 49, 'Headphones & Earbuds');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (66, 'medical_health', 'Found by the treadmil area', 'Red inhaler ', '2025-04-30 11:13:30.628769-07', 'WFC', NULL, 13, 49, 'Inhalers');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (67, 'Keys_IDs', 'WFC first floor''s bathroom ', 'Car keys with a pink hello kitty key ', '2025-04-30 11:14:14.944493-07', 'WFC', NULL, 13, 49, 'Car Keys');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (68, 'technology', 'Found by the treadmil area', 'Apple earbuds case with no earbuds ', '2025-04-30 11:14:44.998151-07', 'WFC', NULL, 13, 49, 'Headphones & Earbuds');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (69, 'technology', 'Found at the basketball quad', 'Apple earbuds (case and earbuds)', '2025-04-30 11:15:07.150127-07', 'WFC', NULL, 13, 49, 'Headphones & Earbuds');
INSERT INTO public.items OVERRIDING SYSTEM VALUE VALUES (70, 'technology', 'WFC first floor''s bathroom ', 'Light purple Jlab earbuds (case and earbuds)', '2025-04-30 11:17:02.8085-07', 'WFC', NULL, 13, 49, 'Headphones & Earbuds');


--
-- TOC entry 4870 (class 0 OID 26540)
-- Dependencies: 227
-- Data for Name: operationslogitems; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.operationslogitems VALUES (1, 'INSERT', 'technology', 'AB Floor 1', 'iPhone 13 Pro Max with blue silicone case.', '2025-04-29 17:36:23.772011-07', '2025-04-29 17:36:23.781487-07', 'golden.koala.tafg@letterprotect.com', 'AB', 'Phones');
INSERT INTO public.operationslogitems VALUES (2, 'INSERT', 'clothing', 'AB Floor 2', 'UNR Engineering Club grey hoodie (size M).', '2025-04-29 17:38:26.686159-07', '2025-04-29 17:38:26.701887-07', 'golden.koala.tafg@letterprotect.com', 'AB', 'Hoodies & Sweatshirts');
INSERT INTO public.operationslogitems VALUES (3, 'INSERT', 'bags', 'AB Floor 3', 'Black North Face Borealis backpack with red zipper pulls.', '2025-04-29 17:39:40.981573-07', '2025-04-29 17:39:41.018614-07', 'golden.koala.tafg@letterprotect.com', 'AB', 'Backpacks');
INSERT INTO public.operationslogitems VALUES (4, 'INSERT', 'medical_health', 'AB Floor 1', 'Ray-Ban prescription glasses in brown tortoise-shell frame.', '2025-04-29 17:53:05.991917-07', '2025-04-29 17:53:06.02473-07', 'golden.koala.tafg@letterprotect.com', 'AB', 'Glasses & Contacts');
INSERT INTO public.operationslogitems VALUES (5, 'INSERT', 'school', 'AB Floor 2', 'Five Star college-ruled spiral notebook, blue cover.', '2025-04-29 17:54:13.328296-07', '2025-04-29 17:54:13.331957-07', 'golden.koala.tafg@letterprotect.com', 'AB', 'Notebooks');
INSERT INTO public.operationslogitems VALUES (6, 'INSERT', 'clothing', 'DMSC Floor 1', 'White Nike Air Force 1 sneakers (size 10.5).', '2025-04-29 17:55:44.491064-07', '2025-04-29 17:55:44.495945-07', 'golden.koala.tafg@letterprotect.com', 'DMSC', 'Footwear');
INSERT INTO public.operationslogitems VALUES (7, 'INSERT', 'sports_rec', 'DMSC Floor 2', '32 oz Hydro Flask with sticker-covered exterior.', '2025-04-29 17:58:28.501981-07', '2025-04-29 17:58:28.507766-07', 'golden.koala.tafg@letterprotect.com', 'DMSC', 'Water Bottles');
INSERT INTO public.operationslogitems VALUES (8, 'INSERT', 'technology', 'DMSC Floor 3', 'SanDisk 64GB USB 3.0 drive with keyring loop.', '2025-04-29 18:00:54.179908-07', '2025-04-29 18:00:54.184553-07', 'golden.koala.tafg@letterprotect.com', 'DMSC', 'USB Drives');
INSERT INTO public.operationslogitems VALUES (9, 'INSERT', 'miscellaneous', 'DMSC Floor 4', 'Gold chain necklace with small heart pendant.', '2025-04-29 18:03:09.455743-07', '2025-04-29 18:03:09.459905-07', 'golden.koala.tafg@letterprotect.com', 'DMSC', 'Jewelry');
INSERT INTO public.operationslogitems VALUES (10, 'INSERT', 'Keys_IDs', 'DMSC Floor 1', 'Honda Civic key fob with pink puff keychain.', '2025-04-29 18:04:42.867793-07', '2025-04-29 18:04:42.870811-07', 'golden.koala.tafg@letterprotect.com', 'DMSC', 'Car Keys');
INSERT INTO public.operationslogitems VALUES (11, 'INSERT', 'clothing', 'SEM Floor 1', 'UNR Wolf Pack navy blue beanie with logo patch.', '2025-04-29 18:06:08.332056-07', '2025-04-29 18:06:08.336412-07', 'golden.koala.tafg@letterprotect.com', 'SEM', 'Hats & Beanies');
INSERT INTO public.operationslogitems VALUES (12, 'INSERT', 'technology', 'SEM Floor 2', 'TI-84 Plus graphing calculator with cracked screen protector.', '2025-04-29 18:07:20.991712-07', '2025-04-29 18:07:20.996137-07', 'golden.koala.tafg@letterprotect.com', 'SEM', 'Calculators');
INSERT INTO public.operationslogitems VALUES (13, 'INSERT', 'medical_health', 'SEM Floor 3', 'Blue Ventolin inhaler (albuterol sulfate).', '2025-04-29 18:07:51.13462-07', '2025-04-29 18:07:51.137622-07', 'golden.koala.tafg@letterprotect.com', 'SEM', 'Inhalers');
INSERT INTO public.operationslogitems VALUES (14, 'INSERT', 'bags', 'SEM Floor 4', 'Brown leather Fossil wallet with multiple card slots.', '2025-04-29 18:08:36.365307-07', '2025-04-29 18:08:36.37003-07', 'golden.koala.tafg@letterprotect.com', 'SEM', 'Wallets');
INSERT INTO public.operationslogitems VALUES (15, 'INSERT', 'school', 'SEM Floor 3', '"Calculus: Early Transcendentals" by James Stewart (8th Edition).', '2025-04-29 18:09:16.443327-07', '2025-04-29 18:09:16.448511-07', 'golden.koala.tafg@letterprotect.com', 'SEM', 'Textbooks');
INSERT INTO public.operationslogitems VALUES (16, 'INSERT', 'sports_rec', 'Found outside the WFC', 'Razor A5 Lux scooter with worn black grips.', '2025-04-29 18:12:10.097485-07', '2025-04-29 18:12:10.102365-07', 'golden.koala.tafg@letterprotect.com', 'WFC', 'Skateboards/Scooters');
INSERT INTO public.operationslogitems VALUES (17, 'INSERT', 'technology', 'Found at the treadmill area', 'Apple AirPods Pro (2nd Gen) in white case.', '2025-04-29 18:16:09.255542-07', '2025-04-29 18:16:09.261917-07', 'golden.koala.tafg@letterprotect.com', 'WFC', 'Headphones & Earbuds');
INSERT INTO public.operationslogitems VALUES (18, 'INSERT', 'clothing', 'Found on the first floor ', 'Knitted grey scarf with matching touchscreen gloves.', '2025-04-29 18:17:10.492475-07', '2025-04-29 18:17:10.497127-07', 'golden.koala.tafg@letterprotect.com', 'WFC', 'Scarves & Gloves');
INSERT INTO public.operationslogitems VALUES (19, 'INSERT', 'Keys_IDs', 'Found on the 3rd floor', 'University of Nevada student ID card with WolfCard holder.', '2025-04-29 18:18:54.240537-07', '2025-04-29 18:18:54.245656-07', 'golden.koala.tafg@letterprotect.com', 'WFC', 'Student ID');
INSERT INTO public.operationslogitems VALUES (20, 'INSERT', 'miscellaneous', 'Main floor ', 'Compact black umbrella with automatic open/close button.', '2025-04-29 18:20:37.782229-07', '2025-04-29 18:20:37.811278-07', 'golden.koala.tafg@letterprotect.com', 'WFC', 'Umbrellas');
INSERT INTO public.operationslogitems VALUES (21, 'INSERT', 'technology', 'Found at Los Trojes', 'Fitbit Charge 5 with teal band.', '2025-04-29 18:23:58.458241-07', '2025-04-29 18:23:58.465194-07', 'golden.koala.tafg@letterprotect.com', 'CFA', 'Smartwatches & Wearables');
INSERT INTO public.operationslogitems VALUES (22, 'INSERT', 'clothing', 'CFA first floor ', 'Levi’s 511 slim-fit jeans (dark wash, size 32x32).', '2025-04-29 18:25:05.551194-07', '2025-04-29 18:25:05.55503-07', 'golden.koala.tafg@letterprotect.com', 'CFA', 'Pants & Shorts');
INSERT INTO public.operationslogitems VALUES (23, 'INSERT', 'bags', 'CFA floor 2', 'Canvas Trader Joe’s tote with floral design.', '2025-04-29 18:26:50.407382-07', '2025-04-29 18:26:50.411658-07', 'golden.koala.tafg@letterprotect.com', 'CFA', 'Tote Bags');
INSERT INTO public.operationslogitems VALUES (24, 'INSERT', 'medical_health', 'CFA auditorium ', 'Mini first aid kit in red zip pouch with white cross symbol.', '2025-04-29 18:27:35.653352-07', '2025-04-29 18:27:35.657086-07', 'golden.koala.tafg@letterprotect.com', 'CFA', 'First Aid Items');
INSERT INTO public.operationslogitems VALUES (25, 'INSERT', 'school', 'CFA first floor', 'Pack of 10 Pilot G2 gel pens (black ink).', '2025-04-29 18:28:06.944378-07', '2025-04-29 18:28:06.948104-07', 'golden.koala.tafg@letterprotect.com', 'CFA', 'Pens & Pencils');
INSERT INTO public.operationslogitems VALUES (26, 'INSERT', 'sports_rec', 'Found on the 2nd floor''s bathroom', 'Black Under Armour football mouthguard in case.', '2025-04-29 18:29:34.881153-07', '2025-04-29 18:29:34.885534-07', 'golden.koala.tafg@letterprotect.com', 'JCSU', 'Protective Gear');
INSERT INTO public.operationslogitems VALUES (27, 'INSERT', 'Keys_IDs', 'Found on one of the tables in front of Taco Bell', 'UNR dorm access fob (blue with silver trim).', '2025-04-29 18:30:38.757009-07', '2025-04-29 18:30:38.761873-07', 'golden.koala.tafg@letterprotect.com', 'JCSU', 'Fobs or Access Cards');
INSERT INTO public.operationslogitems VALUES (28, 'INSERT', 'miscellaneous', 'Found on the 4th floor''s auditorium ', '"The Midnight Library" by Matt Haig (paperback edition).', '2025-04-29 18:32:04.723814-07', '2025-04-29 18:32:04.72859-07', 'golden.koala.tafg@letterprotect.com', 'JCSU', '');
INSERT INTO public.operationslogitems VALUES (29, 'INSERT', 'technology', 'Found on the 4th floor', 'Anker 6ft braided USB-C to USB-C charging cable (red).', '2025-04-29 18:33:07.624834-07', '2025-04-29 18:33:07.63016-07', 'golden.koala.tafg@letterprotect.com', 'JCSU', 'Chargers & Cables');
INSERT INTO public.operationslogitems VALUES (30, 'INSERT', 'clothing', 'Found in the bathroom on the 4th floor', 'UNR Nursing student scrub top (navy blue, size S).', '2025-04-29 18:33:38.269647-07', '2025-04-29 18:33:38.274332-07', 'golden.koala.tafg@letterprotect.com', 'JCSU', 'Uniforms');


--
-- TOC entry 4876 (class 0 OID 26555)
-- Dependencies: 233
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users OVERRIDING SYSTEM VALUE VALUES (1, 'super', 'scrypt:32768:8:1$JwNf0F4jpMl7K6TC$e88358a47ef4d9b1b66be5b85f5a48953eba94761a965abd0044e158c02a8fb8a113b32ab1988377d3f771381d3d13cf16855bdb4826c661e33b77498b7e8f32', 'golden.koala.tafg@letterprotect.com', 'superadmin', true, 'dc2ade13-063d-4f2b-84f4-9bb572bc461a');


--
-- TOC entry 4872 (class 0 OID 26547)
-- Dependencies: 229
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4883 (class 0 OID 0)
-- Dependencies: 218
-- Name: accountlogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accountlogs_id_seq', 1, false);


--
-- TOC entry 4884 (class 0 OID 0)
-- Dependencies: 220
-- Name: building_BID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."building_BID_seq"', 7, true);


--
-- TOC entry 4885 (class 0 OID 0)
-- Dependencies: 222
-- Name: claimeditems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.claimeditems_id_seq', 1, false);


--
-- TOC entry 4886 (class 0 OID 0)
-- Dependencies: 224
-- Name: floors_fid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.floors_fid_seq', 28, true);


--
-- TOC entry 4887 (class 0 OID 0)
-- Dependencies: 226
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_id_seq', 71, false);


--
-- TOC entry 4888 (class 0 OID 0)
-- Dependencies: 228
-- Name: operationslogitems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.operationslogitems_id_seq', 30, true);


--
-- TOC entry 4889 (class 0 OID 0)
-- Dependencies: 230
-- Name: permissions_pid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permissions_pid_seq', 1, false);


--
-- TOC entry 4890 (class 0 OID 0)
-- Dependencies: 232
-- Name: rooms_rid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rooms_rid_seq', 112, true);


--
-- TOC entry 4891 (class 0 OID 0)
-- Dependencies: 234
-- Name: users_uid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_uid_seq', 2, false);


-- Completed on 2025-04-30 18:54:58

--
-- PostgreSQL database dump complete
--

