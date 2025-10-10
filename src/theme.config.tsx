// src/theme.config.tsx
import React from "react";

export default {
  logo: <span>vbmetrics Docs</span>,
  project: { link: "https://github.com/vbmetrics" },
  docsRepositoryBase: "https://github.com/vbmetrics/your-repo/tree/main/src/pages/docs",
  footer: { text: "© 2025 vbmetrics" },
  useNextSeoProps() {
    return { titleTemplate: "%s – vbmetrics Docs" };
  },
};
