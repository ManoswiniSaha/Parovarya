-- Add moderation status to heritage_projects
ALTER TABLE public.heritage_projects ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';
ALTER TABLE public.heritage_projects DROP CONSTRAINT IF EXISTS heritage_projects_status_check;
ALTER TABLE public.heritage_projects ADD CONSTRAINT heritage_projects_status_check CHECK (status IN ('pending','approved','rejected'));

-- Add moderation status to contributions
ALTER TABLE public.contributions ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';
ALTER TABLE public.contributions DROP CONSTRAINT IF EXISTS contributions_status_check;
ALTER TABLE public.contributions ADD CONSTRAINT contributions_status_check CHECK (status IN ('pending','approved','rejected'));

-- Approve all existing (seeded) rows so nothing disappears
UPDATE public.heritage_projects SET status = 'approved';
UPDATE public.contributions SET status = 'approved';

-- Public can only read approved projects
DROP POLICY IF EXISTS "Projects are publicly readable" ON public.heritage_projects;
CREATE POLICY "Approved projects are publicly readable" ON public.heritage_projects
  FOR SELECT TO anon, authenticated USING (status = 'approved');

-- Public can only read approved contributions
DROP POLICY IF EXISTS "Contributions are publicly readable" ON public.contributions;
CREATE POLICY "Approved contributions are publicly readable" ON public.contributions
  FOR SELECT TO anon, authenticated USING (status = 'approved');

-- Inserts still allowed, but force them into pending regardless of client input
DROP POLICY IF EXISTS "Anyone can add a project" ON public.heritage_projects;
CREATE POLICY "Anyone can submit a project for review" ON public.heritage_projects
  FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS "Anyone can submit a contribution" ON public.contributions;
CREATE POLICY "Anyone can submit a contribution for review" ON public.contributions
  FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending' AND consent_confirmed = true);