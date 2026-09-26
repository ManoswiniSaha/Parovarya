DROP POLICY "Sources are publicly readable" ON public.project_sources;
CREATE POLICY "Sources of approved projects are publicly readable" ON public.project_sources
FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.heritage_projects hp WHERE hp.id = heritage_project_id AND hp.status = 'approved'));

DROP POLICY "Timeline entries are publicly readable" ON public.project_timeline;
CREATE POLICY "Timeline entries of approved projects are publicly readable" ON public.project_timeline
FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.heritage_projects hp WHERE hp.id = heritage_project_id AND hp.status = 'approved'));