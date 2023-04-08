
//initial game settings
let beginningseedlings = 5;
let beginningtreeChange = 5 //chance of tree spawning at beginning of game
let maxtreeage = 10; //year age of max trees
let treeautodissapearyear = 13;
let startingquota = 20; //rate of trees that are deforested

//Grass Tiling Settings
let grasswidth = 50;


let app;

//User Variables
let remainingSeedlings = beginningseedlings;
let timeskipcooldown = false;
let year = 3;

let harvestabletrees = 0;
let harvestabletreesArray = [];







//textures
let deadtreetexture = PIXI.Texture.from("img/DeadTree.png")

window.onload = function() {
    app = new PIXI.Application(
        {
            width: window.innerWidth,
            height: window.innerHeight,
            background: "#000000"
        }
    );
    document.body.appendChild(app.view)
    //app.view.style.width = "100%";
    
    //Calculate area needed 
    let xGrassTile = Math.ceil(app.view.width/grasswidth);
    let yGrassTile = Math.ceil(app.view.width/grasswidth);

    let tiles = [];
 
    for (let i=0;i<xGrassTile;i++) {
        for(let j=0;j<yGrassTile;j++) {
            tiles.push(new Tile(app, i, j))

        
        }
    }


    year+=1;
    for (let i=0;i<tiles.length;i++) {
        tiles[i].grow();
    }


    //Remaining Seedling Counter
    let seedlingCounterTexture = PIXI.Texture.from("img/acornCount.png");
    let seedlingCounterDecal = new PIXI.Sprite(seedlingCounterTexture);
    seedlingCounterDecal.width = 90;
    seedlingCounterDecal.height = seedlingCounterDecal.width;
    seedlingCounterDecal.x = 15;
    seedlingCounterDecal.y = app.view.height - 105
    app.stage.addChild(seedlingCounterDecal);

    //Seedling label
    var seedlabel = new PIXI.Text("Seeds", {fontFamily: "Press Start 2P", fill:"white", fontSize: '18px'});
    app.stage.addChild(seedlabel);
    seedlabel.x = 16;
    seedlabel.y = app.view.height - 130

    //Seedling Remaining label
    var seedCounter = new PIXI.Text(remainingSeedlings.toString(), {fontFamily: "Press Start 2P", fill:"white", fontSize: '18px'});
    app.stage.addChild(seedCounter);
    seedCounter.anchor.set(.5)
    seedCounter.x = 60;
    seedCounter.y = app.view.height- 10

    //Year Label
    let yearTexture = PIXI.Texture.from("img/yearTexture.png");
    let yearimg = new PIXI.Sprite(yearTexture);
    yearimg.x = 16;
    yearimg.y = app.view.height - 890;
    yearimg.width = 300;
    yearimg.height = 80;
    app.stage.addChild(yearimg) 
    var yearLabel = new PIXI.Text("Year: " + year.toString(), {fontFamily: "Press Start 2P", fill:"white", fontSize: '20px'});
    yearLabel.x = 40;
    yearLabel.y = app.view.height - 860;
    app.stage.addChild(yearLabel);

    //time skip
    var timeSkipLabel = new PIXI.Text("Fast Forward", {fontFamily: "Press Start 2P", fill:"white", fontSize: '13px'});
    app.stage.addChild(timeSkipLabel);
    timeSkipLabel.x = app.view.width - 180;
    timeSkipLabel.y = app.view.height - 130

    //timeskip button
    let timeskipbuttonTexture = PIXI.Texture.from("img/timeskip.png")
    let timeskiphighlight = PIXI.Texture.from("img/timeskip_highlighted.png")
    let timeskipclick = PIXI.Texture.from("img/timeskipclick.png")
    let tsb = new PIXI.Sprite(timeskipbuttonTexture);
    app.stage.addChild(tsb);
    tsb.eventMode = 'dynamic';
    tsb.buttonMode = true;
    tsb.width = 180;
    tsb.height = 90
    tsb.x = app.view.width  - tsb.width - 15
    tsb.y = app.view.height - 105
    tsb.defaultCursor = 'pointer'

    //animation stuff
    tsb.on('pointerenter', event=>{
        tsb.texture = timeskiphighlight;
    })

    tsb.on('pointerleave', event=>{
        tsb.texture = timeskipbuttonTexture;
    })

    tsb.on('pointerdown', event=>{
        tsb.texture = timeskipclick;
    })

    tsb.on('pointerup', event=>{
        tsb.texture = timeskiphighlight;
       
        //deforest setup
        let quotaMultiplier = year - 3;
        console.log(harvestabletreesArray)


        for (let i=0;i<tiles.length;i++) {
            if (tiles[i].state == 2) {
                if (Math.floor(Math.random()*100) < 5) {
                    remainingSeedlings+=1
                }
            }
        }
        year += 1;

        for (let i=0;i<tiles.length;i++) {
            tiles[i].grow();
           
        }







    })

    


    //frame
    const ticker = new PIXI.Ticker();
    ticker.stop();
    ticker.add((deltaTime) => {
        seedCounter.text = remainingSeedlings;
        yearLabel.text = "Year: " + year;


      
      
      
       
    });
    ticker.start();


} 


