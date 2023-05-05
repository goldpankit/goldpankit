const express = require('express')
const path = require('path');
const port = 8888
const app = express()
app.use(express.static(path.join(__dirname, 'public')));

// load routers
app.get('/api/test', (req, res) => {
  res.send('Hello World!')
})

// start listen
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
