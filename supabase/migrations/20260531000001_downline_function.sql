-- Recursive function to fetch the complete downline of the calling user.
-- SECURITY DEFINER so the CTE can traverse beyond the direct-partner RLS boundary,
-- but auth.uid() pins it to the calling user's own tree.

CREATE OR REPLACE FUNCTION public.get_my_downline()
RETURNS TABLE (
  id           UUID,
  full_name    TEXT,
  email        TEXT,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ,
  sponsor_id   UUID,
  sponsor_name TEXT,
  depth        INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE downline AS (
    -- Base: direct partners of the calling user
    SELECT
      p.id,
      p.full_name,
      p.email,
      p.avatar_url,
      p.created_at,
      p.sponsor_id,
      1 AS depth
    FROM profiles p
    WHERE p.sponsor_id = auth.uid()
      AND p.is_active = TRUE

    UNION ALL

    -- Recursive: partners of partners
    SELECT
      p.id,
      p.full_name,
      p.email,
      p.avatar_url,
      p.created_at,
      p.sponsor_id,
      d.depth + 1
    FROM profiles p
    INNER JOIN downline d ON p.sponsor_id = d.id
    WHERE p.is_active = TRUE
  )
  SELECT
    d.id,
    d.full_name,
    d.email,
    d.avatar_url,
    d.created_at,
    d.sponsor_id,
    s.full_name  AS sponsor_name,
    d.depth
  FROM downline d
  LEFT JOIN profiles s ON s.id = d.sponsor_id
  ORDER BY d.depth ASC, d.created_at ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_downline() TO authenticated;
