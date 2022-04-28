const Dialogue = require("../../../../Resources/Dialogue")
const {nextTurn, killPlayer, addCoin, surrenderEvent, revealEvent} = require("../../../../GameState/GameStateManagement")


const turnOptions = {
    income:{
      condition: function({player,game}){
        return itsThisPlayersTurn(player, game)
      },
      msg:"🪙 Income: gain 1 coin (unblockable)",
      emoji:"🪙",
      run:function({player,game}){
        addCoin(player,1)
        nextTurn(game)
      }
    },
    "foreign aid":{
      condition: function({player,game}){
        return itsThisPlayersTurn(player, game)
      },
  
      msg:"💸 Foreign Aid: gain 2 coins",
      emoji:"💸",
      run:function({player,game}){
        player.taxable = true
        addCoin(player,2)
        nextTurn(game)
      }
    },
    tax:{
      condition: function({player,game}){
        return itsThisPlayersTurn(player, game)
      },
      msg:"⚜️ Tax: gain 3 coins",
      emoji:"⚜️",
      run:function({player,game}){
        addCoin(player,3)
        nextTurn(game)
      }
    },
    steal:{
      condition: function({player,game}){
        return itsThisPlayersTurn(player, game)
      },
      msg:"💠 Steal: take 2 coins from another player",
       emoji:"💠",
      run:function stealEvent(game, player){
        Dialogue.turnEvents.steal.chooseTarget(game, player)//unset

        let chooseAPlayerToStealFrom = game.playOrder.reduce((choosePlayer={}, target, index)=>{
          choosePlayer[numberEmojis[index]] = ()=>{stealBlockOrAllowEvent(player, target, game)}
          return choosePlayer
        })
        game['waitingForReaction'] = chooseAPlayerToStealFrom

        function stealBlockOrAllowEvent(player, target, game){
          Dialogue.turnEvents.steal.blockOrAllow(target, player, game)
          game["waitingForReaction"] = {
            "✔️":function(){
              Dialogue.turnEvents.steal.success(false, game)
              addCoin(target, -2)
              addCoin(player, 2)
              nextTurn(game)
            },
            "💠":function(){
              Dialogue.turnEvents.steal.success(true, game)
              nextTurn(game)
            },
            "🧩":function(){
              Dialogue.turnEvents.steal.success(true, game)
              nextTurn(game)
            }
          }
        }
      }
      
    },
    exchange:{
      condition: function({player,game}){
        return itsThisPlayersTurn(player, game)
      },
      msg:"🧩 Exchange: you can see and may swap upto 2 cards from the deck",
      emoji:"🧩",
      run:function({player,game}){
        game['waitingForReaction'].player
      }
    },
    assassinate:{
      condition: function({player,game}){
        return itsThisPlayersTurn(player, game) &&
          player.coins>2
      },
      msg:"💀 Assassinate: pay 3 🪙 to kill a player",
      emoji:"💀",
      run:function assassinateEvent(game, player){
        Dialogue.turnEvents.assassinate.chooseTarget(game, player)//unset
        
        function assassinateBlockOrAllowEvent(player, target, game){
          Dialogue.turnEvents.assassinate.blockOrAllow(target, game);
          game["waitingForReaction"] = {
            "✔️":function(){
              Dialogue.turnEvents.assassinate.success(false, game)
              playerLosesACardThenTurnPass(target, game)
              nextTurn(game)
            },
            "💟":function(){
              Dialogue.turnEvents.assassinate.success(true, game)
              nextTurn(game)
            }
          }
        }

        let selecEvent = {}
        game.playOrder.forEach((target, index)=>{
          selectEvent[numberEmojis[index]] = function(){
            assassinateBlockOrAllowEvent(player, target, game)
          }
        })

        game['waitingForReaction'] = selectEvent
      }
    },
    coup:{
      condition: function({player,game}){
        return itsThisPlayersTurn(player, game) &&
         player.coins>6
      },
      msg:"🔱 Coup: pay 7 🪙 to kill a player (unblockable)",
      emoji:"🔱",
      run:function coupEvent(game, player){
        Dialogue.turnEvents.coup.chooseTarget(game, player)//unset
        
        let selecEvent = {}
        game.playOrder.forEach((target, index)=>{
          selectEvent[numberEmojis[index]] = function(){
            Dialogue.turnEvents.coup.success(target, player, game)
            playerLosesACardThenTurnPass(target, game)
            nextTurn(game)
          }
        })
      }
    },
    pass:{
      condition: function({player,game}){
        return itsThisPlayersTurn(player, game)
      },
      msg:"🤷‍♂️ PassTurn: They called your bluff.",
      emoji:"🤷‍♂️",
      run:function({player,game}){
        nextTurn(game)
      }
    },
    surrender:{
      condition: function({player,game, display}){
        return player.isAlive() || !display
      },
      msg:"",
      emoji:"🏳️",
      run:function({player,game}){
        (player.cards.length == 1)?killPlayer(game, player):surrenderEvent(game, player)
      }
    },
    reveal:{
      condition: function({player, game, display}){
        return player.isAlive() || !display
      },
      msg:"",
      emoji:"👐",
      run:function({player,game}){
      }
    },
}

////////
function playerLosesACardThenTurnPass(player, game){
  // turnpass not yet applied (consider host mode)
  (player.cards.length == 2)?surrenderEvent(game, player):killPlayer(player, game)
}

////
function itsThisPlayersTurn(player, game){
  return player = game.playOrder[0]
}



module.exports = turnOptions

