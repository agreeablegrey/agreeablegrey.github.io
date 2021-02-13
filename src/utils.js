export const getRange = (begin,end,step=1) => {
    if (step > end) { return Array(); }
    const arraySize = Math.ceil((end - begin) / step);
    return Array(arraySize).fill(begin).map((num, i) => num + (i * step));
}