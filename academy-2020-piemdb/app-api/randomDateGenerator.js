const daysInWeek = 7;
const milsInDay = 24 * 60 * 60 * 1000;
const startDate = new Date(Date.UTC(2020, 9, 12));
const currentDate = new Date();

// Returns number of days since startDate
const totalDays = (date) => {
  // Creating date for today without time component
  const todaysDate = new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(), 0, 0, 0, 0,
  ));
  return (todaysDate - startDate) / milsInDay;
};

const randomWeek = (date) => {
  const totalWeeks = Math.floor(totalDays(date) / daysInWeek);
  // returns a random integer between 0 and total weeks inclusive
  return Math.floor(Math.random() * Math.floor(totalWeeks + 1));
};

const randomDateReturn = () => {
  const newDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate() + (randomWeek(currentDate) * daysInWeek),
  );
  // increment getMonth() as JS Date months are 0 based
  const randomDate = (`${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`);
  return randomDate;
};

// For a given date, return the date of the first day of that week
const getFirstDayOfWeek = (date) => {
  const dayOfWeek = date.getDay();
  let shift;

  if (dayOfWeek === 0) {
    shift = 6;
  } else {
    shift = dayOfWeek - 1;
  }
  const startOfWeek = new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - shift, 0, 0, 0, 0,
  ));
  return startOfWeek;
};

module.exports = {
  randomDateReturn,
  totalDays,
  randomWeek,
  getFirstDayOfWeek,
};
