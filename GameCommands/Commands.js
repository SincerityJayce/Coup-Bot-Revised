function Deploy_GameCommands(client){

    client.on("messageReactionAdd", (reaction, user)=>{
        EmojiAction(reaction,user,games)
    })
    
    client.on("message", (msg) =>{
        handleMessages(msg, games)
    })
}



module.exports = Deploy_GameCommands