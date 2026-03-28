import React from "react";
import { cn } from "./utils";

const RFCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-4 overflow-hidden rounded-xl bg-card border border-border py-4 text-sm text-card-foreground", className)} {...props} />
  )
);
RFCard.displayName = "RFCard";

const RFCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("grid auto-rows-min items-start gap-1 px-4", className)} {...props} />
  )
);
RFCardHeader.displayName = "RFCardHeader";

const RFCardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-base leading-snug font-medium", className)} {...props} />
  )
);
RFCardTitle.displayName = "RFCardTitle";

const RFCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-4", className)} {...props} />
  )
);
RFCardContent.displayName = "RFCardContent";

export { RFCard, RFCardHeader, RFCardTitle, RFCardContent };
