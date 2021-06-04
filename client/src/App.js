import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
function App() {

  const [data, setData] = useState(null);

  useEffect(() => {//Lay data tu api server
    async function getData() {
      try {

        const response = await fetch("http://localhost:3001/api");
        const data = await response.json();
        setData(data.message);

      } catch (error) {
        console.log("Loi lay data api", error);
      }

    }

    getData();
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {!data ? "Loading...." : data}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