class Tile {
    constructor(app, x, y) {
        this.app = app
        this.x = x // the X tile on the screen
        this.y = y // the Y tile on the screen
        this.state = 0

        /*
        tree states
        0 - No tree
        1 - sappling
        2 - full grown tree
        3 - dead tree
        4 - cut tree
        */
        
        this.grassTexture = PIXI.Texture.from("img/grasstile.png");
        this.grasstile = new PIXI.Sprite(this.grassTexture);
        this.grasstile.width = grasswidth;
        this.grasstile.height = this.grasstile.width
        this.grasstile.x = grasswidth * x;
        this.grasstile.y = grasswidth * y;
        this.grasstile.eventMode = 'dynamic';
        this.grasstile.buttonMode = true;
        app.stage.addChild(this.grasstile);
        this.hastree = false;
        this.isalive = false;
        this.harvestable = false;

      

    

        this.grasstile.on('pointerenter', event=>{
            this.grasstile.tint = 0xD6D7DA
        })

        this.grasstile.on('pointerup', event=>{
            if (remainingSeedlings <=0 || this.state !=0) return false;
            this.plant();
            this.grasstile.tint = 0xFFFFFF;
            remainingSeedlings--;

        })

        this.grasstile.on('pointerleave', event=>{
            this.grasstile.tint = 0xFFFFFF
        })

        if (Math.floor(Math.random()*100) <= 30) {
            this.plant();
            this.hastree = true;
            this.isalive = false;
            this.harvestable = true;
            this.treebirthyear = Math.ceil(Math.random()*3) 
        }
        

    }

    plant() {
        // initialize tree sprites
        this.saplingTexture = PIXI.Texture.from("img/Sapling.png")
        this.grownTexture = PIXI.Texture.from("img/Tree.png")
        this.cutTexture = PIXI.Texture.from("img/Stump.png")

        // initialize tree
        this.tree = new PIXI.Sprite(this.saplingTexture);
        this.app.stage.addChild(this.tree);
        this.tree.eventMode = 'dynamic';
        this.tree.buttonMode = true;
        this.tree.width = grasswidth;
        this.tree.height = grasswidth
        this.tree.x = this.x * grasswidth
        this.tree.y = this.y * grasswidth
        this.tree.defaultCursor = 'pointer'
        this.treebirthyear = year;
        this.state = 1;
    }

    grow() {
        if (this.state == 1) {
        if (year - this.treebirthyear >= 3) {
            this.tree.texture = this.grownTexture
            this.state = 2;
            this.harvestable = true;
            harvestabletrees++;
            harvestabletreesArray.push(this);
        }}else if (this.state == 2) {
            //handles tree death
            if (year-this.treebirthyear >= maxtreeage) {
                this.state = 3;
                this.isalive =  false;
                this.tree.texture = deadtreetexture;
                this.harvestable = false;
                harvestabletrees--

                harvestabletreesArray.splice(harvestabletreesArray.indexOf(this));
            }
        }else if(this.state ==3 || this.state == 4) {
            if (year-this.treebirthyear>= treeautodissapearyear) {
                this.tree.visible = false;
                this.app.stage.removeChild(this.tree)
                this.tree = null;
                this.harvestable = false;
                this.state = 0;
            }
        }

        
        
        
    }

    cut() {
       
        this.sprite.texture = this.cutTexture
        this.state = 4;
        this.hastree = false;
        this.isalive = false;
        this.harvestable = false;
    }
}