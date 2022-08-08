import './App.css';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage' ;


function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route exact path="/" element={ <LandingPage /> } />
          <Route exact path="/login" element={ <LoginPage /> } />
          <Route exact path="/register" element={ <RegisterPage /> } />
        </Routes>
      </Router> 
    </div>
  );
}



export default App;
