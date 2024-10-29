export const getProviders = async (): Promise<Miscellaneous.Provider[]> => {
  const response = await fetch('api/providers')
  const items = await response.json()
  return items
}

export const updateProvider = async (newProvider: Miscellaneous.Provider) => {
  await fetch('/api/providers', {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(newProvider)
  })
}

export const deleteProvider = async (id: Miscellaneous.Provider['id']) => {
  await fetch(`/api/providers/${id}`, {
    method: 'DELETE'
  })
}

export const saveProvider = async (newProvider: Miscellaneous.NewProvider) => {
  await fetch('/api/providers', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(newProvider)
  })
}