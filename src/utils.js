export const dateToAry = (rawDate) => {
  const newDate = new Date(rawDate);
  const [month, date, year] = newDate.toLocaleDateString('en-US').split('/');
  return [+year, +month, +date];
};

export const dateToObj = (rawDate) => {
  const [year, month, date] = dateToAry(rawDate);
  return { year, month, date };
};

export const dateToStr = (rawDate, full = false) => {
  const newDate = dateToAry(rawDate);
  return newDate.map((item) => (full && item < 10 ? `0${item}` : item)).join('-');
};

export const isValidDate = (dateStr) => !!new Date(dateStr).toJSON();
