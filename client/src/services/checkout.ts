export const saveCheckout = async (productGroups: Miscellaneous.ProductGroup[]) => {
  const newSales: Miscellaneous.NewSale[] = []
  for (const product of productGroups) {
    newSales.push({
      product: product.id,
      count: product.count,
      total: product.price * product.count
    })
  }
  await fetch('/api/sales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSales)
  })
}

export const findProducts = async (query: string) => {
  const products = await fetch(`/api/products/${query}`)
    .then(res => res.json())
  return products
}