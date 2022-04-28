const{Discord, fetch, keepAlive, client} = require("../BoilerPlate/Discord");

const {messageIsIrrelevant, messageIsStartingGame, gameInvitationMessage, addPlayers, initPlayer,emojis, playerSummary, starterDeck, cardNames, shuffle, getPlayerById, maxNumberOfPlayers,summaryOfAllPlayers,sendPlayerTheirCards,turnOptions,emojiToAction, startOfTurn} = require("../library/libraryModule");


function handleReactions(reaction, user, games){
  if (user.bot) {return}
  console.log(reaction._emoji.name)
  
  let game = games[user.id]
  let thisPlayer = game['players'][user.id]

  if (reaction.message.channel.type=='dm'){
    if (game['turnEvent']) {
      game['turnEvent'](reaction._emoji.name)
      return
    }

    playerTakesMove(game, thisPlayer, emojiToAction[reaction._emoji.name])
  }
}



function playerTakesMove(game, player, actionString){
  let action = turnOptions[actionString]
  action.condition({player, game}) && action.run({player, game})
}




module.exports = handleReactions