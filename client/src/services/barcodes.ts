export const createBarCode = async (newBarCode: Miscellaneous.NewBarCode) => {
  await fetch('/api/bar-codes', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(newBarCode)
  })
}

export const getBarCodes = async (): Promise<Miscellaneous.BarCode[]> => {
  const response = await fetch('/api/bar-codes')
  const barcodes = await response.json()
  return barcodes
}

export const updateBarCode = async (barCode: Miscellaneous.BarCode) => {
  await fetch('api/bar-codes', {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(barCode)
  })
}

export const deleteBarCode = async (id: Miscellaneous.BarCode['id']) => {
  await fetch(`/api/bar-codes/${id}`, {
    method: 'DELETE'
  })
}