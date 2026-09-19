CREATE TABLE public.heritage_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  local_name text,
  slug text not null unique,
  description text not null,
  category text not null,
  cultural_significance text,
  historical_context text,
  community text,
  state text not null,
  district text,
  city text not null,
  latitude numeric(10,7),
  longitude numeric(10,7),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
CREATE INDEX idx_project_discovery ON public.heritage_projects (category, state, city);
CREATE INDEX idx_project_title ON public.heritage_projects (title);

CREATE TABLE public.contributions (
  id uuid primary key default gen_random_uuid(),
  heritage_project_id uuid not null references public.heritage_projects(id) on delete cascade,
  contribution_type text not null check (contribution_type in ('photograph','video','audio','document','story','research','external_link')),
  title text not null,
  description text,
  contributor_name text not null,
  source text,
  external_url text,
  consent_confirmed boolean not null default false,
  created_at timestamptz not null default now()
);
CREATE INDEX idx_contribution_project ON public.contributions (heritage_project_id);

CREATE TABLE public.project_sources (
  id uuid primary key default gen_random_uuid(),
  heritage_project_id uuid not null references public.heritage_projects(id) on delete cascade,
  title text not null,
  source_type text,
  url text,
  description text,
  created_at timestamptz not null default now()
);

CREATE TABLE public.project_timeline (
  id uuid primary key default gen_random_uuid(),
  heritage_project_id uuid not null references public.heritage_projects(id) on delete cascade,
  event_title text not null,
  event_description text,
  event_date text,
  created_at timestamptz not null default now()
);

GRANT SELECT, INSERT ON public.heritage_projects TO anon, authenticated;
GRANT SELECT, INSERT ON public.contributions TO anon, authenticated;
GRANT SELECT ON public.project_sources TO anon, authenticated;
GRANT SELECT ON public.project_timeline TO anon, authenticated;
GRANT ALL ON public.heritage_projects, public.contributions, public.project_sources, public.project_timeline TO service_role;

ALTER TABLE public.heritage_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are publicly readable" ON public.heritage_projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can add a project" ON public.heritage_projects FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Contributions are publicly readable" ON public.contributions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can submit a contribution" ON public.contributions FOR INSERT TO anon, authenticated WITH CHECK (consent_confirmed = true);
CREATE POLICY "Sources are publicly readable" ON public.project_sources FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Timeline entries are publicly readable" ON public.project_timeline FOR SELECT TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER update_heritage_projects_updated_at BEFORE UPDATE ON public.heritage_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.heritage_projects (id, title, local_name, slug, description, category, cultural_significance, historical_context, community, state, district, city, latitude, longitude) VALUES
('11111111-1111-4111-8111-111111111111','Kumartuli: Living Clay Art','কুমোরটুলি','kumartuli-living-clay-art','A living neighbourhood of clay artisans who shape the idols of Bengal''s festival calendar, documented through workshop visits, oral histories and seasonal photographs.','Crafts','Kumartuli''s artisans sustain an unbroken idol-making lineage that anchors Durga Puja, Bengal''s largest community festival, and carries clay-modelling knowledge passed down within families.','Artisans migrated from Krishnanagar in the 18th century to serve the zamindar households of north Kolkata, gradually forming a dedicated potters'' quarter along the Hooghly.','Clay artisans','West Bengal','Kolkata','Kolkata',22.5990000,88.3630000),
('22222222-2222-4222-8222-222222222222','North Kolkata Courtyard Houses','উত্তর কলকাতার বাড়ি','north-kolkata-courtyard-houses','A community record of domestic architecture: thakur dalans, shuttered verandahs, cast-iron railings and the everyday life held inside old family homes.','Architecture','Courtyard houses hold the shared rituals of extended families, where the central thakur dalan served as both worship space and social stage.','Built largely between 1850 and 1930 by merchant and professional families, these houses blended Bengali courtyard planning with European classical detail.','Local residents','West Bengal','Kolkata','Kolkata',22.5850000,88.3630000),
('33333333-3333-4333-8333-333333333333','Pithe Traditions of Bengal','পিঠে','pithe-traditions-of-bengal','Stories and seasonal memories around festive foods: rice flour, date palm jaggery and the winter kitchens where pithe is made together.','Food & Culinary Traditions','Pithe-making marks Poush Sankranti and binds households through shared labour, recipes remembered by hand rather than written down.','Tied to the winter rice harvest and the tapping of date palm sap, the tradition spans rural and urban Bengali kitchens across generations.','Bengali home cooks','West Bengal','Kolkata','Kolkata',22.5726000,88.3639000);

INSERT INTO public.project_timeline (heritage_project_id, event_title, event_description, event_date) VALUES
('11111111-1111-4111-8111-111111111111','Artisans settle in north Kolkata','Potters from Krishnanagar move to the riverside quarter to serve household pujas.','c. 1750'),
('11111111-1111-4111-8111-111111111111','Community pujas expand demand','Barowari (community) pujas spread across the city, multiplying orders for idols.','1910s'),
('11111111-1111-4111-8111-111111111111','Global shipping of idols','Workshops begin exporting idols to diaspora pujas across the world.','1990s onwards'),
('22222222-2222-4222-8222-222222222222','Merchant houses rise','Trading and professional families build large courtyard mansions.','1850-1900'),
('22222222-2222-4222-8222-222222222222','Partition and subdivision','Households divide and many homes are split among heirs or tenants.','1947 onwards'),
('33333333-3333-4333-8333-333333333333','Poush Sankranti harvest festival','Winter harvest and palm sap season set the calendar for pithe making.','Annual, mid-January');

INSERT INTO public.project_sources (heritage_project_id, title, source_type, url, description) VALUES
('11111111-1111-4111-8111-111111111111','Oral history interviews with idol makers','Oral history',null,'Recorded conversations with three generations of a single workshop family.'),
('22222222-2222-4222-8222-222222222222','Family photograph albums','Photographic archive',null,'Scanned household albums shared by residents, 1930s-1980s.'),
('33333333-3333-4333-8333-333333333333','Handwritten recipe notebooks','Document',null,'Recipes transcribed from family notebooks and dictation.');

INSERT INTO public.contributions (heritage_project_id, contribution_type, title, description, contributor_name, source, consent_confirmed) VALUES
('11111111-1111-4111-8111-111111111111','photograph','Straw armature before the first clay layer','Documenting the bamboo and straw frame that holds the idol''s shape.','Ananya Dutta','Field visit, September 2025',true),
('11111111-1111-4111-8111-111111111111','story','My grandfather''s workshop','A recollection of learning to mix clay as a child during the monsoon months.','Subir Pal',null,true),
('22222222-2222-4222-8222-222222222222','photograph','Thakur dalan at dusk','The central worship space of a family house on Beadon Street.','Riya Chatterjee','Family archive',true),
('33333333-3333-4333-8333-333333333333','story','Making patishapta with my mother','Notes on measuring rice flour by feel and the smell of nolen gur.','Manoswini Saha',null,true);