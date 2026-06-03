import { supabase } from '../lib/supabase.js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    // GET
    const { data, error } = await supabase.from('books').select('*')

    if (error) return res.status(500).json(error)
    return res.json(data)
  }

  if (req.method === 'POST') {
    const { name, description } = req.body

    const { data, error } = await supabase
      .from('books')
      .insert([{ name, description }])

    if (error) return res.status(500).json(error)
    return res.json(data)
  }

  res.status(405).end()
}
