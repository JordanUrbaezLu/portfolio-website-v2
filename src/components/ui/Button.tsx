import React from "react";
import clsx from "clsx";

type Variant = "primary" | "outline" | "link";

type ButtonBaseProps = {
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
};

type AnchorProps = React.ComponentPropsWithoutRef<"a"> & { as?: "a" };
type ButtonElProps = React.ComponentPropsWithoutRef<"button"> & {
  as: "button";
};
type DivProps = React.ComponentPropsWithoutRef<"div"> & { as: "div" };

// extend with other elements if needed
type PolymorphicProps = AnchorProps | ButtonElProps | DivProps;

export function Button(props: ButtonBaseProps & PolymorphicProps) {
  const {
    as = "a",
    variant = "primary",
    className,
    children,
    ...rest
  } = props as ButtonBaseProps & (AnchorProps | ButtonElProps | DivProps);

  const base =
    "inline-flex items-center justify-center px-8 py-3 rounded-xl text-white font-medium transition-all duration-300";

  const stylesMap: Record<Variant, string> = {
    primary:
      "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 hover:scale-105",
    outline:
      "border border-white/20 hover:bg-white/5 hover:border-white/30 hover:scale-105",
    link: "text-white/80 hover:text-white group",
  };

  const Component = as as React.ElementType;

  return (
    <Component className={clsx(base, stylesMap[variant], className)} {...rest}>
      {children}
    </Component>
  );
}
