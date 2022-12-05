var lives;
var oldLives;
var guesses = [];
var counter ;

class Word{
    #word;
    
    set #wordFunction(word){
        this.#word = word;
    }
    get #wordFunction(){
        return this.#word;
    }

    wordLength(){
        return this.#wordFunction.length;
    }
    
    GetRandomWord(){
        var manualWord = $('#manualWord').is(':checked');
        var wordStr = $('#wordStr').val().trim().toUpperCase();
        if(manualWord){
            this.#wordFunction = wordStr
        }
        else{
            var wordList;
            var queryURL = terminology.QueryURL;
            $.ajax({
                url: queryURL,
                async: false,
                success: function (data) {
                    wordList = data.split(' ');
                }
            });
            if(wordStr != null && wordStr != ''){
                wordList = wordList.filter(name => name.startsWith(wordStr));
            }
            this.#wordFunction = wordList[Math.floor(Math.random() * wordList.length)];
        }
    }
    
    WordCreate() {
        var wordHolder = $('#word');
        wordHolder.empty();
        guesses = [];
        var ul = $('<ul/>').attr('id', 'my-word');
        $.each(this.#wordFunction.split(''), function(index, value){
            var li = $('<li/>').addClass('guess');
            li.html('_');
            guesses.push(li);
            ul.append(li);
        });
        wordHolder.append(ul);
    }

    isNullOrEmpty(){
        return this.#wordFunction == null || this.#wordFunction == "";
    }

    check(guess){
        for (var i = 0; i < this.wordLength(); i++) {
            if (this.#wordFunction[i] == guess) {
                guesses[i].html(guess);
                counter ++;
            } 
        }
    }
    
    GetIndex(guess){
        return this.#wordFunction.indexOf(guess)
    }

    showWord(){
        for (var i = 0; i < this.wordLength(); i++) {
            guesses[i].html(this.#wordFunction[i]);
        }
    }
}

// var word = new Word();

var en = {
    Title:'Hangman',
    Alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    QueryURL: './assets/dictionaries/EnglishWords.txt',
    GetLives: function(lives){
        return `You have ${lives} lives left.`;
    },
    Victory: 'Congratulations, You Won!',
    Defeat: 'Game Over.',
    ManualWord: 'Enter your word',
    StartsWith: 'Word will start from',
    CheckBox: 'Check this to fill your own word',
    Start: 'Start Game',
    English: 'English',
    Greek: 'Greek',
    Language: 'Language',
    NoWord: 'No word was given.',
    NoMatch: 'Couldn\'t find a word.'
};

var gr = {
    Title:'Κρεμάλα',
    Alphabet: ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ',
    'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ',
    'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'],
    QueryURL: './assets/dictionaries/GreekWords.txt',
    GetLives: function(lives){
        return `Απομένουν ${lives} ζωές.`;
    },
    Victory: 'Συγχαρητήρια, νίκησες!',
    Defeat: 'Τέλος Παιχνιδιού.',
    ManualWord: 'Πληκτρολογίστε την λέξη σας',
    StartsWith: 'Η λέξη θα ξεκινάει από',
    CheckBox: 'Κάνε κλικ εδώ για να βάλεις την δική σου λέξη',
    Start: 'Έναρξη παιχνιδιού',
    English: 'Αγγλικά',
    Greek: 'Ελληνικά',
    Language: 'Γλώσσα',
    NoWord: 'Δεν δόθηκε λέξη.',
    NoMatch: 'Δεν βρέθηκε λέξη.'
};

var language = 'en';
var terminology = en;

function GetTerminology(lng){
    language = lng;
    terminology = language == 'gr' ? gr : en;
}

function Buttons(word) {
    $('#buttons').empty();
    var myButtons = $('#buttons');
    var ul = $('<ul/>').attr('id', 'alphabet');
    var alphabet = language == 'en' ? en.Alphabet : gr.Alphabet;
    $.each(alphabet, function(index, value){
        var li = $('<li/>').attr('id', 'letter').html(value);
        check(li,word);
        ul.append(li);
    });
    myButtons.append(ul);
};

function changeImage(){
    $('#hangManLives'+lives).show();
    lives != oldLives ? $('#hangManLives'+oldLives).hide() : '';
};

function InitGame(){
    counter = 0;
    oldLives = lives;
    lives = 7;
    $('#lives').text(terminology.GetLives(lives))
    changeImage();
};

check = function (li,word) {
    li.click(function(){
        if(lives > 0 && counter < guesses.length){
            var guess = (this.innerHTML);
            $(this).addClass('disabled');
            $(this).off();
            var failedGuess = (word.GetIndex(guess) == -1);
            if(!failedGuess){
                word.check(guess);
                counter == word.wordLength() ? $('#lives').text(terminology.Victory) : '';
            }
            else{
                oldLives = lives;
                lives--;
                $('#lives').text(terminology.GetLives(lives));
                changeImage();
                if(lives == 0){
                    $('#lives').text(terminology.Defeat);
                    word.showWord();
                }
            }
        }
    });
};

$('#manualWord').click(function(){
    if($('#manualWord').is(':checked')){
        $('#wordStrLabel').text(terminology.ManualWord);
        $('#wordStr').val(null);
        $('#wordStr').attr('type', 'password');
    }
    else{
        $('#wordStrLabel').text(terminology.StartsWith);
        $('#wordStr').val(null);
        $('#wordStr').attr('type', 'text');
    }
    
});

$('#English,#Greek').click(function(e){
    if(e.target.id == 'English'){
        $('#English').addClass('activated');
        $('#Greek').removeClass('activated');
        GetTerminology('en');
    }
    else if(e.target.id == 'Greek'){
        $('#Greek').addClass('activated');
        $('#English').removeClass('activated');
        GetTerminology('gr');
    }
    $('#manualWord').is(':checked') 
        ? $('#wordStrLabel').text(terminology.ManualWord) 
        : $('#wordStrLabel').text(terminology.StartsWith);

    $('#manualWordLabel').text(terminology.CheckBox);
    $('#startGame').text(terminology.Start);
    $('#English').text(terminology.English);
    $('#Greek').text(terminology.Greek);
    $('#language').text(terminology.Language);
    $('#title').text(terminology.Title);
});

$('#startGame').click(function(){
    var word = new Word();
    word.GetRandomWord();
    if(word.isNullOrEmpty()){
        $('#manualWord').is(':checked') 
        ? $('#lives').text(terminology.NoWord) 
        : $('#lives').text(terminology.NoMatch);
    }
    else{
        InitGame();
        word.WordCreate();
        Buttons(word);
    }
});