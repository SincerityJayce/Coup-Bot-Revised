const cardNames = {
  "🔳":'Unknown',
  "⚜️":'Duke',
  "💠":'Captain',
  "🧩":'Ambassador',
  "💀":'Assassin',
  "💟":'Contessa'
}
const starterDeck = [
  "⚜️","💠","🧩","💀","💟",
  "⚜️","💠","🧩","💀","💟",
  "⚜️","💠","🧩","💀","💟"
]

const reverse_EmojiLibrary = {
  "🏳️":"surrender",
  "👐":"reveal",
  "🪙":"income",
  "💸":"foreign aid",
  "⚜️":"tax",
  "🧩":"exchange",
  "💠":"steal",
  "💀":"assassinate",
  "🔱":"coup",
  "🤷‍♂️":"pass"
}
const emojis = {
  Unknown:"🔳",
  surrender:"🏳️",
  reveal:"👐",
  income:"🪙",
  "foreign aid":"💸",
  tax:"⚜️",
  exchange:"🧩",
  steal:"💠",
  assassinate:"💀",
  pass:"🤷‍♂️",

  coup:"🔱",

  Duke:"⚜️",
  Ambassador:"🧩",
  Captain:"💠",
  Assassin:"💀",
  Contessa:"💟"
}

const numberEmojis = [
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣"
]

module.exports = {cardNames, starterDeck, reverse_EmojiLibrary, emojis, numberEmojis}