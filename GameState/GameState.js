function InitGameState(gameStartingMessage){

    let host = gameStartingMessage.author
    
    let gameID = host.id

    let channel = gameStartingMessage.channel

    games[gameID] = {
        gameID,
        host,
        players:{}, 
        deck:shuffle(starterDeck),
        playOrder:[],
        channel,
        waitingForReaction:null,
        past:[],
    }
}

function InitPlayer(Player, {players, gameID, deck}){
    players[Player.id] = {        
      username:Player.username,
      cards:[deck.shift(), deck.shift()],
      deadCards:[],
      coins:2,
      id:Player.id,
      game:gameID,
      inbox:Player,
      isAlive:function(){
        return this["cards"].length
      }
    }
}


///////////////

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

module.exports = {InitGameState, InitPlayer, shuffle}


