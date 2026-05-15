import * as React from "react";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  show: boolean;
  onHide: () => void;
  size?: "sm" | "md" | "lg" | "xl";
  backdrop?: "static" | boolean;
  keyboard?: boolean;
  children: React.ReactNode;
}

interface ModalHeaderProps {
  closeButton?: boolean;
  children: React.ReactNode;
  onHide?: () => void;
}

interface ModalTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

const Modal: React.FC<ModalProps> & {
  Header: React.FC<ModalHeaderProps>;
  Title: React.FC<ModalTitleProps>;
  Body: React.FC<ModalBodyProps>;
  Footer: React.FC<ModalFooterProps>;
} = ({ show, onHide, size = "md", backdrop = true, children }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (backdrop !== "static" && e.target === e.currentTarget) {
      onHide();
    }
  };

  React.useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          "relative w-full bg-card rounded-xl shadow-2xl border border-border animate-fadeIn max-h-[90vh] flex flex-col",
          sizeClasses[size]
        )}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement<ModalHeaderProps>(child) && child.type === ModalHeader) {
            return React.cloneElement(child, { onHide });
          }
          return child;
        })}
      </div>
    </div>
  );
};

const ModalHeader: React.FC<ModalHeaderProps> = ({ closeButton, children, onHide }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      {children}
      {closeButton && onHide && (
        <button
          onClick={onHide}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

const ModalTitle: React.FC<ModalTitleProps> = ({ children, className }) => {
  return (
    <h3 className={cn("text-lg font-semibold text-foreground", className)}>
      {children}
    </h3>
  );
};

const ModalBody: React.FC<ModalBodyProps> = ({ children, className }) => {
  return (
    <div className={cn("p-4 overflow-y-auto flex-1", className)}>{children}</div>
  );
};

const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 p-4 border-t border-border",
        className
      )}
    >
      {children}
    </div>
  );
};

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export { Modal };
