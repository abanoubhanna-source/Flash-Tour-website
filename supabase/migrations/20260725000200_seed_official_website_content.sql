-- Official Flash Tour website content seed.
--
-- Safety guarantees:
--   * all newly created records are drafts;
--   * ON CONFLICT never changes published content or published SEO;
--   * the fixed seedKey marker makes SEO, revisions and relations idempotent.

insert into public.hospitality_categories (key, name, sort_order)
values
  ('nile_cruise', 'Nile Cruise', 10),
  ('dahabiya', 'Dahabiya', 20),
  ('hotel', 'Hotel', 30),
  ('resort', 'Resort', 40),
  ('restaurant', 'Restaurant', 50),
  ('boat', 'Boat', 60),
  ('speed_boat', 'Speed Boat', 70)
on conflict (key) do nothing;

-- About is deliberately a page-section draft. Existing published section data is
-- never read or written by this statement.
insert into public.pages (key, path, name, template_key, locale, enabled)
values ('about', '/about', 'About', 'about', 'en', false)
on conflict (key, locale) do nothing;

with about_sections (key, component_key, sort_order, data) as (
  values
    ('hero_intro', 'about_hero', 1000, jsonb_build_object('seedKey','official-about-v1','eyebrow','About Flash Tour','title','Travel expertise since 1985','body','Flash Tour Group is an IATA and ASTA licensed travel agency offering a wide range of travel services. Over the years, Flash Tour has worked with international tour operators, delivering first-class services and professional travel solutions.')),
    ('experience', 'about_rich_text', 1010, jsonb_build_object('seedKey','official-about-v1','title','40 Years of Experience','body','With over 40 years of experience in travel and tourism, Flash Group has built expertise, reliability, and trust while evolving to meet the changing needs of travellers across worldwide destinations.')),
    ('highlights', 'about_statistics', 1020, jsonb_build_object('seedKey','official-about-v1','title','Highlights','items',jsonb_build_array(jsonb_build_object('label','Founded','value','1985'),jsonb_build_object('label','Experience','value','40+ years'),jsonb_build_object('label','Transportation fleet','value','104 vehicles'),jsonb_build_object('label','Employees','value','5,000+'),jsonb_build_object('label','Continents','value','4')))),
    ('work_process', 'about_rich_text', 1030, jsonb_build_object('seedKey','official-about-v1','title','Our Work Process','body','Our operations team simplifies each journey so clients can relax and enjoy the moment. From booking until returning home, clients are escorted, guided, and assisted by a team briefed on their individual requests.')),
    ('vision', 'about_statement', 1040, jsonb_build_object('seedKey','official-about-v1','title','Vision','body','To lead the tourism industry by setting the top standards for others to follow worldwide.')),
    ('mission', 'about_statement', 1050, jsonb_build_object('seedKey','official-about-v1','title','Mission','body','To provide immersive experiences tailored to our clients through a hospitable culture and uncompromising elite service.')),
    ('services_summary', 'about_list', 1060, jsonb_build_object('seedKey','official-about-v1','title','Our Services','items',jsonb_build_array('Transportation','Hajj and Umrah','Hotel Booking','MICE Management','Golf','Tour Guiding Service','Leisure Travel for FITs, Individuals & Groups','FIT, Family & Group Leisure Travel'))),
    ('expansion_journey', 'about_timeline', 1070, jsonb_build_object('seedKey','official-about-v1','title','Our Expansion Journey','subtitle','From Egypt to the World','milestones',jsonb_build_array(jsonb_build_object('country','Egypt','year',1985,'brand','Flash Tour'),jsonb_build_object('country','Zanzibar','year',2011,'brand','Flash Zanzibar'),jsonb_build_object('country','United Arab Emirates','year',2014,'brand','Flash Horizon'),jsonb_build_object('country','Morocco','year',2024,'brand','Flash Horizon Morocco')),'body','Today, Flash Group provides Destination Management, MICE, FIT travel, group travel, and privately tailored experiences. Kiwi Beach Resorts is referenced as the group''s Italy hotel collection; the group also owns and manages a collection of hotels across Sicily and Sardinia in Italy.')),
    ('ceo_message', 'about_quote', 1080, jsonb_build_object('seedKey','official-about-v1','title','Message From The CEO','body','It all started in the beautiful land of Egypt, a country full of heritage and beautiful landscapes. Flash means leisure, and it is our duty to provide the ultimate service to our clients.')),
    ('team', 'about_rich_text', 1090, jsonb_build_object('seedKey','official-about-v1','title','The Team','body','With more than 5,000 employees across 4 continents, Flash Tour embraces diversity. Our staff look forward to greeting clients and providing our signature service.')),
    ('languages', 'about_list', 1100, jsonb_build_object('seedKey','official-about-v1','title','Languages','items',jsonb_build_array('Arabic','German','French','Russian','Italian','English','Dutch')))
)
insert into public.page_sections (page_id, key, component_key, sort_order, enabled, draft_data)
select p.id, s.key, s.component_key, s.sort_order, true, s.data
from about_sections s join public.pages p on p.key = 'about' and p.locale = 'en'
on conflict (page_id, key) do update set
  draft_data = excluded.draft_data,
  component_key = excluded.component_key;

