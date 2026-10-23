import { Fragment } from "react";

/** Renders **bold** inline segments as <strong>. */
function inline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i} className="font-semibold text-fg">{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>,
  );
}

/**
 * Tiny markdown subset (headings, paragraphs, bullet and numbered lists, bold),
 * rendered as React elements so article content is never injected as raw HTML.
 */
export function ArticleBody({ content }) {
  const blocks = content.trim().split(/\n\s*\n/);
  return (
    <div className="space-y-5 text-base leading-relaxed text-muted-fg">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (block.startsWith("## ")) {
          return <h2 key={i} className="heading-2 pt-4 text-fg">{block.slice(3)}</h2>;
        }
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="list-disc space-y-2 pl-6 marker:text-primary">
              {lines.map((l, j) => <li key={j}>{inline(l.slice(2))}</li>)}
            </ul>
          );
        }
        if (lines.every((l) => /^\d+\. /.test(l))) {
          return (
            <ol key={i} className="list-decimal space-y-2 pl-6 marker:font-semibold marker:text-primary">
              {lines.map((l, j) => <li key={j}>{inline(l.replace(/^\d+\. /, ""))}</li>)}
            </ol>
          );
        }
        return <p key={i}>{inline(block)}</p>;
      })}
    </div>
  );
}
