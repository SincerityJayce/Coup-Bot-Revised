const {cardNames, emojis} = require('./Library');


const Dialogue = {

  explainTurnOrder:function(game){
    game.channel.send("These are the players in turn order. \n \n.")
  },
  explainObjective:function(game){
    game.channel.send(".\n\n Last person alive wins. Declare your move now " +game.playOrder[0].username+".")

  },
  inviteAllPlayers:function(game){
    function gameInvitationMessage(player){
      let link = "https://cf.geekdo-images.com/-6JanbKPNBzuQam0-bee7g__imagepagezoom/img/wE7XODedWUqxKPCIA-rTGkY9p20=/fit-in/1200x900/filters:no_upscale():strip_icc()/pic1812508.jpg"
      let message =   (
        `You're included in a game of coup with ${game.host.username} in ${game.channel.guild.name}${game.channel.name} channel.
        \n
        \n This game is still played manually. It relies on you to play by the rules. 
        Only reveal your cards or surrender a card if it is time to do so or you'll ruin the game. 
        But don't worry😊, the first game's always practice.
        \n
        \n
        ${link}`)
        player.inbox.send(message)
    }
    game.playOrder.map(gameInvitationMessage)
  },
  sendTurnOptionsTo:function (turnPlayer, game){
    let validOptions = Object.values(turnOptions).filter((o)=>o.condition({player,game}))
    let optionEmojis = validOptions.map((o)=>o.emoji)
    let optionString = validOptions.reduce(
      (dialogue = "It is your turn. Tell voice chat what you want to do. Then React when they allow you.\n", option)=>{
        return `${dialogue}\n${option.msg}`
    })
    
    sendAndEmoji(turnPlayer.inbox,optionString,optionEmojis)
  },
  tellNonturnPlayersWhosTurnItIs:function(turnPlayer, nonTurnPlayers){
    for (const p of nonTurnPlayers){
      p.inbox.send("It's " + turnPlayer.username + "'s turn.'")
    }
  },
  sendAllPlayersTheirCards:function(game){
    game.players.map(sendPlayerTheirCards)
  },
  messageTheGroupTheStartOfTurn:function(game){
    function groupMessage_turnStart({ playOrder }) {
      return (
        "It's " +
        playOrder[0].username +
        "'s turn.\n'" +
        summaryOfAllPlayers({ playOrder })
      );
    }
  
    game.channel.send(groupMessage_turnStart(game))
  },
  

  hostActions:{
    playerCoinsSet: function (game, player, coins) {
        game.channel.send(
          "Host set " + player.username + "'s coins to " + coins + "."
        );
      },
    
      playerLivesSet: function (game, username, lives) {
        game.channel.send(
          "Host set " + player.username + "'s cards to " + lives + "."
        );
      },
    
      turnSet: function (game) {
        game.channel.send(
          "Host set game to" + game.playOrder[0].username + "'s turn."
        );
      }
  },
  

  chooseCardTo:{
    surrender: function (game, player) {
        let emojiDump = (msg) => {
          msg.react("1️⃣");
          msg.react("2️⃣");
        };
        game.channel.send(player.username + " is conceeding a card.");
        player.inbox
          .send(
            "Pick a card to let die...\n1️⃣" +
              player.card[0] +
              " ... 2️⃣" +
              player.card[1]
          )
          .then(emojiDump);
      },
    
      reveal: function (game, player) {
        let emojiDump = (msg) => {
          msg.react("1️⃣");
          msg.react("2️⃣");
        };
        game.channel.send(player.username + " is conceeding a card.");
        player.inbox
          .send(
            "Pick a card to let die...\n1️⃣" +
              player.card[0] +
              " ... 2️⃣" +
              player.card[1]
          )
          .then(emojiDump);
      }
  },


  turnEvents: {
    steal: {
      chooseTarget: function (player, game) {
        let message = "Which player will you steal from?";
        let { optionEmojis, playerSummaryText } = validTargetsNumbered(game);
        sendAndEmoji(game.channel, message + playerSummaryText, optionEmojis);
      },
      blockOrAllow: function (target, player, game) {
        game.channel.send(
          player.username +
            " is attempting to steal from " +
            target.username +
            "."
        );
        sendAndEmoji(
          target.inbox,
          player.username +
            " is stealing from you. Do you let them, or block it as Captain💠 or Ambassador🧩?",
          ["✔️", "💠", "🧩"]
        );
      },
      success: function (blocked, game) {
        game.channel.send(
          blocked ? "The stealing was blocked." : "They succeeded."
        );
      },
    },
    assassinate: {
      chooseTarget: function (player, game) {
        let message = "Which player will you assassinate?";
        let { optionEmojis, playerSummaryText } = validTargetsNumbered(game);
        sendAndEmoji(game.channel, message + playerSummaryText, optionEmojis);
      },

      blockOrAllow: function (target, player, game) {
        game.channel.send(
          player.username + " is attempting to murder " + target.username + "."
        );

        sendAndEmoji(
          target.inbox,
          player.username +
            " is attempting to kill you. Do you let them, or block it as Contessa💟?",
          ["✔️", "💟"]
        );
      },

      success: function (blocked, game) {
        game.channel.send(blocked ? "But they failed." : "They succeeded.");
      },
    },
    coup: {
      chooseTarget: function (target, player, game) {
        let { optionEmojis, playerSummaryText } = validTargetsNumbered(game);

        sendAndEmoji(
          player.inbox,
          "Which player will you coup?" + playerSummaryText,
          optionEmojis
        );
      },
      success: function (target, player, game) {
        game.channel.send(player.username + " coup'd " + target.username + ".");
      },
    },
  },

  playerRevealedCard: function (player, card) {
    game.channel.send(player.username + " had " + card + cardNames[card] + ".");
  },
};