-- The current official service copy. A previously existing service is left intact.
with official_services (slug, title, short_description, full_description, sort_order) as (
  values
  ('inbound-outbound-tourism','Inbound & Outbound Tourism','Global travel and hospitality solutions across multiple destinations.','With many years of experience in hospitality and travel, Flash Tour has built a diverse global portfolio across multiple destinations, including Nile cruises, boutique hotels, resorts, and boats.',10),
  ('flight-reservations','Flight Reservations','Ticketing and airline reservation support through IATA partnerships.','Our team handles ticketing procedures through IATA partnerships and the Amadeus system, reviewing the best available options before reserving airline tickets for clients.',20),
  ('airport-services','Airport Services','Premium airport assistance, lounge access, and transfer support.','We deliver premium airport assistance including Marhaba services, lounge access, 24/7 support from our dedicated team, and shuttle transfers for seamless arrivals and departures.',30),
  ('visa-services','Visa Services','UAE entry visa support for tourism and business travel.','We offer efficient UAE entry visa services at competitive rates for tourism and business travel, with reliable support throughout the application process.',40),
  ('hotel-reservations','Hotel Reservations','Accommodation sourcing with competitive rates and flexible options.','Our extensive hotel network covers a wide range of luxury levels, facilities, and locations. Competitive rates and exclusive deals provide partners and clients with value and flexibility.',50),
  ('tour-guiding-services','Tour Guiding Services','Certified bilingual guides for journeys across destinations.','Our professional, bilingual, certified tour-guide team provides knowledgeable and reliable full guidance throughout each journey.',60),
  ('transportation','Transportation','VIP cars, limousines, coasters, shuttles, and buses for individuals and groups.','We provide private VIP cars, limousines, coasters, shuttles, and buses up to 50 seats. With more than 100 vehicles, we serve individual travellers and large groups with flexible mobility solutions.',70),
  ('leisure-individuals-groups','Leisure Travel: Individuals & Groups','Tailor-made travel for FIT travellers and leisure groups.','We provide high-quality tailor-made travel solutions for niche markets and customized services for large leisure groups, creating flexible and memorable experiences.',80),
  ('premium-fit-family-travel','Premium FIT & Family Travel','Personalized travel planning for FIT clients and families.','Our experts design fully customized travel experiences for FIT clients and families, managing transfers, accommodations, and curated excursions around individual preferences and comfort.',90),
  ('fully-escorted-group-tours','Fully Escorted Group Tours','Thoughtfully designed small-group journeys for 12 to 24 guests.','We offer fully escorted small group tours for 12 to 24 guests, combining discovery, comfort, social travel, and itineraries beyond traditional tourist routes.',100),
  ('hajj-and-umrah','Hajj and Umrah','Complete pilgrimage travel services for Egyptian clients.','We manage flights, transportation, hotel bookings, on-ground assistance, and special requirements for a smooth and spiritually focused Hajj and Umrah journey.',110),
  ('mice-management','MICE Management','Corporate travel and events managed by a dedicated UAE team.','Our dedicated in-house UAE MICE team manages meetings, incentives, conferences, exhibitions, and large-scale corporate travel from planning to delivery.',120),
  ('golf','Golf Travel Services','Golf packages, green fees, and tournament arrangements in the UAE.','Flash Horizon Golf brings extensive experience and industry connections to arrange golf packages, green fees, and tournaments executed to a premium standard.',130)
)
insert into public.content_entries (content_type, slug, title, locale, status, sort_order, is_active, draft_data)
select 'service', slug, title, 'en', 'draft', sort_order, true,
  jsonb_build_object('seedKey','official-service-' || slug,'title',title,'slug',slug,'shortDescription',short_description,'fullDescription',full_description,'displayOrder',sort_order,'isActive',true)
from official_services
on conflict (content_type, locale, slug) do nothing;

