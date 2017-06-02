const wikiurl = "https://pl.wikiquote.org/w/api.php?action=query&format=json&origin=*&prop=revisions%7Cinfo&"
                + "titles=Przys%C5%82owia+polskie&utf8=1&rvprop=content&rvlimit=1";
var entry = "",
    hiddenEntry = "",
    alphabetString = "AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ",
    alphabetArray = new Array(),
    alphabetGrid = "",
    fails = 0,
    successSound = document.createElement("audio"),
    failSound = document.createElement("audio"),
    i = 0;
successSound.src = "wav/yes.wav";
failSound.src = "wav/no.wav";
String.prototype.revealLetter = function (place, letter) {
    'use strict';
    if (place <= this.length - 1) {
        return this.substr(0, place) + letter + this.substr(place + 1);
    }
};
function entryGenerator () {
    'use strict';
    fetch(wikiurl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var rawQuery = data.query.pages["4974"].revisions["0"]["*"];
        rawQuery = rawQuery.replace(/\*{2}.*|==.*==|\[+.*\]+|{+.*}+|\*\s?|\s*\([^)]*\)/g, "");
        var query2array = rawQuery.split(/\n+/);
        var proverbs = query2array.splice(1, query2array.length);
        proverbs = proverbs.splice(0, proverbs.length-1);
        entry = proverbs[Math.floor(Math.random()*proverbs.length)];
        for (i = 0; i < entry.length; i += 1) {
            if (/\W/.test(entry.charAt(i)) && /[^ĄĆĘŁŃÓŚŹŻąćęłńóśźż]/.test(entry.charAt(i))) {
                hiddenEntry = hiddenEntry + entry.charAt(i);
            } else {
                hiddenEntry = hiddenEntry + "_";
            }
        }
        entry = entry.toUpperCase();
        printEntry();
    });
}
function startUp() {
    'use strict';
    entryGenerator();
    for (i = 0; i < alphabetString.length; i += 1) {
        alphabetArray[i] = alphabetString.charAt(i);
        alphabetGrid = alphabetGrid + "<div id=\"gpl-" + i + "\" class=\"letter button\" onclick=\"letterCheck("
                                    + i + ")\">" + alphabetArray[i] + "</div>";
        // In case of responsivity below won't work properly
        if ((i + 1) % 7 === 0) { alphabetGrid = alphabetGrid + "<div style='clear:both;'></div>"; }
    }
    document.getElementById("alphabet").innerHTML = alphabetGrid;
    document.getElementById("gallows").innerHTML = "<img src=\"img/s" + fails + ".jpg\" alt=\"\">";
}
function printEntry() {
    'use strict';
    document.getElementById("entry").innerHTML = hiddenEntry;
}
function letterCheck(no) {                                                                    /* exported letterCheck */
    'use strict';
    var success = false,
        letter = "gpl-" + no;
    for (i = 0; i < entry.length; i += 1) {
        if (entry.charAt(i) === alphabetString.charAt(no)) {
            hiddenEntry = hiddenEntry.revealLetter(i, alphabetString.charAt(no));
            success = true;
        }
    }
    if (success === true) {
        successSound.play();
        document.getElementById(letter).className += " letter-success";
        printEntry();
    } else {
        failSound.play();
        document.getElementById(letter).className += " letter-fail";
        fails += 1;
        document.getElementById("gallows").innerHTML = "<img src=\"img/s" + fails + ".jpg\" alt=\"\" />";
    }
    document.getElementById(letter).setAttribute("onClick", ";");
    if (entry === hiddenEntry) {
        document.getElementById("alphabet").innerHTML = "<span class=\"winner\">Brawo!</span><br /> <br />"
                                                        + "<span class=\"reset button\" onclick=\"location.reload()\">"
                                                        + "Gram ostatni raz!</span>";
    }
    if (fails >= 9) {
        document.getElementById("alphabet").innerHTML = "<span class=\"looser\">Wisisz!</span><br /><br />"
                                                        + "<span class=\"reset button\" onclick=\"location.reload()\">"
                                                        + "Gram ostatni raz!</span>";
    }
}
document.addEventListener('DOMContentLoaded', startUp);
