# Dashboard CMS manual QA

## Hospitality

- [ ] Sign in as an Admin and confirm 21 seeded drafts appear.
- [ ] Test search, category, country, region, status, active, sorting, pagination, and shared URLs.
- [ ] Create a `qa-` draft with category; verify missing category and duplicate slug errors.
- [ ] Save, archive, restore a revision, and test optimistic locking in two tabs.
- [ ] Add, edit, remove, and reorder facilities, dining options, accessibility, and gallery items.
- [ ] Verify external gallery URL validation, preview, failure fallback, and unsaved-change warning.

## Destination hierarchy

- [ ] Confirm 5 countries, 15 places, and 36 attractions.
- [ ] Create a place under a country and an attraction under a place.
- [ ] Verify invalid parents, missing attraction parent, and archive of a parent with children are rejected.
- [ ] Verify filtering, revisions, restore, and optimistic locking.

## Cruises and brands

- [ ] Confirm the nine approved cruise records are visible as Draft only and do not appear publicly.
- [ ] Create, edit, publish, archive, restore, and reorder a test cruise and brand without changing a published record.
- [ ] Verify SEO, galleries, array fields, duplicate slugs, and permission boundaries in both editors.

## Permissions and cleanup

- [ ] Confirm a guest cannot access Dashboard and a non-admin cannot mutate records.
- [ ] Confirm no Service Role value is present in browser code.
- [ ] Keep QA slugs prefixed `qa-`; never publish them; archive or remove them after testing.
