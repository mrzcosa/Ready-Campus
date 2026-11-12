export const money = (amount) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(Number(amount) || 0)
export const formatDate = (date) => new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' }).format(new Date(date))
