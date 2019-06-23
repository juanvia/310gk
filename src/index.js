import React, {useState} from "react";
import ReactDOM from "react-dom";
import { Polynomial, upperCases, variableNames } from "./anotherstuff"
import { makeStackedMatrixOfGenerators } from "./powers-list"
import {combinations} from 'mathjs'
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles'
import theme from './theme';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';


function App() {

  const [dimensions, setDimensions] = useState(3);  
  const [degree, setDegree] = useState(6);
  const [stackedMatrixOfGenerators, setStackedMatrixOfGenerators] = useState(makeStackedMatrixOfGenerators(3, 6))
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
      setDegree(Number(e.target.value))
  }

  const handleChangeOfDimensions = e => {
    if (dimensions >= 0 && dimensions <= 6)
      setDimensions(Number(e.target.value))
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

    <Container >
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom color="textSecondary">
          Multivariable polynomials
        </Typography>
        <div className="App">
          <div>
            <div className="div5">
                <div className="marginated">Domain dimension (number of independent variables)</div>
                <input className="short" type="number" value={dimensions} name="dimensions" id="dimensions" onChange={handleChangeOfDimensions}/>
            </div>

            <div className="div5">
                <div className="marginated">Polynomial's degree</div>
                <input className="short" type="number" value={degree} name="degree" id="degree" onChange={handleChangeOfDegree}/>
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

          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Typography variant="subtitle2" component="h1" gutterBottom>
                Powers matrix
              </Typography>
              <div style={{fontFamily: 'monaco, monospace', cursive: true, lineHeight: 1.5, fontSize: '0.7rem'}}>
                {JSON.stringify(stackedMatrixOfGenerators)}
              </div>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="subtitle2" component="h1" gutterBottom>
                Polynomial
              </Typography>
              <Polynomial 
                coefficientsNotation={coefficientsNotation} 
                variablesNotation={variablesNotation} 
                stackedMatrix={stackedMatrixOfGenerators}
              />
            </Grid>
          </Grid>

        </div>
      </Box>
    </Container>
  
  );
}


// let tabla=[]
// for (let dim=3;dim<4;++dim)
//   for (let deg=1;deg<10;++deg) 
//     tabla.push([dim,deg, makeStackedMatrixOfGenerators(dim, deg).length])
// console.log(sortBy(prop(2))(tabla))
  


const rootElement = document.getElementById("root");
ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <App />
  </ThemeProvider>, rootElement);

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

