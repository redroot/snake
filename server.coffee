express = require('express')
io = require('socket.io')

app = express.createServer()

app.configure ->
  app.use(express.bodyParser())
  app.use(app.router)
  app.use(express.static(__dirname + "/public/"))
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true}))
  app.set('views',__dirname + "/views/")
  
# server routes

app.get "/", (req,res) ->
    res.render 'game.ejs', layout: false
app.get "/d", (req,res) ->
  res.render 'dashboard.ejs', layout: false

app.listen(3000)
console.log("Running at port 3000")

# sockets fun, attempting to build a dashboard of game state

# main class for handling everything
class Controller
  constructor: ->
    @games = []
    @dashboard = null
  connect: (game) ->
    @games.push(game)
  setDash: (dash) ->
      @dashboard = dash
  disconnect: (did) ->
    for game, id of @games
      if game.id is did
        game.active = false
  cleanup: ->
    console.log("Cleaning up games")
    activeGames = {}
    activeGames[game] = game for game, id of @screens when screen.active == true
    @games = activeGames
        
        
        

ct = new Controller
count = 0
        
# start up the sockets

socket = io.listen(app)

socket.sockets.on 'connection', (socket) ->
  
  #on any connections
  count++
  console.log("Game count = " + count)
  
  socket.on 'new_game', (game) ->
      ct.connect(game)
    
      
  socket.on 'game_closed', (game) ->
      ct.disconnect(game.id)
      ct.cleanup
      # emit current status here to dashboard
      console.log("game closed" + game.id)
    
  socket.on 'disconnect', (data) ->
    count--
    console.log("disconnected")
      
  socket.on 'gameState', (data) ->
    console.log(data.food)
      
      

