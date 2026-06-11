CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
    CREATE TYPE user_status AS ENUM ('active', 'disabled');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'theme_preference') THEN
    CREATE TYPE theme_preference AS ENUM ('system', 'light', 'dark');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_kind') THEN
    CREATE TYPE media_kind AS ENUM ('image');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_status') THEN
    CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'page_status') THEN
    CREATE TYPE page_status AS ENUM ('draft', 'published', 'archived');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'navigation_location') THEN
    CREATE TYPE navigation_location AS ENUM ('header_primary', 'header_secondary', 'user_menu', 'footer');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'navigation_auth_state') THEN
    CREATE TYPE navigation_auth_state AS ENUM ('any', 'guest', 'authenticated');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contact_message_status') THEN
    CREATE TYPE contact_message_status AS ENUM ('new', 'read', 'replied', 'archived');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email citext NOT NULL UNIQUE,
  password_hash text NOT NULL,
  status user_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind media_kind NOT NULL DEFAULT 'image',
  url text NOT NULL,
  alt_text text NOT NULL DEFAULT '',
  width integer CHECK (width IS NULL OR width > 0),
  height integer CHECK (height IS NULL OR height > 0),
  source text,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS media_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  variant_key text NOT NULL,
  url text NOT NULL,
  width integer NOT NULL CHECK (width > 0),
  height integer NOT NULL CHECK (height > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (asset_id, variant_key),
  CHECK (variant_key = lower(variant_key)),
  CHECK (variant_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  headline text,
  bio text,
  avatar_asset_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  theme_preference theme_preference NOT NULL DEFAULT 'system',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (slug = lower(slug)),
  CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (slug = lower(slug)),
  CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  cover_asset_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  body_html text NOT NULL DEFAULT '',
  body_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  status post_status NOT NULL DEFAULT 'draft',
  read_minutes integer NOT NULL DEFAULT 1 CHECK (read_minutes > 0),
  seo_title text,
  meta_description text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(body_html, '')), 'C')
  ) STORED,
  CHECK (length(trim(title)) > 0),
  CHECK (excerpt IS NULL OR length(excerpt) <= 500),
  CHECK (slug = lower(slug)),
  CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CHECK (status <> 'published' OR published_at IS NOT NULL),
  CHECK (status <> 'published' OR length(trim(body_html)) > 0 OR body_json <> '{}'::jsonb)
);

CREATE TABLE IF NOT EXISTS post_tags (
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE IF NOT EXISTS post_relations (
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  related_post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  PRIMARY KEY (post_id, related_post_id),
  CHECK (post_id <> related_post_id)
);

CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  lead text,
  body_html text NOT NULL DEFAULT '',
  seo_title text,
  meta_description text,
  status page_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (slug = lower(slug)),
  CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  title text NOT NULL,
  subtitle text,
  link_url text,
  media_asset_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location navigation_location NOT NULL,
  label text NOT NULL,
  href text NOT NULL,
  icon_class text,
  auth_state navigation_auth_state NOT NULL DEFAULT 'any',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (location, href, auth_state)
);

CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email citext NOT NULL,
  message text NOT NULL,
  status contact_message_status NOT NULL DEFAULT 'new',
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (length(trim(name)) > 0),
  CHECK (length(trim(message)) >= 10)
);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  ip_address inet,
  user_agent text,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (expires_at > created_at)
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS media_assets_created_by_idx ON media_assets(created_by);
CREATE INDEX IF NOT EXISTS media_variants_asset_idx ON media_variants(asset_id, variant_key);
CREATE INDEX IF NOT EXISTS categories_active_sort_idx ON categories(is_active, sort_order, name);
CREATE INDEX IF NOT EXISTS tags_active_sort_idx ON tags(is_active, sort_order, name);
CREATE INDEX IF NOT EXISTS posts_public_list_idx ON posts(published_at DESC, updated_at DESC)
  WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS posts_author_status_updated_idx ON posts(author_id, status, updated_at DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS posts_category_public_idx ON posts(category_id, published_at DESC)
  WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS posts_search_vector_idx ON posts USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS post_tags_tag_idx ON post_tags(tag_id);
CREATE INDEX IF NOT EXISTS post_relations_sort_idx ON post_relations(post_id, sort_order);
CREATE INDEX IF NOT EXISTS hero_slides_page_sort_idx ON hero_slides(page_id, is_active, sort_order);
CREATE INDEX IF NOT EXISTS navigation_items_location_sort_idx ON navigation_items(location, auth_state, sort_order);
CREATE INDEX IF NOT EXISTS contact_messages_status_created_idx ON contact_messages(status, created_at DESC);
CREATE INDEX IF NOT EXISTS auth_sessions_user_active_idx ON auth_sessions(user_id, expires_at DESC)
  WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS password_reset_tokens_user_idx ON password_reset_tokens(user_id, expires_at DESC)
  WHERE used_at IS NULL;

DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'users',
    'media_assets',
    'media_variants',
    'user_profiles',
    'categories',
    'tags',
    'posts',
    'pages',
    'hero_slides',
    'navigation_items',
    'site_settings',
    'contact_messages',
    'auth_sessions'
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', table_name || '_set_updated_at', table_name);
    EXECUTE format(
      'CREATE TRIGGER %I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      table_name || '_set_updated_at',
      table_name
    );
  END LOOP;
END $$;
