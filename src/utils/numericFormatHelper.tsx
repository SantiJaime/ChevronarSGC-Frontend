import React, { forwardRef } from "react";
import { Form } from "react-bootstrap";

export type BootstrapInputProps = Omit<
  React.ComponentProps<"input">,
  "size" | "value"
> & {
  value?: string | number | string[];
};

const BootstrapInputAdapter = forwardRef<HTMLInputElement, BootstrapInputProps>(
  ({ value, ...props }, ref) => {
    return <Form.Control {...props} value={value} ref={ref} />;
  }
);

BootstrapInputAdapter.displayName = "BootstrapInputAdapter";

export default BootstrapInputAdapter;
