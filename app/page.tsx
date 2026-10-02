import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import WorkGrid from '@/components/WorkGrid'
import ParallaxHero from '@/components/ParallaxHero'

export const revalidate = 60

export default async function HomePage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  const { data: works } = await supabase
    .from('works')
    .select('*, categories(name, slug)')
    .order('created_at', { ascending: false })

  return (
    <main>
      <ParallaxHero title="Моё портфолио" subtitle="Работы, проекты, эксперименты" />
      <h1 className="sr-only">Моё портфолио</h1>
      <WorkGrid works={works || []} />
    </main>
  )
}