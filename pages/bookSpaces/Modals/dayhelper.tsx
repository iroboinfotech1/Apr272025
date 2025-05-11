import moment from "moment";

export function getWeekdayOrdinalLabel(dateString: string): {
  label: string;
  day: number;
  month: number;
  year: number;
} {
  const date = moment(dateString);
  const day = date.date();
  const month = date.month() + 1;
  const year = date.year();

  const weekday = date.day(); // 0 = Sun, 6 = Sat
  const ordinals = ["First", "Second", "Third", "Fourth", "Fifth"];

  let count = 0;
  for (let i = 1; i <= day; i++) {
    const d = moment(date).date(i);
    if (d.day() === weekday) {
      count++;
    }
  }

  // Check if it's the last occurrence of that weekday
  const lastDayOfMonth = moment(date).endOf("month").date();
  const lastWeekdayInMonth = moment(date).clone().date(lastDayOfMonth);
  while (lastWeekdayInMonth.day() !== weekday) {
    lastWeekdayInMonth.subtract(1, "day");
  }

  const isLast = date.date() === lastWeekdayInMonth.date();
  const weekdayName = date.format("dddd");
  const label = isLast
    ? `Last ${weekdayName}`
    : `${ordinals[count - 1]} ${weekdayName}`;

  return { label, day, month, year };
}
