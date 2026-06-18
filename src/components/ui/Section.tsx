"use client";
import React, { useEffect, useRef } from "react";

type Registry = React.RefObject<Record<string, HTMLElement | null>>;

export function Section({
  id,
  registry,
  children,
  className = "",
}: {
  id: string;
  registry: Registry;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const reg = registry.current;
    reg[id] = ref.current;
    return () => {
      reg[id] = null;
    };
  }, [id, registry]);

  return (
    <section id={id} ref={ref} className={className}>
      {children}
    </section>
  );
}
