import { useDispatch } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar/Navbar';
import User from './User/Info';

const Home = () => <div>Home Page</div>;

const App = () => {
  const dispatch = useDispatch();

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/User" element={<User />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
