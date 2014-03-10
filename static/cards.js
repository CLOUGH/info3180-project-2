var cards_selected= new Array();
var cards_selected_index= new Array();
var found_matches = new Array();

var deck_size = 16;
var max_card_flips = 2;
var card_flips =0;
var MAX_FLIP = 26;
var deck;
var fname;
var lname;


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
var showCards = function(cardJSON,deck_index) {
  txt = cardJSON.rank /*+ cardJSON.suite*/;    

  card = document.createElement("div");
  card.id = deck_index;
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

//TODO: should change name to generate-random deck
var generateRandDeck = function(deck){

    var card_picked = new Array();
    var new_deck =  new Array();

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
      //create a new array with the cards
      new_deck.push(deck[card_picked[random_pick]]);
      //showCards(deck[card_picked[random_pick]]);
      card_picked.splice(random_pick,1);
      
    };

    return new_deck;
}

function showDeck(deck){
  for(var i=0;i<deck.length;i++){
      showCards(deck[i],i);
  }
}
function memory_game (selected_card) {

  if(card_flips <= MAX_FLIP-1)
  {
    // if the card was not seleceted before then add it to selected list
    if($(selected_card.lastElementChild).hasClass('hidden')== false)
    {
      var match_index;
      flip_card(selected_card);
      //count the max number of flip
      card_flips += 1;

      //from the selected cards  check if the card matched
      if((match_index =isMatched(selected_card, cards_selected))!=-1)
      {
        //push matched cards to the found_match array and remove the selected card from the selected card_array
        found_matches.push(cards_selected[match_index].id);
        found_matches.push(selected_card.id)

        cards_selected.splice(match_index,1);
        cards_selected_index.splice(match_index,1);

        //play matched audio   
        $("#matched-audio")[0].load();
        $("#matched-audio")[0].play();
      }
      else
      {
        //if the max amount of card flips have been reached then hide all the unmatched selected cards
        if(cards_selected.length>=max_card_flips)
        {
          cards_selected_length = cards_selected.length;
          for (var i=0; i<cards_selected_length; i++)
          {
            flip_card(cards_selected[0]);
            cards_selected.splice(0,1);
            cards_selected_index.splice(match_index,1);        
          }
        }

        cards_selected.push(selected_card);
        var test = selected_card.id;
        cards_selected_index.push(test);
      }   
    } 

    if(found_matches.length==deck_size)
    {
      $("#victory-song")[0].load();
      $("#victory-song")[0].play();
      $('#win-modal').modal('setting', 'closable', false).modal('show');
      
    }
  }
  else
  {
    $("#max-flip").text(MAX_FLIP);
    $('#lost-modal').modal('setting', 'closable', false).modal('show');
  }

}
function updatePlayerInfo()
{
  //update number of flips
  $("#card-flips").text(card_flips);
  $("#max-flips").text(MAX_FLIP);

  $('#player_name').text(fname+" "+lname);
}
function playAgain()
{
  localStorage.removeItem('player_fname');
  localStorage.removeItem('player_lname');          
  localStorage.removeItem('card-deck');
  localStorage.removeItem('found-cards');
  localStorage.removeItem('card-flips');
  localStorage.removeItem('selected-cards');
  $('#card-box').empty();
  
  found_matches = new Array();  
  cards_selected_index = new Array();
  cards_selected = new Array();
  deck = generateRandDeck(createDeck());
  showDeck(deck);       
  card_flips = 0;       
  updatePlayerInfo();

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

function turnFlipedCards(found_cards){
  for(var i=0;i<found_cards.length;i++)
  {
    var card_id = found_cards[i];
    var card = document.getElementById(card_id);

    flip_card(card);
  }
}
function flip_card (selected_card) {
  $(selected_card.lastElementChild).transition('horizontal flip', '500ms');
  $("#card-flick")[0].load();
  $("#card-flick")[0].play();
}

