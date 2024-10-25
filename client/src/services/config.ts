export const getConfig = async () => {
  const config = await fetch('/api/config')
    .then(res => res.json())
  return config
}