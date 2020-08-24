const gravity = 2;
const moveUp = -30;


//load all the assets first and then start the game
function loadAssets(callback){
    let assetCount = 0

    function assetLoadingFinished(callback){
        if(assetCount > 0){
            requestAnimationFrame(assetLoadingFinished.bind(this,callback))
        }else{
            callback();
        }
    }

    function load(src){
        assetCount++
        const img = new Image()
        img.src = src

        img.onload = ()=>{
            assetCount--
        }
        return img
    }
    
    game.sprites.background.img = load('./images/bg.png')
    game.sprites.bird.img = load('./images/bird.png')
    game.sprites.fg.img = load('./images/fg.png')
    game.sprites.pipeUp.img = load('./images/pipeNorth.png')
    game.sprites.pipeDown.img = load('./images/pipeSouth.png')

    assetLoadingFinished(callback)

}

class Canvas{
    constructor(){
        this.cvs = document.getElementById('canvas')
        this.ctxt = this.cvs.getContext('2d')
    }

    draw({img,position}){
        this.ctxt.drawImage(img, position.x, position.y);
    }
}

class Position{
    constructor(x,y){
        this.x = x
        this.y = y
    }

    offSet(x,y){
        const add = new Position(x,y)
        this.x+=add.x
        this.y+=add.y
    }
}

class Game{
    constructor(){
        this.sprites = {
            background : {position : new Position(0,0)},
            bird : {position : new Position(0,0)},
            pipeUp : {position : []},
            pipeDown : {position : []},
            fg : {position : new Position(0,0)}
        }
        this.score;
        this.init = this.init.bind(this)
        this.start = this.start.bind(this)
    }
    init(){
        this.canvas = new Canvas()
        this.score = 0
        this.sprites.bird.position.offSet(10,150)
        this.sprites.fg.position.offSet(0,this.canvas.cvs.height-this.sprites.fg.img.height)
        for(let key in this.sprites){
            if(key === 'pipeUp'){
                this.sprites[key].position.push(new Position(this.canvas.cvs.width, 0))
            }else if(key === 'pipeDown'){
                this.sprites[key].position.push(new Position(this.canvas.cvs.width,this.sprites.pipeUp.img.height + 90))
            }
        }
        document.addEventListener('keydown', ()=>{
            this.sprites.bird.position.offSet(0,moveUp)
        })
        this.start()
    }
    detectCollision(pos,key){
        if((this.sprites.bird.position.y+this.sprites.bird.img.height) >= (this.canvas.cvs.height - this.sprites.fg.img.height)) return true;
        else if((this.sprites.bird.position.x+this.sprites.bird.img.width)) return false
        else return false;
    }
    start(){
        for(let key in this.sprites){
            if(key != 'pipeUp' && key != 'pipeDown'){
                this.canvas.draw(this.sprites[key])  
            }
            else{
                for(let pos in this.sprites[key].position){
                    this.canvas.draw({img : this.sprites[key].img,position : this.sprites[key].position[pos]})
                    this.sprites[key].position[pos].offSet(-1,0)
                    if(this.detectCollision(pos,key)){
                        location.reload();
                    }
                }
            }
        }
        this.sprites.bird.position.offSet(0,gravity)

        const length = this.sprites.pipeDown.position.length;
        if(this.sprites.pipeDown.position[length-1].x < this.canvas.cvs.width -150){
            const y = Math.floor(Math.random()*this.sprites.pipeUp.img.height) 
            this.sprites.pipeDown.position.push(new Position(this.canvas.cvs.width, y+90))
            this.sprites.pipeUp.position.push(new Position(this.canvas.cvs.width, y- this.sprites.pipeUp.img.height))
        }
        this.canvas.ctxt.fillStyle = '#7c807e'
        this.canvas.ctxt.font = '20px Verdana'
        this.canvas.ctxt.fillText(`Score : ${this.score}` , 0, this.canvas.cvs.height-20)
        requestAnimationFrame(this.start)
    }
}

const game = new Game()

//pop from array
//collision
//score