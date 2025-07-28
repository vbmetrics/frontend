"use client";

import { cn } from "@/lib/utils";

import { z } from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { 
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import type { KeyboardEvent } from "react";

// const ALLOWED_CODES = ["K1#S+", "A3#R-", "P5#E="];

const FormSchema = z.object({
    code: z
        .string()
        .min(4, {
            message: "Code must be at least 4 characters.",
        })
        .max(160, {
            message: "One code must not be longer than 160 characters.",
        })
        .transform((val) => val.toUpperCase()),
        /*
        .refine((val) => ALLOWED_CODES.includes(val.toUpperCase()), {
            message: "Podany kod nie znajduje się na liście dozwolonych akcji.",
        })
        .refine((val) => val.startsWith("A"), { // Sprawdź warunek już na zmienionych danych
            message: "Kod musi być kodem ataku (zaczynać się od 'A').",
        })
        .pipe(z.string().min(4, { message: "Kod musi mieć co najmniej 4 znaki." }))
        .pipe(z.string().includes("#", { message: "Kod musi zawierać symbol #." }))
        .regex(/^[A-Z]\d#[A-Z][+-]$/, {
            message: "Wrong format of action code. Check documentation.",
        })
        */
});

export function CodeInput() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: "onChange", // "onTouched"
        defaultValues: { code: "" },
    });

    const { errors, dirtyFields } = form.formState;

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast("You submitted the following action code", {
            description: (
                <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        });

        form.reset({ code: "" });
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            form.handleSubmit(onSubmit)();
        } else if (event.key === "Escape") {
            form.reset({ code: "" });
        }
    };

    return (
        <Form { ... form }>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-12 pl-12 space-y-4">
                <FormField 
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Action Code</FormLabel>
                            <FormControl>
                                <div className={cn(
                                    "flex h-16 items-center rounded-md bg-muted px-3 transition-colors",
                                    errors.code && "border border-red-600",
                                    !errors.code && dirtyFields.code && "border border-green-600",
                                    !dirtyFields.code && "border border-input"
                                )}>
                                    <Textarea 
                                        placeholder="Type in the current action code"
                                        className="w-full resize-none border-none bg-transparent px-0 py-8 shadow-none focus-visible:ring-0"
                                        { ... field }
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                            </FormControl>
                            <FormDescription>
                                You can code the current action following documentation.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className={cn(
                    "text-background hover:text-background",
                    errors.code && "bg-red-700 hover:bg-red-900",
                    !errors.code && dirtyFields.code && "bg-green-700 hover:bg-green-900",
                    !dirtyFields.code && "bg-gray-700 hover:bg-gray-900"
                )}>
                    Submit
                </Button>
            </form>
        </Form>
    );
}
