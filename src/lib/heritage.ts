import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type HeritageProject = {
  id: string;
  title: string;
  local_name: string | null;
  slug: string;
  description: string;
  category: string;
  cultural_significance: string | null;
  historical_context: string | null;
  community: string | null;
  state: string;
  district: string | null;
  city: string;
  created_at: string;
};

export type Contribution = {
  id: string;
  heritage_project_id: string;
  contribution_type: string;
  title: string;
  description: string | null;
  contributor_name: string;
  source: string | null;
  external_url: string | null;
  created_at: string;
};

export type TimelineEvent = {
  id: string;
  event_title: string;
  event_description: string | null;
  event_date: string | null;
};

export type ProjectSource = {
  id: string;
  title: string;
  source_type: string | null;
  url: string | null;
  description: string | null;
};

export const CONTRIBUTION_TYPES = [
  "photograph",
  "video",
  "audio",
  "document",
  "story",
  "research",
  "external_link",
] as const;

export const CONTRIBUTION_TYPE_LABELS: Record<string, string> = {
  photograph: "Photograph",
  video: "Video",
  audio: "Audio recording",
  document: "Document",
  story: "Story or memory",
  research: "Research note",
  external_link: "External link",
};

export const projectsQuery = queryOptions({
  queryKey: ["heritage_projects"],
  queryFn: async (): Promise<HeritageProject[]> => {
    const { data, error } = await supabase
      .from("heritage_projects")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []) as HeritageProject[];
  },
});

export const projectQuery = (slug: string) =>
  queryOptions({
    queryKey: ["heritage_project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("heritage_projects")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data as HeritageProject | null) ?? null;
    },
  });

export const projectDetailQuery = (projectId: string | undefined) =>
  queryOptions({
    queryKey: ["heritage_project_detail", projectId],
    enabled: Boolean(projectId),
    queryFn: async () => {
      const [contributions, timeline, sources] = await Promise.all([
        supabase
          .from("contributions")
          .select("*")
          .eq("heritage_project_id", projectId!)
          .order("created_at", { ascending: false }),
        supabase
          .from("project_timeline")
          .select("*")
          .eq("heritage_project_id", projectId!)
          .order("created_at", { ascending: true }),
        supabase
          .from("project_sources")
          .select("*")
          .eq("heritage_project_id", projectId!)
          .order("created_at", { ascending: true }),
      ]);
      if (contributions.error) throw contributions.error;
      if (timeline.error) throw timeline.error;
      if (sources.error) throw sources.error;
      return {
        contributions: (contributions.data ?? []) as Contribution[],
        timeline: (timeline.data ?? []) as TimelineEvent[],
        sources: (sources.data ?? []) as ProjectSource[],
      };
    },
  });

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}
