const EPSILON = 1e-12;

const cloneMatrix = (matrix) => matrix.map((row) => [...row]);
const dot = (left, right) => left.reduce((sum, value, index) => sum + value * right[index], 0);
const norm = (vector) => Math.sqrt(dot(vector, vector));
const scale = (vector, factor) => vector.map((value) => value * factor);
const subtract = (left, right) => left.map((value, index) => value - right[index]);

export function transpose(matrix) {
  return matrix[0].map((_, column) => matrix.map((row) => row[column]));
}

export function multiplyMatrices(left, right) {
  const rightT = transpose(right);
  return left.map((row) => rightT.map((column) => dot(row, column)));
}

export function frobeniusError(left, right) {
  let sum = 0;
  for (let row = 0; row < left.length; row += 1) {
    for (let column = 0; column < left[row].length; column += 1) {
      const delta = left[row][column] - right[row][column];
      sum += delta * delta;
    }
  }
  return Math.sqrt(sum);
}

function identity(size) {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => (row === column ? 1 : 0)));
}

function thinColumns(matrix, count) {
  return matrix.map((row) => row.slice(0, count));
}

export function classicalGramSchmidt(matrix) {
  const columns = transpose(matrix);
  const qColumns = [];
  const r = Array.from({ length: columns.length }, () => Array(columns.length).fill(0));

  columns.forEach((column, j) => {
    let residual = [...column];
    for (let i = 0; i < j; i += 1) {
      r[i][j] = dot(qColumns[i], column);
    }
    for (let i = 0; i < j; i += 1) {
      residual = subtract(residual, scale(qColumns[i], r[i][j]));
    }
    r[j][j] = norm(residual);
    qColumns.push(r[j][j] > EPSILON ? scale(residual, 1 / r[j][j]) : residual.map(() => 0));
  });

  return { Q: transpose(qColumns), R: r };
}

export function modifiedGramSchmidt(matrix) {
  const columns = transpose(matrix).map((column) => [...column]);
  const qColumns = [];
  const r = Array.from({ length: columns.length }, () => Array(columns.length).fill(0));

  for (let i = 0; i < columns.length; i += 1) {
    r[i][i] = norm(columns[i]);
    const q = r[i][i] > EPSILON ? scale(columns[i], 1 / r[i][i]) : columns[i].map(() => 0);
    qColumns.push(q);
    for (let j = i + 1; j < columns.length; j += 1) {
      r[i][j] = dot(q, columns[j]);
      columns[j] = subtract(columns[j], scale(q, r[i][j]));
    }
  }

  return { Q: transpose(qColumns), R: r };
}

export function householderQr(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  const r = cloneMatrix(matrix);
  const q = identity(m);

  for (let k = 0; k < Math.min(m, n); k += 1) {
    const x = r.slice(k).map((row) => row[k]);
    const xNorm = norm(x);
    if (xNorm <= EPSILON) continue;
    const alpha = x[0] >= 0 ? -xNorm : xNorm;
    const v = [...x];
    v[0] -= alpha;
    const vNorm = norm(v);
    if (vNorm <= EPSILON) continue;
    const unit = scale(v, 1 / vNorm);

    for (let column = k; column < n; column += 1) {
      let projection = 0;
      for (let row = k; row < m; row += 1) projection += unit[row - k] * r[row][column];
      for (let row = k; row < m; row += 1) r[row][column] -= 2 * unit[row - k] * projection;
    }

    for (let row = 0; row < m; row += 1) {
      let projection = 0;
      for (let column = k; column < m; column += 1) projection += q[row][column] * unit[column - k];
      for (let column = k; column < m; column += 1) q[row][column] -= 2 * projection * unit[column - k];
    }
  }

  return {
    Q: thinColumns(q, n),
    R: r.slice(0, n).map((row) => row.slice(0, n)),
  };
}

export function orthogonalityError(q) {
  const gram = multiplyMatrices(transpose(q), q);
  return frobeniusError(gram, identity(gram.length));
}

