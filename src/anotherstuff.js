import React from 'react'

import { isEmpty, addIndex, chain,  remove, map,
  append, repeat, uniq, concat, range, sum,
  findIndex, findLastIndex, sort } from "ramda";




// ----- permutations -----------------------------------------------------
// Returns all permutations  a vector -----------------------------------------------

export const permutations = (tokens, subperms = [[]]) =>
  isEmpty(tokens) ? subperms
                  : addIndex(chain)((token, idx) => permutations( remove(idx, 1, tokens), map(append(token), subperms)), tokens)

// ----- relax ------------------------------------------------------------
// Makes more "plain" a vector (distribute its values)

export const relax = powers => {

  let indexOfTheDecrementable = findLastIndex(e => e > 1, powers)
  if (indexOfTheDecrementable === -1) return null

  let indexOfTheIncrementable = findIndex(e => e < powers[indexOfTheDecrementable] - 1, powers)
  if (indexOfTheIncrementable === -1) return null

  --powers[indexOfTheDecrementable]
  ++powers[indexOfTheIncrementable]

  return powers

}



// ----- relevance --------------------------------------------------------
// Returns the value needed for sort a generator row

const max = array => array.reduce((previous, current) => Math.max(previous, current), Number.MIN_VALUE)
export const relevance = row => sum(row) * 1000000 
                                + max(row) * 1000 
                                + row.reduce((previous, current, index, array) => previous + 2 ** (array.length - index) * current, 0)



// ------ makeStackedMatrixOfGenerators -----------------------------------
// Returns a matrix where each row is a generator for one term in the polynomial
// a 'generator' is a vector containing the powers at which the correspondent 
// independent variable must be raised

export const makeStackedMatrixOfGenerators = (dimensions, degree) => {


  let stackedMatrix = []

  let permutee = repeat(0, dimensions)  // This generator row is for permutate and stack those permutations in the matrix.
  permutee[0] = degree                  // At first all to the first one. High potential energy. High inequality. Lowest entropy.

  do {

    stackedMatrix = concat(stackedMatrix, uniq(permutations(permutee)))

    permutee = relax(permutee)      // step by step to social justice among the elements

  } while (permutee) 


  // The turn has come for lesser degrees
  if (degree > 0) {

    stackedMatrix = concat(stackedMatrix, makeStackedMatrixOfGenerators(dimensions, degree - 1))

  }

  return sort((a, b) => relevance(b) - relevance(a), stackedMatrix)

}



// ----- makePolynomial ---------------------------------------------------
// Returns a string with a representation of the polinomial defined by the stacked matrix

export const upperCases = range(65, 65+26).map(charCode => String.fromCharCode(charCode))
export const variableNames = "xyztuvw".split('')
const PowerTraditionalNotation = ({power, powerIndex}) => <>
  { power === 0 ? '' 
                : variableNames[powerIndex % variableNames.length]
  }
  <sup>{ power<2 ? '' : power }</sup>
</>
const PowerPedanticNotation = ({power, powerIndex}) => <>
  { power === 0 ? '' 
                : <>x<sub>{powerIndex+1}</sub></>
  }
  <sup>{ power<2 ? '' : power }</sup>
</>

const Powers = ({powers, variablesNotation}) => (
  powers.map((power,powerIndex) => variablesNotation === 'traditional' 
    ? <PowerTraditionalNotation key={powerIndex} power={power} powerIndex={powerIndex} />
    : <PowerPedanticNotation key={powerIndex} power={power} powerIndex={powerIndex} /> 
  )
)

const Coefficient = ({index, coefficientsNotation}) => 
  coefficientsNotation === "traditional" 
    ? upperCases[index % upperCases.length]
    : <>a<sub>{index+1}</sub></>

const Term = ({powers, index, coefficientsNotation, variablesNotation }) => <>
  <Coefficient index={index} coefficientsNotation={coefficientsNotation}/>
  <Powers powers={powers} variablesNotation={variablesNotation}/>
</>

const Left = ({dimensions, variablesNotation}) => <>
  <span className="surly">
    {variablesNotation === 'pedantic' ? 'y' : variableNames[dimensions]}
  </span>
  <span className="surly">=</span>
  <span className="surly"> f(
      <span>
        { 
          variablesNotation !== 'pedantic'
          ? range(0,dimensions).map(d => variableNames[d]).join(',')
          : range(0,dimensions).map((d,i,a) => <span key={i}>x<sub>{d+1}{i<a.length ? ',' : ''}</sub></span>)
        }
      </span>
  )
  </span>
  <span className="surly">:</span>
  <span className="surly">&#x211D;<sup>{dimensions}</sup>&#xffeb;&#x211D;</span>
  <span className="surly">=</span>
  
</>

export const Polynomial = ({coefficientsNotation, variablesNotation, stackedMatrix}) => <div>

    <Left 
      dimensions={stackedMatrix[0].length} 
      variablesNotation={variablesNotation}
    />

    {stackedMatrix.map( (powers, index, array) => <span key={index}>
        <Term 
          powers={powers} 
          index={index}
          coefficientsNotation={coefficientsNotation}
          variablesNotation={variablesNotation} 
          />
        
        {/* if not last separate with plus sign */}
        {(index < array.length-1 ? '  + ' : '')} 
      
      </span>
      
      )}
  
  </div>
  


