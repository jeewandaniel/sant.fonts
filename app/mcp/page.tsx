import type { Metadata } from "next";
import { CodeBlock, GitHubLink, ProseSection, SimplePage } from "@/components/SimplePage";

export const metadata: Metadata = {
  title: "MCP — sant.fonts",
  description:
    "A Model Context Protocol server that lets agents like Claude Code search the sant.fonts catalog and pick pairings.",
};

export default function McpPage() {
  return (
    <SimplePage
      eyebrow="MCP · coming soon"
      title="Let your agent"
      italic="pick the typeface."
      intro="A Model Context Protocol server that exposes the sant.fonts catalog as tools. Claude Code, Cursor or any MCP-aware client can search, fetch CSS, and ask for pairings — directly from a coding session."
    >
      <ProseSection label="Wire it up">
        <CodeBlock filename="claude_desktop_config.json">{`{
  "mcpServers": {
    "santfonts": {
      "command": "npx",
      "args": ["@santfonts/mcp"]
    }
  }
}`}</CodeBlock>
      </ProseSection>

      <ProseSection label="Tools">
        <p>The server registers three tools, each operating against the bundled offline manifest:</p>
        <CodeBlock filename="tools.txt">{`search_fonts(query, category?, role?, limit?)
  → ranked list of matching families

get_font(slug, weights?, subsets?)
  → CSS @import string + family-stack ready to paste

list_pairings(slug)
  → curated pairings + editorial reasoning`}</CodeBlock>
        <p>
          Same data shape as the CLI, same data as the website &mdash; one
          source of truth, three surfaces.
        </p>
      </ProseSection>

      <ProseSection label="Status">
        <p>
          The package will publish as{" "}
          <code className="font-mono text-[14px] text-text-primary">@santfonts/mcp</code> on npm. Coming
          immediately after the CLI lands.
        </p>
        <p>
          <GitHubLink href="https://github.com/jeewandaniel/sant.fonts">
            jeewandaniel/sant.fonts →
          </GitHubLink>
        </p>
      </ProseSection>
    </SimplePage>
  );
}
