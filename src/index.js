import React, {useState} from "react";
import ReactDOM from "react-dom";
import { Polynomial, upperCases, variableNames } from "./anotherstuff"
import { makeStackedMatrixOfGenerators } from "./powers-list"
import {combinations} from 'mathjs'

const Section = ({children}) => <div className="Section"> {children} </div>

function App() {

  const [dimensions, setDimensions] = useState(3);  
  const [degree, setDegree] = useState(6);
  const [stackedMatrixOfGenerators, setStackedMatrixOfGenerators] = useState(makeStackedMatrixOfGenerators(dimensions, degree))
  const [coefficientsNotation, setCoefficientsNotation] = useState('traditional');
  const [variablesNotation, setVariablesNotation] = useState('traditional');


  const disciplineNotations = stackedMatrix => {
    if (stackedMatrix.length > upperCases.length) {
      setCoefficientsNotation('pedantic')
    }
    if (dimensions > variableNames.length - 1) {
      setVariablesNotation('pedantic')
    }
  }

  const handleChangeOfDegree = e => {
    let degree = e.target.value
    if (degree >= 0 && degree <= 9)
      setDegree(e.target.value)
  }

  const handleChangeOfDimensions = e => {
    setDimensions(e.target.value)
  }

  const handleChangeOfCoefficientsNotation = e => {
    setCoefficientsNotation(e.target.value)
    disciplineNotations(stackedMatrixOfGenerators)
  }

  const handleChangeOfVariablesNotation = e => {
    setVariablesNotation(e.target.value)
    disciplineNotations(stackedMatrixOfGenerators)
  }

  const handleGoClick = () => {
    let stackedMatrix = makeStackedMatrixOfGenerators(dimensions, degree)
    disciplineNotations(stackedMatrix)
    setStackedMatrixOfGenerators(stackedMatrix)
  }

  return (

    <div className="App">

        <Section>

          <h3>&#x211D;<sup>n</sup>&#xffeb;&#x211D; polynomial generator</h3>
          
          <div>
            <div className="div5">
                <div className="marginated">Domain dimension (number of independent variables)</div>
                <input className="short" type="text" value={dimensions} name="dimensions" id="dimensions" onChange={handleChangeOfDimensions}></input>
            </div>

            <div className="div5">
                <div className="marginated">Polynomial's degree</div>
                <input className="short" type="text" value={degree} name="degree" id="degree" onChange={handleChangeOfDegree}></input>
            </div>

            <div className="div5">
                <div className="marginated">Notation variant of the coefficients</div>
                <select className="short" onChange={handleChangeOfCoefficientsNotation}>
                    <option value="traditional">Traditional</option>
                    <option value="pedantic">Pedantic</option>
                </select>
            </div>
            
            <div className="div5">
                <div className="marginated">Notation variant of the independent variables</div>
                <select className="short" onChange={handleChangeOfVariablesNotation}>
                    <option value="traditional">Traditional</option>
                    <option value="pedantic">Pedantic</option>
                </select>
            </div>
            
            <div className="div5">
                <button className="short" onClick={handleGoClick}>Go</button>
            </div>

            <div className="clear"></div>

          </div>
          
          <br/>

          <p>

            You'll need at least <b>{stackedMatrixOfGenerators.length}</b> data points, or 'training points' :), in order to obtain 
            the coefficients for this type of polynomial
          
          </p>

          <div className="left">

            <h4>Powers matrix</h4>

            <pre>
                {stackedMatrixOfGenerators.map(row => row + "\n")}<br/>
            </pre>

          </div>

          <div className="right">

            <h4>Polynomial</h4>

            <Polynomial 
              coefficientsNotation={coefficientsNotation} 
              variablesNotation={variablesNotation} 
              stackedMatrix={stackedMatrixOfGenerators} 
            />

          </div>

          <div className="clear"></div>

        </Section>
      </div>
  );
}


// let tabla=[]
// for (let dim=3;dim<4;++dim)
//   for (let deg=1;deg<10;++deg) 
//     tabla.push([dim,deg, makeStackedMatrixOfGenerators(dim, deg).length])
// console.log(sortBy(prop(2))(tabla))
  


const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

const optimalDegree = (dim, pointsLength) => {
  
  let degree = 1
  
  do {

    ++degree
  
  } while(combinations(degree+dim,dim) < pointsLength)
  
  return degree-1

}

for (let degree=1; degree<10; ++degree) {
  console.log(`Para el grado ${degree} se necesitan por lo menos ${combinations(3+degree, 3)} puntos.`)
}

console.log(`El grado óptimo para 40 puntos (tres dimensiones) es ${optimalDegree(3,40)}.`)

