-- "500,000+" overflowed its stat tile on narrow mobile screens (a fixed
-- large font-size with no room for a 9-character number in a 2-column
-- grid). Shortened to "500K+" — the layout was also hardened separately
-- to handle long numbers gracefully going forward.

update page_sections
set draft_data = jsonb_set(
  draft_data,
  '{stats,items}',
  (
    select jsonb_agg(
      case when item->>'label' = 'Happy Travelers'
        then jsonb_set(item, '{number}', '"500K+"')
        else item
      end
    )
    from jsonb_array_elements(draft_data->'stats'->'items') as item
  )
)
where key = 'hero'
  and page_id = (select id from pages where key = 'home')
  and draft_data->'stats'->'items' @> '[{"label": "Happy Travelers"}]';

update page_sections
set published_data = jsonb_set(
  published_data,
  '{stats,items}',
  (
    select jsonb_agg(
      case when item->>'label' = 'Happy Travelers'
        then jsonb_set(item, '{number}', '"500K+"')
        else item
      end
    )
    from jsonb_array_elements(published_data->'stats'->'items') as item
  )
)
where key = 'hero'
  and page_id = (select id from pages where key = 'home')
  and published_data is not null
  and published_data->'stats'->'items' @> '[{"label": "Happy Travelers"}]';
