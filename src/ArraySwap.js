export var arraySwap = function(arr, i, j) {
  if (arr === null) {
    throw "Array is null";
  } else if (i < 0 || j < 0) {
    throw "Indexes below zero";
  } else if (i >= arr.length || j >= arr.length) {
    throw "Indexes exceed array length";
  }
  
  var newArr = [...arr];
  var temp = newArr[i];
  newArr[i] = newArr[j];
  newArr[j] = temp;
  return newArr;
}

export default arraySwap;
