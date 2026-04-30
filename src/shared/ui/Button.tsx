import * as React from "react"
import { cn } from "../utils/cn"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}


const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    default: "bg-[var(--accent)] text-white shadow hover:bg-[var(--accent)]/90",
    destructive: "bg-[var(--danger)] text-white shadow-sm hover:bg-[var(--danger)]/90",
    outline: "border border-[var(--border)] bg-transparent shadow-sm hover:bg-[var(--bg-elevated)] text-[var(--text-primary)]",
    secondary: "bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm hover:bg-[var(--bg-elevated)]/80",
    ghost: "hover:bg-[var(--bg-elevated)] text-[var(--text-primary)]",
    link: "text-[var(--accent)] underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9",
  }



  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
