const wikiurl = "https://pl.wikiquote.org/w/api.php?action=query&format=json&origin=*&prop=revisions%7Cinfo&"
                + "titles=Przys%C5%82owia+polskie&utf8=1&rvprop=content&rvlimit=1";
var entry = "",
    hiddenEntry = "",
    alphabetArray = "AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ",
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
    var alphabetGrid = "";

    var alphabetArrayALT = new Array();

    for (i = 0; i < alphabetArray.length; i += 1) {
        alphabetArrayALT[i] = "gpl" + i;
        alphabetGrid = alphabetGrid + "<gp-letter id=\"gpl-" + i + "\" class=\"button\" onclick=\"letterCheck("
                                    + i + ")\">" + alphabetArray.charAt(i) + "</gp-letter>";
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
function letterCheck(no) {
    'use strict';
    /* exported letterCheck */
    var success = false,
        letter = "gpl-" + no;
    for (i = 0; i < entry.length; i += 1) {
        if (entry.charAt(i) === alphabetArray.charAt(no)) {
            hiddenEntry = hiddenEntry.revealLetter(i, alphabetArray.charAt(no));
            success = true;
        }
    }
    if (success === true) {
        successSound.play();
        document.getElementById(letter).style.background = "#003300";
        document.getElementById(letter).style.color = "#00C000";
        document.getElementById(letter).style.border = "0.2rem solid #00C000";
        document.getElementById(letter).style.cursor = "default";
        printEntry();
    } else {
        failSound.play();
        document.getElementById(letter).style.background = "#330000";
        document.getElementById(letter).style.color = "#C00000";
        document.getElementById(letter).style.border = "0.2rem solid #C00000";
        document.getElementById(letter).style.cursor = "default";
        document.getElementById(letter).setAttribute("onClick", ";");
        fails += 1;
        document.getElementById("gallows").innerHTML = "<img src=\"img/s" + fails + ".jpg\" alt=\"\" />";
    }
    if (entry === hiddenEntry) {
        document.getElementById("alphabet").innerHTML = "<span class=\"winner\">Brawo!</span><br /> <br />"
                                                        + "<span class=\"reset button\" onclick=\"location.reload()\">"
                                                        + "Gram ostatni raz!</span>";
    }
    if (fails >= 9) {
        document.getElementById("alphabet").innerHTML = "<span class=\"looser\">Wisisz!</span>"
                                                        + "<br /><br /><span class=\"reset button\" "
                                                        + "onclick=\"location.reload()\">"
                                                        + "Gram ostatni raz!</span>";
    }
}
document.addEventListener('DOMContentLoaded', startUp);
