"use client";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { KeyboardEvent } from "react";
import { postRally } from "@/lib/api/matches";

const FormSchema = z.object({
  code: z.string().min(2, { message: "Code is too short." }).max(160).transform((v) => v.toUpperCase()),
});

export function CodeInput({ matchId, onUpdated }: { matchId: string; onUpdated?: () => void }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: { code: "" },
  });
  const { errors, dirtyFields, isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const state = await postRally(matchId, data.code);
      toast.success("Rally saved");
      onUpdated?.(); // odśwież scoreboard/listę
    } catch (e: any) {
      toast.error("Failed to save rally");
      console.error(e);
    } finally {
      form.reset({ code: "" });
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    } else if (event.key === "Escape") {
      form.reset({ code: "" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-8 space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action Code</FormLabel>
              <FormControl>
                <div
                  className={cn(
                    "flex h-16 items-center rounded-md bg-muted px-3 transition-colors",
                    errors.code && "border border-red-600",
                    !errors.code && dirtyFields.code && "border border-green-600",
                    !dirtyFields.code && "border border-input"
                  )}
                >
                  <Textarea
                    placeholder="Type in the current action code"
                    className="w-full resize-none border-none bg-transparent px-0 py-8 shadow-none focus-visible:ring-0"
                    {...field}
                    onKeyDown={handleKeyDown}
                    disabled={isSubmitting}
                  />
                </div>
              </FormControl>
              <FormDescription>Press Enter to submit, Esc to clear.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="text-background">
          {isSubmitting ? "Saving…" : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
