export const formatDate = (isoString: string) => {
  const d = new Date(isoString)
  return d.toLocaleString('id-ID', { hour12: false })
}
