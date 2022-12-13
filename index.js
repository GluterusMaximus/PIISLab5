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
const variableValues = Array(B.length).fill(0)
for (const i in simplexResult?.basicVariables) {
  const basic = simplexResult?.basicVariables[i]
  variableValues[basic] =
    simplexResult?.matrix[Number(i) + 1].at(-1)
}
for (const i in A[0]) {
  console.log(`x${Number(i) + 1}: ${variableValues[i]}`)
}
