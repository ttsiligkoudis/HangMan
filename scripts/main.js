var lives;
var oldLives;
var word;
var guesses = [];
var counter ;

class Language {
    constructor(lang) {
        var __construct = function (){
            if (eval('typeof ' + lang) == 'undefined'){
                lang = 'en';
            }
            return;
        };
        this.getStr = function (str){
            var retStr = eval('eval(lang).' + str);
            if (typeof retStr != 'undefined'){
                return retStr;
            } else {
                return str;
            }
        };
    }
};

var en = {
    Title:'Hangman',
    Alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    QueryURL: './assets/dictionaries/EnglishWords.txt',
    GetLives: function(lives){
        return 'You have ' + lives + ' lives left.';
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
        return 'Απομένουν ' + lives + ' ζωές.';
    },
    Victory: 'Συγχαρητηρία, νίκησες!',
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
var translator = new Language(language);

function Buttons() {
    $('#buttons').empty();
    var myButtons = $('#buttons');
    var ul = $('<ul/>').attr('id', 'alphabet');
    var alphabet = language == 'en' ? en.Alphabet : gr.Alphabet;
    $.each(alphabet, function(index, value){
        var li = $('<li/>').attr('id', 'letter').html(value);
        check(li);
        ul.append(li);
    });
    myButtons.append(ul);
};

function changeImage(){
    $('#hangManLives'+lives).show();
    lives != oldLives ? $('#hangManLives'+oldLives).hide() : '';
};
    
function GetRandomWord(){
    var manualWord = $('#manualWord').is(':checked');
    var wordStr = $('#wordStr').val().trim().toUpperCase();
    if(manualWord){
       word = wordStr;
    }
    else{
        var wordList;
        var queryURL = translator.getStr('QueryURL');
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
        word = wordList[Math.floor(Math.random() * wordList.length)];
    }
    return word;
};

function WordCreate() {
    wordHolder = $('#word');
    wordHolder.empty();
    guesses = [];
    var ul = $('<ul/>').attr('id', 'my-word');
    $.each(word.split(''), function(index, value){
        var li = $('<li/>').addClass('guess');
        li.html('_');
        guesses.push(li);
        ul.append(li);
    });
    wordHolder.append(ul);
};

function InitGame(){
    counter = 0;
    oldLives = lives;
    lives = 7;
    language == 'en' ? $('#lives').text(en.GetLives(lives)) : $('#lives').text(gr.GetLives(lives));
    changeImage();
};

check = function (li) {
    li.click(function(){
        if(lives > 0 && counter < guesses.length){
            var guess = (this.innerHTML);
            $(this).addClass('disabled');
            $(this).off();
            var failedGuess = (word.indexOf(guess) == -1);
            if(!failedGuess){
                for (var i = 0; i < word.length; i++) {
                    if (word[i] == guess) {
                        guesses[i].html(guess);
                        counter ++;
                    } 
                }
                counter == word.length ? $('#lives').text(translator.getStr('Victory')) : '';
            }
            else{
                oldLives = lives;
                lives--;
                language == 'en' ? $('#lives').text(en.GetLives(lives)) : $('#lives').text(gr.GetLives(lives));
                changeImage();
                if(lives == 0){
                    $('#lives').text(translator.getStr('Defeat'));
                    for (var i = 0; i < word.length; i++) {
                            guesses[i].html(word[i]);
                    } 
                }
            }
        }
    });
};

$('#manualWord').click(function(){
    if($('#manualWord').is(':checked')){
        $('#wordStrLabel').text(translator.getStr('ManualWord'));
        $('#wordStr').val(null);
        $('#wordStr').attr('type', 'password');
    }
    else{
        $('#wordStrLabel').text(translator.getStr('StartsWith'));
        $('#wordStr').val(null);
        $('#wordStr').attr('type', 'text');
    }
    
});

$('#English,#Greek').click(function(e){
    if(e.target.id == 'English'){
        $('#English').addClass('activated');
        $('#Greek').removeClass('activated');
        language = 'en';
        translator = new Language(language);
    }
    else if(e.target.id == 'Greek'){
        $('#Greek').addClass('activated');
        $('#English').removeClass('activated');
        language = 'gr';
        translator = new Language(language);
    }
    $('#manualWord').is(':checked') 
        ? $('#wordStrLabel').text(translator.getStr('ManualWord')) 
        : $('#wordStrLabel').text(translator.getStr('StartsWith'));

    $('#manualWordLabel').text(translator.getStr('CheckBox'));
    $('#startGame').text(translator.getStr('Start'));
    $('#English').text(translator.getStr('English'));
    $('#Greek').text(translator.getStr('Greek'));
    $('#language').text(translator.getStr('Language'));
    $('#title').text(translator.getStr('Title'));
});

$('#startGame').click(function(){
    word = GetRandomWord();
    console.log(word);
    if(word != null && word != ''){
        InitGame();
        WordCreate();
        Buttons();
    }
    else{
        $('#manualWord').is(':checked') 
            ? $('#lives').text(translator.getStr('NoWord')) 
            : $('#lives').text(translator.getStr('NoMatch'));
    }
});