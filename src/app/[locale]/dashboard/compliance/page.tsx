import { redirect } from 'next/navigation'

export default async function ComplianceRedirectPage() {
  redirect('/dashboard/seller/compliance')
}
