// server component
export default function DocsApplication() {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-none">
      <h1>Application</h1>
      <p>Structure of the app: organizations → teams → seasons → matches.</p>

      <h2 id="organizations">Organizations</h2>
      <p>How to create, join and manage organizations. Sharing & roles.</p>

      <h2 id="teams">Teams</h2>
      <p>Team types, home arena, country, and roster management basics.</p>

      <h2 id="seasons">Seasons</h2>
      <p>Season lifetime, constraints, default season selection.</p>
    </article>
  );
}
