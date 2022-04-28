const {cardNames, starterDeck, emojiToAction, emojis} = require('../library/dictionaries');


function sendAndEmoji(channel, text, emojis){
  const emojiDump = (msg)=>{
    emojis.forEach(msg.react)
  }
  channel.send(text)
  .then(emojiDump)
}


function playersHand(player){
  let {username,cards,coin,discord} = player;

  let hand = "// // Your Hand // // // // // //   \n"
    for (const card of cards){
      hand = hand + card + cardNames[card] + " "
    }
    hand = hand + "      "+(":coin:".repeat(coin))+" " + coin + "\n// // // // // // // //\n\n:flag_white: to surrender a card if someone calls your bluff\n:open_hands: to reaveal a card if you weren't lying"  
  return hand 
}

function summaryOfAllPlayers({playOrder}){

  const playerSummary=({username, cards, deadCards, coin})=>{

    let pSummary = ":coin:" + coin + "   " 
    for(const c of cards){
      pSummary = pSummary + emojis['Unknown']
    }
    for(const c of deadCards){
      pSummary = pSummary + c
    }
    pSummary = pSummary + " " + username + "   "

    return pSummary
  }



  var summary = ""
  for (const p of playOrder){
    summary = summary + playerSummary(p) + "\n"
  }
  return summary
}

function groupMessage_StartOfTurn({playOrder}){
 return (
   "It's "+playOrder[0].username+"'s turn.\n'"+summaryOfAllPlayers({playOrder})
 )
}

function playerCoinsSet(game, player, coins){
  game.channel.send("Host set "+player.username+"'s coins to "+coins+".")
}

function playerLivesSet(game, username, lives){
  game.channel.send("Host set "+player.username+"'s cards to "+lives+".")
}

function turnSet(game){
  game.channel.send("Host set game to"+game.playOrder[0].username+"'s turn.")
}

function surrenderChoice(game, player){
  let emojiDump = msg=>{
    msg.react('1️⃣')
    msg.react('2️⃣')
  }
  game.channel.send(player.username + " is conceeding a card.");
  player.inbox.send("Pick a card to let die...\n1️⃣" + player.card[0] + " ... 2️⃣"+player.card[1])
  .then(emojiDump)
}

function revealChoice(game, player){
  let emojiDump = msg=>{
    msg.react('1️⃣')
    msg.react('2️⃣')
  }
  game.channel.send(player.username + " is conceeding a card.");
  player.inbox.send("Pick a card to let die...\n1️⃣" + player.card[0] + " ... 2️⃣"+player.card[1])
  .then(emojiDump)
}

function validTargetsNumbered(game){
  let message=""
  let targetCount = 0
  let optionEmojis = []

  game.playOrder.forEach((potentialTarget)=>{
    if(index==0||!potentialTarget.isAlive()){return}
    let targetNum = numberEmojis[targetCount]
    targetCount++
    message = message + "\n"+targetNum+potentialTarget.username
    emojis.push(targetNum)
  })

  return{optionEmojis, playerSummaryText:message}
}

function stealEvent(player, game){
  let message = "Which player will you steal from?"
  let {optionEmojis, playerSummaryText} = validTargetsNumbered(game)
  sendAndEmoji(game.channel, message + playerSummaryText, optionEmojis)
}
function stealBlockOrAllowEvent(target,player, game){
  game.channel.send(
    player.username + " is attempting to steal from " +target.username+"."
  )

  sendAndEmoji(
    target.inbox, 
    player.username + " is stealing from you. Do you let them, or block it as Captain💠 or Ambassador🧩?", 
    ["✔️","💠","🧩"]
  )  
}
function stealSuccess(blocked, game){
  game.channel.send(blocked?"The stealing was blocked.":"They succeeded.")
}
function assassinateEvent(player, game){
  let message = "Which player will you assassinate?"
  let {optionEmojis, playerSummaryText} = validTargetsNumbered(game)
  sendAndEmoji(game.channel, message + playerSummaryText, optionEmojis)
}


function assassinatelBlockOrAllowEvent(target,player, game){
  game.channel.send(
    player.username + " is attempting to murder "+ target.username + "."
  )

  sendAndEmoji(
    target.inbox, 
    player.username + " is attempting to kill you. Do you let them, or block it as Contessa💟?", 
    ["✔️","💟"]
  )  
}

function assassinateSuccess(blocked, game){
  game.channel.send(blocked?"But they failed.":"They succeeded.")
}
function coupEvent(target,player, game){
  let {optionEmojis, playerSummaryText} = validTargetsNumbered(game)
  sendAndEmoji(
    player.inbox, 
    "Which player will you coup?" + playerSummaryText, 
    optionEmojis
  )
}

function coupSuccessEvent(target,player, game){
  game.channel.send(player.username + " coup'd " +target.username+".")
}

function playerRevealedCard(player, card){
  game.channel.send(
    player.username + " had " + card + cardNames[card] + "."
  )
}




module.exports = {playersHand,summaryOfAllPlayers, groupMessage_StartOfTurn,playerCoinsSet, playerLivesSet, turnSet,surrenderChoice,revealChoice,stealEvent
,stealBlockOrAllowEvent,
stealSuccess
,assassinateEvent
,assassinatelBlockOrAllowEvent,
assassinateSuccess
,coupEvent,
coupSuccessEvent,
playerRevealedCard}