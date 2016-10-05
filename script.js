$(document).ready(function () {
  var canvas = document.getElementById('canvas')
  var context = canvas.getContext('2d')
  var raf
  var moving = false

  var ball = {
    aim: {
      centerX: 50,
      centerY: 550,
      noOfSlices: 44,
      sliceIndex: 22,
      speed: 33,
      circX: function () {
        return this.centerX + this.speed * Math.cos(Math.PI / 2 / this.noOfSlices * this.sliceIndex)
      },
      circY: function () {
        return this.centerY - this.speed * Math.sin(Math.PI / 2 / this.noOfSlices * this.sliceIndex)
      },
      draw: function () {
        context.beginPath()
        context.moveTo(this.centerX, this.centerY)
        context.lineTo(this.circX(), this.circY())
        context.stroke()
        context.closePath()
      }
    },
    x: function () {
      return this.aim.circX()
    },
    y: function () {
      return this.aim.circY()
    },
    vx: function () {
      return (this.aim.circX() - this.aim.centerX)
    },
    vy: function () {
      return (this.aim.circY() - this.aim.centerY)
    },
    radius: 5,
    color: 'rgb(49, 50, 162)',
    draw: function () {
      context.beginPath()
      context.arc(x, y, this.radius, 0, Math.PI * 2)
      context.closePath()
      context.fillStyle = this.color
      context.fill()
    }
  }

  var target = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 5,
    width: 10,
    height: 200,
    bands: [0, 0.12, 0.24, 0.36, 0.47, 0.53, 0.64, 0.76, 0.88, 1],
    // bandPixels: [50, 86, 122, 158, 182, 212, 242, 278, 314, 350],
    bandPixels: [],
    scores: [1, 2, 3, 5, 10, 5, 3, 2, 1],
    draw: function () {
      for (var i = 0; i < this.bandPixels.length; i++) {
        if (i % 2 === 0) {
          context.fillStyle = 'rgb(184, 34, 34)'
        } else {
          context.fillStyle = 'rgb(20, 86, 152)'
        }
        context.fillRect(this.x, this.bandPixels[i], this.width, this.bandPixels[i + 1] - this.bandPixels[i])
      }
    }
  }

  target.y = Math.floor((Math.random() * 200)) + 200
  target.x = Math.floor((Math.random() * 100)) + 550

  function nextRound () {
    if (gameRound.hit) {
      gameRound.totalScore += gameRound.currentScore
    }
    gameRound.attempts -= 1
    target.y = Math.floor((Math.random() * 200)) + 50
  }

  for (var i = 0; i < target.bands.length; i++) {
    target.bandPixels.push(target.bands[i] * target.height + target.y)
  }

  function boardHit () {
    if (x > target.x) {
      for (var i = 0; i < 10; i++) {
        var lowerBand = target.height * target.bands[i]
        var upperBand = target.height * target.bands[i + 1]
        if (y > target.y + lowerBand && y <= target.y + upperBand) {
          gameRound.currentScore = target.scores[i]
          gameRound.hit = true // variable to prevent more than one function call
          moving = false
          getBallVal()
          nextRound()
        }
      }
    }
  }

  function boardReset () {

  }

  var gameRound = {
    totalScore: 0,
    attempts: 5,
    currentScore: 0,
    hit: false,
  }

  ball.draw()
  target.draw()
  ball.aim.draw()

  var x
  var y
  var vx
  var vy

  function getBallVal () {
    x = ball.x()
    y = ball.y()
    vx = ball.vx()
    vy = ball.vy()
  }

  getBallVal()

  function draw () {
    context.clearRect(0, 0, canvas.width, canvas.height)
    ball.draw()
    target.draw()
    ball.aim.draw()

    if (moving) {
      x += vx
      y += vy
      vy *= 0.97
      vy += 0.75
      vx *= 0.99
    }

    if (x + vx > canvas.width || x + vx < 0 || y + vy > canvas.height) {
      moving = false
    }

    context.font = '25px serif'
    context.fillText(gameRound.currentScore, 25, 30)
    context.fillText('Score: ' + gameRound.totalScore, 25, 60)
    context.fillText('Tries: ' + gameRound.attempts, 25, 90)

    boardHit()

    raf = window.requestAnimationFrame(draw)
  }


  $(window).keydown(function (event) {
    var keyCode = event.which
    if (keyCode === 38) {
      if (ball.aim.centerX <= ball.aim.circX()) {
        ball.aim.sliceIndex += 1
        getBallVal()
      }
    }
    if (keyCode === 40) {
      if (ball.aim.centerY >= ball.aim.circY()) {
        ball.aim.sliceIndex -= 1
        getBallVal()
      }
    }
    if (keyCode === 32) {
      if (x === ball.aim.circX() && y === ball.aim.circY()) {
        moving = true
      }
    }
  })

  raf = window.requestAnimationFrame(draw)
})
