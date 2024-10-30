export const getHistory = async (): Promise<Miscellaneous.History[]> => {
  const response = await fetch('/api/history')
  const results = await response.json()
  return results
}

export const getDayHistory = async (year: number, mounth: number, day: number): Promise<Miscellaneous.History[]> => {
  const response = await fetch(`/api/history/day/${year}/${mounth}/${day}`)
  const results = await response.json()
  return results
}

export const getWeekHistory = async (year: number, week: number): Promise<Miscellaneous.History[]> => {
  const response = await fetch(`/api/history/week/${year}/${week}`)
  const results = await response.json()
  return results
}

export const getMonthHistory = async (year: number, mounth: number): Promise<Miscellaneous.History[]> => {
  const response = await fetch(`/api/history/month/${year}/${mounth}`)
  const results = await response.json()
  return results
}

export const restoreHistory = async (id: Miscellaneous.History['id']) => {
  await fetch(`/api/history/${id}`, {
    method: 'delete'
  })
}