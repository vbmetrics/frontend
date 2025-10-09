// server component
import Link from "next/link";

export default function DocsCoding() {
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_260px]">
      <article className="prose prose-sm dark:prose-invert max-w-none">
        <h1>Coding</h1>
        <p>
          This section explains live coding workflow and the action code notation.
          Below is a mock spec outline you’ll replace with your final version.
        </p>

        <h2 id="workflow">Workflow</h2>
        <ol>
          <li>Create a match.</li>
          <li>Set initial lineups (P1..P6, Libero).</li>
          <li>Start coding rallies in <code>/live/&lt;matchId&gt;/coding</code>.</li>
        </ol>

        <h2 id="notation">Notation (draft)</h2>
        <p>
          Keep all code examples in a consistent format. See{" "}
          <Link href="/docs/coding#examples">Examples</Link>.
        </p>

        <h3 id="tokens">Tokens</h3>
        <ul>
          <li><code>S</code> – serve, <code>R</code> – reception, <code>A</code> – attack, …</li>
          <li>Quality marks: <code>+</code>, <code>-</code>, <code>#</code>, etc.</li>
        </ul>

        <h3 id="validation">Validation & scoring</h3>
        <p>Server-side validation resolves the rally’s winner and increments score.</p>

        <h2 id="examples">Examples</h2>
        <pre>{`S# R+ A-   // explain what happens here`}</pre>
      </article>

      <aside className="sticky top-20 hidden md:block">
        <div className="rounded-lg border bg-card p-3">
          <p className="text-xs font-semibold mb-2">On this page</p>
          <nav className="space-y-1 text-sm">
            <a href="#workflow" className="text-muted-foreground hover:text-foreground">Workflow</a><br/>
            <a href="#notation" className="text-muted-foreground hover:text-foreground">Notation</a><br/>
            <a href="#tokens" className="text-muted-foreground hover:text-foreground ml-2">Tokens</a><br/>
            <a href="#validation" className="text-muted-foreground hover:text-foreground">Validation</a><br/>
            <a href="#examples" className="text-muted-foreground hover:text-foreground">Examples</a>
          </nav>
        </div>
      </aside>
    </div>
  );
}
