import { deepCopy } from './utils.js'

export default function (A, B, C) {
  let { basicVariables, targetValue, matrix } =
    findInitialBFS(A, B, C)
  console.dir({ basicVariables, targetValue })
  if (targetValue !== 0) return null

  matrix.shift()
  matrix.unshift([...B, 0])
  let adjustedMatrix = adjustMatrix(matrix, basicVariables)

  console.dir({ matrix, adjustedMatrix })
  return findOptimalSolution(
    adjustedMatrix,
    basicVariables,
    false,
    true
  )
}

const findInitialBFS = (A, B, C) => {
  const constraintCoefs = deepCopy(A).map((row, i) => {
    const newCoefs = Array(A.length).fill(0)
    newCoefs[i] = 1
    return row.concat(newCoefs)
  })

  const targetCoefs = Array(B.length)
    .fill(0)
    .concat(Array(A.length).fill(-1))

  let targetValue = 0

  const freeMembers = deepCopy(C)

  const variableValues = Array(B.length)
    .fill(0)
    .concat(...freeMembers)

  const matrix = constructMatrix(
    targetCoefs,
    targetValue,
    constraintCoefs,
    freeMembers
  )
  console.dir({ matrix })

  const basicVariables = [
    ...Array(targetCoefs.length).keys(),
  ].slice(-constraintCoefs.length)
  const adjustedMatrix = adjustMatrix(
    matrix,
    basicVariables
  )
  console.dir({ adjustedMatrix })
  console.dir({
    targetCoefs,
    targetValue,
    constraintCoefs,
    freeMembers,
  })
  console.dir(deconstructMatrix(adjustedMatrix))
  return findOptimalSolution(
    adjustedMatrix,
    basicVariables,
    true,
    true
  )
}

const constructMatrix = (
  targetCoefs,
  targetValue,
  constraintCoefs,
  freeMembers
) => {
  const matrix = []
  matrix.push(targetCoefs.concat(targetValue))
  const otherRows = constraintCoefs.map((row, i) => {
    return row.concat(freeMembers[i])
  })
  matrix.push(...otherRows)

  return matrix
}

const deconstructMatrix = (matrix) => {
  const targetCoefs = matrix[0].slice(0, -1)
  const targetValue = matrix[0].at(-1)
  const constraintCoefs = matrix
    .slice(1)
    .map((row) => row.slice(0, -1))
  const freeMembers = matrix
    .slice(1)
    .map((row) => row.at(-1))

  return {
    targetCoefs,
    targetValue,
    constraintCoefs,
    freeMembers,
  }
}

const adjustMatrix = (matrix, toBeZeroVars) => {
  const adjustedMatrix = deepCopy(matrix)

  for (const variableI of toBeZeroVars) {
    const variable = adjustedMatrix[0][variableI]
    if (variable !== 0) {
      const sourceI = adjustedMatrix.findIndex(
        (row, rowI) => row[variableI] !== 0 && rowI !== 0
      )
      const addVariable = adjustedMatrix[sourceI][variableI]
      const coef = findCoef(variable, addVariable)
      addRows(adjustedMatrix, sourceI, 0, coef)
    }
  }

  return adjustedMatrix
}

const addRows = (matrix, source, dest, coef) => {
  for (const index in matrix[dest]) {
    matrix[dest][index] += matrix[source][index] * coef
  }
}

const findOptimalSolution = (
  matrix,
  basicVariables,
  isInitial = false,
  isMinimizing = true
) => {
  const matrixCopy = deepCopy(matrix)
  while (
    matrixCopy[0]
      .slice(0, -1)
      .some((coef) => (isMinimizing ? coef > 0 : coef < 0))
  ) {
    const enteringI = findEnteringI(matrixCopy)
    const leavingI = findLeavingI(matrixCopy, enteringI)
    if (leavingI === undefined)
      return { targetValue: -Infinity, basicVariables }

    basicVariables.splice(leavingI - 1, 1, enteringI)
    pivotMatrix(matrixCopy, leavingI, enteringI)
  }
  return {
    targetValue: +matrixCopy[0].at(-1).toFixed(4),
    basicVariables,
    matrix: roundMatrix(
      isInitial
        ? matrixCopy.map((row) => [
            ...row.slice(0, -basicVariables.length - 1),
            row.at(-1),
          ])
        : matrixCopy
    ),
  }
}

const findCoef = (variable, addVariable) =>
  Math.abs(variable / addVariable) *
  (Math.sign(variable) === Math.sign(addVariable) ? -1 : 1)

const findLeavingI = (matrix, enteringI) => {
  const ratios = matrix
    .map((row, index) => ({
      ratio: row.at(-1) / row[enteringI],
      index,
    }))
    .filter((row) => row.ratio > 0 && row.index !== 0)

  if (ratios.length === 0) return undefined
  return ratios.sort((a, b) => a.ratio - b.ratio)[0].index
}

const findEnteringI = (matrix) => {
  const coefs = matrix[0]
    .map((coef, index) => ({
      value: coef,
      index,
    }))
    .filter(
      (coef) =>
        coef.value > 0 &&
        coef.index !== matrix[0].length - 1
    )

  if (coefs.length === 0) return undefined
  return coefs.sort((a, b) => b.value - a.value)[0].index
}

const pivotMatrix = (matrix, leavingI, enteringI) => {
  matrix[leavingI] = matrix[leavingI].map(
    (coef) => coef / matrix[leavingI][enteringI]
  )
  for (const rowI in matrix) {
    if (Number(rowI) === leavingI) continue

    const addVariable = matrix[leavingI][enteringI]
    const variable = matrix[rowI][enteringI]
    const coef = findCoef(variable, addVariable)
    addRows(matrix, leavingI, rowI, coef)
  }
}

const roundMatrix = (matrix) => {
  const matrixCopy = deepCopy(matrix)
  for (const i in matrixCopy) {
    for (const j in matrixCopy[i]) {
      matrixCopy[i][j] = +matrixCopy[i][j].toFixed(4)
    }
  }
  return matrixCopy
}