-- Countries, regions, and attractions. Tanzania Safari is intentionally not seeded
-- as a place because the supplied source describes it as an excursion from Zanzibar,
-- not a destination hierarchy parent.
with official_destinations (content_type, slug, title, parent_type, parent_slug, short_description, full_description, sort_order) as (
  values
  ('destination','egypt','Egypt',null,null,'A destination of heritage, landscapes, and the Nile.','Egypt is the group’s founding destination and home to travel, hospitality, transportation, and Nile experiences.',10),
  ('destination','uae','United Arab Emirates',null,null,'A dynamic destination for leisure, MICE, FIT, and tailored travel.','Flash Horizon brings the group’s hospitality heritage to the United Arab Emirates.',20),
  ('destination','italy','Italy',null,null,'A destination for the group’s hotel collection across Sicily and Sardinia.','The group owns and manages a collection of hotels across Sicily and Sardinia in Italy.',30),
  ('destination','zanzibar','Zanzibar',null,null,'An Indian Ocean destination served by Flash Zanzibar.','Flash Zanzibar established the group in Tanzania in 2011 as a destination management company.',40),
  ('destination','morocco','Morocco',null,null,'A North African destination served by Flash Horizon Morocco.','Flash Horizon Morocco expanded the group’s North African presence in 2024.',50),
  ('destination_place','sharm-el-sheikh','Sharm El Sheikh','destination','egypt','A Red Sea destination in Egypt.','Sharm El Sheikh offers Red Sea experiences and nearby natural and cultural attractions.',110),
  ('destination_place','hurghada','Hurghada','destination','egypt','A Red Sea destination in Egypt.','Hurghada provides access to islands, monasteries, and Red Sea excursions.',120),
  ('destination_place','marsa-alam','Marsa Alam','destination','egypt','A Red Sea destination in Egypt.','Marsa Alam provides access to reefs, islands, and marine encounters.',130),
  ('destination_place','luxor','Luxor','destination','egypt','An Egyptian destination of ancient heritage.','Luxor is home to major archaeological and cultural sites.',140),
  ('destination_place','aswan','Aswan','destination','egypt','An Egyptian Nile destination.','Aswan connects Nubian culture with Nile and temple experiences.',150),
  ('destination_place','dubai','Dubai','destination','uae','A leading destination in the United Arab Emirates.','Dubai combines landmark architecture, coastal developments, and luxury hospitality.',210),
  ('destination_place','abu-dhabi','Abu Dhabi','destination','uae','The capital destination of the United Arab Emirates.','Abu Dhabi offers cultural landmarks, hospitality, and Yas Island attractions.',220),
  ('destination_place','ras-al-khaimah','Ras Al Khaimah','destination','uae','An emirate of mountain experiences.','Ras Al Khaimah is home to Jebel Jais and its zipline.',230),
  ('destination_place','fujairah','Fujairah','destination','uae','An east-coast emirate destination.','Fujairah offers historic and coastal points of interest.',240),
  ('destination_place','sharjah','Sharjah','destination','uae','A cultural destination in the United Arab Emirates.','Sharjah includes major museums and mosques.',250),
  ('destination_place','sicily','Sicily','destination','italy','An Italian island region in the group’s hotel collection.','Sicily includes hospitality properties and cultural destinations.',310),
  ('destination_place','sardinia','Sardinia','destination','italy','An Italian island region in the group’s hotel collection.','Sardinia includes the group’s Castelsardo Resort.',320),
  ('destination_place','zanzibar-island','Zanzibar Island','destination','zanzibar','An island destination in Tanzania.','Zanzibar Island combines natural, historic, and forest attractions.',410),
  ('destination_place','agadir','Agadir','destination','morocco','A destination in Morocco.','Agadir is included in the official Morocco destination content.',510),
  ('destination_place','marrakech','Marrakech','destination','morocco','A destination in Morocco.','Marrakech is a cultural and leisure destination in Morocco.',520),
  ('destination_attraction','tiran-island','Tiran Island','destination_place','sharm-el-sheikh','An island attraction near Sharm El Sheikh.','Tiran Island is listed among Sharm El Sheikh attractions.',1110),
  ('destination_attraction','mount-moses','Mount Moses','destination_place','sharm-el-sheikh','A landmark near Sharm El Sheikh.','Mount Moses is listed among Sharm El Sheikh attractions.',1120),
  ('destination_attraction','ras-mohammed-national-park','Ras Mohammed National Park','destination_place','sharm-el-sheikh','A national park near Sharm El Sheikh.','Ras Mohammed National Park is listed among Sharm El Sheikh attractions.',1130),
  ('destination_attraction','dream-island','Dream Island','destination_place','hurghada','An island attraction near Hurghada.','Dream Island is listed among Hurghada attractions.',1210),
  ('destination_attraction','giftun-island','Giftun Island','destination_place','hurghada','An island attraction near Hurghada.','Giftun Island is listed among Hurghada attractions.',1220),
  ('destination_attraction','red-sea-monasteries','Red Sea Monasteries','destination_place','hurghada','Historic monasteries near Hurghada.','Red Sea Monasteries are listed among Hurghada attractions.',1230),
  ('destination_attraction','abu-dabbab','Abu Dabbab','destination_place','marsa-alam','A marine attraction near Marsa Alam.','Abu Dabbab is listed among Marsa Alam attractions.',1310),
  ('destination_attraction','hamata-islands','Hamata Islands','destination_place','marsa-alam','Island attractions near Marsa Alam.','Hamata Islands are listed among Marsa Alam attractions.',1320),
  ('destination_attraction','sataya-dolphin-reef','Sataya Dolphin Reef','destination_place','marsa-alam','A reef attraction near Marsa Alam.','Sataya Dolphin Reef is listed among Marsa Alam attractions.',1330),
  ('destination_attraction','mummification-museum','Mummification Museum','destination_place','luxor','A museum in Luxor.','The Mummification Museum is listed among Luxor attractions.',1410),
  ('destination_attraction','karnak-temple','Karnak Temple','destination_place','luxor','A temple in Luxor.','Karnak Temple is listed among Luxor attractions.',1420),
  ('destination_attraction','valley-of-the-kings','Valley of the Kings','destination_place','luxor','A heritage site in Luxor.','The Valley of the Kings is listed among Luxor attractions.',1430),
  ('destination_attraction','nubian-village','Nubian Village','destination_place','aswan','A cultural attraction in Aswan.','Nubian Village is listed among Aswan attractions.',1510),
  ('destination_attraction','abu-simbel-temple','Abu Simbel Temple','destination_place','aswan','A temple attraction associated with Aswan.','Abu Simbel Temple is listed among Aswan attractions.',1520),
  ('destination_attraction','philae-temple','Philae Temple','destination_place','aswan','A temple attraction in Aswan.','Philae Temple is listed among Aswan attractions.',1530),
  ('destination_attraction','burj-khalifa','Burj Khalifa','destination_place','dubai','A landmark in Dubai.','Burj Khalifa is listed among Dubai attractions.',2110),
  ('destination_attraction','palm-jumeirah','Palm Jumeirah','destination_place','dubai','A landmark in Dubai.','Palm Jumeirah is listed among Dubai attractions.',2120),
  ('destination_attraction','burj-al-arab','Burj Al Arab','destination_place','dubai','A landmark in Dubai.','Burj Al Arab is listed among Dubai attractions.',2130),
  ('destination_attraction','emirates-palace','Emirates Palace','destination_place','abu-dhabi','A landmark in Abu Dhabi.','Emirates Palace is listed among Abu Dhabi attractions.',2210),
  ('destination_attraction','sheikh-zayed-grand-mosque','Sheikh Zayed Grand Mosque','destination_place','abu-dhabi','A landmark in Abu Dhabi.','Sheikh Zayed Grand Mosque is listed among Abu Dhabi attractions.',2220),
  ('destination_attraction','yas-island','Yas Island','destination_place','abu-dhabi','An attraction in Abu Dhabi.','Yas Island is listed among Abu Dhabi attractions.',2230),
  ('destination_attraction','jebel-jais','Jebel Jais','destination_place','ras-al-khaimah','A mountain attraction in Ras Al Khaimah.','Jebel Jais is listed among Ras Al Khaimah attractions.',2310),
  ('destination_attraction','jebel-jais-zipline','Jebel Jais Zipline','destination_place','ras-al-khaimah','A zipline attraction in Ras Al Khaimah.','Jebel Jais Zipline is listed among Ras Al Khaimah attractions.',2320),
  ('destination_attraction','fujairah-fort','Fujairah Fort','destination_place','fujairah','A historic attraction in Fujairah.','Fujairah Fort is listed among Fujairah attractions.',2410),
  ('destination_attraction','musandam-dibba','Musandam Dibba','destination_place','fujairah','A coastal attraction associated with Fujairah.','Musandam Dibba is listed among Fujairah attractions.',2420),
  ('destination_attraction','museum-of-islamic-civilization','Museum of Islamic Civilization','destination_place','sharjah','A museum in Sharjah.','The Museum of Islamic Civilization is listed among Sharjah attractions.',2510),
  ('destination_attraction','king-faisal-mosque','King Faisal Mosque','destination_place','sharjah','A mosque in Sharjah.','King Faisal Mosque is listed among Sharjah attractions.',2520),
  ('destination_attraction','national-park','National Park','destination_place','zanzibar-island','A national park attraction on Zanzibar Island.','The supplied source lists National Park among Zanzibar Island attractions.',4110),
  ('destination_attraction','stone-town','Stone Town','destination_place','zanzibar-island','A historic attraction on Zanzibar Island.','Stone Town is listed among Zanzibar Island attractions.',4120),
  ('destination_attraction','jozani-forest','Jozani Forest','destination_place','zanzibar-island','A forest attraction on Zanzibar Island.','Jozani Forest is listed among Zanzibar Island attractions.',4130),
  ('destination_attraction','palermo','Palermo','destination_place','sicily','A destination in Sicily.','Palermo is listed among Sicily attractions.',3110),
  ('destination_attraction','olive-oil-farms','Olive Oil Farms','destination_place','sicily','An attraction in Sicily.','Olive Oil Farms are listed among Sicily attractions.',3120),
  ('destination_attraction','ortigia','Ortigia','destination_place','sicily','A destination in Sicily.','Ortigia is listed among Sicily attractions.',3130),
  ('destination_attraction','porto-cervo','Porto Cervo','destination_place','sardinia','A destination in Sardinia.','Porto Cervo is listed among Sardinia attractions.',3210),
  ('destination_attraction','costa-smeralda','Costa Smeralda','destination_place','sardinia','A destination in Sardinia.','Costa Smeralda is listed among Sardinia attractions.',3220),
  ('destination_attraction','cagliari','Cagliari','destination_place','sardinia','A destination in Sardinia.','Cagliari is listed among Sardinia attractions.',3230)
)
insert into public.content_entries (content_type, slug, title, locale, status, sort_order, is_active, draft_data)
select content_type::public.content_type, slug, title, 'en', 'draft', sort_order, true,
  jsonb_build_object('seedKey','official-destination-' || content_type || '-' || slug,'name',title,'slug',slug,'summary',short_description,'fullDescription',full_description,'displayOrder',sort_order,'isActive',true,'kind',case when content_type = 'destination' then 'country' when content_type = 'destination_place' then 'place' else 'attraction' end)
