const listOf_Host_Commands = require( "./Host Commands/Host Commands" )
const intialiseGame = require('./Init Game/Init Game')


function handleMessages(msg, games){
    if (messageIsIrrelevant(msg)) return
  
    if (messageIsCommand(msg)) return hostCommand(msg, games)
  
    if (messageIsStartingGame(msg)) return intialiseGame()
}



/////////////////////
function messageIsIrrelevant(msg, relevantChannels = ["861062230187442176"]){
    return(
        msg.author.bot || !((msg.guild &&relevantChannels.includes(msg.guild.id))||msg.type=="dm")
    )
}
function messageIsCommand(msg){
    return msg.content.includes('!Coup')
}
function hostCommand(msg, games){
    let game = games[(msg.author.id)]
    if (game.host != message.author) return
    let command = listOf_Host_Commands.get(msg.content.split(' ')[1])
    command&&command(game, commandArray)
}
function messageIsStartingGame(msg){
    return (
        msg.content.includes("Lets play Coup") &&
        msg.mentions.users.size > 0
    )
}
function messageIsCommand(msg){
    return msg.content.includes('!Coup')
}

module.exports = handleMessages