import '../App.css';
import ChartComponent from './BarChart';
import styled from 'styled-components';

const Header = styled.div`
background-color: gray;
padding: 10px;
margin-bottom: 30px;
h2 {
  margin: 0;
  padding: 10px;
  color: white;
}
`
function App() {
  return (
    <div className="App">
      <Header>
        <h2>Products Dashboard</h2>
      </Header>
      <ChartComponent />
    </div>
  );
}

export default App;
