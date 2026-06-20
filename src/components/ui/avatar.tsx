import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

const colors = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
  "bg-violet-100 text-violet-700",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const COLOR_HASH_SHIFT = 5;

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << COLOR_HASH_SHIFT) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, name = "", src, size = "md", ...props }, ref) => {
    if (src) {
      return (
        <div
          ref={ref}
          className={cn("relative overflow-hidden rounded-full", sizeClasses[size], className)}
          {...props}
        >
          <img src={src} alt={name} className="h-full w-full object-cover" />
        </div>
      );
    }
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center rounded-full font-medium",
          getColor(name),
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {getInitials(name)}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
