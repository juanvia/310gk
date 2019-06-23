// ----- relevance --------------------------------------------------------
// Returns the value needed for sort a generator row
import { repeat,concat,sort, sum, takeLast, reduce,add, map, pipe, split } from 'ramda'


// ----- permutations -----------------------------------------------------
// Returns all permutations of a vector -----------------------------------

export const relevance = row => {
    return sum(row) * 1000000 
  + reduce(Math.max, Number.MIN_VALUE)(row) * 1000 
  + row.reduce((previous, current, index, array) => previous + 2 ** (array.length - index) * current, 0)
}

// ------ makeStackedMatrixOfGenerators -----------------------------------
// Returns a matrix where each row is a generator for one term in the polynomial
// a 'generator' is a vector containing the powers at which the correspondent 
// independent variable must be raised




const transform = (nBinary, size, base) => pipe(
    concat('0000000000'),         // ensure enough length for next step
    takeLast(size),               // the length must equals the value of the "size" variable
    split(''),                    // transform the number string representation to an array of chars
    map(Number)                   // array of chars to array of numbers (one digit each)
) (nBinary.toString(base))        // send to pipe the number in <base>ary form




const takeValidsForDegree = (dimensions, degree) => {
  
  // Initialize the list of valid points to empty
  let valids = []
  
  // All the posibilities are taken into account
  let phaseSpaceCardinal = (degree + 1) ** dimensions

  // Visit the entire phase space searching for good point
  for (let nBinary = 0; nBinary < phaseSpaceCardinal; ++nBinary) {

    // n expressed in base <degree+1>. This is the punch line!
    let nCandidate = transform(nBinary, dimensions, degree+1)

    // n tested (and adopted if its sum is correct)
    if (reduce(add, 0)(nCandidate) <= degree) {

      valids.push(nCandidate)

    }

  }

  return valids

}




export const makeStackedMatrixOfGenerators = (dimensions, degree) => {
  
  // Add zero degree case
  if (degree === 0) {
    return [repeat(0,dimensions)]
  }

  // Gathering seeds being created (Only those which sum of elements equals the given degree)
  let stack = takeValidsForDegree(dimensions, degree)

  // On delivery be polite and give a neat, ordered list
  const byRelevance = (a, b) => relevance(b) - relevance(a)
  return sort( byRelevance, stack)

}

