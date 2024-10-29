export const createUser = async (newUser: Miscellaneous.NewUser) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(newUser)
  })
  return await response.json()
}

export const getUsers = async (): Promise<Miscellaneous.User[]> => {
  const response = await fetch('/api/users')
  const results = await response.json()
  return results
}

export const updateUser = async (id: Miscellaneous.User['id'], user: Partial<Miscellaneous.NewUser>) => {
  const response = await fetch('/api/users', {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ id, ...user })
  })
  return await response.json()
}

export const deleteUser = async (id: Miscellaneous.User['id']) => {
  await fetch(`/api/users/${id}`, {
    method: 'DELETE'
  })
}