from official_destinations
on conflict (content_type, locale, slug) do nothing;

-- Build hierarchy from stable slugs. Existing country rows can safely act as parents,
-- while newly inserted places and attractions remain drafts.
with hierarchy (child_type, child_slug, parent_type, parent_slug, relation_type, sort_order) as (
  values
  ('destination_place','sharm-el-sheikh','destination','egypt','contains_place',110),('destination_place','hurghada','destination','egypt','contains_place',120),('destination_place','marsa-alam','destination','egypt','contains_place',130),('destination_place','luxor','destination','egypt','contains_place',140),('destination_place','aswan','destination','egypt','contains_place',150),
  ('destination_place','dubai','destination','uae','contains_place',210),('destination_place','abu-dhabi','destination','uae','contains_place',220),('destination_place','ras-al-khaimah','destination','uae','contains_place',230),('destination_place','fujairah','destination','uae','contains_place',240),('destination_place','sharjah','destination','uae','contains_place',250),
  ('destination_place','sicily','destination','italy','contains_place',310),('destination_place','sardinia','destination','italy','contains_place',320),('destination_place','zanzibar-island','destination','zanzibar','contains_place',410),('destination_place','agadir','destination','morocco','contains_place',510),('destination_place','marrakech','destination','morocco','contains_place',520),
  ('destination_attraction','tiran-island','destination_place','sharm-el-sheikh','contains_attraction',1110),('destination_attraction','mount-moses','destination_place','sharm-el-sheikh','contains_attraction',1120),('destination_attraction','ras-mohammed-national-park','destination_place','sharm-el-sheikh','contains_attraction',1130),
  ('destination_attraction','dream-island','destination_place','hurghada','contains_attraction',1210),('destination_attraction','giftun-island','destination_place','hurghada','contains_attraction',1220),('destination_attraction','red-sea-monasteries','destination_place','hurghada','contains_attraction',1230),
  ('destination_attraction','abu-dabbab','destination_place','marsa-alam','contains_attraction',1310),('destination_attraction','hamata-islands','destination_place','marsa-alam','contains_attraction',1320),('destination_attraction','sataya-dolphin-reef','destination_place','marsa-alam','contains_attraction',1330),
  ('destination_attraction','mummification-museum','destination_place','luxor','contains_attraction',1410),('destination_attraction','karnak-temple','destination_place','luxor','contains_attraction',1420),('destination_attraction','valley-of-the-kings','destination_place','luxor','contains_attraction',1430),
  ('destination_attraction','nubian-village','destination_place','aswan','contains_attraction',1510),('destination_attraction','abu-simbel-temple','destination_place','aswan','contains_attraction',1520),('destination_attraction','philae-temple','destination_place','aswan','contains_attraction',1530),
  ('destination_attraction','burj-khalifa','destination_place','dubai','contains_attraction',2110),('destination_attraction','palm-jumeirah','destination_place','dubai','contains_attraction',2120),('destination_attraction','burj-al-arab','destination_place','dubai','contains_attraction',2130),
  ('destination_attraction','emirates-palace','destination_place','abu-dhabi','contains_attraction',2210),('destination_attraction','sheikh-zayed-grand-mosque','destination_place','abu-dhabi','contains_attraction',2220),('destination_attraction','yas-island','destination_place','abu-dhabi','contains_attraction',2230),
  ('destination_attraction','jebel-jais','destination_place','ras-al-khaimah','contains_attraction',2310),('destination_attraction','jebel-jais-zipline','destination_place','ras-al-khaimah','contains_attraction',2320),('destination_attraction','fujairah-fort','destination_place','fujairah','contains_attraction',2410),('destination_attraction','musandam-dibba','destination_place','fujairah','contains_attraction',2420),
  ('destination_attraction','museum-of-islamic-civilization','destination_place','sharjah','contains_attraction',2510),('destination_attraction','king-faisal-mosque','destination_place','sharjah','contains_attraction',2520),
  ('destination_attraction','national-park','destination_place','zanzibar-island','contains_attraction',4110),('destination_attraction','stone-town','destination_place','zanzibar-island','contains_attraction',4120),('destination_attraction','jozani-forest','destination_place','zanzibar-island','contains_attraction',4130),
  ('destination_attraction','palermo','destination_place','sicily','contains_attraction',3110),('destination_attraction','olive-oil-farms','destination_place','sicily','contains_attraction',3120),('destination_attraction','ortigia','destination_place','sicily','contains_attraction',3130),
  ('destination_attraction','porto-cervo','destination_place','sardinia','contains_attraction',3210),('destination_attraction','costa-smeralda','destination_place','sardinia','contains_attraction',3220),('destination_attraction','cagliari','destination_place','sardinia','contains_attraction',3230)
)
insert into public.content_relations (source_id, target_id, relation_type, sort_order)
select parent.id, child.id, h.relation_type, h.sort_order
from hierarchy h
join public.content_entries parent on parent.content_type = h.parent_type::public.content_type and parent.locale = 'en' and parent.slug = h.parent_slug
join public.content_entries child on child.content_type = h.child_type::public.content_type and child.locale = 'en' and child.slug = h.child_slug
on conflict (source_id, target_id, relation_type) do nothing;

