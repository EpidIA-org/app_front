import chroma from "chroma-js"

export const validNumber = num => !(isNaN(num) ||
    num == null ||
    num == undefined ||
    // for our use case, we don't consider Infinity a valid number
    num == Infinity ||
    num == -Infinity)

export const getMin = (array, key) =>
    Math.min(...array.filter(x => validNumber(x[key])).map(x => Number(x[key])))

export const getMax = (array, key) =>
    Math.max(...array.filter(x => validNumber(x[key])).map(x => Number(x[key])))

export const normalizeValue = (value, min, max) => (value - min) / (max - min)

export const getColor = (param, colorScale, min, max) =>
    chroma
        .scale(colorScale)
        .mode("lch")(normalizeValue(param, min, max))
        .hex()


// Compute the number of days as a Number between <StartDate> and <EndDate>
export const daysBetween = function (StartDate, EndDate) {
    // The number of milliseconds in all UTC days (no DST)
    const oneDay = 1000 * 60 * 60 * 24;

    // A day in UTC always lasts 24 hours (unlike in other time formats)
    const start = Date.UTC(
        EndDate.getFullYear(),
        EndDate.getMonth(),
        EndDate.getDate()
    );
    const end = Date.UTC(
        StartDate.getFullYear(),
        StartDate.getMonth(),
        StartDate.getDate()
    );

    // so it's safe to divide by 24 hours
    return (start - end) / oneDay;
}
// Access the nested information in <obj> by following the <reduceArray> path 
export const reduceObject = function (obj, reducerArray) {
    return [obj].concat(reducerArray).reduce((item, key) => item[key]);
}
//UTILS - Sort an array
export const sortArray = arr => arr.sort((a, b) => a - b);
//UTILS - Sum elements of an array
export const sumArray = arr => arr.reduce((a, b) => a + b, 0);
//UTILS - Average elements of an array
export const meanArray = arr => sumArray(arr) / arr.length;
//UTILS - Compute the standard deviation of an array
export const stdArray = function (arr) {
    const mu = meanArray(arr);
    const diffArr = arr.map(a => (a - mu) ** 2);
    return Math.sqrt(this.sumArray(diffArr) / (arr.length - 1));
};
//UTILS - Compute the quantile <q> value of the array's elements. <q> in [0,1]
export const quantileArray = function (arr, q) {
    const sorted = sortArray(arr);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
}
//UTILS - Compute a interval array by using quantiles
export const getQuantileFromArray = function (values) {
    const q10 = quantileArray(values, 0.1);
    const q20 = quantileArray(values, 0.2);
    //   const q30 = quantileArray(values, 0.3);
    const q40 = quantileArray(values, 0.4);
    const q50 = quantileArray(values, 0.5);
    const q60 = quantileArray(values, 0.7);
    const q70 = quantileArray(values, 0.8);
    //   const q80 = quantileArray(values, 0.9);
    const q90 = quantileArray(values, 0.9);
    return [
        { min: 0, max: q10 },
        { min: 0, max: q20 },
        { min: 0, max: q20 },
        { min: q20, max: q40 },
        { min: q40, max: q50 },
        { min: q50, max: q60 },
        { min: q60, max: q70 },
        { min: q70, max: q90 },
        { min: q90, max: 1000000 },
        { min: q90, max: 1000000 }
      ].slice(2, 9);
}

export const aggregate = function (data, keyFields, accumulator) {
    var createNewObj = (ref, fields) => {
      return fields.reduce((result, key) => {
        return Object.assign(result, { [key] : ref[key] });
      }, {});
    }
    return Object.values(data.reduce((result, object) => {
      let key = keyFields.map(key => object[key]).join('');
      let val = result[key] || createNewObj(object, keyFields);
      val[accumulator.key] = accumulator.fn(val[accumulator.key] || 0, object[accumulator.key]);
      return Object.assign(result, { [key] : val });
    }, {}));
  }