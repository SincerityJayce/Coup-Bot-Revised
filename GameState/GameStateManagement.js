/////////////////////////////////////////

function nextTurn(game){
    let {playOrder} = game
    var turnPlayer = ()=>playOrder[0]
    var lastPlayer = turnPlayer;

    nextAlivePlayer(game)
    rememberThePast(game)
    startOfTurn(game)

    function nextAlivePlayer(game){
      playOrder.push(playOrder.shift())
      if (turnPlayer() == lastPlayer) {theGameHasBeenWonBy(lastPlayer, game);return}
      !playOrder[0].isAlive() && nextAlivePlayer();
    }
    function rememberThePast(game){
      let save = $.extend(true,{},game)
      delete save.past
      game.past.push(save)
    }
    function theGameHasBeenWonBy(player, game){
      game.channel.send(player.username + " is the winner! Well Played.")
    }
}

function undo(game){
    Object.assign(game,past.pop())
    game.channel.send("The host undid the last action")
    startOfTurn(game)
}

function addCoin({coins},ammount){
  coins += ammount
  coins = coins>10?10:coins;
  coins = coins<0?0:coins;
}
function killPlayer(game, player){
  while (player.cards.length < 0){
    player.deadCards.push(player.cards.pop())
  }
  if(!game.playOrder[0].isAlive()){
    nextTurn(game)
  }
}

function surrenderEvent(game, player){
  Dialogue.surrenderEvent(game, player)
  game["waitingForReaction"] = {
    "1️⃣":function(){
      player.deadCards.push(player.cards.shift())
    },
    "2️⃣":function(){
      player.deadCards.push(player.cards.pop())
    }}
}

function revealEvent(player, game){
  function revealChoice(game, player){
    Dialogue.revealChoice(game, player)
    game["waitingForReaction"] = {
      "1️⃣":function(){
        game.deck.push(player.cards.shift())
        player.cards.push(game.deck.shift())
      },
      "2️⃣":function(){
        game.deck.push(player.cards.pop())
        player.cards.push(game.deck.shift())
      }}
  }

  function revealPlayersCard(index, player, game){
    dialogue.playerRevealedCard(player,player.cards[index])
    game.deck.push(index?player.cards.shift():player.cards.pop())
    player.cards.push(game.deck.shift())
  }

  player.cards.length==2?revealChoice(player, game):revealPlayersCard(0,player, game)
}


module.exports = {undo, nextTurn, killPlayer, addCoin, surrenderEvent, revealEvent}