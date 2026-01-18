import { ReactNode } from 'react'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import themeConfig from '../../theme.config' // Dostosuj ścieżkę do swojego pliku
import 'nextra-theme-docs/style.css'

export default async function DocsLayout({ children }: { children: ReactNode }) {
  const pageMap = await getPageMap()

  return (
    <html lang="pl" dir="ltr" suppressHydrationWarning>
      <body>
        <Layout
          {...themeConfig} // Tutaj przekazujesz logo, linki do projektu itp.
          pageMap={pageMap}
          navbar={<Navbar logo={themeConfig.logo || <b>Logo</b>} />}
          footer={<Footer>{themeConfig.footer?.text || 'Stopka'}</Footer>}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}