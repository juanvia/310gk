import React from 'react'

import { range } from "ramda";

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
  <div style={{fontFamily: 'Shadows Into Light', cursive: true, lineHeight: 1, fontSize: '1.3rem'}} >

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

</div>
  
