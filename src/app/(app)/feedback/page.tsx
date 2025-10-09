"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category = "bug" | "idea" | "question";

export default function FeedbackPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [category, setCategory] = React.useState<Category>("idea");
  const [message, setMessage] = React.useState("");

  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // live region – dla komunikatów walidacji / sukcesu
  const [live, setLive] = React.useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Name is too short.";
    if (!/.+@.+\..+/.test(email)) e.email = "Invalid email.";
    if (!message || message.trim().length < 10)
      e.message = "Please provide at least 10 characters.";
    return e;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      setLive("Please fix the highlighted fields.");
      return;
    }
    setSubmitting(true);
    setLive("");

    try {
      // MOCK: zamiast dzwonić do API, tylko „udajemy” request
      await new Promise((r) => setTimeout(r, 600));

      toast.success("Thanks! We received your feedback.");
      setLive("Feedback sent successfully.");
      setName("");
      setEmail("");
      setCategory("idea");
      setMessage("");
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLive("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-1">Feedback</h1>
      <p className="text-muted-foreground mb-6">
        Tell us what to improve. This form is mock-only (no API call).
      </p>

      {/* aria-live dla czytników ekranu */}
      <div aria-live="polite" className="sr-only">
        {live}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Name</label>
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "err-name" : undefined}
            />
            {errors.name && (
              <p id="err-name" className="mt-1 text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <Input
              placeholder="you@domain.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "err-email" : undefined}
            />
            {errors.email && (
              <p id="err-email" className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Category</label>
          <Select value={category} onValueChange={(v: Category) => setCategory(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pick a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="idea">Idea</SelectItem>
              <SelectItem value="question">Question</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-xs mt-1">
            What is your feedback about?
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Message</label>
          <Textarea
            rows={8}
            placeholder="Describe your feedback…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "err-message" : undefined}
          />
          {errors.message && (
            <p id="err-message" className="mt-1 text-sm text-red-600">
              {errors.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setName("");
              setEmail("");
              setCategory("idea");
              setMessage("");
              setErrors({});
              setLive("Form cleared.");
            }}
          >
            Clear
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Sending…" : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
}
