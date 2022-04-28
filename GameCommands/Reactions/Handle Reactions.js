const reverse_EmojiLibrary = require("../../Resources/Library")
const turnOptions = require("./GameFlow/Turn Options/Turn Options")

function EmojiAction(reaction, user, games){
    if (user.bot) return
    
    let game = games[user.id]
    let player = game['players'][user.id]
  
    if (reaction.message.channel.type=='dm'){
      if (game['waitingForReaction']) {
        game['waitingForReaction'](reaction._emoji.name)
        return
      }
  
      playerTakesMove(game, player, reverse_EmojiLibrary[reaction._emoji.name])
    }
}
  
function playerTakesMove(game, player, actionString){
    let action = turnOptions[actionString]
    action.condition({player, game}) && action.run({player, game})
}

module.exports = EmojiAction