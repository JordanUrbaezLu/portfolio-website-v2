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
    registry.current[id] = ref.current;
    console.log(`[Section] Registered: ${id}`, ref.current);
    return () => {
      registry.current[id] = null;
      console.log(`[Section] Unregistered: ${id}`);
    };
  }, [id, registry]);

  return (
    <section id={id} ref={ref} className={className}>
      {children}
    </section>
  );
}
