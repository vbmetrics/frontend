// server component
export default function DocsAnalytics() {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-none">
      <h1>Analytics</h1>
      <p>Overview of reports and charts. How metrics are computed (mock content).</p>

      <h2 id="reports">Reports</h2>
      <ul>
        <li>Team overview</li>
        <li>Player trend</li>
        <li>Serve/Receive balance</li>
      </ul>

      <h2 id="exports">Exports</h2>
      <p>CSV/JSON & upcoming Python integration.</p>
    </article>
  );
}
