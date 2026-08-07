import type { JSX } from "react";

export function Code({ children }: { children: React.ReactNode }): JSX.Element {
  return <code>{children}</code>;
}
