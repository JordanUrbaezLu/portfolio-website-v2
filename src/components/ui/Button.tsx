import React from "react";
import clsx from "clsx";

type Variant = "primary" | "glass" | "outline" | "link";
type Size = "sm" | "md" | "lg";

type ButtonBaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: React.ReactNode;
};

type AnchorProps = React.ComponentPropsWithoutRef<"a"> & { as?: "a" };
type ButtonElProps = React.ComponentPropsWithoutRef<"button"> & {
  as: "button";
};
type DivProps = React.ComponentPropsWithoutRef<"div"> & { as: "div" };

type PolymorphicProps = AnchorProps | ButtonElProps | DivProps;

const sizeMap: Record<Size, string> = {
  sm: "px-4 py-2 text-sm rounded-lg gap-1.5",
  md: "px-6 py-3 text-[0.95rem] rounded-xl gap-2",
  lg: "px-7 py-3.5 text-base rounded-xl gap-2",
};

const variantMap: Record<Variant, string> = {
  // Loud, eye-catching CTA — aurora gradient + glow
  primary:
    "text-white bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_8px_30px_-8px_rgba(99,102,241,0.7)] hover:shadow-[0_12px_40px_-8px_rgba(99,102,241,0.85)] hover:-translate-y-0.5 ring-1 ring-inset ring-white/15",
  // Frosted secondary
  glass:
    "text-white glass hover:bg-white/[0.1] hover:-translate-y-0.5",
  // Quiet outline
  outline:
    "text-white/90 border border-white/20 hover:bg-white/[0.06] hover:border-white/35 hover:-translate-y-0.5",
  // Inline text link
  link: "text-white/80 hover:text-white group !px-0 !py-0",
};

export function Button(props: ButtonBaseProps & PolymorphicProps) {
  const {
    as = "a",
    variant = "primary",
    size = "md",
    className,
    children,
    ...rest
  } = props as ButtonBaseProps & (AnchorProps | ButtonElProps | DivProps);

  const base =
    "relative inline-flex items-center justify-center font-medium transition-all duration-300 ease-out select-none disabled:opacity-50 disabled:pointer-events-none";

  const Component = as as React.ElementType;

  return (
    <Component
      className={clsx(base, sizeMap[size], variantMap[variant], className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
