// src/app/docs/[[...mdxPath]]/page.tsx
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { notFound } from 'next/navigation'

// 1. Nazwa parametru MUSI być identyczna jak w nazwie folderu: 'mdxPath'
export function generateStaticParams() {
  return generateStaticParamsFor('mdxPath')
}

export default async function Page(props: { params: Promise<{ mdxPath?: string[] }> }) {
  // 2. Musisz użyć await przed dostępem do params w Next.js 16
  const params = await props.params
  
  // 3. Obsługa strony głównej /docs (gdzie mdxPath jest undefined)
  const mdxPath = params.mdxPath || []

  try {
    // 4. Importujemy stronę z folderu src/content
    const { default: MDXContent, metadata } = await importPage(mdxPath)
    
    // Przekazujemy rozwiązane params dalej
    return <MDXContent {...props} params={params} />
  } catch (error) {
    notFound()
  }
}