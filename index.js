import simplexMethod from './SimplexMethod.js'

const A = [
  [4, 0, 5, 2, 1],
  [2, -1, 0, 1, 0],
  [1, 1, 0, 0, 1],
]

const B = [6, 0, -1, 1, 2]

const C = [8, 2, 2]

const simplexResult = simplexMethod(A, B, C)
if (simplexResult === null)
  console.log('No solution possible!')

console.log('Target function minimal value:')
console.log(simplexResult?.targetValue)

console.log('\nVariable coefficient values:')
for (const i in simplexResult?.basicVariables) {
  console.log(simplexResult?.basicVariables)
}

console.dir({ matrix: simplexResult?.matrix })
