const Dialogue = require("../Resources/Dialogue")
/////////////////////////////////////////
function startOfTurn(game){
  let [turnPlayer, ...nonTurnPlayers] = game.playOrder

  Dialogue.sendAllPlayersTheirCards(game)

  Dialogue.sendTurnOptionsTo(turnPlayer, game);

  Dialogue.tellNonturnPlayersWhosTurnItIs(turnPlayer, nonTurnPlayers)

  Dialogue.messageTheGroupTheStartOfTurn(game)
}

module.exports = startOfTurn