with official_hospitality (slug, title, category_key, country, region, location, short_description, full_description, rooms_or_cabins, facilities, dining_options, accessibility, sort_order) as (
  values
  ('magic-i','Magic I','nile_cruise',null,null,null,'A Nile cruise with 64 cabins.','Magic I offers 64 cabins and onboard restaurant, lounges, bar, sundeck, live music, and traditional entertainment.',64,jsonb_build_array('Restaurant','Lounges','Bar','Sundeck','Live music','Traditional entertainment'),jsonb_build_array(),jsonb_build_array(),10),
  ('magic-ii','Magic II','nile_cruise',null,null,null,'A Nile cruise with 64 guest cabins.','Magic II offers 64 guest cabins, a restaurant, lounge, gym, spa, sundeck, pool, bar, loungers, and entertainment.',64,jsonb_build_array('Restaurant','Lounge','Gym','Spa','Sundeck','Pool','Bar','Loungers','Entertainment'),jsonb_build_array(),jsonb_build_array(),20),
  ('lady-carol','Lady Carol','nile_cruise',null,null,null,'A Nile cruise with 66 cabins.','Lady Carol offers 66 cabins with a restaurant, lounge, sundeck, gym, and spa.',66,jsonb_build_array('Restaurant','Lounge','Sundeck','Gym','Spa'),jsonb_build_array(),jsonb_build_array(),30),
  ('lady-mary','Lady Mary','nile_cruise',null,null,null,'A Nile cruise experience.','Lady Mary offers a restaurant, lounge, sundeck, gym, and spa.',null,jsonb_build_array('Restaurant','Lounge','Sundeck','Gym','Spa'),jsonb_build_array(),jsonb_build_array(),40),
  ('nile-excellence','Nile Excellence','dahabiya',null,null,null,'A dahabiya with 30 suites.','Nile Excellence offers 30 suites with a restaurant, lounge, sundeck, and pool.',30,jsonb_build_array('Restaurant','Lounge','Sundeck','Pool'),jsonb_build_array(),jsonb_build_array(),50),
  ('nile-majestic','Nile Majestic','dahabiya','Egypt','Luxor and Aswan',null,'A dahabiya with 10 guest cabins.','Nile Majestic offers 10 guest cabins, dining, excursions, a sundeck, pool, bar, and lounge.',10,jsonb_build_array('Excursions','Sundeck','Pool','Bar','Lounge'),jsonb_build_array('Dining'),jsonb_build_array(),60),
  ('nile-divine','Nile Divine','dahabiya',null,null,null,'A dahabiya with 8 cabins.','Nile Divine offers 8 cabins, reception, spa, and two sundecks.',8,jsonb_build_array('Reception','Spa','Two sundecks'),jsonb_build_array(),jsonb_build_array(),70),
  ('true-beach-resort','True Beach Resort','resort','Egypt','Marsa Alam',null,'A Marsa Alam resort with 158 rooms.','True Beach Resort has 158 rooms across a family wing and an adults-only village, including swim-up rooms.',158,jsonb_build_array('Family wing','Adults-only village','Swim-up rooms'),jsonb_build_array(),jsonb_build_array(),80),
  ('flash-boats','Flash Boats','boat','Egypt','Hurghada and Marsa Alam',null,'Boat experiences for up to 35 guests.','Flash Boats operates in Hurghada and Marsa Alam for up to 35 guests, with snorkeling gear, an open bar, and sunbathing.',35,jsonb_build_array('Snorkeling gear','Open bar','Sunbathing'),jsonb_build_array(),jsonb_build_array(),90),
  ('luxury-speed-boat','Luxury Speed Boat','speed_boat',null,'Red Sea',null,'A luxury speed boat experience on the Red Sea.','Luxury Speed Boat offers a Red Sea experience with professional snorkeling equipment.',null,jsonb_build_array('Professional snorkeling equipment'),jsonb_build_array(),jsonb_build_array(),100),
  ('rossini','Rossini','restaurant',null,null,'Cairo and Florence','Italian and seafood dining in Cairo and Florence.','Rossini serves Italian and seafood dining, preserving its Cairo and Florence locations from the source.',null,jsonb_build_array('VIP dining','Fine dining'),jsonb_build_array('Italian cuisine','Seafood'),jsonb_build_array(),110),
  ('carlo-heliopolis','Carlo Heliopolis','restaurant','Egypt','Cairo','Heliopolis','A restaurant in Heliopolis, Cairo.','Carlo Heliopolis offers dining in an outdoor ambiance in Heliopolis, Cairo.',null,jsonb_build_array('Outdoor ambiance'),jsonb_build_array('Dining'),jsonb_build_array(),120),
  ('kiwengwa-beach-resort','Kiwengwa Beach Resort','resort','Tanzania','Zanzibar','Kiwengwa, north-east coast of Zanzibar','A Zanzibar resort with 223 units.','Kiwengwa Beach Resort has 223 units, four restaurants, three bars, three pools, a lagoon, and recreation facilities.',223,jsonb_build_array('Three pools','Lagoon','Recreation facilities','Mosquito nets'),jsonb_build_array('Four restaurants','Three bars'),jsonb_build_array(),130),
  ('1920s-boutique-hotel','1920s Boutique Hotel','hotel','Egypt','Cairo','Korba, Heliopolis','A historic boutique hotel in Korba, Heliopolis.','1920s Boutique Hotel is a historic villa in Korba, Heliopolis with 10 rooms.',10,jsonb_build_array('Historic villa'),jsonb_build_array(),jsonb_build_array(),140),
  ('president-sea-palace-hotel','President Sea Palace Hotel','hotel','Italy','Sicily','Noto Marina','A Sicily hotel with 74 rooms.','President Sea Palace Hotel in Noto Marina has 74 rooms, a main restaurant, poolside dining, lobby and pool bars, entertainment, gym, parking, luggage service, and 24-hour reception.',74,jsonb_build_array('Entertainment','Gym','Parking','Luggage service','24-hour reception'),jsonb_build_array('Main restaurant','Poolside dining','Lobby bar','Pool bar'),jsonb_build_array('Wheelchair-friendly'),150),
  ('castelsardo-resort','Castelsardo Resort','resort','Italy','Sardinia','Castelsardo','A Sardinian resort with 132 rooms.','Castelsardo Resort has 99 sea-view rooms and 33 standard rooms, with dining, pizzeria, bar, gym, tennis, entertainment, and live music.',132,jsonb_build_array('Gym','Tennis','Entertainment','Live music'),jsonb_build_array('Main restaurant','Pizzeria','Bar'),jsonb_build_array(),160),
  ('hopps-hotel','Hopps Hotel','hotel','Italy','Sicily','Mazara del Vallo','A Sicily hotel with 235 rooms.','Hopps Hotel in Mazara del Vallo has 235 rooms, a main restaurant, pizzeria, bars, pools, private beach, and entertainment.',235,jsonb_build_array('Pools','Private beach','Entertainment'),jsonb_build_array('Main restaurant','Pizzeria','Bars'),jsonb_build_array(),170),
  ('baia-doro-hotel','Baia D’Oro Hotel','hotel','Italy','Sicily',null,'A Sicily hotel with 68 rooms.','Baia D’Oro Hotel has 68 rooms, main and poolside dining, lobby and pool bars, gym, and entertainment.',68,jsonb_build_array('Gym','Entertainment'),jsonb_build_array('Main restaurant','Poolside dining','Lobby bar','Pool bar'),jsonb_build_array('Accessible rooms','Wheelchair access'),180),
  ('hotel-club-eloro','Hotel Club Eloro','hotel','Italy','Sicily','Eloro','A Sicily hotel with 247 rooms.','Hotel Club Eloro has 247 rooms, dining options, pools, a mini club, and entertainment.',247,jsonb_build_array('Pools','Mini club','Entertainment'),jsonb_build_array('Dining'),jsonb_build_array(),190),
  ('hotel-dolcestate-club','Hotel Dolcestate Club','hotel','Italy','Sicily','Buonfornello–Campofelice di Roccella','A Sicily hotel with 60 rooms.','Hotel Dolcestate Club has 60 rooms, buffet dining, conference capacity for 20 to 300 guests, pools, and accessibility facilities.',60,jsonb_build_array('Conference facilities','Pools','Parking'),jsonb_build_array('Buffet dining'),jsonb_build_array('Two lifts'),200),
  ('le-dune-beach-club','Le Dune Beach Club','resort','Italy','Sicily',null,'A beach club in Sicily.','Le Dune Beach Club offers bungalows, buffet and specialty dining, a pool, bar, gardens, sun terrace, and sports facilities.',null,jsonb_build_array('Pool','Bar','Gardens','Sun terrace','Sports facilities'),jsonb_build_array('Buffet dining','Specialty dining'),jsonb_build_array(),210)
)
insert into public.content_entries (content_type, slug, title, locale, status, sort_order, is_active, draft_data)
select 'hospitality', h.slug, h.title, 'en', 'draft', h.sort_order, true,
  jsonb_build_object('seedKey','official-hospitality-' || h.slug,'title',h.title,'slug',h.slug,'location',h.location,'country',h.country,'region',h.region,'shortDescription',h.short_description,'fullDescription',h.full_description,'roomsOrCabins',h.rooms_or_cabins,'facilities',h.facilities,'diningOptions',h.dining_options,'accessibility',h.accessibility,'gallery',jsonb_build_array(),'categoryId',c.id,'displayOrder',h.sort_order,'isActive',true)
