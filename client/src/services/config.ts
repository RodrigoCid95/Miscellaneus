export const getConfig = async () => {
  const config = await fetch('/api/config')
    .then(res => res.json())
  return config
}

export const saveConfig = async (config: Miscellaneous.Config) => {
  await fetch('/api/config', {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(config)
  })
}