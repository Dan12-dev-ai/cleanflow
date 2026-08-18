export const customers = [
  { id: 1, name: 'Maya Chen', phone: '+233 20 123 4567', email: 'maya@mail.com', address: 'East Legon', orders: 12, score: 96, status: 'VIP' },
  { id: 2, name: 'Ava Turner', phone: '+233 24 987 6543', email: 'ava@mail.com', address: 'Tema', orders: 5, score: 84, status: 'Regular' },
  { id: 3, name: 'Noah Lee', phone: '+233 27 555 1122', email: 'noah@mail.com', address: 'Accra Central', orders: 2, score: 78, status: 'New' },
]

export const services = [
  { id: 1, name: 'Wash & Fold', category: 'Standard', price: 18, duration: '24h' },
  { id: 2, name: 'Dry Cleaning', category: 'Premium', price: 24, duration: '48h' },
  { id: 3, name: 'Ironing', category: 'Express', price: 12, duration: '8h' },
  { id: 4, name: 'Express Service', category: 'Urgent', price: 30, duration: '4h' },
]

export const orders = [
  { id: 'LD-1042', customer: 'Maya Chen', service: 'Wash & Fold', amount: 24, status: 'Ready', createdAt: '2026-08-03', payment: 'Paid' },
  { id: 'LD-1043', customer: 'Ava Turner', service: 'Dry Cleaning', amount: 36, status: 'Washing', createdAt: '2026-08-03', payment: 'Pending' },
  { id: 'LD-1044', customer: 'Noah Lee', service: 'Ironing', amount: 12, status: 'Delivered', createdAt: '2026-08-02', payment: 'Paid' },
]

export const payments = [
  { id: 1, orderId: 'LD-1042', customer: 'Maya Chen', method: 'Cash', amount: 24, date: '2026-08-03' },
  { id: 2, orderId: 'LD-1043', customer: 'Ava Turner', method: 'Card', amount: 36, date: '2026-08-03' },
]

export const reportsData = [
  { name: 'Mon', orders: 20, revenue: 480 },
  { name: 'Tue', orders: 28, revenue: 620 },
  { name: 'Wed', orders: 24, revenue: 540 },
  { name: 'Thu', orders: 35, revenue: 780 },
  { name: 'Fri', orders: 40, revenue: 900 },
  { name: 'Sat', orders: 31, revenue: 720 },
  { name: 'Sun', orders: 27, revenue: 640 },
]

export const employees = [
  { id: 1, name: 'Daniel Mensah', role: 'Admin', email: 'daniel@launderly.com', status: 'Active' },
  { id: 2, name: 'Grace Boateng', role: 'Staff', email: 'grace@launderly.com', status: 'Active' },
]

export const settings = {
  theme: 'dark',
  notifications: true,
  autoReceipt: true,
  lowStockAlert: true,
}
