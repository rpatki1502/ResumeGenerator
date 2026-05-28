# Database Standards

## Database
- PostgreSQL (primary)
- Redis (caching, sessions, queues)

## Schema Rules
- Always use migrations (Flyway) — never alter tables directly
- Migration files: V{version}__{description}.sql
- Indexes on all foreign keys — mandatory
- Soft deletes using deleted_at timestamp — never hard delete
- Row Level Security (RLS) enabled on all user-facing tables
- UUID primary keys (not sequential integers) for security
- created_at and updated_at timestamps on every table

## Query Rules
- No N+1 queries — always use JOIN FETCH or batch loading
- No raw SQL unless JPA cannot handle the query
- Paginate all list queries — never return unbounded result sets
- Default page size: 20, max: 100
- Always use parameterized queries — never string concatenation

## Indexing Strategy
- Index all foreign keys
- Index all columns used in WHERE clauses frequently
- Composite index for multi-column WHERE conditions
- Partial indexes for soft-deleted tables (WHERE deleted_at IS NULL)

## Redis Usage
- Cache expensive DB queries with TTL
- Default TTL: 5 minutes for frequently changing data
- Default TTL: 1 hour for rarely changing data
- Session storage: 7 days
- Cart storage: 24 hours
- Always handle cache miss gracefully (fallback to DB)

## Naming Conventions
- Tables: snake_case plural (users, product_categories)
- Columns: snake_case (created_at, user_id)
- Foreign keys: {table_name}_id (user_id, product_id)
- Indexes: idx_{table}_{column} (idx_users_email)
- Migrations: V1__create_users.sql, V2__add_products.sql
