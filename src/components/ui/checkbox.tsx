"use client"

import * as React from "react"
import {
  Checkbox as AriaCheckbox,
  CheckboxProps as AriaCheckboxProps,
  composeRenderProps,
  Text,
} from "react-aria-components"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface CheckboxProps extends AriaCheckboxProps {
  label?: string
  description?: string
}

function Checkbox({ className, children, label, description, ...props }: CheckboxProps) {
  return (
    <AriaCheckbox
      className={composeRenderProps(className, (className) =>
        cn(
          "group flex items-center gap-2 text-sm outline-none",
          "data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2 data-[focus-visible]:rounded-sm",
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
          className
        )
      )}
      {...props}
    >
      {composeRenderProps(children, (children, renderProps) => (
        <>
          <div
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded border border-input bg-background",
              "transition-colors duration-200",
              "group-data-[selected]:bg-primary group-data-[selected]:border-primary group-data-[selected]:text-primary-foreground",
              "group-data-[indeterminate]:bg-primary group-data-[indeterminate]:border-primary",
              "group-data-[focus-visible]:ring-2 group-data-[focus-visible]:ring-ring group-data-[focus-visible]:ring-offset-2"
            )}
          >
            {renderProps.isSelected && <Check className="h-3 w-3" />}
          </div>
          {label && <span className="cursor-pointer">{label}</span>}
          {children}
          {description && (
            <Text className="text-xs text-muted-foreground" slot="description">
              {description}
            </Text>
          )}
        </>
      ))}
    </AriaCheckbox>
  )
}

export { Checkbox }
