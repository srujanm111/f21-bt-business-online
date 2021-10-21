import { BrowserRouter as Router, Route} from "react-router-dom"
import background from './background.svg';
import Welcome from "./views/Welcome"
import Login from "./views/Login"
import './App.css';

function App() {
  return (
    <div className="App">
      <img className="App-background" src={background} />
      <div className="App-body">
        <Router>
          <Route exact path="/">
            <Welcome />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
        </Router>
      </div>
    </div>
  );
}

export default App;
