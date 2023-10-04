document.addEventListener('DOMContentLoaded', () => {
    let elements = {
        game: document.querySelector('.game'),
        desk: document.querySelector('.desk'),
        wallContainer: document.querySelector('.walls'),
        Ball: document.querySelector('.ball'),
        topWall: document.querySelector('.top-wall'),
        bottomWall: document.querySelector('.bottom-wall'),
        leftWall: document.querySelector('.left-wall'),
        rightWall: document.querySelector('.right-wall'),
        scoreEl: document.querySelector('.score'),
        overEl: document.querySelector('.over'),
        walls: []
    }
    let styleRoot = document.querySelector(':root')
    let gameWidth = elements.game.getBoundingClientRect().width
    let gameHeight = elements.game.getBoundingClientRect().height
    let wallLength = 40
    let enableUpdate = true
    let score = 0
// ball phisycs
    let ballPhisycs = {
        x: getStyleProperty('--ballLeft'),
        y: getStyleProperty('--ballTop'),
        w: elements.Ball.getBoundingClientRect().width,
        h: elements.Ball.getBoundingClientRect().height,
        vx: 3,
        vy: 3,
        speed: 1.5
    }

    defData()
    requestAnimationFrame(update)
     
    function update(){
        if(!enableUpdate) {return}
        checkGameOver()
        ballCatchDesk()

        requestAnimationFrame(update)
    }

    function defData(){
        mouseMove()
        createWall()
        console.log(elements.walls);
    }

//ball Moves and catches desk
    function ballCatchDesk(){
        elements.walls.forEach((item) => {
            if (collision(elements.Ball.getBoundingClientRect(), item.getBoundingClientRect())){
                crashWall(parseInt(item.getAttribute('data')))
            }
        })

        if(collision(elements.desk.getBoundingClientRect(), elements.Ball.getBoundingClientRect())){
            let random = randomNumber(2)
            if(random === 1){
                ballPhisycs.vx *= 1
                ballPhisycs.vy *= -1                
            }else{
                ballPhisycs.vx *= -1
                ballPhisycs.vy *= -1 
            }

        }else if(collision(elements.rightWall.getBoundingClientRect(), elements.Ball.getBoundingClientRect())){
            ballPhisycs.vx *= -1
            ballPhisycs.vy *= 1 

        }else if(collision(elements.leftWall.getBoundingClientRect(), elements.Ball.getBoundingClientRect())){
            ballPhisycs.vx *= -1
            ballPhisycs.vy *= 1 

        }else if(collision(elements.topWall.getBoundingClientRect(), elements.Ball.getBoundingClientRect())){
            ballPhisycs.vx *= 1
            ballPhisycs.vy *= -1 

        }else if(collision(elements.bottomWall.getBoundingClientRect(), elements.Ball.getBoundingClientRect())){
             console.log('lose')
        }

        setStyleProperty('--ballLeft', `${ballPhisycs.x += ballPhisycs.vx}px`)
        setStyleProperty('--ballTop', `${ballPhisycs.y += ballPhisycs.vy}px`)
    }

    function crashWall(id){
        elements.walls.forEach((item) => {
            if(parseInt(item.getAttribute('data')) == id){
                if(item.classList.contains('disable')) {return}
                item.classList.add('disable')
                if(score % 5 == 0){
                    ballPhisycs.speed = ballPhisycs.speed + 1.5
                    ballPhisycs.vx = ballPhisycs.speed
                    ballPhisycs.vy = ballPhisycs.speed
                }
                ballPhisycs.vx *= 1
                ballPhisycs.vy *= -1
                score++
                elements.scoreEl.textContent = `Score: ${score}`

                if(score === wallLength){
                    gameWin()
                }
            }
        })
    }

//desk  moves on mousemove
    function mouseMove(){
        elements.game.addEventListener('mousemove', (e) => {
            if(!enableUpdate) {return}
            setStyleProperty('--deskLeft', `${e.offsetX}px`)
        })
    }

    function setStyleProperty(variable, value) {
       styleRoot.style.setProperty(variable, value)
    }
    function getStyleProperty(variable){
        return parseFloat(getComputedStyle(styleRoot).getPropertyValue(variable))
    }

// walls
   function createWall() {
    for (let i = 0; i < wallLength; i++) {
        const element = document.createElement('div')
        element.classList.add('wall')
        element.setAttribute('data', i)
        elements.walls.push(element)
        elements.wallContainer.appendChild(element)
    }
   }

// game over
    function checkGameOver(){
        if(collision( elements.Ball.getBoundingClientRect(), elements.bottomWall.getBoundingClientRect())){
            gameOver()
        }
    }

    function gameOver(){
        enableUpdate = false
        elements.overEl.style.display = 'block'
    }

    // win
    function gameWin(){
        enableUpdate = false
        elements.overEl.textContent = 'You Win'
        elements.overEl.style.display = 'block'
    }

// collision
   function collision(rect1, rect2){
        if (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y) {

            return true
        }else{

            return false
        }
   }


// ball direction on random
   function randomNumber(max){
        return Math.floor(Math.random() * max)
   }


})