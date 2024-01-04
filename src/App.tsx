import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Article from './components/article';
import Header from './components/header';
import List from './components/List';
import Login from './components/login';
import { ErrorPage } from './components/errorPage';


function App() {
  return (
    <div className="App">
      <Header title="안녕하세요" onTest={function(){alert(1)}}/>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<List/>}></Route>
            <Route path="/login" element={<Login header="일반 사용자"/>}></Route>
            <Route path="*" element={<ErrorPage/>}/>
          </Routes>
        </BrowserRouter>
      <Article/>
    </div>
  );
}

export default App;
