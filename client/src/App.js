import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages';
import Auth from './pages/auth';
import Video from './pages/video';
function App() {
  return (
    <div className="Appi">
      <Router>
          <Routes>
            <Route path='/' element={<Index/>} />
            <Route path='/auth' element={<Auth/>} />
            <Route path='/video/:id' element={<Video/>} />
    
          </Routes>
        </Router>
    </div>
  );
}

export default App;
