const express = require('express')
const app = express();
const port = 3001;

app.get("/api/hello", (req, res)=>{
	res.json({message: "Hello from backend!"})
});

app.listen(port, ()=>{
	console.log(`Backend running at http://localhost:${port}`);
});
