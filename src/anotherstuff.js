import React from 'react'

import { isEmpty, addIndex, chain,  remove, map, append, uniq, 
  concat, range, sum, takeLast, contains, sort, repeat,add, reduce } from "ramda";




// ----- permutations -----------------------------------------------------
// Returns all permutations  a vector -----------------------------------------------

export const permutations = (tokens, subperms = [[]]) =>
  isEmpty(tokens) 
    ? subperms
    : addIndex(chain)((token, idx) => permutations( remove(idx, 1, tokens), map(append(token), subperms)), tokens)

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

const generateSeeds = (dimensions, degree) => {
  
  // Initialize the list of permutation seeds to empty
  let seeds = []
  
  // All the posibilities are taken in count
  let phaseSpaceCardinal = (degree + 1) ** dimensions
  
  // Visit the entire phase space searching for good points
  for (let nBinary = 0; nBinary < phaseSpaceCardinal; ++nBinary) {
    
    // n expressed in base <degree+1>. This is the punch line!
    let nConverted = nBinary.toString(degree + 1)
    
    // n normalized (its length must equal the value of the "dimensions" variable)
    let nNormalized = takeLast(dimensions,'00000000' + nConverted)
    
    // n splitted (and ordered high to low)
    const sortDescending = sort((a,b) => b - a)
    let nSplitted = sortDescending(nNormalized.split('').map(c => Number(c)))
    
    // n tested (if its sum is correct)
    if (reduce( add, 0 )(nSplitted) === degree) {
      
      // n adopted if it isn't already there 
      if (!contains(nSplitted, seeds)) {
        
        seeds.push(nSplitted)
      
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
  let stack = generateSeeds(dimensions,degree).reduce((stack, seed) => concat(stack, uniq(permutations(seed))) ,[] )
  
  // It's turn for lesser degrees
  stack = concat(stack, makeStackedMatrixOfGenerators(dimensions, degree-1))

  // On delivery be polite and give a neat, ordered list
  return sort( (a, b) => relevance(b) - relevance(a), stack)

}


// ----- makePolynomial ---------------------------------------------------
// Returns a string with a representation of the polynomial defined by the stacked matrix

export const upperCases = range(65, 65+26).map(charCode => String.fromCharCode(charCode))
export const variableNames = "xyztuvw".split('')

const PowerTraditionalNotation = ({power, powerIndex}) => <>
  
  {/** Variable name*/}
  { power === 0 ? '' : variableNames[powerIndex] }
  
  {/** Power (superscripted) */}
  <sup>{ power < 2 ? '' : power }</sup>

</>

const PowerPedanticNotation = ({power, powerIndex}) => <>

  {/** x subindexed  */}
  { power === 0 ? '' : <>x<sub>{powerIndex+1}</sub></> }

  {/** Power (superscripted) */}
  <sup>{ power < 2 ? '' : power }</sup>

</>

const Powers = ({powers, variablesNotation}) => (

  powers.map((power,powerIndex) => variablesNotation === 'traditional' 
    ? <PowerTraditionalNotation key={powerIndex} power={power} powerIndex={powerIndex} />
    : <PowerPedanticNotation    key={powerIndex} power={power} powerIndex={powerIndex} /> 
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

const Terms = ({coefficientsNotation, variablesNotation, stackedMatrix}) => <>{

  stackedMatrix.map( (powers, index, array) => <span key={index}>

    <Term 
      powers={powers} 
      index={index}
      coefficientsNotation={coefficientsNotation}
      variablesNotation={variablesNotation} 
      />

    {/* if not last separate with plus sign */}
    {(index < array.length-1 ? '  + ' : '')} 

  </span>

)}</>

export const Polynomial = ({coefficientsNotation, variablesNotation, stackedMatrix}) => <div>

    <Left 
      dimensions={stackedMatrix[0].length} 
      variablesNotation={variablesNotation}
    />
  
    <Terms 
      coefficientsNotation={coefficientsNotation}
      variablesNotation={variablesNotation}
      stackedMatrix={stackedMatrix}
    />

</div>
  