function svd2x2(matrix) {
  const ata = multiplyMatrices(transpose(matrix), matrix);
  const a = ata[0][0];
  const b = ata[0][1];
  const d = ata[1][1];
  const trace = a + d;
  const discriminant = Math.sqrt(Math.max(0, ((a - d) ** 2) + (4 * b * b)));
  const eigen1 = (trace + discriminant) / 2;
  const eigen2 = (trace - discriminant) / 2;

  let v1;
  if (Math.abs(b) > EPSILON) v1 = [b, eigen1 - a];
  else v1 = a >= d ? [1, 0] : [0, 1];
  const v1Norm = norm(v1);
  v1 = scale(v1, 1 / Math.max(v1Norm, EPSILON));
  const v2 = [-v1[1], v1[0]];
  const singularValues = [Math.sqrt(Math.max(0, eigen1)), Math.sqrt(Math.max(0, eigen2))];
  const v = [[v1[0], v2[0]], [v1[1], v2[1]]];

  const uColumns = [v1, v2].map((vector, index) => {
    const av = matrix.map((row) => dot(row, vector));
    if (singularValues[index] > EPSILON) return scale(av, 1 / singularValues[index]);
    return index === 0 ? [1, 0] : [0, 1];
  });
  const u = transpose(uColumns);
  const sigma = [[singularValues[0], 0], [0, singularValues[1]]];

  return { U: u, Sigma: sigma, Vt: transpose(v), singularValues };
}

export function buildDecompositionComparison({ diagonalA, diagonalD, offDiagonal }) {
  const matrix = [[diagonalA, offDiagonal], [offDiagonal, diagonalD]];
  const determinant = diagonalA * diagonalD - offDiagonal * offDiagonal;
  if (diagonalA <= 0 || determinant <= 0) throw new RangeError('Comparison matrix must stay symmetric positive definite.');

  const l21 = offDiagonal / diagonalA;
  const lu = {
    L: [[1, 0], [l21, 1]],
    U: [[diagonalA, offDiagonal], [0, diagonalD - (l21 * offDiagonal)]],
  };
  const qr = modifiedGramSchmidt(matrix);
  const choleskyL = [
    [Math.sqrt(diagonalA), 0],
    [offDiagonal / Math.sqrt(diagonalA), Math.sqrt(diagonalD - (offDiagonal * offDiagonal / diagonalA))],
  ];
  const svd = svd2x2(matrix);

  const reconstructions = {
    LU: multiplyMatrices(lu.L, lu.U),
    QR: multiplyMatrices(qr.Q, qr.R),
    SVD: multiplyMatrices(multiplyMatrices(svd.U, svd.Sigma), svd.Vt),
    Cholesky: multiplyMatrices(choleskyL, transpose(choleskyL)),
  };

  return {
    matrix,
    determinant,
    factors: {
      LU: lu,
      QR: qr,
      SVD: svd,
      Cholesky: { L: choleskyL, Lt: transpose(choleskyL) },
    },
    errors: Object.fromEntries(Object.entries(reconstructions).map(([name, reconstruction]) => [
      name,
      frobeniusError(matrix, reconstruction),
    ])),
  };
}

export function buildQrStabilityLab({ nearCollinearExponent }) {
  const epsilon = 10 ** (-nearCollinearExponent);
  const matrix = [
    [1, 1, 1],
    [1, 1 + epsilon, 1 + (2 * epsilon)],
    [1, 1 + (2 * epsilon), 1 + (4 * epsilon) + (epsilon ** 2)],
    [1, 1 + (3 * epsilon), 1 + (6 * epsilon) + (3 * epsilon ** 2)],
  ];
  const classical = classicalGramSchmidt(matrix);
  const householder = householderQr(matrix);
  return {
    epsilon,
    matrix,
    classical: {
      ...classical,
      orthogonalityError: orthogonalityError(classical.Q),
      reconstructionError: frobeniusError(matrix, multiplyMatrices(classical.Q, classical.R)),
    },
    householder: {
      ...householder,
      orthogonalityError: orthogonalityError(householder.Q),
      reconstructionError: frobeniusError(matrix, multiplyMatrices(householder.Q, householder.R)),
    },
  };
}

function rotation(degrees) {
  const radians = degrees * Math.PI / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return [[cosine, -sine], [sine, cosine]];
}

function outer(left, right) {
  return left.map((leftValue) => right.map((rightValue) => leftValue * rightValue));
}

export function buildSvdApproximation({ sigma1, sigma2, leftAngleDegrees, rightAngleDegrees }) {
  if (sigma1 <= 0 || sigma2 < 0 || sigma2 > sigma1) throw new RangeError('Require sigma1 >= sigma2 >= 0.');
  const u = rotation(leftAngleDegrees);
  const v = rotation(rightAngleDegrees);
  const sigma = [[sigma1, 0], [0, sigma2]];
  const matrix = multiplyMatrices(multiplyMatrices(u, sigma), transpose(v));
  const u1 = u.map((row) => row[0]);
  const v1 = v.map((row) => row[0]);
  const rank1 = outer(u1, v1).map((row) => row.map((value) => value * sigma1));
  const totalEnergy = (sigma1 ** 2) + (sigma2 ** 2);
  return {
    matrix,
    rank1,
    rank1Error: frobeniusError(matrix, rank1),
    expectedRank1Error: sigma2,
    energyRetained: totalEnergy > 0 ? (sigma1 ** 2) / totalEnergy : 1,
    singularValues: [sigma1, sigma2],
  };
}

