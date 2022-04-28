const startOfTurn = require("../../../GameState/Start Of Turn")
const {undo,  killPlayer, surrenderEvent} = require("../../../GameState/GameStateManagement")


//surrenderEvent needs to be set
const hostCommands = {
    setPlayerLives: function(game, [,,username, lives]){
      function increaseLives(game, player, lives){
        while (player.cards.length < lives){
          game.deck.push(player.deadCards.pop())
          player.cards.push(game.deck.shift())
          console.log('card added. player lives:',player.cards.length)
        }
      }
  
      function decreaseLives(game, player, lives){
        (lives == 0)?killPlayer(game, player):surrenderEvent(game, player);
      }
  
      let player = getPlayerByUsername(game, username)
      if(!player){return}
  
      if (lives = player.cards.length) return;
      (lives = player.cards.length)? increaseLives(game, player, lives):decreaseLives(game, player, lives)
  
      dialogue.playerLivesSet(game, username, coins)
    },
    setPlayerCoins: function(game, [,,username, coins]){
      let player = getPlayerByUsername(game, username)
      if(!player){return}
  
      player.coins = coins
  
      dialogue.playerCoinsSet(game, username, coins)
    },
    setTurn: function(game, [,,username]){
      let player = getPlayerByUsername(game, username)
      if(!player || !player.isAlive()){return}
  
      while(game.playOrder[0].id != player.id){
        game.playOrder.push(game.playOrder.shift())
        console.log(game.playOrder)
      }
      dialogue.turnSet(game)
      startOfTurn(game)
    },
    undo: function (game){
      undo(game)
    }
  }

function getPlayerByUsername(game, username){
  function convertTagToUsername(tag){
    if (tag[0] == "@"){
      tag = tag.substring(1);
    }
    return tag
  }
  username = convertTagToUsername(username)
  for (const p of game.playOrder){
    if (p.username == username){
      return p;
    }
  }
}


module.exports = hostCommands