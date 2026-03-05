const seededRandom = function (seed) {
  var m = 2 ** 35 - 31;
  var a = 185852;
  var s = seed % m;
  return function () {
    return (s = (s * a) % m) / m;
  };
};

/**
 * Returns available reservation times for the given date.
 * Uses a seeded random so results are deterministic per day-of-month.
 * @param {Date} date
 * @returns {string[]}
 */
export const fetchAPI = function (date) {
  let result = [];
  let random = seededRandom(date.getDate());

  for (let i = 17; i <= 23; i++) {
    if (random() < 0.5) {
      result.push(i + ":00");
    }
    if (random() < 0.5) {
      result.push(i + ":30");
    }
  }
  return result;
};

/**
 * Submits booking form data. Always returns true in this mock.
 * @param {Object} formData
 * @returns {boolean}
 */
// eslint-disable-next-line no-unused-vars
export const submitAPI = function (_formData) {
  return true;
};