export function rref(matrix, tolerance = 1e-10) {
  const result = cloneMatrix(matrix);
  const pivotColumns = [];
  const steps = [];
  let pivotRow = 0;

  for (let column = 0; column < result[0].length && pivotRow < result.length; column += 1) {
    let selected = pivotRow;
    for (let row = pivotRow + 1; row < result.length; row += 1) {
      if (Math.abs(result[row][column]) > Math.abs(result[selected][column])) selected = row;
    }
    if (Math.abs(result[selected][column]) <= tolerance) continue;
    if (selected !== pivotRow) {
      [result[selected], result[pivotRow]] = [result[pivotRow], result[selected]];
      steps.push(`Swap R${pivotRow + 1} and R${selected + 1}`);
    }
    const pivot = result[pivotRow][column];
    result[pivotRow] = result[pivotRow].map((value) => value / pivot);
    steps.push(`Scale R${pivotRow + 1} to make the pivot 1`);
    for (let row = 0; row < result.length; row += 1) {
      if (row === pivotRow) continue;
      const factor = result[row][column];
      if (Math.abs(factor) <= tolerance) continue;
      result[row] = result[row].map((value, index) => value - factor * result[pivotRow][index]);
      steps.push(`Eliminate column ${column + 1} from R${row + 1}`);
    }
    pivotColumns.push(column);
    pivotRow += 1;
  }

  return {
    matrix: result.map((row) => row.map((value) => Math.abs(value) < tolerance ? 0 : value)),
    pivotColumns,
    steps,
  };
}

function nullspaceFromRref(reduced, pivotColumns) {
  const columnCount = reduced[0].length;
  const freeColumns = Array.from({ length: columnCount }, (_, index) => index)
    .filter((column) => !pivotColumns.includes(column));
  return freeColumns.map((freeColumn) => {
    const vector = Array(columnCount).fill(0);
    vector[freeColumn] = 1;
    pivotColumns.forEach((pivotColumn, row) => {
      vector[pivotColumn] = -reduced[row][freeColumn];
    });
    return vector;
  });
}

export function buildFundamentalSubspaces(matrix) {
  const reduced = rref(matrix);
  const leftReduced = rref(transpose(matrix));
  const rank = reduced.pivotColumns.length;
  const rowBasis = reduced.matrix.filter((row) => row.some((value) => Math.abs(value) > EPSILON));
  const columnBasis = reduced.pivotColumns.map((column) => matrix.map((row) => row[column]));
  const nullBasis = nullspaceFromRref(reduced.matrix, reduced.pivotColumns);
  const leftNullBasis = nullspaceFromRref(leftReduced.matrix, leftReduced.pivotColumns);
  return {
    matrix,
    rref: reduced.matrix,
    steps: reduced.steps,
    pivotColumns: reduced.pivotColumns,
    rank,
    rowBasis,
    columnBasis,
    nullBasis,
    leftNullBasis,
    dimensions: {
      columnSpace: rank,
      rowSpace: rank,
      nullSpace: matrix[0].length - rank,
      leftNullSpace: matrix.length - rank,
    },
  };
}

export function buildRectangularMap({ matrix, vector }) {
  if (matrix[0].length !== vector.length) throw new RangeError('Vector dimension must match the matrix input dimension.');
  const output = matrix.map((row) => dot(row, vector));
  const columns = transpose(matrix);
  const contributions = columns.map((column, index) => ({
    inputIndex: index,
    scalar: vector[index],
    column,
    contribution: scale(column, vector[index]),
  }));
  return {
    matrix,
    vector,
    output,
    inputDimension: matrix[0].length,
    outputDimension: matrix.length,
    rowDots: matrix.map((row, index) => ({ row, value: output[index] })),
    contributions,
    contributionSum: contributions.reduce(
      (sum, item) => sum.map((value, index) => value + item.contribution[index]),
      Array(matrix.length).fill(0),
    ),
  };
}

export function matrixProductShape(leftRows, leftColumns, rightRows, rightColumns) {
  return {
    compatible: leftColumns === rightRows,
    outputRows: leftRows,
    outputColumns: rightColumns,
    contractedDimension: leftColumns,
  };
}
