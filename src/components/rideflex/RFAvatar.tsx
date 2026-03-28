import React from "react";
import { cn } from "./utils";

interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {}

const RFAvatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("relative inline-flex size-8 shrink-0 overflow-hidden rounded-full select-none", className)}
      {...props}
    />
  )
);
RFAvatar.displayName = "RFAvatar";

const RFAvatarImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, ...props }, ref) => (
    <img
      ref={ref}
      className={cn("aspect-square size-full rounded-full object-cover", className)}
      {...props}
    />
  )
);
RFAvatarImage.displayName = "RFAvatarImage";

const RFAvatarFallback = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
RFAvatarFallback.displayName = "RFAvatarFallback";

export { RFAvatar, RFAvatarImage, RFAvatarFallback };
