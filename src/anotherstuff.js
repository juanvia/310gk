import { isEmpty, addIndex, chain,  remove, map, 
  append, repeat, uniq, concat, any,
  findIndex, findLastIndex } from "ramda";




  // ----- permutations -----------------------------------------------------
// ----- Permutate a vector -----------------------------------------------

export const permutations = (tokens, subperms = [[]]) =>
  isEmpty(tokens) ? subperms 
                  : addIndex(chain)((token, idx) => permutations( remove(idx, 1, tokens), map(append(token), subperms)), tokens)




                  
// ----- relax ------------------------------------------------------------
// ----- Makes more "plain" a vector (distribute its values) --------------
export const relax = generatorRow => {

  let toDecrementIndex = findLastIndex(e => e > 1, generatorRow)
  let toIncrementIndex = findIndex(e => e < generatorRow[toDecrementIndex] - 1, generatorRow)
  
  generatorRow[toDecrementIndex] = generatorRow[toDecrementIndex] - 1
  generatorRow[toIncrementIndex] = generatorRow[toIncrementIndex] + 1
  
  return generatorRow

}




// ------ makeStackedMatrixOfGenerators -----------------------------------
// ------ return a matrix where each row is for one term in the polynomial

export const makeStackedMatrixOfGenerators = (dimensions, degree) => {

  let stackedMatrix = []
  
  let generatorRow = repeat(0, dimensions)  // This generator row is for permutate and stack those permutations in the matrix.
  generatorRow[0] = degree                  // At first all to first. High potential energy. High inequality. Lowest enthropy.
  
  
  while(any(e => e > 1)(generatorRow)) {
    
    stackedMatrix = concat(stackedMatrix, uniq(permutations(generatorRow)))
  
    generatorRow = relax(generatorRow)      // step by step to social justice among the elements
    
  } 
  
  // Don't forget the last term
  stackedMatrix = concat(stackedMatrix, uniq(permutations(generatorRow)))

  // The turn has come for lesser degrees
  if (degree > 0) {

    stackedMatrix = concat(stackedMatrix, uniq(makeStackedMatrixOfGenerators(dimensions, degree - 1)))

  }

  return stackedMatrix

}

