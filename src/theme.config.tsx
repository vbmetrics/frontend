import React from "react";

const config = {
  logo: <span>vbmetrics Docs</span>,
  project: { 
    link: "https://github.com/vbmetrics" 
  },
  docsRepositoryBase: "https://github.com/vbmetrics/your-repo/tree/main/src/pages/docs",
  footer: { 
    text: `© ${new Date().getFullYear()} vbmetrics` 
  },
  // W Nextra 3 zamiast useNextSeoProps używamy head lub Metadata w layout.tsx
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="vbmetrics Docs" />
      <meta property="og:description" content="Dokumentacja projektu vbmetrics" />
    </>
  ),
  // Jeśli chcesz szablon tytułu, w Nextra 3 ustawia się to w useNextSeoProps zamienniku:
  useNextSeoProps() {
    // Uwaga: to może generować ostrzeżenia w Next.js 16, 
    // zaleca się docelowo migrację do layout.tsx Metadata
    return {
      titleTemplate: '%s – vbmetrics Docs'
    }
  }
};

export default config;