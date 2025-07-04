import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [msg, setMsg] = useState("");
  useEffect(()=>{
	  fetch('/api/hello')
	  .then(res=> res.json())
	  .then(data=> setMsg(data.message));
  }, []);

  return (
    <>
      <h1>Monorepo App</h1>
      <p>{msg}</p>
    </>
  );
}

export default App
