-- 15 published hospitality/cruise entries (the Nile fleet, Luxury Speed Boat,
-- and Rossini) had no country set, even though every one of them is an
-- Egypt-based asset (Nile cruises, a Red Sea boat, and a Cairo restaurant).
-- Backfilling this so a "properties in this country" query against
-- Destinations pages can actually find them — previously it would have
-- silently missed most of the Nile fleet.

update public.content_entries
set draft_data = draft_data || '{"country": "Egypt"}'::jsonb,
    published_data = coalesce(published_data, draft_data) || '{"country": "Egypt"}'::jsonb
where content_type in ('hospitality', 'cruise')
  and slug in (
    'magic', 'magic-i', 'magic-ii', 'lady-carol', 'lady-mary',
    'nile-excellence', 'nile-divine', 'luxury-speed-boat', 'rossini'
  )
  and (published_data -> 'country') is null;
