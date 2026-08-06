-- Diagnosing the "Upload failed" report from the user's feedback doc required
-- reproducing a real upload against this entry's gallery to confirm whether
-- the storage/RLS pipeline actually works (it does). Restores the gallery
-- back to its original seeded value (see
-- 20260805000100_backfill_zanzibar_safari_place_and_attractions.sql) after
-- that test upload.

update public.content_entries
set draft_data = jsonb_set(
      draft_data,
      '{gallery}',
      '[{"alt": "Safari", "url": "/images/safari-main.jpg", "assetId": null, "caption": ""}]'::jsonb
    ),
    published_data = jsonb_set(
      published_data,
      '{gallery}',
      '[{"alt": "Safari", "url": "/images/safari-main.jpg", "assetId": null, "caption": ""}]'::jsonb
    )
where id = '5422516c-bf90-4fd3-954f-f3afddc6d218'
  and content_type = 'destination_place';
