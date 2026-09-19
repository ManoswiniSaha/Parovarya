import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, MapPin, Users } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import {
  CONTRIBUTION_TYPES,
  CONTRIBUTION_TYPE_LABELS,
  projectDetailQuery,
  projectQuery,
} from "@/lib/heritage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => {
    const readable = params.slug.replace(/-/g, " ");
    return {
      meta: [
        { title: `${readable} — Paro Varya` },
        {
          name: "description",
          content: `Photographs, stories, timeline and sources documenting ${readable} in the Paro Varya community heritage archive.`,
        },
        { property: "og:title", content: `${readable} — Paro Varya` },
        {
          property: "og:description",
          content: `Photographs, stories, timeline and sources documenting ${readable}.`,
        },
      ],
    };
  },
  component: ProjectDetail,
});

type FormState = {
  title: string;
  contributor_name: string;
  contribution_type: string;
  description: string;
  source: string;
  external_url: string;
  consent: boolean;
};

const emptyForm: FormState = {
  title: "",
  contributor_name: "",
  contribution_type: "story",
  description: "",
  source: "",
  external_url: "",
  consent: false,
};

function ContributionForm({ projectId }: { projectId: string }) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("contributions").insert({
        heritage_project_id: projectId,
        title: form.title.trim(),
        contributor_name: form.contributor_name.trim(),
        contribution_type: form.contribution_type,
        description: form.description.trim() || null,
        source: form.source.trim() || null,
        external_url: form.external_url.trim() || null,
        consent_confirmed: form.consent,
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      toast.success("Thank you — your contribution has been submitted for review and will appear once approved.");
      setForm(emptyForm);
      await queryClient.invalidateQueries({ queryKey: ["heritage_project_detail", projectId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const canSubmit =
    form.title.trim() !== "" && form.contributor_name.trim() !== "" && form.consent;

  return (
    <form
      className="archive-card p-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (!canSubmit) {
          toast.error("Add a title, your name, and confirm consent to share.");
          return;
        }
        mutation.mutate();
      }}
    >
      <p className="rule-label">Contribute</p>
      <h3 className="mt-2 text-2xl text-foreground">Add what you know</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Share a memory, a photograph you have permission to share, a document reference or a
        research note.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="c-title">Title</Label>
          <Input
            id="c-title"
            className="mt-1.5"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Straw armature before the first clay layer"
          />
        </div>
        <div>
          <Label htmlFor="c-name">Your name</Label>
          <Input
            id="c-name"
            className="mt-1.5"
            value={form.contributor_name}
            onChange={(e) => setForm({ ...form, contributor_name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="c-type">Type of contribution</Label>
          <Select
            value={form.contribution_type}
            onValueChange={(value) => setForm({ ...form, contribution_type: value })}
          >
            <SelectTrigger id="c-type" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTRIBUTION_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {CONTRIBUTION_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="c-desc">Description</Label>
          <Textarea
            id="c-desc"
            className="mt-1.5 min-h-28"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What does this record, and when?"
          />
        </div>
        <div>
          <Label htmlFor="c-source">Source (optional)</Label>
          <Input
            id="c-source"
            className="mt-1.5"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            placeholder="Family album, field visit, interview"
          />
        </div>
        <div>
          <Label htmlFor="c-url">Link (optional)</Label>
          <Input
            id="c-url"
            className="mt-1.5"
            value={form.external_url}
            onChange={(e) => setForm({ ...form, external_url: e.target.value })}
            placeholder="https://"
          />
        </div>
      </div>

      <label className="mt-6 flex items-start gap-3 text-sm text-muted-foreground">
        <Checkbox
          checked={form.consent}
          onCheckedChange={(value) => setForm({ ...form, consent: value === true })}
          aria-label="Confirm consent"
          className="mt-0.5"
        />
        <span>
          I have the consent of the people and community involved to share this in a public
          archive.
        </span>
      </label>

      <Button type="submit" className="mt-6" disabled={mutation.isPending}>
        {mutation.isPending ? "Adding…" : "Add contribution"}
      </Button>
    </form>
  );
}

function ProjectDetail() {
  const { slug } = Route.useParams();
  const { data: project, isPending } = useQuery(projectQuery(slug));
  const { data: detail } = useQuery(projectDetailQuery(project?.id));

  if (isPending) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-16">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="mt-6 h-40 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="text-3xl text-foreground">Project not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This entry isn't in the archive. It may have been removed.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Back to the archive
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> All projects
      </Link>

      <header className="mt-8 border-b border-border pb-8">
        <p className="rule-label">{project.category}</p>
        <h1 className="mt-3 text-4xl leading-tight text-foreground sm:text-5xl">
          {project.title}
        </h1>
        {project.local_name ? (
          <p className="mt-2 font-display text-2xl text-clay">{project.local_name}</p>
        ) : null}
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" aria-hidden />
            {[project.city, project.district, project.state].filter(Boolean).join(" · ")}
          </span>
          {project.community ? (
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-4" aria-hidden />
              {project.community}
            </span>
          ) : null}
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-10">
          {project.cultural_significance ? (
            <section>
              <p className="rule-label">Cultural significance</p>
              <p className="mt-3 leading-relaxed text-foreground">
                {project.cultural_significance}
              </p>
            </section>
          ) : null}

          {project.historical_context ? (
            <section>
              <p className="rule-label">Historical context</p>
              <p className="mt-3 leading-relaxed text-foreground">
                {project.historical_context}
              </p>
            </section>
          ) : null}

          <section>
            <p className="rule-label">Contributions</p>
            <h2 className="mt-2 text-2xl text-foreground">
              {detail?.contributions.length ?? 0} from the community
            </h2>
            <div className="mt-5 space-y-4">
              {(detail?.contributions ?? []).map((contribution) => (
                <article key={contribution.id} className="archive-card p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                      {CONTRIBUTION_TYPE_LABELS[contribution.contribution_type] ??
                        contribution.contribution_type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(contribution.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg text-foreground">{contribution.title}</h3>
                  {contribution.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {contribution.description}
                    </p>
                  ) : null}
                  <p className="mt-3 text-xs text-muted-foreground">
                    Contributed by {contribution.contributor_name}
                    {contribution.source ? ` · ${contribution.source}` : ""}
                  </p>
                  {contribution.external_url ? (
                    <a
                      href={contribution.external_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm text-primary underline"
                    >
                      View linked material
                    </a>
                  ) : null}
                </article>
              ))}
              {detail && detail.contributions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No contributions yet. Yours can be the first.
                </p>
              ) : null}
            </div>
          </section>

          <ContributionForm projectId={project.id} />
        </div>

        <aside className="space-y-10">
          <section>
            <p className="rule-label">Timeline</p>
            <ol className="mt-4 space-y-5 border-l border-border pl-5">
              {(detail?.timeline ?? []).map((event) => (
                <li key={event.id} className="relative">
                  <span
                    className="absolute -left-[26px] top-1.5 size-2.5 rounded-full bg-clay"
                    aria-hidden
                  />
                  <p className="text-xs text-muted-foreground">{event.event_date}</p>
                  <p className="mt-1 font-display text-base text-foreground">
                    {event.event_title}
                  </p>
                  {event.event_description ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {event.event_description}
                    </p>
                  ) : null}
                </li>
              ))}
              {detail && detail.timeline.length === 0 ? (
                <li className="text-sm text-muted-foreground">No timeline recorded yet.</li>
              ) : null}
            </ol>
          </section>

          <section>
            <p className="rule-label">Sources</p>
            <ul className="mt-4 space-y-4">
              {(detail?.sources ?? []).map((source) => (
                <li key={source.id} className="archive-card p-4">
                  <p className="font-display text-base text-foreground">{source.title}</p>
                  {source.source_type ? (
                    <p className="mt-1 text-xs text-muted-foreground">{source.source_type}</p>
                  ) : null}
                  {source.description ? (
                    <p className="mt-2 text-sm text-muted-foreground">{source.description}</p>
                  ) : null}
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm text-primary underline"
                    >
                      Open source
                    </a>
                  ) : null}
                </li>
              ))}
              {detail && detail.sources.length === 0 ? (
                <li className="text-sm text-muted-foreground">No sources listed yet.</li>
              ) : null}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
