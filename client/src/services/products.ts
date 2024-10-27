export const getProducts = async (): Promise<Miscellaneous.Product[]> => {
  const response = await fetch('/api/products')
  const results = await response.json()
  return results
}