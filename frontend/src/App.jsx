import { Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <div>
        <Link to="/home">Home</Link>
      </div>
      <div>
        <Link to="/chart">Chart</Link>
      </div>
      <div>
        <Link to="/signup">SignUp</Link>
      </div>
    </div>
  );
}

export default App;
