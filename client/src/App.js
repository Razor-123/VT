import './App.css';
import { BrowserRouter as Router,Routes,Route,} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home/>}/>
        <Route exact path='/signup' element={<Signup/>} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/profile' element={<Profile/>} />
      </Routes>
    </Router>
  );
}

export default App;
