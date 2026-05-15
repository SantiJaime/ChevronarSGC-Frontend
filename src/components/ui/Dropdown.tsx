import * as React from "react";
import { cn } from "../../lib/utils";

interface DropdownProps {
  children: React.ReactNode;
  className?: string;
}

interface DropdownMenuProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
}

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> & {
  Menu: React.FC<DropdownMenuProps>;
  Item: React.FC<DropdownItemProps>;
} = ({ children, className }) => {
  return <div className={cn("relative", className)}>{children}</div>;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({ show, children, className }) => {
  if (!show) return null;

  return (
    <div
      className={cn(
        "absolute z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-lg py-1 max-h-60 overflow-y-auto animate-fadeIn",
        className
      )}
    >
      {children}
    </div>
  );
};

const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={cn(
        "w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

Dropdown.Menu = DropdownMenu;
Dropdown.Item = DropdownItem;

export { Dropdown };
