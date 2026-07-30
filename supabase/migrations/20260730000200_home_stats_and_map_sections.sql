-- Lift the Home page's "Scale & Certifications" and "Global Infrastructure
-- Map" sections into the CMS, so they become editable via the dashboard's
-- existing Pages > Home editor, alongside the hero.
--
-- These aren't new content_entries or page_sections rows: the Home page's
-- 'hero' page_section draft_data/published_data is a schemaless jsonb blob
-- validated on the TypeScript side (src/lib/cms/pages/schema.ts), which
-- already holds the hero's `slides` array the same way. Adding `stats` and
-- `map` keys alongside it lets them ride the exact same save/publish/
-- revision/lock-version machinery with zero new SQL functions.
--
-- The values below are the site's current hardcoded copy (previously only
-- in src/components/StatsAndCerts.tsx and InteractiveMap.tsx), written to
-- both draft_data and published_data so the live site's appearance does not
-- change until an editor deliberately changes something and republishes.

update public.page_sections
set
  draft_data = draft_data || jsonb_build_object(
    'stats', jsonb_build_object(
      'heading', 'Scale That Builds Trust',
      'items', jsonb_build_array(
        jsonb_build_object('number', '40+', 'label', 'Years of Excellence'),
        jsonb_build_object('number', '1000+', 'label', 'Global Experts'),
        jsonb_build_object('number', '100+', 'label', 'Owned Fleet Assets'),
        jsonb_build_object('number', '5', 'label', 'Strategic Markets')
      ),
      'certificationsHeading', 'Certified Excellence',
      'certificationsIntro', 'Operating under certified international standards to give partners uncompromised quality, safety, and operational confidence.',
      'certifications', jsonb_build_array(
        jsonb_build_object('name', 'ISO 9001:2015', 'desc', 'Quality Management System', 'logo', '/images/certifications/iso-9001.png'),
        jsonb_build_object('name', 'IATA Accredited', 'desc', 'International Air Transport Association', 'logo', '/images/certifications/iata.webp')
      )
    ),
    'map', jsonb_build_object(
      'heading', 'Our Global Infrastructure',
      'intro', 'We do not outsource luxury. Flash Group owns and operates a massive network of hotels, vehicle fleets, and river cruises across Europe, Africa, and the Middle East, giving our B2B partners absolute control over quality and pricing.',
      'checklist', jsonb_build_array('Global Headquarters & Hubs', 'Owned Luxury Resorts', 'VIP Transport Fleets'),
      'locations', jsonb_build_array(
        jsonb_build_object('id', 'italy', 'name', 'Italy', 'top', '34%', 'left', '37%', 'details', '7 Exclusive 5-Star Resorts • European Desk'),
        jsonb_build_object('id', 'morocco', 'name', 'Morocco', 'top', '43%', 'left', '26%', 'details', 'Strategic Regional Operations & B2B Partnerships'),
        jsonb_build_object('id', 'egypt', 'name', 'Egypt', 'top', '45%', 'left', '43.5%', 'details', 'Global HQ • 7 Nile Cruises • 100+ VIP Fleet'),
        jsonb_build_object('id', 'uae', 'name', 'UAE', 'top', '47%', 'left', '55%', 'details', 'Corporate Hub • 50+ VIP Fleet • MICE Experts'),
        jsonb_build_object('id', 'zanzibar', 'name', 'Zanzibar (Tanzania)', 'top', '68%', 'left', '46%', 'details', 'Kiwengwa Beach Resort • Safari Logistics')
      )
    )
  ),
  published_data = coalesce(published_data, '{}'::jsonb) || jsonb_build_object(
    'stats', jsonb_build_object(
      'heading', 'Scale That Builds Trust',
      'items', jsonb_build_array(
        jsonb_build_object('number', '40+', 'label', 'Years of Excellence'),
        jsonb_build_object('number', '1000+', 'label', 'Global Experts'),
        jsonb_build_object('number', '100+', 'label', 'Owned Fleet Assets'),
        jsonb_build_object('number', '5', 'label', 'Strategic Markets')
      ),
      'certificationsHeading', 'Certified Excellence',
      'certificationsIntro', 'Operating under certified international standards to give partners uncompromised quality, safety, and operational confidence.',
      'certifications', jsonb_build_array(
        jsonb_build_object('name', 'ISO 9001:2015', 'desc', 'Quality Management System', 'logo', '/images/certifications/iso-9001.png'),
        jsonb_build_object('name', 'IATA Accredited', 'desc', 'International Air Transport Association', 'logo', '/images/certifications/iata.webp')
      )
    ),
    'map', jsonb_build_object(
      'heading', 'Our Global Infrastructure',
      'intro', 'We do not outsource luxury. Flash Group owns and operates a massive network of hotels, vehicle fleets, and river cruises across Europe, Africa, and the Middle East, giving our B2B partners absolute control over quality and pricing.',
      'checklist', jsonb_build_array('Global Headquarters & Hubs', 'Owned Luxury Resorts', 'VIP Transport Fleets'),
      'locations', jsonb_build_array(
        jsonb_build_object('id', 'italy', 'name', 'Italy', 'top', '34%', 'left', '37%', 'details', '7 Exclusive 5-Star Resorts • European Desk'),
        jsonb_build_object('id', 'morocco', 'name', 'Morocco', 'top', '43%', 'left', '26%', 'details', 'Strategic Regional Operations & B2B Partnerships'),
        jsonb_build_object('id', 'egypt', 'name', 'Egypt', 'top', '45%', 'left', '43.5%', 'details', 'Global HQ • 7 Nile Cruises • 100+ VIP Fleet'),
        jsonb_build_object('id', 'uae', 'name', 'UAE', 'top', '47%', 'left', '55%', 'details', 'Corporate Hub • 50+ VIP Fleet • MICE Experts'),
        jsonb_build_object('id', 'zanzibar', 'name', 'Zanzibar (Tanzania)', 'top', '68%', 'left', '46%', 'details', 'Kiwengwa Beach Resort • Safari Logistics')
      )
    )
  )
where key = 'hero'
  and page_id = (select id from public.pages where key = 'home');
