import { redirect } from 'next/navigation'

export default function TeamPage() {
  redirect('/team/users')
  return null
}
