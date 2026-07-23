SELECT table_schema, table_name, column_name
FROM information_schema.columns
WHERE table_name = 'resource'
ORDER BY table_schema, table_name, ordinal_position;
