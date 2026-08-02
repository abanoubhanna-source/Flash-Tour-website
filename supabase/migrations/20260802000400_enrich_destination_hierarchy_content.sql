-- The Destinations hierarchy (destination_place/destination_attraction) content_entries
-- were seeded with thin, generic placeholder text (e.g. "Sharm El Sheikh offers Red
-- Sea experiences and nearby natural and cultural attractions.") that was silently
-- overriding the much richer, real descriptions hardcoded on the 5 destination country
-- pages via /api/destinations/hierarchy -- a real regression: editors saw no visible
-- effect from editing (or worse, generic text quietly replacing good copy), which is
-- exactly what was reported as "I cannot edit it at all".
--
-- Replaces fullDescription with the real copy from each page component (verbatim, no
-- fabrication) and adds a gallery image so image overlay can be wired up too. Only
-- touches the 14 places + 36 attractions that already exist and are actually
-- referenced by a country page; Morocco's Atlas Mountains/Sahara sections and the
-- orphaned 'agadir' place have no corresponding real content or images and are left
-- untouched rather than inventing placeholder copy for them.

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'Located in South Sinai, Sharm El-Sheikh is a coastal destination. It is warm and sunny all year long and has the most famous coral reef sites. If you are a diving enthusiast, this is the best place to go. For some adrenaline rush you can try different kinds of water sports. If you are a marine passionate you will discover so many marine species and be astonished by the underwater colored reefs. For those wanting to relax, they can enjoy refreshments while tanning on a sunbed by the beach. Nightlife in Sharm is very lively, and this aesthetically beautiful town offers all sorts of activities from early morning to late at night.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/sharm-main.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'Located in South Sinai, Sharm El-Sheikh is a coastal destination. It is warm and sunny all year long and has the most famous coral reef sites. If you are a diving enthusiast, this is the best place to go. For some adrenaline rush you can try different kinds of water sports. If you are a marine passionate you will discover so many marine species and be astonished by the underwater colored reefs. For those wanting to relax, they can enjoy refreshments while tanning on a sunbed by the beach. Nightlife in Sharm is very lively, and this aesthetically beautiful town offers all sorts of activities from early morning to late at night.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/sharm-main.jpg', 'alt', '')))
where content_type = 'destination_place' and slug = 'sharm-el-sheikh';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'Located along the Red Sea, Hurghada offers a wide variety of activities. In this city you can go on an adventure, you can snorkel, you can enjoy a boat day and relax. Hurghada is very famous for its laidback lifestyle, for fish lovers you will enjoy the freshest seafood. Hurghada ranks amongst the top destinations for those seeking a relaxing holiday.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/hurghada-main.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'Located along the Red Sea, Hurghada offers a wide variety of activities. In this city you can go on an adventure, you can snorkel, you can enjoy a boat day and relax. Hurghada is very famous for its laidback lifestyle, for fish lovers you will enjoy the freshest seafood. Hurghada ranks amongst the top destinations for those seeking a relaxing holiday.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/hurghada-main.jpg', 'alt', '')))
where content_type = 'destination_place' and slug = 'hurghada';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'Marsa Alam, a very well preserved protectorate where nature is intact, far away from urbanization and in the heart of nature. This destination is so authentic that the main activity there is exploring the marine life, the birds. This tranquil destination has white sandy beaches, lagoons, and top sites for diving.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/marsa-main.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'Marsa Alam, a very well preserved protectorate where nature is intact, far away from urbanization and in the heart of nature. This destination is so authentic that the main activity there is exploring the marine life, the birds. This tranquil destination has white sandy beaches, lagoons, and top sites for diving.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/marsa-main.jpg', 'alt', '')))
where content_type = 'destination_place' and slug = 'marsa-alam';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'Located on the Eastern bank of the Nile, where the ancient capital of Egypt, Thebes, stood. Due to the city''s historical significance, it is abundant with numerous artifacts from several eras in Egyptian history; moreover, the city is renowned as an open-air museum.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/luxor-main.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'Located on the Eastern bank of the Nile, where the ancient capital of Egypt, Thebes, stood. Due to the city''s historical significance, it is abundant with numerous artifacts from several eras in Egyptian history; moreover, the city is renowned as an open-air museum.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/luxor-main.jpg', 'alt', '')))
where content_type = 'destination_place' and slug = 'luxor';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'Located in Southern Egypt, it has served as a strategic location since ancient times for commercial activities. Nowadays, the city hosts several ancient temples from different eras; furthermore, the Nubian villages are where you observe well preserved cultures still practicing ancient practices.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/aswan-main.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'Located in Southern Egypt, it has served as a strategic location since ancient times for commercial activities. Nowadays, the city hosts several ancient temples from different eras; furthermore, the Nubian villages are where you observe well preserved cultures still practicing ancient practices.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/aswan-main.jpg', 'alt', '')))
where content_type = 'destination_place' and slug = 'aswan';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'Dubai is the most populated city in the UAE, and gained a solid reputation for its ultramodern lifestyle. Our clients would expect no less than a luxurious lifestyle to surround them everywhere they go.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/dubai-main.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'Dubai is the most populated city in the UAE, and gained a solid reputation for its ultramodern lifestyle. Our clients would expect no less than a luxurious lifestyle to surround them everywhere they go.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/dubai-main.jpg', 'alt', '')))
where content_type = 'destination_place' and slug = 'dubai';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'Abu Dhabi is the capital city of the UAE that has made it all real. Its business oriented nature has led the strategy that transformed the country in such a short time. Our Clients Will Get To Explore The Culture And History Of This Prosperous Nation.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/abudhabi-main.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'Abu Dhabi is the capital city of the UAE that has made it all real. Its business oriented nature has led the strategy that transformed the country in such a short time. Our Clients Will Get To Explore The Culture And History Of This Prosperous Nation.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/abudhabi-main.jpg', 'alt', '')))
where content_type = 'destination_place' and slug = 'abu-dhabi';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'The Emirate is well known for its beautiful nature. Several mountain ranges fill the landscape, with Jebel Jais being the most famous; moreover our clients get to experience the world''s longest zipline adventure amongst the mountains.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/rak-main.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'The Emirate is well known for its beautiful nature. Several mountain ranges fill the landscape, with Jebel Jais being the most famous; moreover our clients get to experience the world''s longest zipline adventure amongst the mountains.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/rak-main.jpg', 'alt', '')))
where content_type = 'destination_place' and slug = 'ras-al-khaimah';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'Regarded as one of the top destinations in the UAE for its beaches and coral reefs, the city is a must go for those seeking to destress and unwind; moreover our clients can go back further in time when the ruling family was living there by visiting the oldest fort in the UAE.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/fujairah-main.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'Regarded as one of the top destinations in the UAE for its beaches and coral reefs, the city is a must go for those seeking to destress and unwind; moreover our clients can go back further in time when the ruling family was living there by visiting the oldest fort in the UAE.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/fujairah-main.jpg', 'alt', '')))
where content_type = 'destination_place' and slug = 'fujairah';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'The third most populated emirate in the UAE is renowned as a family-friendly emirate. It offers a laid back atmosphere where you can immerse yourself into Emirati culture. It is a well-known destination amongst scholars and travelers seeking to dig deeper into Islamic history.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/sharjah-main.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'The third most populated emirate in the UAE is renowned as a family-friendly emirate. It offers a laid back atmosphere where you can immerse yourself into Emirati culture. It is a well-known destination amongst scholars and travelers seeking to dig deeper into Islamic history.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/sharjah-main.jpg', 'alt', '')))
where content_type = 'destination_place' and slug = 'sharjah';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'Sicily, the beauty of Italy. It is one of the most renowned islands in Europe due to its greenery, its endless beaches and locally grown products; moreover, its history and lots of films and movies have been shot there. Sicily has astonishing landscapes, views and some UNESCO world heritage places. Whether you are visiting Ortigia Old town exploring a thousand year old church, or strolling around Marzamemi discovering the biggest tuna factories while tasting local products, you will witness landscapes that you have never seen, and beaches that are as clear as the sky.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/sicily-main.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'Sicily, the beauty of Italy. It is one of the most renowned islands in Europe due to its greenery, its endless beaches and locally grown products; moreover, its history and lots of films and movies have been shot there. Sicily has astonishing landscapes, views and some UNESCO world heritage places. Whether you are visiting Ortigia Old town exploring a thousand year old church, or strolling around Marzamemi discovering the biggest tuna factories while tasting local products, you will witness landscapes that you have never seen, and beaches that are as clear as the sky.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/sicily-main.jpg', 'alt', '')))
where content_type = 'destination_place' and slug = 'sicily';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'Sardinia, famous for its Turquoise waters, is the perfect destination to completely relax by the beach. It is the right place to just spend an unforgettable holiday swimming everyday in transparent waters, while enjoying their wine and excellent Italian delicacies such as the fresh sea food and home grown vegetables. Famous for its emerald waters, Sardinia is the perfect destination for an unforgettable luxury stay.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/sardinia-main.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'Sardinia, famous for its Turquoise waters, is the perfect destination to completely relax by the beach. It is the right place to just spend an unforgettable holiday swimming everyday in transparent waters, while enjoying their wine and excellent Italian delicacies such as the fresh sea food and home grown vegetables. Famous for its emerald waters, Sardinia is the perfect destination for an unforgettable luxury stay.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/sardinia-main.jpg', 'alt', '')))
where content_type = 'destination_place' and slug = 'sardinia';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'In Zanzibar, our own resort Kiwengwa Beach has more than 200 rooms. It is directly located on the beach and offers a wide range of activities. The island itself has the most famous beaches in Africa, where we will organize your private boat Safaris to sand banks located in the middle of the ocean. A visit to the forest with a guide taking you on a spice tour, and a day of relaxation sipping on coconut by the beach.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/zanzibar-island.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'In Zanzibar, our own resort Kiwengwa Beach has more than 200 rooms. It is directly located on the beach and offers a wide range of activities. The island itself has the most famous beaches in Africa, where we will organize your private boat Safaris to sand banks located in the middle of the ocean. A visit to the forest with a guide taking you on a spice tour, and a day of relaxation sipping on coconut by the beach.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/zanzibar-island.jpg', 'alt', '')))
where content_type = 'destination_place' and slug = 'zanzibar-island';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'Known as the ''Red City'', Marrakech is a sensory masterpiece where ancient traditions meet modern luxury. From the bustling souks and the historic Medina to our exclusive, meticulously restored luxury Riads, we offer your elite clients an authentic yet highly sophisticated Moroccan experience.'),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'Known as the ''Red City'', Marrakech is a sensory masterpiece where ancient traditions meet modern luxury. From the bustling souks and the historic Medina to our exclusive, meticulously restored luxury Riads, we offer your elite clients an authentic yet highly sophisticated Moroccan experience.')
where content_type = 'destination_place' and slug = 'marrakech';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'One of the most astonishing spots in the Red Sea with enchanting aquatic wonders. It is one of the best preserved diving sites.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/tiran-island.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'One of the most astonishing spots in the Red Sea with enchanting aquatic wonders. It is one of the best preserved diving sites.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/tiran-island.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'tiran-island';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'The biblical site where Moses received the 10 commandments. Nearby the mountain at St. Catherine''s village, accommodation is offered for adventurers.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/mt-moses.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'The biblical site where Moses received the 10 commandments. Nearby the mountain at St. Catherine''s village, accommodation is offered for adventurers.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/mt-moses.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'mount-moses';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'A natural preservation where diving enthusiasts will be dazzled by the beauty of its coral reefs. It is protected under Egyptian law to never be polluted.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/ras-mohamed.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'A natural preservation where diving enthusiasts will be dazzled by the beauty of its coral reefs. It is protected under Egyptian law to never be polluted.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/ras-mohamed.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'ras-mohammed-national-park';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'A very special site to explore the under-water gardens of the coral reefs and colorful fish; moreover, enjoy your sunbathe by the beach.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/dream-island.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'A very special site to explore the under-water gardens of the coral reefs and colorful fish; moreover, enjoy your sunbathe by the beach.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/dream-island.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'dream-island';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'A truly magnificent island with its offshore reefs providing spectacular drop-offs for experienced divers, hiding moray eels and fish amongst the corals.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/giftun-island.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'A truly magnificent island with its offshore reefs providing spectacular drop-offs for experienced divers, hiding moray eels and fish amongst the corals.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/giftun-island.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'giftun-island';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'Hidden amid the arid Red Sea Hills, far from the hustle and bustle of the cities, lies Egypt''s two oldest Coptic monasteries: St Paul''s and St Anthony''s.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/monasteries.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'Hidden amid the arid Red Sea Hills, far from the hustle and bustle of the cities, lies Egypt''s two oldest Coptic monasteries: St Paul''s and St Anthony''s.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/monasteries.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'red-sea-monasteries';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'A chance to spot the seaweeds gracing dugongs and turtles within their natural habitat. In addition to abundance of colored fish.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/abu-dabab.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'A chance to spot the seaweeds gracing dugongs and turtles within their natural habitat. In addition to abundance of colored fish.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/abu-dabab.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'abu-dabbab';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'The shallow waters are home to the black and orange striped fish and marine delicate species within the vicinity of the coral reefs.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/hamata.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'The shallow waters are home to the black and orange striped fish and marine delicate species within the vicinity of the coral reefs.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/hamata.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'hamata-islands';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'An extraordinary site with a steep wall at the outer reef... It provides an opportunity to encounter large schools of fish such as dolphins, tunas, Napoleon, and occasionally passing turtles.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/sataya.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'An extraordinary site with a steep wall at the outer reef... It provides an opportunity to encounter large schools of fish such as dolphins, tunas, Napoleon, and occasionally passing turtles.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/sataya.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'sataya-dolphin-reef';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'An archeological museum, dedicated to the art of Ancient Egyptian mummification. It displays related artifacts and mummies.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/mummification.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'An archeological museum, dedicated to the art of Ancient Egyptian mummification. It displays related artifacts and mummies.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/mummification.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'mummification-museum';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'Karnak is viewed as the biggest antiquated site on the planet. Around thirty pharaohs have contributed to the structures, permitting it to arrive at a size, intricacy, and variety not discovered elsewhere in Egypt.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/karnak.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'Karnak is viewed as the biggest antiquated site on the planet. Around thirty pharaohs have contributed to the structures, permitting it to arrive at a size, intricacy, and variety not discovered elsewhere in Egypt.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/karnak.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'karnak-temple';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'The massive site of royal burials since around 2100 BC with more than 63 magnificent royal tombs. It is one of the most prominent sites.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/valley-kings.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'The massive site of royal burials since around 2100 BC with more than 63 magnificent royal tombs. It is one of the most prominent sites.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/valley-kings.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'valley-of-the-kings';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'Explore the Traditional Nubian village with vividly colored houses, spice shops, and cafes overlooking the Nile River. It is an experience that no one should miss.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/nubian-village.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'Explore the Traditional Nubian village with vividly colored houses, spice shops, and cafes overlooking the Nile River. It is an experience that no one should miss.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/nubian-village.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'nubian-village';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'Built by the Egyptian king Ramses II and the largest temple carved in rocks in the world. Sun lights up the face of Ramses II in Abu Simbel in biannual illumination.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/abu-simbel.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'Built by the Egyptian king Ramses II and the largest temple carved in rocks in the world. Sun lights up the face of Ramses II in Abu Simbel in biannual illumination.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/abu-simbel.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'abu-simbel-temple';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'Egypt''s ancient center for the cult of Isis. The temple complex was rescued and moved to nearby Agilkia Island as part of the UNESCO Nubia Campaign project.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/philae.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'Egypt''s ancient center for the cult of Isis. The temple complex was rescued and moved to nearby Agilkia Island as part of the UNESCO Nubia Campaign project.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/philae.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'philae-temple';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'The tallest skyscraper where you can enjoy the spectacular view of Dubai''s skyline from the observatory, and delight yourself with upscale dining.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/burj-khalifa.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'The tallest skyscraper where you can enjoy the spectacular view of Dubai''s skyline from the observatory, and delight yourself with upscale dining.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/burj-khalifa.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'burj-khalifa';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'The famous palm in the middle of the sea hosts top notch hotels and resorts. It is dedicated to convey the upscale luxury that the UAE aspires to introduce to the world.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/palm-jumeirah.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'The famous palm in the middle of the sea hosts top notch hotels and resorts. It is dedicated to convey the upscale luxury that the UAE aspires to introduce to the world.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/palm-jumeirah.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'palm-jumeirah';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'The global Icon of Arabian luxury which is set on an island in a striking sail-shaped building. It is the first choice for presidents and royal families.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/burj-al-arab.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'The global Icon of Arabian luxury which is set on an island in a striking sail-shaped building. It is the first choice for presidents and royal families.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/burj-al-arab.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'burj-al-arab';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'The place where Emirati luxury is defined. This is where presidents and royalty stay upon visiting the UAE, so one can only expect perfection.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/emirates-palace.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'The place where Emirati luxury is defined. This is where presidents and royalty stay upon visiting the UAE, so one can only expect perfection.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/emirates-palace.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'emirates-palace';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'One of the largest mosques in the world, and designed to have traditional Islamic architecture meet the modern world.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/zayed-mosque.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'One of the largest mosques in the world, and designed to have traditional Islamic architecture meet the modern world.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/zayed-mosque.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'sheikh-zayed-grand-mosque';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'The famous Island featuring Ferrari World is where you get to enjoy the history of Ferrari, and also test-drive your favorite car.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/yas-island.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'The famous Island featuring Ferrari World is where you get to enjoy the history of Ferrari, and also test-drive your favorite car.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/yas-island.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'yas-island';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'Located within other surrounding mountain ranges, Jebel Jais is the most famous mountain in Ras Al Khaimah where several desert activities take place.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/jebel-jais.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'Located within other surrounding mountain ranges, Jebel Jais is the most famous mountain in Ras Al Khaimah where several desert activities take place.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/jebel-jais.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'jebel-jais';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'The longest zip-line in the world offers a spectacular view of the mountain ranges. With an average of 60 Km/h, one will have a unique experience.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/zip-line.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'The longest zip-line in the world offers a spectacular view of the mountain ranges. With an average of 60 Km/h, one will have a unique experience.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/zip-line.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'jebel-jais-zipline';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'A 300 year old fort, one of oldest forts in the UAE; moreover, very few forts and castles are well preserved as Fujairah fort is. It has served as a major post for anti-colonialism.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/fujairah-fort.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'A 300 year old fort, one of oldest forts in the UAE; moreover, very few forts and castles are well preserved as Fujairah fort is. It has served as a major post for anti-colonialism.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/fujairah-fort.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'fujairah-fort';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'One of the most beautiful fjords in the region. Sailing the fjord with a dhow provides an amazing experience for guests who enjoy being in nature''s company.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/musandam.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'One of the most beautiful fjords in the region. Sailing the fjord with a dhow provides an amazing experience for guests who enjoy being in nature''s company.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/musandam.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'musandam-dibba';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'The museum is dedicated to Islamic civilization, offering guests to experience the history and culture. One can expect ceramics, coins, glass objects, and manuscripts.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/islamic-museum.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'The museum is dedicated to Islamic civilization, offering guests to experience the history and culture. One can expect ceramics, coins, glass objects, and manuscripts.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/islamic-museum.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'museum-of-islamic-civilization';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'One of the largest mosques in Sharjah Emirate is one of the most beautiful mosques in the UAE due to its amazing architecture.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/king-faisal-mosque.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'One of the largest mosques in Sharjah Emirate is one of the most beautiful mosques in the UAE due to its amazing architecture.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/king-faisal-mosque.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'king-faisal-mosque';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'The city is well known for its downtown markets where local merchants sell their merchandise and pass on the profession to the next generation. The capital city, known for its narrow streets and traditional street markets.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/palermo.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'The city is well known for its downtown markets where local merchants sell their merchandise and pass on the profession to the next generation. The capital city, known for its narrow streets and traditional street markets.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/palermo.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'palermo';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'Sicilian olive oil is renowned as the best olive oil made in Italy, and the olive farms provide an amazing experience to explore the process of how this delicacy is produced. Experience Sicilian cuisine at its best.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/olive-oil.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'Sicilian olive oil is renowned as the best olive oil made in Italy, and the olive farms provide an amazing experience to explore the process of how this delicacy is produced. Experience Sicilian cuisine at its best.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/olive-oil.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'olive-oil-farms';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'An old city built in the Baroque style, and well maintained by the locals. It is regarded as a UNESCO site as it is one of the few places that still features a full Baroque experience and a beautiful World Heritage site.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/ortigia.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'An old city built in the Baroque style, and well maintained by the locals. It is regarded as a UNESCO site as it is one of the few places that still features a full Baroque experience and a beautiful World Heritage site.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/ortigia.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'ortigia';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'A magnificent marina that hosts several yachts voyaging the Mediterranean. Financed and created by Prince Karim Aga Khan along with other investors, it is a destination for those who seek an extravagant holiday.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/porto-cervo.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'A magnificent marina that hosts several yachts voyaging the Mediterranean. Financed and created by Prince Karim Aga Khan along with other investors, it is a destination for those who seek an extravagant holiday.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/porto-cervo.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'porto-cervo';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'A stretch of land surrounded by turquoise water and sandy beaches. The main town of the area is very famous for its upscale hotels and luxury shopping sites. It is a must go destination for everyone visiting Sardinia.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/costa-smeralda.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'A stretch of land surrounded by turquoise water and sandy beaches. The main town of the area is very famous for its upscale hotels and luxury shopping sites. It is a must go destination for everyone visiting Sardinia.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/costa-smeralda.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'costa-smeralda';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'The capital city of the Island, and the place where most tourists seeking knowledge about history will stop first; moreover, the hilltop castello, a wall quarter built during the medieval era, is a top attraction.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/cagliari.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'The capital city of the Island, and the place where most tourists seeking knowledge about history will stop first; moreover, the hilltop castello, a wall quarter built during the medieval era, is a top attraction.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/cagliari.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'cagliari';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'A vast lagoon blessed with a spectacular landscape of striped sand. The mangrove trees surround the lagoon adding to its natural beauty.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/zanzibar-national-park.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'A vast lagoon blessed with a spectacular landscape of striped sand. The mangrove trees surround the lagoon adding to its natural beauty.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/zanzibar-national-park.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'national-park';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'The ancient capital city, where travelers enter the daily life of locals. A visit is never complete without seeing Freddie Mercury''s home museum.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/stone-town.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'The ancient capital city, where travelers enter the daily life of locals. A visit is never complete without seeing Freddie Mercury''s home museum.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/stone-town.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'stone-town';

update public.content_entries
set draft_data = draft_data || jsonb_build_object('fullDescription', 'Home to the Red Colobus: a rare species of monkey regarded as the national symbol of Zanzibar. Perfect for those who seek adventure.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/jozani.jpg', 'alt', ''))),
    published_data = coalesce(published_data, draft_data) || jsonb_build_object('fullDescription', 'Home to the Red Colobus: a rare species of monkey regarded as the national symbol of Zanzibar. Perfect for those who seek adventure.', 'gallery', jsonb_build_array(jsonb_build_object('assetId', null, 'url', '/images/jozani.jpg', 'alt', '')))
where content_type = 'destination_attraction' and slug = 'jozani-forest';


