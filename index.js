const express = require('express')
const path = require('path');
const app = express()
const bodyParser = require('body-parser')
const cache = require('memory-cache')
const uuid = require('uuid/v4')
const Package = require('./package')

const TWENTY_FOUR_HOURS = 86400000

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect(Package.homepage)
})

app.get('/:pasteId', (req, res) => {
  const data = cache.get(req.params.pasteId)
  if (!data) return res.send('No paste found.').status(404)
  res.send(data)
})

app.put('/:pasteId', (req, res) => {
  const pasteId = req.params.pasteId
  const pasteUrl = `${req.protocol}://${req.headers.host}/${pasteId}`
  cache.put(pasteId, req.body, TWENTY_FOUR_HOURS)
  res.send({ pasteId, pasteUrl })
})

app.post('/', (req, res) => {
  const pasteId = uuid()
  const pasteUrl = `${req.protocol}://${req.headers.host}/${pasteId}`
  cache.put(pasteId, req.body, TWENTY_FOUR_HOURS)
  res.send({ pasteId, pasteUrl })
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
