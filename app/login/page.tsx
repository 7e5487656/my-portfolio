'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email, password,
    })

    console.log('AUTH ERROR:', authError)
    console.log('USER:', data?.user)

    if (authError) {
      setError('Неверный email или пароль')
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    console.log('USER ID:', data.user.id)
    console.log('PROFILE:', profile)
    console.log('PROFILE ERROR:', profileError)

    if (profile?.role !== 'admin') {
      await supabase.auth.signOut()
      setError('Нет доступа к админке')
      return
    }

    router.push('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Вход в админку</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          required
        />
        <button type="submit" className="w-full bg-black text-white rounded-lg py-2">
          Войти
        </button>
      </form>
    </div>
  )
}