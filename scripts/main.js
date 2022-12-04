var lives;
var oldLives;
var word;
var guesses = [];
var counter ;  
var locale = "en-GB";

var englishAlphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

var greekAlphabet = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ',
'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ',
'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'];

var alphabet = [];

function Buttons() {
    $("#buttons").empty();
    var myButtons = $("#buttons");
    var ul = $('<ul/>').attr('id', 'alphabet');
    if(locale == "en-GB"){
        alphabet = englishAlphabet;
    }
    else{
        alphabet = greekAlphabet;
    }
    $.each(alphabet, function(index, value){
        var li = $('<li/>').attr('id', 'letter').html(value);
        check(li);
        ul.append(li);
    });
    myButtons.append(ul);
};

function changeImage(){
    $("#hangManLives"+lives).show();
    if(lives != oldLives){
        $("#hangManLives"+oldLives).hide();
    }
};
    
function GetRandomWord(){
    var manualWord = $("#manualWord").is(":checked");
    var wordStr = $("#wordStr").val().trim().toUpperCase();
    if(manualWord){
       word = wordStr;
    }
    else{
        var wordList;
        var queryURL;
        if(locale == "en-GB"){
            queryURL = "./assets/dictionaries/EnglishWords.txt"
        }
        else{
            queryURL = "./assets/dictionaries/GreekWords.txt"
        }
        $.ajax({
            url: queryURL,
            async: false,
            success: function (data) {
                wordList = data.split(" ");
            }
        });
        if(wordStr != null && wordStr != ""){
            wordList = wordList.filter(name => name.startsWith(wordStr))
        }
        word = wordList[Math.floor(Math.random() * wordList.length)];
    }
    return word;
};

function WordCreate() {
    wordHolder = $('#word');
    wordHolder.empty();
    guesses = [];
    var ul = $("<ul/>").attr("id", "my-word");
    $.each(word.split(''), function(index, value){
        var li = $("<li/>").addClass("guess");
        if(index == 0){
            li.html(word[index]);
        }else{
            li.html("_")
        }
        guesses.push(li);
        ul.append(li);
    });
    wordHolder.append(ul);
};

function InitGame(){
    counter = 1;
    oldLives = lives
    lives = 7;
    if(locale == "en-GB"){
        $("#lives").text("You have " + lives + " lives left.");
    }
    else{
        $("#lives").text("Απομένουν " + lives + " ζωές.");
    }
    changeImage()
};

check = function (li) {
    li.click(function(){
        if(lives > 0 && counter < guesses.length){
            var guess = (this.innerHTML);
            $(this).addClass("disabled");
            $(this).off();
            var failedGuess = (word.indexOf(guess) == -1);
            if(!failedGuess){
                for (var i = 0; i < word.length; i++) {
                    if (word[i] == guess) {
                        guesses[i].html(guess);
                        counter ++;
                    } 
                }
                debugger;
                if(counter == word.length){
                    if(locale == "en-GB"){
                        $("#lives").text("Congratulations, You Won!");
                    }
                    else{
                        $("#lives").text("Συγχαρητία, νίκησες!");
                    }
                }
            }
            else{
                oldLives = lives;
                lives--;
                if(locale == "en-GB"){
                    $("#lives").text("You have " + lives + " lives left.");
                }
                else{
                    $("#lives").text("Απομένουν " + lives + " ζωές.");
                }
                changeImage()
                if(lives == 0){
                    if(locale == "en-GB"){
                        $("#lives").text("Game Over.");
                    }
                    else{
                        $("#lives").text("Τέλος Παιχνιδιού.");
                    }
                }
                    
            }
        }
    });
};

$("#manualWord").click(function(){
    if($("#manualWord").is(":checked")){
        if(locale == "en-GB"){
            $("#wordStrLabel").text("Enter your word");
        }
        else{
            $("#wordStrLabel").text("Πληκτρολογίστε την λέξη σας");
        }
        $("#wordStr").val(null);
        $("#wordStr").attr("type", "password");
    }
    else{
        if(locale == "en-GB"){
            $("#wordStrLabel").text("Word will start from");
        }
        else{
            $("#wordStrLabel").text("Η λέξη θα ξεκινάει από");
        }
        $("#wordStr").val(null);
        $("#wordStr").attr("type", "text");
    }
    
});

$("#English,#Greek").click(function(e){
    if(e.target.id == "English"){
        $("#English").addClass("activated");
        $("#Greek").removeClass("activated");
        locale = "en-GB";
    }
    else if(e.target.id == "Greek"){
        $("#Greek").addClass("activated");
        $("#English").removeClass("activated");
        locale = "el-GR";
    }
    if($("#manualWord").is(":checked")){
        if(locale == "en-GB"){
            $("#wordStrLabel").text("Enter your word");
        }
        else{
            $("#wordStrLabel").text("Πληκτρολογίστε την λέξη σας");
        }
    }
    else{
        if(locale == "en-GB"){
            $("#wordStrLabel").text("Word will start from");
        }
        else{
            $("#wordStrLabel").text("Η λέξη θα ξεκινάει από");
        }
    }
    if(locale == "en-GB"){
        $("#manualWordLabel").text("Check this to fill your own word");
        $("#startGame").text("Start Game");
        $("#English").text("English");
        $("#Greek").text("Greek");
        $("#language").text("Language");
        $("#title").text("HangMan");
    }
    else{
        $("#manualWordLabel").text("Κάνε κλικ εδώ για να βάλεις την δική σου λέξη");
        $("#startGame").text("Έναρξη παιχνιδιού");
        $("#English").text("Αγγλικά");
        $("#Greek").text("Ελληνικά");
        $("#language").text("Γλώσσα");
        $("#title").text("Κρεμάλα");
    }
})

$("#startGame").click(function(){
    if(locale == "en-GB"){
        $("#startGame").text("Reset Game");
    }
    else{
        $("#startGame").text("Επανεκκίνηση παιχνιδιού");
    }
    word = GetRandomWord();
    console.log(word);
    if(word != null && word != ""){
        InitGame();
        WordCreate();
        Buttons();
    }
    else{
        if($("#manualWord").is(":checked")){
            if(locale == "en-GB"){
                $("#lives").text("No word was given.");
            }
            else{
                $("#lives").text("Δεν δόθηκε λέξη.");
            }
        }
        else{
            if(locale == "en-GB"){
                $("#lives").text("Couldn't find a word.");
            }
            else{
                $("#lives").text("Δεν βρέθηκε λέξη.");
            }
        }
    }
});