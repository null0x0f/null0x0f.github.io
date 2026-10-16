const DAY = 86_400_000;

export function isWeekStart(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value && date.getUTCDay() === 1;
}

export function formatWeeklyDate(date: Date): string {
  return date.toLocaleDateString("zh-CN", { timeZone: "UTC", year: "numeric", month: "2-digit", day: "2-digit" });
}

export function getWeekInfo(weekOf: string) {
  const start = new Date(`${weekOf}T00:00:00Z`);
  const end = new Date(start.valueOf() + 6 * DAY);
  // ISO 周所属年取决于本周的星期四；全部使用 UTC，避免构建机器时区改变结果。
  const thursday = new Date(start.valueOf() + 3 * DAY);
  const isoYear = thursday.getUTCFullYear();
  const week = Math.ceil(((thursday.valueOf() - Date.UTC(isoYear, 0, 1)) / DAY + 1) / 7);
  const number = String(week).padStart(2, "0");
  const datePart = (date: Date) => date.toISOString().slice(0, 10).replaceAll("-", ".");
  const endLabel = start.getUTCFullYear() === end.getUTCFullYear() ? datePart(end).slice(5) : datePart(end);
  return {
    start, end, number, isoYear,
    label: `${isoYear} · W${number}`,
    range: `${datePart(start)} — ${endLabel}`,
    year: String(start.getUTCFullYear()),
    month: weekOf.slice(0, 7),
    monthLabel: `${start.getUTCFullYear()} 年 ${start.getUTCMonth() + 1} 月`
  };
}
