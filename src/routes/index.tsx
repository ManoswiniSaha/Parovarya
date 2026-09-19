import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { MapPin, Search, Users } from "lucide-react";

import heroImage from "@/assets/hero-kumartuli.jpg";
import { projectsQuery, type HeritageProject } from "@/lib/heritage";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Paro Varya — A community record of living heritage" },
      {
        name: "description",
        content:
          "Browse and contribute to an open archive of crafts, architecture and food traditions, documented by the communities who keep them alive.",
      },
      { property: "og:title", content: "Paro Varya — A community record of living heritage" },
      {
        property: "og:description",
        content:
          "Browse and contribute to an open archive of crafts, architecture and food traditions, documented by the communities who keep them alive.",
      },
    ],
  }),
  component: Index,
});

function ProjectCard({ project }: { project: HeritageProject }) {
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: project.slug }}
      className="archive-card archive-card-hover flex flex-col p-6"
    >
      <p className="rule-label">{project.category}</p>
      <h3 className="mt-3 text-xl text-foreground">{project.title}</h3>
      {project.local_name ? (
        <p className="mt-1 font-display text-base text-clay">{project.local_name}</p>
      ) : null}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5" aria-hidden />
          {project.city}, {project.state}
        </span>
        {project.community ? (
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-3.5" aria-hidden />
            {project.community}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

function Index() {
  const { data: projects, isPending } = useQuery(projectsQuery);
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set((projects ?? []).map((p) => p.category))],
    [projects],
  );

  const filtered = useMemo(() => {
    const q = term.trim().toLowerCase();
    return (projects ?? []).filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const haystack = [
        p.title,
        p.local_name,
        p.description,
        p.category,
        p.community,
        p.city,
        p.state,
        p.district,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesCategory && (q === "" || haystack.includes(q));
    });
  }, [projects, term, category]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={heroImage}
          alt="Clay idol heads drying on wooden shelves in an artisan workshop"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/72" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
          <p className="rule-label text-primary-foreground/70">Paro Varya · পরম্পরা</p>
          <h1 className="mt-4 max-w-2xl text-4xl leading-tight text-primary-foreground sm:text-6xl">
            Heritage recorded by the people who live it
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/80">
            An open archive of crafts, buildings, food and memory. Search what has been
            documented, read the stories behind it, and add what your own community knows.
          </p>
          <div className="mt-8 flex max-w-md items-center gap-2 rounded-lg bg-card p-2 shadow-archive">
            <Search className="ml-2 size-4 text-muted-foreground" aria-hidden />
            <Input
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search projects, places, communities"
              aria-label="Search the archive"
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="rule-label">The archive</p>
            <h2 className="mt-2 text-3xl text-foreground">
              {filtered.length} {filtered.length === 1 ? "project" : "projects"} documented
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setCategory(name)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  category === name
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {isPending ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((key) => (
              <Skeleton key={key} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="archive-card mt-10 p-10 text-center">
            <h3 className="text-xl text-foreground">Nothing recorded yet for this search</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different term, or start a new project entry for what you know.
            </p>
            <Link
              to="/projects/new"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Add a project
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
