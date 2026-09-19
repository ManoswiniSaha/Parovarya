import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/heritage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/projects/new")({
  head: () => ({
    meta: [
      { title: "Start a heritage project — Paro Varya" },
      {
        name: "description",
        content:
          "Open a new entry in the Paro Varya archive: name the tradition, place and community, and describe what should be remembered.",
      },
      { property: "og:title", content: "Start a heritage project — Paro Varya" },
      {
        property: "og:description",
        content: "Open a new entry in the community heritage archive.",
      },
    ],
  }),
  component: NewProject,
});

const initial = {
  title: "",
  local_name: "",
  category: "",
  description: "",
  cultural_significance: "",
  historical_context: "",
  community: "",
  city: "",
  district: "",
  state: "",
};

function NewProject() {
  const [form, setForm] = useState(initial);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const slug = `${slugify(form.title)}-${Math.random().toString(36).slice(2, 7)}`;
      const { data, error } = await supabase
        .from("heritage_projects")
        .insert({
          title: form.title.trim(),
          local_name: form.local_name.trim() || null,
          slug,
          description: form.description.trim(),
          category: form.category.trim(),
          cultural_significance: form.cultural_significance.trim() || null,
          historical_context: form.historical_context.trim() || null,
          community: form.community.trim() || null,
          city: form.city.trim(),
          district: form.district.trim() || null,
          state: form.state.trim(),
        })
        .select("slug")
        .single();
      if (error) throw error;
      return data.slug as string;
    },
    onSuccess: async (slug) => {
      toast.success("Project submitted for review — it will appear in the archive once approved.");
      await queryClient.invalidateQueries({ queryKey: ["heritage_projects"] });
      navigate({ to: "/projects/$slug", params: { slug } });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const required = ["title", "category", "description", "city", "state"] as const;
  const canSubmit = required.every((key) => form[key].trim() !== "");

  const field = (
    key: keyof typeof initial,
    label: string,
    options?: { placeholder?: string; area?: boolean; span?: boolean },
  ) => (
    <div className={options?.span ? "sm:col-span-2" : undefined}>
      <Label htmlFor={key}>{label}</Label>
      {options?.area ? (
        <Textarea
          id={key}
          className="mt-1.5 min-h-28"
          value={form[key]}
          placeholder={options.placeholder}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ) : (
        <Input
          id={key}
          className="mt-1.5"
          value={form[key]}
          placeholder={options?.placeholder}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="rule-label">New entry</p>
      <h1 className="mt-3 text-4xl text-foreground">Start a heritage project</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Describe a tradition, place or practice that deserves a record. Others can then add
        photographs, stories and research to it.
      </p>

      <form
        className="archive-card mt-10 grid gap-5 p-6 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (!canSubmit) {
            toast.error("Title, category, description, city and state are required.");
            return;
          }
          mutation.mutate();
        }}
      >
        {field("title", "Title", { placeholder: "Kumartuli: Living Clay Art", span: true })}
        {field("local_name", "Local name (optional)", { placeholder: "কুমোরটুলি" })}
        {field("category", "Category", { placeholder: "Crafts, Architecture, Food…" })}
        {field("description", "Description", {
          placeholder: "What is this, and what does documenting it preserve?",
          area: true,
          span: true,
        })}
        {field("community", "Community (optional)", { placeholder: "Clay artisans" })}
        {field("city", "City or town")}
        {field("district", "District (optional)")}
        {field("state", "State")}
        {field("cultural_significance", "Cultural significance (optional)", {
          area: true,
          span: true,
        })}
        {field("historical_context", "Historical context (optional)", {
          area: true,
          span: true,
        })}

        <div className="sm:col-span-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving…" : "Add to the archive"}
          </Button>
        </div>
      </form>
    </div>
  );
}
