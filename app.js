import express from 'express'
import multer from 'multer'

const app = express()
const text = express.text()
const json = express.json()
const urlencoded = express.urlencoded({extended: false})
const upload = multer()

app.use(text)
app.use(json)
app.use(urlencoded)
app.use(upload.none())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5000')
  res.header('Access-Control-Allow-Headers', 'Authorization,Content-Type,X-API-KEY,Origin,X-Requested-With,Accept,Access-Control-Request-Method')
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PATCH,PUT,DELETE')
  res.header('Allow', 'GET,POST,PATCH,OPTIONS,PUT,DELETE')
  next()
})

app.get('/get', (req, res) => {
  const {url, method, body, query} = req
  res.send({
    code: 1,
    query
  })
})
app.post('/post', (req, res) => {
  const {url, method, body, query} = req
  res.send({
    code: 1,
    query, body
  })
})
app.post('/none', (req, res) => {
  const {url, method, body, query} = req
  res.status(404).send({
    code: 1,
    query, body
  })
})
app.post('/wrong', (req, res) => {
  const {url, method, body, query} = req
  res.status(500).send({
    code: 1,
    query, body
  })
})
app.listen(3000, () => console.log('App listening on port 3000.'))