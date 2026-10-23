import { Container, PageHeader } from "./Section";

export function LegalPage({ title, updated, intro, sections }) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={title} description={`Last updated ${updated}`} />
      <Container className="max-w-3xl py-12">
        <p className="body-lg">{intro}</p>
        <div className="mt-10 space-y-10">
          {sections.map(([heading, paragraphs], i) => (
            <section key={heading} aria-labelledby={`legal-${i}`}>
              <h2 id={`legal-${i}`} className="heading-3">{i + 1}. {heading}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-fg">
                {paragraphs.map((p) => <p key={p}>{p}</p>)}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
