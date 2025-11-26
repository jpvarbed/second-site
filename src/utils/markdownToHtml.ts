import { remark } from "remark";
import html from "remark-html";

import remarkToc from "remark-toc";

export default async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkToc, { heading: "TOC|Table of Contents", tight: true })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    .use((() => (tree: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
      tree.children.forEach((node: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (node.type === "heading") {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
          node.depth = Math.min(node.depth + 1, 6);
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any)
    .use(html)
    .process(markdown);
  return result.toString();
}
