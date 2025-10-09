"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // rozmiar i tło toru (zbiera kolory z Twoich zmiennych)
        "peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-all outline-none",
        "data-[state=unchecked]:bg-input data-[state=checked]:bg-primary",
        "border-border focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // gałka
          "pointer-events-none block size-5 rounded-full bg-background shadow transition-transform",
          // pozycje
          "data-[state=unchecked]:translate-x-[2px]",
          "data-[state=checked]:translate-x-[calc(100%-2px)]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
