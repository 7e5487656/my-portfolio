'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [works, setWorks] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { data: cats } = await supabase.from('categories').select().order('sort_order')
    const { data: ws } = await supabase.from('works').select('*, categories(name)').order('created_at', { ascending: false })
    setCategories(cats || [])
    setWorks(ws || [])
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function addCategory(fd: FormData) {
    await supabase.from('categories').insert({
      name: fd.get('name'),
      slug: fd.get('slug'),
    })
    loadData()
  }

  async function addWork(fd: FormData) {
    const file = fd.get('file') as File
    let coverUrl = ''
    if (file && file.size > 0) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('works').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('works').getPublicUrl(path)
        coverUrl = data.publicUrl
      }
    }
    await supabase.from('works').insert({
      title: fd.get('title'),
      category_id: Number(fd.get('category_id')),
      description: fd.get('description'),
      cover_url: coverUrl,
    })
    loadData()
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Управление работами</h1>
        <button onClick={handleLogout} className="text-sm text-neutral-500">Выйти</button>
      </div>
      <form action={addCategory} className="flex gap-3 mb-8">
        <input name="name" placeholder="Название категории" className="border rounded px-3 py-2" required />
        <input name="slug" placeholder="slug (напр. photo)" className="border rounded px-3 py-2" required />
        <button className="bg-blue-600 text-white rounded px-4 py-2">Добавить категорию</button>
      </form>
      <form action={addWork} className="space-y-3 mb-8 border p-4 rounded-lg">
        <h2 className="font-semibold">Добавить работу</h2>
        <input name="title" placeholder="Заголовок" className="w-full border rounded px-3 py-2" required />
        <select name="category_id" className="w-full border rounded px-3 py-2" required>
          <option value="">Выберите категорию</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <textarea name="description" placeholder="Описание" className="w-full border rounded px-3 py-2" rows={2} />
        <input name="file" type="file" accept="image/*,video/*" className="w-full" />
        <button className="bg-black text-white rounded px-4 py-2">Загрузить</button>
      </form>
      <div className="space-y-2">
        {works.map((w) => (
          <div key={w.id} className="flex justify-between border-b py-2">
            <span>{w.title} — {w.categories?.name}</span>
            <button
              onClick={async () => {
                await supabase.from('works').delete().eq('id', w.id)
                loadData()
              }}
              className="text-red-500 text-sm"
            >Удалить</button>
          </div>
        ))}
      </div>
    </div>
  )
}