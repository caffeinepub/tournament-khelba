export function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-BD');
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatSlots(filled: number, total: number): string {
  return `${filled}/${total} slots`;
}

export function getSlotPercentage(filled: number, total: number): number {
  return (filled / total) * 100;
}

export function isLowSlots(filled: number, total: number): boolean {
  return getSlotPercentage(filled, total) > 75;
}

export function isUrgentDeadline(deadline: Date | string): boolean {
  const d = typeof deadline === 'string' ? new Date(deadline) : deadline;
  const now = new Date();
  const hoursUntil = (d.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntil < 24 && hoursUntil > 0;
}
