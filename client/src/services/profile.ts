export const getProfile = async () => {
  const response = await fetch('/api/profile')
  const profile = await response.json()
  return profile
} 