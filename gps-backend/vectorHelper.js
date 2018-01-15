function getUnitVectorOfVector(vector) {
  return {
    x:vector.x/getVectorLength(vector),
    y:vector.y/getVectorLength(vector)
  }
}

function getVectorOfTwoPoints(pointA, pointB) {
  return {x: pointB.x-pointA.x, y: pointB.y-pointA.y}
}

function getVectorLength(vector) {
  return Math.sqrt(Math.pow(vector.x,2)+Math.pow(vector.y,2));
}

function getDistanceBetweenTwoPoints(pointA, pointB) {
  var vector=getVectorOfTwoPoints(pointA, pointB);
  return getVectorLength(vector);
}

function getUnitVectorOfLineBetweenTwoPoints(pointA, pointB) {
  // var vectorAB = {x:pointB.x-pointA.x, y:pointB.y-pointA.y}
  var vectorAB = getVectorOfTwoPoints(pointA, pointB);
  // var distance = Math.sqrt(Math.pow((pointB.x-pointA.x),2)+Math.pow(pointB.y-pointA.y,2))
  var distance = getVectorLength(vectorAB);

  return {x:vectorAB.x/distance, y: vectorAB.y/distance}
}

function getRightUnitVectorPerpendicularTo(vector) {
  var perpenVector={x: vector.y, y: -vector.x};
  return getUnitVectorOfVector(perpenVector);
}

function getLeftUnitVectorPerpendicularTo(vector) {
  var perpenVector={x: -vector.y, y: vector.x};
  return getUnitVectorOfVector(perpenVector);
}

function getRotatedVector(vector, angle) {
  return {
    x:vector.x*Math.cos(angle)-vector.y*Math.sin(angle),
    y:vector.x*Math.sin(angle)+vector.y*Math.cos(angle)
  }
}

function getReversedVector(vector) {
  return {x:-vector.x, b:-vector.y}
}

module.exports = {
  getUnitVectorOfVector,
  getVectorOfTwoPoints,
  getVectorLength,
  getUnitVectorOfLineBetweenTwoPoints,
  getRightUnitVectorPerpendicularTo,
  getLeftUnitVectorPerpendicularTo,
  getReversedVector,
  getDistanceBetweenTwoPoints,
  getRotatedVector
}

var R={x:-96.80322, y:32.9697}
var S={x:-98.53506, y:29.46786}
console.log("getDistanceBetweenTwoPoints", getDistanceBetweenTwoPoints(R,S));

var R={x:-122.195523, y:37.435824}
var S={x:-122.191553, y:37.435892}
console.log("getDistanceBetweenTwoPoints", getDistanceBetweenTwoPoints(R,S));
