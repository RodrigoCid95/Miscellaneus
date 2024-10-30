export const getProfile = async () => {
  const response = await fetch('/api/profile')
  const profile = await response.json()
  return profile
}

export const updateProfile = async (data: Partial<Miscellaneous.User>) => {
  const response = await fetch(`${window.location.origin}/api/profile`, {
    method: 'post',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await response.json()
}