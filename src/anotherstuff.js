import React from 'react'

import { isEmpty, addIndex, chain,  remove, map,
  append, repeat, uniq, concat, any, range, sum,
  findIndex, findLastIndex, sort } from "ramda";




// ----- permutations -----------------------------------------------------
// Returns all permutations  a vector -----------------------------------------------

export const permutations = (tokens, subperms = [[]]) =>
  isEmpty(tokens) ? subperms
                  : addIndex(chain)((token, idx) => permutations( remove(idx, 1, tokens), map(append(token), subperms)), tokens)





// ----- relax ------------------------------------------------------------
// Makes more "plain" a vector (distribute its values)

export const relax = powers => {

  let toDecrementIndex = findLastIndex(e => e > 1, powers)
  let toIncrementIndex = findIndex(e => e < powers[toDecrementIndex] - 1, powers)

  powers[toDecrementIndex] = powers[toDecrementIndex] - 1
  powers[toIncrementIndex] = powers[toIncrementIndex] + 1

  return powers

}



// ----- relevance --------------------------------------------------------
// Returns the value needed for sort a generator row

const max = array => array.reduce((previous, current) => Math.max(previous, current), Number.MIN_VALUE)
export const relevance = row => sum(row) * 1000000 + max(row) * 1000 + row.reduce((previous, current, index, array) => previous + 2 ** (array.length - index) * current, 0)



// ------ makeStackedMatrixOfGenerators -----------------------------------
// Returns a matrix where each row is a generator for one term in the polynomial

export const makeStackedMatrixOfGenerators = (dimensions, degree) => {

  let stackedMatrix = []

  let powers = repeat(0, dimensions)  // This generator row is for permutate and stack those permutations in the matrix.
  powers[0] = degree                  // At first all to the first one. High potential energy. High inequality. Lowest entropy.


  while(any(e => e > 1)(powers)) {

    stackedMatrix = concat(stackedMatrix, uniq(permutations(powers)))

    powers = relax(powers)      // step by step to social justice among the elements

  }

  // Don't forget the last term
  stackedMatrix = concat(stackedMatrix, uniq(permutations(powers)))

  // The turn has come for lesser degrees
  if (degree > 0) {

    stackedMatrix = concat(stackedMatrix, uniq(makeStackedMatrixOfGenerators(dimensions, degree - 1)))

  }

  return sort((a,b) => relevance(b) - relevance(a), uniq(stackedMatrix))

}



// ----- makePolynomial ---------------------------------------------------
// Returns a string with a representation of the polinomial defined by the stacked matrix

export const upperCases = range(65, 65+26).map(charCode => String.fromCharCode(charCode))
export const variableNames = "xyztuvw".split('')
const Power = ({power, powerIndex}) => <>
  { power === 0 ? '' 
                : variableNames[powerIndex % variableNames.length]
  }
  <sup>{ power<2 ? '' : power }</sup>
</>

const Powers = ({powers, variablesNotation}) => (
  powers.map((power,powerIndex) => <Power key={powerIndex} power={power} powerIndex={powerIndex} />)
)

const Coefficient = ({index, coefficientsNotation}) => <>
  {upperCases[index % upperCases.length]}
</>

const Term = ({powers, index, coefficientsNotation, variablesNotation }) => <>
  <Coefficient index={index} coefficientsNotation={coefficientsNotation}/>
  <Powers powers={powers} variablesNotation={variablesNotation}/>
</>

export const Polynomial = ({coefficientsNotation, variablesNotation, stackedMatrix}) => (

  stackedMatrix.map((powers, index, array) => <span key={index}>
    
    <Term 
      powers={powers} 
      index={index}
      coefficientsNotation={coefficientsNotation}
      variablesNotation={variablesNotation} 
    />
    
    {/* if not last separate with plus sign */}
    {(index < array.length-1 ? ' + ' : '')} 
  
  </span>)
  
)
