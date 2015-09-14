// 0 = move to average of neighbors
// 1 = move towards furtherst neighbor
// 2 = simple harmonic (springs between neighbors) plus damping
var moveMode = 0;
var Modes = ["neighbors' centroid", "furthest neighbor", "simple harmonic"]
// true = hold on to last selected dot
// false = grab nearest dot
var grabNearest = false;

var flag = 0;
var pNearI;
var pNearJ;
var width = window.innerWidth;
// number of points in y dimension
var height = window.innerHeight;
var ySize = 20;
// number of points in the x dimension
var xSize = Math.floor(ySize * width / height);
// vertical distance between points
var yDist = window.innerHeight / (ySize - 1);
// horizontal distance between points
var xDist = window.innerWidth / (xSize - 1);
var point = new Array(xSize);
var lerpSpeed = 0.05;
var movSpeed = 10;
var rstrCoef = 0.1;
var dampCoef = rstrCoef * 1.2;
// Point 2D array
for (var i = 0; i < xSize; i++) {
  point[i] = new Array(ySize);
  for (var j = 0; j < ySize; j++) {
    point[i][j] = new Point(i, j, i * xDist, j * yDist);
  }
}

/*movement button clicked*/
function changeMode(){
    moveMode = (moveMode + 1)%3
    document.getElementById("modeButton").innerHTML = Modes[moveMode];
}

/* Point OBJECT */
function Point(i, j, newX, newY) {
  var i_idx = i;
  var j_idx = j;
  var x = newX;
  var y = newY;
  var nextX = x;
  var nextY = y;
  var radius = 2;
  var targetColour = "blue";
  // velocity, used for some movement patterns
  var velX = 0;
  var velY = 0;

  /* public methods */
  this.draw = draw;

  function draw() {
    x = nextX;
    y = nextY;
    g.beginPath();
    g.fillStyle = targetColour;
    g.arc(x, y, radius, 0, Math.PI * 2);
    g.fill();
    g.closePath();
  }

  function lerp(oldP, newP) { return (oldP + (newP - oldP) * lerpSpeed); }
  function max(oldP, newP) {
    travel = Math.min(Math.abs(newP - oldP), movSpeed);
    return (oldP + ((newP > oldP) ? travel : (-1) * travel));
  }



  this.setX = setX;

  function setX(newX) { x = newX; }

  this.getX = getX;

  function getX() { return x; }

  this.setY = setY;

  function setY(newY) { y = newY; }

  this.getY = getY;

  function getY() { return y; }

  this.getRadius = getRadius;

  function getRadius() { return radius; }

  this.move = move;

  function move() {
    isSel = ((i_idx == pNearI) && (j_idx == pNearJ) && (flag == 1));
    if ((((i_idx == 0 || i_idx == (xSize - 1)) || j_idx == 0) ||
         j_idx == (ySize - 1)) ||
        isSel) {
      nextX = x;
      nextY = y;
      return;
    }
    // coordinates of neighbor positions (left right down up)
    xs = [
      point[(i_idx - 1)][j_idx]
          .getX(),
      point[(i_idx + 1)][j_idx].getX(),
      point[i_idx][(j_idx - 1)].getX(),
      point[i_idx][(j_idx + 1)].getX()
    ];
    ys = [
      point[(i_idx - 1)][j_idx]
          .getY(),
      point[(i_idx + 1)][j_idx].getY(),
      point[i_idx][(j_idx - 1)].getY(),
      point[i_idx][(j_idx + 1)].getY()
    ];

    switch (moveMode) {
      case 2:
        forceX = 0;
        forceY = 0;
        for (i = 0; i < 4; i++) {
          forceX += (xs[i] - x);
          forceY += (ys[i] - y);
        }
        dampX = (-1) * dampCoef * velX;
        dampY = (-1) * dampCoef * velY;
        velX += forceX * rstrCoef + dampX;
        velY += forceY * rstrCoef + dampY;
        nextX = x + velX;
        nextY = y + velY;
        // nextX = max(x,finX);
        // nextY = max(y,finY);
        // nextX = finX;
        // nextY = finY;
        break;
      case 1:
        // distance squared from each neighbor
        dists = new Array(4);
        for (i = 0; i < 4; i++) {
          dists[i] = Math.pow(Math.abs(xs[i] - x), 2) +
                     Math.pow(Math.abs(ys[i] - y), 2);
        }
        cDist = 0;
        finX = x;
        finY = y;
        for (i = 0; i < 4; i++) {
          if (dists[i] > cDist) {
            cDist = dists[i];
            finX = xs[i];
            finY = ys[i];
          }
        }
        nextX = lerp(x, finX);
        nextY = lerp(y, finY);
        // nextX = max(x,finX);
        // nextY = max(y,finY);
        // nextX = finX;
        // nextY = finY;
        break;
      default:
        finX = (point[(i_idx - 1)][j_idx].getX() +
                point[(i_idx + 1)][j_idx].getX() +
                point[i_idx][(j_idx - 1)].getX() +
                point[i_idx][(j_idx + 1)].getX()) /
               4;
        finY = (point[(i_idx - 1)][j_idx].getY() +
                point[(i_idx + 1)][j_idx].getY() +
                point[i_idx][(j_idx - 1)].getY() +
                point[i_idx][(j_idx + 1)].getY()) /
               4;
        // nextX = lerp(x,finX);
        // nextY = lerp(y,finY);
        // nextX = max(x,finX);
        // nextY = max(y,finY);
        nextX = finX;
        nextY = finY;
    }
  }
}



