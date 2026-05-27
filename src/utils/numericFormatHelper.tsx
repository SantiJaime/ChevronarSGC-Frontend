import React, { forwardRef } from "react";
import { cn } from "../lib/utils";

export type NumericFormatInputProps = Omit<
  React.ComponentProps<"input">,
  "size" | "value"
> & {
  value?: string | number | string[];
};

const NumericFormatInputAdapter = forwardRef<
  HTMLInputElement,
  NumericFormatInputProps
>(({ value, className, ...props }, ref) => (
  <input
    {...props}
    ref={ref}
    value={value as string | number | readonly string[] | undefined}
    className={cn(
      "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
  />
));

NumericFormatInputAdapter.displayName = "NumericFormatInputAdapter";

export type BootstrapInputProps = NumericFormatInputProps;
export { NumericFormatInputAdapter as BootstrapInputAdapter };
export default NumericFormatInputAdapter;
