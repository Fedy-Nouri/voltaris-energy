type JsonLdProps = {
  /** Any schema.org object from `lib/schema.ts`. */
  schema: Record<string, unknown>;
};

/**
 * Renders a structured-data block.
 *
 * `JSON.stringify` output is escaped for `</script>` before being injected.
 * The data here is authored in this repository rather than user-supplied, so
 * the risk is theoretical, but a content layer that later becomes a CMS should
 * not need this revisited.
 */
export function JsonLd({ schema }: JsonLdProps) {
  const json = JSON.stringify(schema).replace(/</g, '\\u003c');

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
