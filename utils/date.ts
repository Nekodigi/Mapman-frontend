import { OpeningPeriod } from "@googlemaps/google-maps-services-js";

export const renderHour = (hour: number) => {
  return `${Math.floor(hour / 2)}:${hour % 2 === 0 ? "00" : "30"}`;
};
export const renderHourRange = (hours: number[]) => {
  if (hours[0] === 0 && hours[1] === 48) {
    return "Open 24 hours";
  } else if (
    (hours[0] === 0 && hours[1] === 0) ||
    (hours[0] === 48 && hours[1] === 48)
  ) {
    return "Closed";
  } else {
    return `${renderHour(hours[0])} - ${renderHour(hours[1])}`;
  }
};

export const renderHours = (hours: number[][]) => {
  let count = 0;
  let hour = 0;
  for (let i = 0; i < 7; i++) {
    if (hours[i][1] - hours[i][0] !== 0) {
      hour = Math.abs(hours[i][1] - hours[i][0]) / 2;
      count++;
    }
  }
  return `${hour}h/${count}`;
};

[
  { close: { day: 0, time: "1800" }, open: { day: 0, time: "0900" } },
  { close: { day: 1, time: "1800" }, open: { day: 1, time: "0900" } },
  { close: { day: 3, time: "1800" }, open: { day: 3, time: "0900" } },
  { close: { day: 4, time: "1800" }, open: { day: 4, time: "0900" } },
  { close: { day: 5, time: "2145" }, open: { day: 5, time: "0900" } },
  { close: { day: 6, time: "1800" }, open: { day: 6, time: "0900" } },
];
type Period = {
  open: {
    day: number;
    time: string;
  };
  close: {
    day: number;
    time: string;
  };
};

export const period2hour = (period: OpeningPeriod): number[] => {
  const po = period.open;
  const pc = period.close;
  if (pc === undefined) {
    return [0, 0];
  }
  if (po.time === undefined || pc.time === undefined) {
    return [0, 0];
  }
  const open =
    po.day * 48 +
    Math.floor(parseInt(po.time) / 100) * 2 +
    Math.round((parseInt(po.time) % 100) / 30);
  const close =
    pc.day * 48 +
    Math.floor(parseInt(pc.time) / 100) * 2 +
    Math.round((parseInt(pc.time) % 100) / 30);
  return [open, close];
};
export const periods2hours = (
  periods: OpeningPeriod[] | undefined
): number[][] => {
  let hours: number[][] = Array.from({ length: 7 }, () => [0, 0]);
  if (periods === undefined) {
    hours = Array.from({ length: 7 }, () => [0, 48]);
    return hours;
  }
  for (const period of periods) {
    const [open, close] = period2hour(period);
    const openDay = Math.floor(open / 48);
    const closeDay = Math.floor(close / 48);
    for (let i = openDay; i <= closeDay; i++) {
      let start = 0;
      let end = 48;
      if (i === openDay) {
        start = i === openDay ? open % 48 : 0;
      }
      if (i === closeDay) {
        end = i === closeDay ? close % 48 : 48;
        if (end === 0) {
          end = 48;
        }
      } else {
        end = 48;
      }
      hours[i] = [start, end];
    }
  }
  return hours;
};

// const periods2hours = (periods: Period[]): number[][] => {
//   const hours: number[][] = Array.from({ length: 7 }, () => [0, 0]);
//   let lastHour = 0;
//   for (const period of periods) {
//     const [open, close] = period2hour(period);z
//     const openDay = Math.floor(open / 48);
//     const closeDay = Math.floor(close / 48);
//     for (let i = openDay; i <= closeDay; i++) {
//       let start = 0;
//       let end = 48;
//       if (i === openDay) {
//         start = i === openDay ? open % 48 : 0;
//       }
//       if (i === closeDay) {
//         end = i === closeDay ? close % 48 : 48;
//         if (end === 0) {
//           end = 48;
//         }
//       } else {
//         end = 48;
//       }
//       hours[i] = [start, end];
//     }
//   }
//   return hours;
// };

// type Period = {
//   open: {
//     day: number;
//     hour: number;
//     minute: number;
//     date: {
//       year: number;
//       month: number;
//       day: number;
//     };
//   };
//   close: {
//     day: number;
//     hour: number;
//     minute: number;
//     date: {
//       year: number;
//       month: number;
//       day: number;
//     };
//   };
// };

// const period2hour = (period: Period): number[] => {
//   // day:1, hour: 10 minute: 40-> 48+20+1 = 68

//   const po = period.open;
//   const pc = period.close;
//   const open = po.day * 48 + po.hour * 2 + Math.round(po.minute / 30);
//   const close = pc.day * 48 + pc.hour * 2 + Math.round(pc.minute / 30);
//   return [open, close];
// };
