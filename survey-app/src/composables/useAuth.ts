import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

const user = ref<any>(null)

export function useAuth() {
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    user.value = data.user
    localStorage.setItem('user', JSON.stringify(data.user))
    return data
  }

  const register = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    
    if (error) throw error
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
    localStorage.removeItem('user')
  }

  const getUser = () => {
    return JSON.parse(localStorage.getItem('user') || 'null')
  }

  return {
    user,
    login,
    register,
    logout,
    getUser
  }
}
