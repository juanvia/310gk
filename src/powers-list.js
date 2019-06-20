// ----- relevance --------------------------------------------------------
// Returns the value needed for sort a generator row
import { contains,repeat,concat,uniq,sort, sum, takeLast, 
    reduce,add, isEmpty,addIndex,chain, remove, map, append,
    pipe, split, subtract, negate } from 'ramda'


// ----- permutations -----------------------------------------------------
// Returns all permutations of a vector -----------------------------------------------

export const permutations = (tokens, subperms = [[]]) =>
  isEmpty(tokens) 
    ? subperms
    : addIndex(chain)((token, idx) => permutations( remove(idx, 1, tokens), map(append(token), subperms)), tokens)

const max = array => array.reduce(Math.max, Number.MIN_VALUE)

export const relevance = row => sum(row) * 1000000 
  + max(row) * 1000 
  + row.reduce((previous, current, index, array) => previous + 2 ** (array.length - index) * current, 0)


// ------ makeStackedMatrixOfGenerators -----------------------------------
// Returns a matrix where each row is a generator for one term in the polynomial
// a 'generator' is a vector containing the powers at which the correspondent 
// independent variable must be raised

const generateSeeds = (dimensions, degree) => {
  
  // Initialize the list of permutation seeds to empty
  let seeds = []
  
  // All the posibilities are taken into account
  let phaseSpaceCardinal = (degree + 1) ** dimensions
  
  // Visit the entire phase space searching for good points
  for (let nBinary = 0; nBinary < phaseSpaceCardinal; ++nBinary) {

    // n expressed in base <degree+1>. This is the punch line!
    let nConverted = nBinary.toString(degree + 1)
      
    const transform = pipe(
      concat('0000000000'),         // ensure enough length for next step
      takeLast(dimensions),         // the length must equals the value of the "dimensions" variable
      split(''),                    // transform the number string representation to an array of chars
      map(Number),                  // array of chars to array of numbers (one digit each)
      sort(pipe(subtract,negate))   // sort in decreasing order
    ) 
    
    // from digit chars string to sorted array of digit
    let candidate = transform(nConverted)

    // n tested (if its sum is correct)
    if (reduce(add, 0)(candidate) === degree) {
      
      // n adopted if it isn't already there 
      if (!contains(candidate, seeds)) {
        
        seeds.push(candidate)
      
      }
      
    }

  }

  return seeds

}

export const makeStackedMatrixOfGenerators = (dimensions, degree) => {
  
  // ... happens
  degree = Number(degree)

  // Recursion stopper
  if (degree === 0)
    return [repeat(0,dimensions)]

  // Gathering the permutations of the seeds being created (Only those which sum of elements equals the given degree)
  const addPermutationsToStack = (stack, seed) => concat(stack, uniq(permutations(seed)))
  let stack = generateSeeds(dimensions,degree).reduce(addPermutationsToStack, [] )
  
  // It's turn for lesser degrees
  stack = concat(stack, makeStackedMatrixOfGenerators(dimensions, degree-1))

  // On delivery be polite and give a neat, ordered list
  return sort( (a, b) => relevance(b) - relevance(a), stack)

}

