import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Paro Varya — how the archive works" },
      {
        name: "description",
        content:
          "Paro Varya is a community heritage archive: how entries are structured, how contributions are reviewed for consent, and how to take part.",
      },
      { property: "og:title", content: "About Paro Varya — how the archive works" },
      {
        property: "og:description",
        content:
          "How the community heritage archive is structured, and how to contribute responsibly.",
      },
    ],
  }),
  component: About,
});

const principles = [
  {
    title: "Consent first",
    body: "Every contribution records who shared it and confirms that the people and community involved agreed to a public record.",
  },
  {
    title: "Context, not just objects",
    body: "Each project holds cultural significance, historical context, a timeline and sources — so the practice is understood, not only pictured.",
  },
  {
    title: "Many hands",
    body: "Anyone can open a project entry and anyone can add photographs, stories, audio, documents or research to an existing one.",
  },
  {
    title: "Local language kept",
    body: "Entries carry the local name alongside the English title, because the words are part of the heritage.",
  },
];

function About() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="rule-label">About</p>
      <h1 className="mt-3 text-4xl leading-tight text-foreground sm:text-5xl">
        A shared record of what communities keep alive
      </h1>
      <p className="mt-6 text-base leading-relaxed text-muted-foreground">
        Paro Varya collects living heritage — crafts, architecture, food traditions, rituals and
        the neighbourhoods that hold them. Instead of one authoritative account, each entry grows
        from many contributions: a photograph from a family album, a memory of a winter kitchen, a
        field note from a workshop visit.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {principles.map((item) => (
          <section key={item.title} className="archive-card p-6">
            <h2 className="font-display text-xl text-foreground">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse the archive
        </Link>
        <Link
          to="/projects/new"
          className="inline-flex items-center justify-center rounded-md border border-input bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Start a project
        </Link>
      </div>
    </div>
  );
}
