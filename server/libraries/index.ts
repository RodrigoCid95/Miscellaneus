export * from './db'

class TimeUTC implements Miscellaneous.ITimeUTC {
  public getCurrentUTC() {
    return new Date().getTime();
  }

  public getStartAndEndOfWeek(year: number, week: number) {
    const firstOfJanuary = new Date(year, 0, 1);
    const dayOfTheWeek = firstOfJanuary.getDay();
    const daysUntilWeek = (week - 1) * 7 - dayOfTheWeek;

    const startOfWeek = new Date(firstOfJanuary);
    startOfWeek.setDate(firstOfJanuary.getDate() + daysUntilWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return {
      start: startOfWeek.getTime(),
      end: endOfWeek.getTime(),
    };
  }

  public getStartAndEndOfDay(year: number, month: number, day: number) {
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    return {
      start: startOfDay.getTime(),
      end: endOfDay.getTime(),
    };
  }

  public getStartAndEndOfMonth(year: number, month: number) {
    const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    return {
      start: startOfMonth.getTime(),
      end: endOfMonth.getTime(),
    };
  }

  public getStartAndEndOfYear(year: number) {
    const startOfYear = new Date(year, 0, 1, 0, 0, 0, 0);
    const endOfYear = new Date(year + 1, 0, 0, 23, 59, 59, 999);

    return {
      start: startOfYear.getTime(),
      end: endOfYear.getTime(),
    };
  }
}

Object.defineProperty(global, 'timeUTC', { value: new TimeUTC(), writable: false });