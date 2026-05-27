import * as React from "react";
import { cn } from "../../lib/utils";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  bordered?: boolean;
  hover?: boolean;
  responsive?: boolean;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, striped, bordered, hover, responsive, children, ...props }, ref) => {
    const tableClasses = cn(
      "w-full text-sm text-left",
      bordered && "border border-border",
      className
    );

    const table = (
      <table ref={ref} className={tableClasses} {...props}>
        {children}
      </table>
    );

    if (responsive) {
      return (
        <div className="w-full overflow-x-auto rounded-lg border border-border">
          {table}
        </div>
      );
    }

    return table;
  }
);
Table.displayName = "Table";

const TableHead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-muted/50 border-b border-border", className)}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & { striped?: boolean; hover?: boolean }
>(({ className, striped, hover, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      "[&>tr:last-child]:border-0",
      striped && "[&>tr:nth-child(even)]:bg-muted/30",
      hover && "[&>tr:hover]:bg-muted/50",
      className
    )}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn("border-b border-border transition-colors", className)}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-4 py-3 align-middle text-foreground", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableHeaderCell = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "px-4 py-3 text-left font-semibold text-foreground align-middle",
      className
    )}
    {...props}
  />
));
TableHeaderCell.displayName = "TableHeaderCell";

export { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell };
