-- Analytics-only marker: a non-null value means this installation has been
-- identified as test/dirty data and is excluded from the distribution and
-- event analytics. The timestamp doubles as the flag (null = not filtered),
-- so there is deliberately no separate boolean column that could drift out of
-- sync with it. Nullable and without a default, so this is an instant,
-- table-rewrite-free ALTER on a large table.
ALTER TABLE "Installation" ADD COLUMN "filteredAt" TIMESTAMPTZ(3);