from official_hospitality h join public.hospitality_categories c on c.key = h.category_key
on conflict (content_type, locale, slug) do nothing;

-- Draft-only SEO for precisely the rows inserted by this seed. No existing SEO row
-- is updated, so published metadata remains untouched.
insert into public.seo_entries (content_entry_id, locale, draft_data)
select e.id, e.locale,
  jsonb_build_object('title',e.title || ' | Flash Tour','description',left(coalesce(e.draft_data->>'shortDescription',e.draft_data->>'summary',''),170),'keywords',jsonb_build_array(),'canonicalUrl','','openGraph',jsonb_build_object('title',e.title || ' | Flash Tour','description',left(coalesce(e.draft_data->>'shortDescription',e.draft_data->>'summary',''),220),'image',''))
from public.content_entries e
where e.locale = 'en'
  and e.status = 'draft'
  and e.draft_data ? 'seedKey'
  and e.draft_data->>'seedKey' like 'official-%'
on conflict (content_entry_id, locale) where content_entry_id is not null do nothing;

-- Exactly one identifiable initial draft revision per seeded content row and About
-- section. The marker avoids duplicate revisions if this migration is replayed.
insert into public.content_revisions (resource_type, resource_id, version, snapshot, event)
select resource_type, resource_id,
  coalesce((select max(r.version) from public.content_revisions r where r.resource_type = seed.resource_type and r.resource_id = seed.resource_id), 0) + 1,
  jsonb_build_object('seedKey','official_website_content_v1','content',payload), 'draft_saved'
from (
  select e.content_type::text as resource_type, e.id as resource_id, e.draft_data as payload
  from public.content_entries e
  where e.status = 'draft' and e.draft_data ? 'seedKey' and e.draft_data->>'seedKey' like 'official-%'
  union all
  select 'page_section', s.id, s.draft_data
  from public.page_sections s
  where s.draft_data->>'seedKey' = 'official-about-v1'
) seed
where not exists (
  select 1 from public.content_revisions r
  where r.resource_type = seed.resource_type and r.resource_id = seed.resource_id
    and r.snapshot->>'seedKey' = 'official_website_content_v1'
);
