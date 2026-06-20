import { cva, type VariantProps } from "class-variance-authority";
import {
  FieldError as AriaFieldError,
  FieldErrorProps as AriaFieldErrorProps,
  Group as AriaGroup,
  GroupProps as AriaGroupProps,
  Label as AriaLabel,
  LabelProps as AriaLabelProps,
  Text as AriaText,
  TextProps as AriaTextProps,
  ValidationResult,
  composeRenderProps,
} from "react-aria-components";

import { cn } from "@/lib/utils";

const labelVariants = cva([
  "text-sm font-medium leading-none",
  /* Disabled */
  "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70",
  /* Invalid */
  "group-data-[invalid]:text-destructive",
]);

function Label({ className, ...props }: AriaLabelProps) {
  return <AriaLabel className={cn(labelVariants(), className)} {...props} />;
}

function FormDescription({ className, ...props }: AriaTextProps) {
  return (
    <AriaText
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
      slot="description"
    />
  );
}

interface FieldErrorProps {
  children?: string | ((validation: ValidationResult) => string);
}

function FieldError({ children }: FieldErrorProps) {
  if (!children) return null;
  return (
    <AriaFieldError className="text-sm text-destructive">
      {children}
    </AriaFieldError>
  );
}

const fieldGroupVariants = cva("", {
  variants: {
    variant: {
      default: [
        "flex h-10 w-full items-center overflow-hidden rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-200",
        /* Focus Within */
        "data-[focus-within]:outline-none data-[focus-within]:ring-2 data-[focus-within]:ring-ring data-[focus-within]:ring-offset-2",
        /* Disabled */
        "data-[disabled]:opacity-50",
      ],
      ghost: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface GroupProps
  extends AriaGroupProps,
    VariantProps<typeof fieldGroupVariants> {}

function FieldGroup({ className, variant, ...props }: GroupProps) {
  return (
    <AriaGroup
      className={composeRenderProps(className, (className) =>
        cn(fieldGroupVariants({ variant }), className)
      )}
      {...props}
    />
  );
}

export {
  Label,
  fieldGroupVariants,
  FieldError,
};
