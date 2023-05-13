const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send(process.env.SERVER_NUM)
})

try {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
      console.log(process.env.SERVER_NUM)
    })
} catch(err) {
    console.log(err)
}