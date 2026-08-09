-- Remove the "Abanoub" test attraction created while diagnosing the Agadir
-- content bug (title/description were placeholder test text: "fgfdh" /
-- "fghfghfgh"). Confirmed disposable by the site owner.

delete from content_relations
where target_id = (select id from content_entries where slug = 'abanoub' and content_type = 'destination_attraction');

delete from content_entries
where slug = 'abanoub' and content_type = 'destination_attraction';
