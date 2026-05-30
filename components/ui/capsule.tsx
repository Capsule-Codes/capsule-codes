import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const capsuleVariants = cva(
  "relative z-[2] inline-flex items-center gap-2 rounded-full font-mono font-medium tracking-[0.01em] transition-[transform,box-shadow] duration-200 ease-out",
  {
    variants: {
      size: {
        sm: "px-3 py-[5px] text-[10px] gap-1.5",
        md: "px-4 py-2 text-xs gap-2",
        lg: "px-5 py-3 text-sm gap-2",
      },
      variant: {
        default:
          "border bg-[image:var(--cap-bg)] border-[color:var(--cap-border)] shadow-[var(--cap-shadow)] text-[color:var(--cap-fg)]",
        success:
          "border bg-[color:var(--status-success-bg)] text-[color:var(--status-success-fg)] border-[color:var(--status-success-border)]",
        warning:
          "border bg-[color:var(--status-warning-bg)] text-[color:var(--status-warning-fg)] border-[color:var(--status-warning-border)]",
        info:
          "border bg-[color:var(--status-info-bg)] text-[color:var(--status-info-fg)] border-[color:var(--status-info-border)]",
      },
      interactive: {
        true: "hover:scale-[1.02] hover:brightness-110 cursor-pointer",
        false: "",
      },
    },
    defaultVariants: { size: "md", variant: "default", interactive: false },
  }
);

interface CapsuleProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof capsuleVariants> {
  dot?: boolean;
  icon?: React.ReactNode;
}

export const Capsule = React.forwardRef<HTMLSpanElement, CapsuleProps>(
  ({ className, size, variant, interactive, dot = true, icon, children, ...props }, ref) => {
    const isDefault = variant === "default" || variant === undefined || variant === null;
    const isButton = interactive === true;

    const handleKeyDown: React.KeyboardEventHandler<HTMLSpanElement> = (e) => {
      if (isButton && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        (props.onClick as unknown as React.MouseEventHandler<HTMLSpanElement> | undefined)?.(
          e as unknown as React.MouseEvent<HTMLSpanElement>
        );
      }
      props.onKeyDown?.(e);
    };

    return (
      <span
        ref={ref}
        className={cn(capsuleVariants({ size, variant, interactive }), className)}
        {...props}
        role={isButton ? (props.role ?? "button") : props.role}
        tabIndex={isButton ? (props.tabIndex ?? 0) : props.tabIndex}
        onKeyDown={handleKeyDown}
      >
        {dot && (
          <span
            aria-hidden
            className="block size-1.5 rounded-full"
            style={{
              backgroundColor: isDefault ? "var(--brand-green)" : "currentColor",
              boxShadow: isDefault ? "0 0 8px var(--brand-green)" : undefined,
            }}
          />
        )}
        {icon && <span className="inline-flex shrink-0">{icon}</span>}
        {children}
      </span>
    );
  }
);
Capsule.displayName = "Capsule";
