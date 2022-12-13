import simplexMethod from './SimplexMethod.js'

const A = [
  [4, 0, 5, 2, 1],
  [2, -1, 0, 1, 0],
  [1, 1, 0, 0, 1],
]

const B = [6, 0, -1, 1, 2]

const C = [8, 2, 2]

// const A = [
//   [2, 0, 1, 0, 1],
//   [2, 0, 0, 1, 0],
//   [5, 1, 1, 0, 3],
// ]

// const B = [-2, 0, 1, -1, -2]

// const C = [5, 3, 8]

// const A = [
//   [2, 0, 1, 0, 1],
//   [2, 0, 0, 1, 0],
//   [5, 1, 1, 0, 3],
// ]

// const B = [2, 0, -1, 1, 2]

// const C = [5, 3, 8]

// 1 3 1
// 0 2 3

const simplexResult = simplexMethod(A, B, C)
if (simplexResult === null)
  console.log('No solution possible!')

console.log('Target function minimal value:')
console.log(simplexResult?.targetValue)

console.log('\nVariable coefficient values:')
for (const i in simplexResult?.basicVariables) {
  console.log(
    // `x${parseInt(i) + 1}: ${
    //   simplexResult.basicVariables[i]
    // }`
    simplexResult?.basicVariables
  )
}

console.dir({ matrix: simplexResult?.matrix })

// var x1 >= 0;
// var x2 >= 0;
// var x3 >= 0;
// var x4 >= 0;
// var x5 >= 0;

// minimize z:     -6*x1 + 1*x3 + -1*x4 + -2*x5;

// subject to c11:   4*x1 + 5*x3 + 2*x4 + 1*x5 = 8;
// subject to c12:   2*x1 + -1*x2 + 1*x4 = 2;
// subject to c13:   1*x1 + 1*x2 + 1*x5 = 2;

// end;

// var x1 >= 0;
// var x2 >= 0;
// var x3 >= 0;
// var x4 >= 0;
// var x5 >= 0;

// minimize z:     -2*x1 + 1*x3 + -1*x4 + -2*x5;

// subject to c11:   2*x1 + 1*x3 + 1*x5 = 5;
// subject to c12:   2*x1 + 1*x4 = 3;
// subject to c13:   5*x1 + 1*x2 + 1*x3 + 3*x5 = 8;

// end;
