export const getHistory = async () => {
  const results = await fetch('/api/history')
    .then(res => res.json())
  return results
}

export const restoreHistory = async (id: Miscellaneous.History['id']) => {
  await fetch(`/api/history/${id}`, {
    method: 'delete'
  })
}