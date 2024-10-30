export const createProduct = async (newProduct: Miscellaneous.NewProduct) => {
  fetch(`${window.location.origin}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProduct)
  })
}

export const getProducts = async (): Promise<Miscellaneous.Product[]> => {
  const response = await fetch('/api/products')
  const results = await response.json()
  return results
}

export const getFilterProducts = async (query: string): Promise<Miscellaneous.Product[]> => {
  const response = await fetch(`/api/products/${query}`)
  const results = await response.json()
  return results
}

export const updateProduct = async (id: Miscellaneous.Product['id'], product: Miscellaneous.NewProduct) => {
  await fetch('/api/products', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...product })
  })
}

export const deleteProduct = async (id: Miscellaneous.Product['id']) => {
  await fetch(`/api/products/${id}`, {
    method: 'DELETE'
  })
}