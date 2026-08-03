-- Magic, Magic II, Lady Carol, Lady Mary, Nile Excellence, Nile Majestic, and
-- Nile Divine were each published under content_type='hospitality' with an
-- identical twin already published under content_type='cruise' (same vessel,
-- same copy). No page ever reads the hospitality-type row for these slugs —
-- the real /cruises page and the destination "Hospitality & Cruises" section
-- both render off the cruise-type twin. Archiving (not deleting) the
-- redundant hospitality copies per the site owner's request; the cruise
-- twins are untouched and keep rendering exactly as before.
update public.content_entries
set status = 'archived',
    published_data = null,
    published_at = null,
    archived_at = now()
where content_type = 'hospitality'
  and slug in ('magic', 'magic-ii', 'lady-carol', 'lady-mary', 'nile-excellence', 'nile-majestic', 'nile-divine');
