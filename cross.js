cross = {};

cross.board = document.getElementById("board");
cross.words = document.getElementById("words");
cross.blank = "#";
cross.start_char_code = "a".charCodeAt(0);

cross.random = function(start, end) {
  return start+Math.floor(Math.random()*((end-start)+1))
}

cross.new_grid = function() {
  var width = 20;
  var height = 10;

  // Erase board
  cross.board.innerHTML = "";

  // find words
  var words = [
    "startup", "code", "work",
    "jobs", "ask", "show",
    "learn", "make", "post",
    "hack", "vote", "karma"
  ];

  // var words = [
  //   "one", "two", "three",
  //   "four", "five", "six",
  //   "seven", "eight", "nine",
  //   "ten", "eleven", "twelve"
  // ];

  var words_unsorted = [];
  words.forEach(function(word) {
    words_unsorted.push(word);
  });

  words.sort(function(a, b) {
    return b.length - a.length || b.localeCompare(a);
  });

  // Create grid
  cross.grid = [];

  for (var y=0; y<height; y++) {
    cross.grid[y] = [];

    for (var x=0; x<width; x++) {
      var new_div = document.createElement("div");
      new_div.classList.add("letter");
      new_div.dataset.x = x;
      new_div.dataset.y = y;
      new_div.innerHTML = cross.blank;
      new_div.addEventListener("mouseenter", function(e) {
        if (e.buttons == 1) {
          var source = e.target || e.srcElement;
          source.classList.toggle("hover");
        }
      });
      new_div.addEventListener("mousedown", function(e) {
        var source = e.target || e.srcElement;
        source.classList.toggle("hover");
      })

      cross.grid[y][x] = new_div;
      cross.board.appendChild(new_div);
    }
  }


  // add words to words element
  words_unsorted.forEach(function(word) {
    var new_word = document.createElement("div");
    new_word.classList.add("word");
    new_word.innerHTML = word;
    new_word.addEventListener("click", function(e) {
      var source = e.target || e.srcElement;

      source.classList.add("found");
    });

    cross.words.appendChild(new_word);
  });

  // populate grid with words and letters
  // 3 words going down
  // 3 words going up
  // 3 words going left
  // 3 words going right
  for (var i=0; i<words.length; i++) {
    var word = words[i];
    var word_length = word.length;

    if (i<3) {
      // UP
      var placed = false;

      while (!placed) {
        var min_y = word_length-1;
        var start_x = cross.random(0, 9);
        var start_y = cross.random(min_y, 9);

        for (var l=0; l<word.length; l++) {
          if (cross.grid[start_y-l][start_x].innerHTML == cross.blank) {
            cross.grid[start_y-l][start_x].innerHTML = word[l];
          } else {
            break;
          }
        }

        placed = true;
      }
    } else if (i>=3 && i<6) {
      // DOWN
      var placed = false;

      while (!placed) {
        var max_y = word_length-1;
        var start_x = cross.random(0, 9);
        var start_y = cross.random(0, 9-max_y);

        for (var l=0; l<word.length; l++) {
          var good = true;

          if (cross.grid[start_y+l][start_x].innerHTML == cross.blank) {
            cross.grid[start_y+l][start_x].innerHTML = word[l];
          } else {
            good = false;
            break;
          }
        }

        if (good) {
          placed = true;
        }
      }
    } else if (i>=6 && i<9) {
      // LEFT
      var placed = false;

      while (!placed) {
        var min_x = word_length-1;
        var start_x = cross.random(min_x, 9);
        var start_y = cross.random(0, 9);

        var old = [];

        for (var l=0; l<word.length; l++) {
          old.push(cross.grid[start_y][start_x-l].innerHTML);
        }

        for (var l=0; l<word.length; l++) {
          var good = true;

          var is_zero = cross.grid[start_y][start_x-l].innerHTML == cross.blank;
          var is_letter = cross.grid[start_y][start_x-l].innerHTML == word[l];

          if (is_zero || is_letter) {
            // cross.grid[start_y][start_x-l].innerHTML = word[l];
          } else {
            good = false;
            break;
          }
        }

        if (good) {
          for (var l=0; l<word.length; l++) {
            cross.grid[start_y][start_x-l].innerHTML = word[l];
          }

          placed = true;
        } else {
          for (var l=0; l<old.length; l++) {
            cross.grid[start_y][start_x-l].innerHTML = old[l];
          }
        }
      }

    } else if (i>=9 && i<12) {
      // RIGHT
      var placed = false;

      while (!placed) {
        var max_x = word_length-1;
        var start_x = cross.random(0, 9-max_x);
        var start_y = cross.random(0, 9);

        var old = [];

        for (var l=0; l<word.length; l++) {
          old.push(cross.grid[start_y][start_x+l].innerHTML);
        }

        for (var l=0; l<word.length; l++) {
          var good = true;

          var is_zero = cross.grid[start_y][start_x+l].innerHTML == cross.blank;
          var is_letter = cross.grid[start_y][start_x+l].innerHTML == word[l];

          if (is_zero || is_letter) {
            // cross.grid[start_y][start_x-l].innerHTML = word[l];
          } else {
            good = false;
            break;
          }
        }

        if (good) {
          for (var l=0; l<word.length; l++) {
            cross.grid[start_y][start_x+l].innerHTML = word[l];
          }

          placed = true;
        } else {
          for (var l=0; l<old.length; l++) {
            cross.grid[start_y][start_x+l].innerHTML = old[l];
          }
        }
      }
    }
  }

  // turn blanks into random letters
  for (var y=0; y<height; y++) {
    for (var x=0; x<width; x++) {
      if (cross.grid[y][x].innerHTML == cross.blank) {
        var random_code = cross.random(cross.start_char_code, cross.start_char_code+25);
        var random_letter = String.fromCharCode(random_code);
        console.log(random_letter);
        cross.grid[y][x].innerHTML = random_letter;
      }
    }
  }
}

cross.onload = function() {
  cross.new_grid();

  // hn.top(0, 10);
}

window.onload = cross.onload;
