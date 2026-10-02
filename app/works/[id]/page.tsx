import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export default async function WorkPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  const { data: work } = await supabase
    .from('works')
    .select('*, categories(name), media(*)')
    .eq('id', id)
    .single()

  if (!work) notFound()

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl md:text-5xl font-bold">{work.title}</h1>
      <p className="text-neutral-500 mt-2">{work.categories?.name}</p>
      {work.description && (
        <p className="mt-6 text-lg leading-relaxed">{work.description}</p>
      )}
      {work.cover_url && (
        <div className="mt-8 aspect-video relative rounded-xl overflow-hidden">
          <Image src={work.cover_url} alt={work.title} fill className="object-cover" />
        </div>
      )}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {work.media?.map((m: any) => (
          <div key={m.id} className="aspect-video relative rounded-xl overflow-hidden bg-neutral-100">
            {m.type === 'image' ? (
              <Image src={m.url} alt="" fill className="object-cover" />
            ) : (
              <video src={m.url} controls className="w-full h-full object-cover" />
            )}
          </div>
        ))}
      </div>
    </main>
  )
}