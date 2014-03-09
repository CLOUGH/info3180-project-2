var cards_seleceted= new Array();
var found_matches = new Array();

var deck_size = 16;
var max_card_flips = 2;
var card_flips =0;
var MAX_FLIP = 26;

var createDeck = function() {
// based on code from http://www.brainjar.com/js/cards/default2.asp
  var ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9",
                        "10", "J", "Q", "K"];
  var suits = ["C", "D", "H", "S"];
  var j, k, index=0;
  var pack_size;

  // Set array of cards.
  // total number of cards
  pack_size = ranks.length * suits.length;
  var cards = [];
  

  // Fill the array with 'n' packs of cards.
  while (index < pack_size){
    for (j = 0; j < suits.length; j++){
       for (k = 0; k < ranks.length; k++){
          //console.log("k:",k,"index:",index);
          cards[index] = {rank:ranks[k], suite:suits[j]};
          index++;
          }
       }
    }
  //console.log(cards.length);
  return cards;
}
var showCards = function(cardJSON) {
  txt = cardJSON.rank /*+ cardJSON.suite*/;    

  card = document.createElement("div");
  var card_content = document.createElement('p');
  var card_cover = document.createElement('div');

  card_cover.className = "cover";
  card_content.textContent = txt;
  card.appendChild(card_content);
  card.appendChild(card_cover);
  card.onclick = function() { 

    memory_game(this);
    //When a card  is clicked update player info
    updatePlayerInfo();
  };

  switch(cardJSON.suite)
  {
    case 'C':
      card.className = "card suitclubs";
      break;
    case 'S':
      card.className = "card suitspades";
      break;
    case 'D':
      card.className = "card suitdiamonds";
      break;
    case 'H':
       card.className = "card suithearts";
      break;
  }
  //console.log(card);
  document.querySelector(".sideBox").appendChild(card);
}

var showDeck = function(deck){

    var card_picked = new Array();

    //generate random deck picks
    var random_card_count = 0;
    while (random_card_count <deck_size) {
      var random_pick = Math.floor((Math.random()*52));

      if(card_picked.indexOf(random_pick)!= 0){
        card_picked[random_card_count]= random_pick;
        card_picked[random_card_count+1] = random_pick; 

        random_card_count += 2;
      }
      else
        continue;
    };

    for (var i = 0; i <deck_size; i++) {
      var random_pick = Math.floor((Math.random()*card_picked.length));
      showCards(deck[card_picked[random_pick]]);
      card_picked.splice(random_pick,1);
      
    };
    /*for (var i = 0; i < deck.length; ++i) {
      showCards(deck[i]);
    }*/
}
function memory_game (selected_card) {

  if(card_flips <= MAX_FLIP-1)
  {
    // if the card was not seleceted before then add it to selected list
    if(selected_card.lastElementChild.hidden == false)
    {
      var match_index;
      flip_card(selected_card);
      //count the max number of flip
      card_flips += 1;

      //from the selected cards  check if the card matched
      if((match_index =isMatched(selected_card, cards_seleceted))!=-1)
      {
        //push matched cards to the found_match array and remove the selected card from the selected card_array
        found_matches.push(cards_seleceted[match_index]);
        found_matches.push(selected_card)

        cards_seleceted.splice(match_index,1);

        //play matched audio   
        $("#matched-audio")[0].load();
        $("#matched-audio")[0].play();
      }
      else
      {
        //if the max amount of card flips have been reached then hide all the unmatched selected cards
        if(cards_seleceted.length>=max_card_flips)
        {
          var cards_selected_length = cards_seleceted.length;
          for (var i=0; i<cards_selected_length; i++)
          {
            flip_card(cards_seleceted[0]);
            cards_seleceted.splice(0,1);        
          }
        }

        cards_seleceted.push(selected_card);
      }   
    } 

    if(found_matches.length==deck_size)
    {
      alert("You have won!");
    }
  }
  else
  {
    alert("Sorry you have reached the max flips of "+MAX_FLIP+"!");
  }

}
function updatePlayerInfo()
{
  //update number of flips
  $("#card-flips").text(card_flips);
  $("#max-flips").text(MAX_FLIP);
  localStorage.setItem('card-flips', JSON.stringify(card_flips));

  //update player name
  var fname = localStorage.getItem("player_fname")
  var lname = localStorage.getItem("player_lname")
  $('#player_name').text(fname+" "+lname);
}
function savePlayerInfo()
{

}

function  isMatched(needle, haystack)
{
  for(var i=0; i<haystack.length; i++){
    if(haystack[i].firstChild.innerHTML==needle.firstChild.innerHTML &&  haystack[i].className==needle.className)
    {
      return i;
    }
  }
  return -1;
}


function flip_card (selected_card) {
  $(selected_card.lastElementChild).transition('horizontal flip', '500ms');
}
var deck = createDeck();
showDeck(deck);