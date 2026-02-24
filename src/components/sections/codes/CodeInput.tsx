"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, Undo2 } from "lucide-react"; // Dodano Undo2

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  code: z.string().min(2, { message: "Code too short." }).max(512, { message: "Code too long." }),
});

async function apiCall(url: string, method: string, body?: any) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || "API request failed");
  }
  return res.json();
}

export function CodeInput({ 
  matchId, 
  onUpdated,
  canUndo = true,
  isMatchFinished = false
}: { 
  matchId: string; 
  onUpdated?: () => void;
  canUndo?: boolean;
  isMatchFinished?: boolean;
}) {
  const [isUndoing, setIsUndoing] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { code: "" },
  });

  const { isSubmitting } = form.formState;
  const { setFocus } = form;

  React.useEffect(() => {
    setFocus("code");
  }, [setFocus]);

  // Obsługa cofania
  const handleUndo = async () => {
    setIsUndoing(true);
    try {
      await apiCall(`/api/backend/api/v1/match/${matchId}/rally/last`, "DELETE");
      toast.success("Last action undone");
      onUpdated?.(); 
    } catch (e: any) {
      toast.error(e.message || "Failed to undo action");
    } finally {
      setIsUndoing(false);
      setTimeout(() => setFocus("code"), 10);
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const finalCode = data.code.toUpperCase();
      await apiCall(`/api/backend/api/v1/match/${matchId}/rally`, "POST", {
        raw_rally_code: finalCode,
        match_id: matchId,
      });
      
      toast.success("Rally saved");
      form.reset({ code: "" });
      onUpdated?.(); 
    } catch (e: any) {
      toast.error(e.message || "Failed to save rally");
    } finally {
      setTimeout(() => setFocus("code"), 10);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex gap-2">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="relative">
                    <Input
                      {...field}
                      placeholder={isMatchFinished ? "MATCH FINISHED" : "ENTER CODE (e.g. H15S#)"}
                      className={cn(
                        "h-14 text-xl font-mono tracking-wider uppercase shadow-sm border-2 focus-visible:ring-primary",
                        form.formState.errors.code && "border-destructive focus-visible:ring-destructive",
                        isMatchFinished && "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                      )}
                      disabled={isSubmitting || isUndoing || isMatchFinished} // Blokujemy Input
                      autoComplete="off"
                    />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Grupa przycisków */}
        <div className="flex gap-2">
          {/* Przycisk UNDO (Zostaje ODBLOKOWANY, nawet gdy isMatchFinished, by móc cofnąć mecz) */}
          <Button 
            type="button" 
            variant="outline"
            size="lg" 
            disabled={isSubmitting || isUndoing || !canUndo} // Tu celowo NIE ma isMatchFinished!
            className="h-14 px-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleUndo}
            title="Undo last action"
          >
            {isUndoing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Undo2 className="h-5 w-5" />}
          </Button>

          {/* Przycisk SEND (ZABLOKOWANY po meczu) */}
          <Button 
            type="submit" 
            size="lg" 
            disabled={isSubmitting || isUndoing || !form.watch("code") || isMatchFinished} // Blokujemy Send
            className="h-14 px-8"
          >
            {isSubmitting && !isUndoing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>

      </form>
    </Form>
  );
}