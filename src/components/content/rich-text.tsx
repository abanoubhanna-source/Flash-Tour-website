import type { ReactNode } from "react";

function inlineMarkup(value: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;
  return value.split(pattern).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("_") && part.endsWith("_")) return <em key={index}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = /^(https?:\/\/|\/|#)/.test(link[2]) ? link[2] : "#";
      return <a key={index} href={href} className="font-semibold text-brand-teal underline decoration-brand-teal/30 underline-offset-2">{link[1]}</a>;
    }
    return part;
  });
}

export function RichText({ value, className }: { value: string; className?: string }) {
  const lines = value.split("\n");
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flushList = () => {
    if (!list.length) return;
    blocks.push(<ul key={`list-${blocks.length}`} className="list-disc space-y-1 pl-5">{list.map((item, index) => <li key={index}>{inlineMarkup(item)}</li>)}</ul>);
    list = [];
  };
  lines.forEach((line) => {
    if (line.startsWith("- ")) { list.push(line.slice(2)); return; }
    flushList();
    if (line.trim()) blocks.push(<p key={`p-${blocks.length}`}>{inlineMarkup(line)}</p>);
  });
  flushList();
  return <div className={className}>{blocks}</div>;
}
