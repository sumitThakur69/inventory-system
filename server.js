import express from 'express';
const app = express();

const PORT = process.env.PORT || 3000;
const localhost = `http://localhost:${PORT}`;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.listen(process.env.PORT || 3000 , () => {
    console.log(`server is running on port on ${localhost}`);
})
