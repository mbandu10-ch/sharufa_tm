import { redirect } from 'next/navigation'

export default async function ProductsRedirectPage() {
  redirect('/dashboard/seller/products')
}
