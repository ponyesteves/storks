const fs = require('fs'),
  https = require('https'),
  cors = require('cors'),
  express = require('express'),
  app = express(),
  authRedirectUrl = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=5894928571543101`,
  request = require('request'),
  RF = require('ramda-fantasy'),
  db = require('./lokidb').db,
  bodyParser = require('body-parser'),
  Maybe = require('ramda-fantasy').Maybe


// Create SSL server with autoSigned certs
https.createServer({
  key: fs.readFileSync(`${__dirname}/ssl/private.pem`),
  cert: fs.readFileSync(`${__dirname}/ssl/server.crt`)
}, app).listen(3000);

app.use(cors())
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

// Redirect to auth
app.get('/', (req, res) => {
  res.redirect(authRedirectUrl)
})

app.get('/auth', function (req, res) {
  RF.Maybe(req.query.code)
    .map(code => {
      request.post('https://api.mercadolibre.com/oauth/token', {
        form: {
          grant_type: 'authorization_code',
          client_id: '5894928571543101',
          client_secret: 'NI64BVwyCD2TzZmWUY3uNo3slZBxte7a',
          code,
          redirect_uri: 'https://storks.elcaminosoftware.com:3000/auth'
        }
      }, (tokenError, tokenResponse, tokenBody) => {
        console.log("tokenError" + tokenError)
        console.log("tokenResponse" + tokenResponse)
        if (tokenError || RF.Maybe(tokenResponse).map(tr => tr.Error).value) return res.send("API de Marcado Libre No disponible :( . Intentelo en unos minutos")
        fs.writeFileSync('session.json', JSON.stringify(JSON.parse(tokenBody)))
        res.redirect('/home')
      })
    }).isJust || res.send('Ingresando a la APP...... :)')
})


app.use('/home', (req, res, next) => {
  const session = JSON.parse(fs.readFileSync('session.json'))
  res.cookie("access_token", session.access_token)
  res.cookie("otra", "prueba")
  next()
})
app.use('/home', express.static(__dirname + '/../client/dist'))

app.get('/productos', function (req, res) {
  db.loadDatabase({}, () => {
    res.send(db.getCollection('adicionales').find())
  })
})

app.post('/producto', (req, res) => {
  db.loadDatabase({}, () => {
    Maybe(db.getCollection('adicionales'))
      .getOrElse(db.addCollection('adicionales'))
      .insert(req.body)
    db.saveDatabase()
    res.status(201).send(req.body)
  })
})