////////////////////
function summaryOfAllPlayers ({ playOrder }) {
    const playerSummary = ({ username, cards, deadCards, coins }) => {
      let pSummary = ":coin:" + coins + "   ";
      for (const c of cards) {
        pSummary = pSummary + emojis["Unknown"];
      }
      for (const c of deadCards) {
        pSummary = pSummary + c;
      }
      pSummary = pSummary + " " + username + "   ";

      return pSummary;
    };

    var summary = "";
    for (const p of playOrder) {
      summary = summary + playerSummary(p) + "\n";
    }
    return summary;
  }

function sendAndEmoji(channel, text, emojis) {
    const emojiDump = (msg) => {
      emojis.forEach(msg.react);
    };
    channel.send(text).then(emojiDump);
}

function validTargetsNumbered (game) {
    let message = "";
    let targetCount = 0;
    let optionEmojis = [];

    game.playOrder.forEach((potentialTarget) => {
      if (index == 0 || !potentialTarget.isAlive()) {
        return;
      }
      let targetNum = numberEmojis[targetCount];
      targetCount++;
      message = message + "\n" + targetNum + potentialTarget.username;
      optionEmojis.push(targetNum);

      //this last line said emojis.push(targetNum) which I'm pretty sure was an error
    });

    return { optionEmojis, playerSummaryText: message };
}

function sendPlayerTheirCards(player){
  function playersHand ({ cards, coins, }) {  
    return (
      cards.reduce((hand=
      `// // Your Hand // // // // // //   \n`, card)=>{
      return `${hand}${card}${cardNames[card]} `
    })+`      ${":coin:".repeat(coins)} ${coins}\n
      // // // // // // // //
      \n
      \n:flag_white: to surrender a card if someone calls your bluff
      \n:open_hands: to reaveal a card if you weren't lying`
    )
  }

  if (player.isAlive()){
    sendAndEmoji(
      player.inbox, 
      playersHand(player),
      [emojis['surrender'],emojis['reveal']])
  }
}


module.exports = Dialogue


