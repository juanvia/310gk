import React, {useState} from "react";
import ReactDOM from "react-dom";
import { reverse, zip } from "ramda";
import { polynomial } from "math-playground";

import { getExamples, Plot } from "./stuff";
import { makeStackedMatrixOfGenerators, Polynomial, upperCases, variableNames } from "./anotherstuff"

const { matrix, multiply, transpose, inv } = require("mathjs");

const solve = (A, b) =>
  multiply(multiply(inv(multiply(transpose(A), A)), transpose(A)), b);

/* const makeRow = (input, degree) => {
  const row = [];

  for (let i = 0; i < degree + 1; i++) {
    row.unshift(input ** i);
  }

  return row;
}; */


const makeRow = (input, degree) => {
  const row = [];

  for (let i = 0; i < degree + 1; i++) {
    row.unshift(input ** i);
  }

  return row;
};
const makeMatrix = (inputs, degree) =>
  inputs.map(input => makeRow(input, degree));

const inputs = [10, 20, 40, 90, 110, 150, 270, 280, 330, 360, 400];

const outputs = [50, 60, 75, 80, 95, 148, 260, 265, 290, 330, 360];

const plotForDegree = (inputs, degree) => {
  const matrixForInputs = makeMatrix(inputs, degree);
  const coefficients = solve(matrix(matrixForInputs), matrix(outputs))._data;

  const reversedCoefficients = reverse(coefficients);
  const examples = getExamples(0, 400, 40);
  const partiallyAppliedPolynomial = polynomial(reversedCoefficients);
  const results = examples.map(example => partiallyAppliedPolynomial(example));

  return zip(examples, results);
};

const Section = ({children}) => <div className="Section"> {children} </div>

function App() {

  const [dimensions, setDimensions] = useState(3);  
  const [degree, setDegree] = useState(3);
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
{/*       <Section>
        <Plot
          paths={[
            plotForDegree(inputs, 1),
            plotForDegree(inputs, 2),
            plotForDegree(inputs, 3),
            plotForDegree(inputs, 4),
            plotForDegree(inputs, 5),
            plotForDegree(inputs, 6),
            plotForDegree(inputs, 7),
            plotForDegree(inputs, 8),
            plotForDegree(inputs, 9)
          ]}
          size={400}
          points={zip(inputs, outputs)}
          />
        </Section>
        <Section>
          <Plot
            paths={[
              plotForDegree(inputs, 7)
            ]}
            size={400}
            points={zip(inputs, outputs)}
            />
        </Section>
 */}
        <Section>

          <h3>R<sup>n</sup> &rarr; R polynomial generator</h3>
          
          <div>
            <div className="div5">
                <div className="marginated">Domain dimension (number of independent variables)</div>
                <input className="short" type="number" max="4" min="1" value={dimensions} name="dimensions" id="dimensions" onChange={handleChangeOfDimensions}></input>
            </div>

            <div className="div5">
                <div className="marginated">Polynomial's degree</div>
                <input className="short" type="number" max="9" min="1" value={degree} name="degree" id="degree" onChange={handleChangeOfDegree}></input>
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

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
