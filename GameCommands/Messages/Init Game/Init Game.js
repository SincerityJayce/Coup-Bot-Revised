const Dialogue = require("../../../Resources/Dialogue")
const startOfTurn = require("../../../GameState/Start Of Turn")
const {InitGameState, InitPlayer, shuffle} = require("../../../GameState/")

const maxNumberOfPlayers = 6;

// host is undefined
function addPlayers(msg, game){
  let players = msg.mentions.users.values()
  let excluded = [];
  let playOrder = [game.host]
  for (const p of players){
      playOrder.length < maxNumberOfPlayers?playOrder.push(InitPlayer(p,game)):excluded.push(p)
    }

  excluded.length && alertOfExcludedPlayers(host, excluded)
  game['playOrder'] = shuffle(Object.values(game['players']))
  for(const p of game['playOrder']){
    game["players"][p.id] = p
  }
}

function alertOfExcludedPlayers(host, excluded){
    host.send("A max of 6 players can play. The following players were excluded: ")
    for(const p of excluded){
      host.send(p.username)
    }
}
  
function intialiseGame(hostMessage){
  let game = InitGameState(hostMessage)
  addPlayers(hostMessage, game)

  Dialogue.inviteAllPlayers(game)
  Dialogue.sendAllPlayersTheirCards(game)
  game.playOrder.map(function setPlayersGameRef(player){games[player.id]=game})

  Dialogue.explainTurnOrder(game)
  startOfTurn(game)
  Dialogue.explainObjective(game)
}

module.exports = intialiseGame