/* MAIN DEMO */
function playDemo() {
  g.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas at start.
  g.canvas.width = window.innerWidth;
  g.canvas.height = window.innerHeight;
  // player.draw();

  for (var i = 0; i < xSize; i++) {
    for (var j = 0; j < ySize; j++) {
      point[i][j].move();
    }
    for (var j = 0; j < ySize; j++) {
      point[i][j].draw();
    }
  }
}

var mX;
var mY;
document.addEventListener("mousedown", function(e) {
  flag = 1;
  if (e.pageX || e.pageY) {
    mX = e.pageX;
    mY = e.pageY;
  } else {
    mX = e.clientX + document.body.scrollLeft +
         document.documentElement.scrollLeft;
    mY = e.clientY + document.body.scrollTop +
         document.documentElement.scrollTop;
  }
  mX -= canvas.offsetLeft;
  mY -= canvas.offsetTop;
  pNearI = Math.round(mX / width * xSize);
  pNearJ = Math.round(mY / height * ySize);
  if (((pNearI == 0 || pNearI == (xSize - 1)) || pNearJ == 0) ||
      pNearJ == (ySize - 1)) {
    return;
  }
  point[pNearI][pNearJ].setX(mX);
  point[pNearI][pNearJ].setY(mY);
}, false);
document.addEventListener("mouseup", function(e) { flag = 0; }, false);
document.addEventListener("mousemove", function(e) {
  if (flag === 1) {
    if (e.pageX || e.pageY) {
      mX = e.pageX;
      mY = e.pageY;
    } else {
      mX = e.clientX + document.body.scrollLeft +
           document.documentElement.scrollLeft;
      mY = e.clientY + document.body.scrollTop +
           document.documentElement.scrollTop;
    }
    mX -= canvas.offsetLeft;
    mY -= canvas.offsetTop;
    if (grabNearest) {
      pNearI = Math.round(mX / width * xSize);
      pNearJ = Math.round(mY / height * ySize);
    }
    if (((pNearI == 0 || pNearI == (xSize - 1)) || pNearJ == 0) ||
        pNearJ == (ySize - 1)) {
      return;
    }
    point[pNearI][pNearJ].setX(mX);
    point[pNearI][pNearJ].setY(mY);
  }

}, false);

/* Get the canvas id */
var canvas = document.getElementById("simpleCanvas");


/* Assign a graphics context to the canvas, so that we can draw on it */
var g = canvas.getContext("2d");

/* Do the function, call every 30 milliseconds*/
var theInterval = setInterval(playDemo, 20);
