export const updatePassword = (currentPass: string, newPass: string) => {
  return fetch(`${window.location.origin}/api/profile`, {
    method: 'put',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ currentPass, newPass })
  })
    .then(res => res.json())
}