import * as React from "react";
import { cn } from "@/lib/utils";

const NativeSelect = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "native-select flex h-11 w-full appearance-none rounded-sm border border-rule bg-sheet px-3 pr-9 text-sm text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);
NativeSelect.displayName = "NativeSelect";

export { NativeSelect };
