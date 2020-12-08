window.addEventListener('load',function() {
    // 获取按钮
    var begin = getEle('button');
    // 获取游戏开始页面
    var strat = getEle('.stratgame');
    // 我方飞机
    var myplane = getEle('.plane');
    // 飞机宽高
    var myWidth = myplane.offsetWidth;
    var myHeight = myplane.offsetHeight;
    // 游戏主页面
    var game = getEle('.game');
    // 主页面高度和宽度
    var gameHeight = game.offsetHeight;
    var gameWidth = game.offsetWidth;

    // 背景移动定时器
    var movetimer = null;
    // 创建子弹定时器
    var bullettimer = null;
    // 移动子弹定时器
    var moveBullettimer = null;
    // 创建敌方飞机定时器
    var enemytimer = null;
    // 移动敌方飞机定时器
    var move_enemy = null;

    // 给开始按钮添加点击事件
    addEvent(begin, 'click', function() {
        strat.style.display = 'none';
        bgMove();
        createEveryBullet();
        moveEveyBullet();
        moveEveryEnemy();
    })

    // 封装一个背景移动的方法
    function bgMove() {
        var bgtop = 0;
        movetimer = setInterval(function() {
            bgtop += 2;
            bgtop = bgtop >= gameHeight ? 0 : bgtop;
            game.style.backgroundPositionY = bgtop + 'px';
        },20)
    }

    // game添加鼠标移动事件
    addEvent(game, 'mousemove', mouseMoveEvent);
    // 鼠标移动方法
    function mouseMoveEvent(e) {
        var left = e.offsetX - myWidth / 2;
        var top = e.offsetY - myHeight / 2;

        var maxLeft = gameWidth - myWidth;
        var maxTop = gameHeight - myHeight;

        left = left <= 0 ? 0 : left > maxLeft ? maxLeft : left;
        top = top <= 0 ? 0 : top > maxTop ? maxTop : top;

        myplane.style.left = left + 'px';
        myplane.style.top = top + 'px';
    }

    // 子弹类
    function Bullet() {
        this.BulletWidth = 6;
        this.BulletHeight = 14;
        this.BulletX = 0;
        this.BulletY = 0;
        this.currentBullet = null;
        this.BulletSrc = './images/bullet.png';
    }
    // 创建子弹节点的方法
    Bullet.prototype.createBullet = function() {
        this.currentBullet = document.createElement('img');
        this.currentBullet.src = this.BulletSrc;
        this.currentBullet.style.width = this.BulletWidth + 'px';
        this.currentBullet.style.height = this.BulletHeight + 'PX';
        this.currentBullet.style.position = 'absolute';
        var planeX = myplane.offsetLeft;
        // console.log(planeX);
        var planeY = myplane.offsetTop;
        this.BulletX = planeX + myplane.offsetWidth/2 - this.BulletWidth/2;
        this.BulletY = planeY - this.BulletHeight;
        this.currentBullet.style.left = this.BulletX + 'px';
        this.currentBullet.style.top = this.BulletY + 'px';

        game.appendChild(this.currentBullet);
    }

    // 创建实例化每一颗子弹
    var bullets = [];
    function createEveryBullet() {
        bullettimer = setInterval(function() {
            var bullet = new Bullet();
            bullet.createBullet();
            console.log(bullet);
            bullets.push(bullet);
            console.log(bullets);
        },100)
    }

    // 子弹移动
    Bullet.prototype.moveBullet = function(index) {
        this.BulletY -= 3;
        if (this.BulletY <= -this.BulletHeight) {
            bullets.splice(index,1);
            game.removeChild(this.currentBullet);
        }
        this.currentBullet.style.top = this.BulletY + 'px';
    }

    // 移动每一颗子弹
    function moveEveyBullet() {
        moveBullettimer = setInterval(function() {
            for (var i = 0; i < bullets.length; i++) {
                bullets[i].moveBullet(i);
            }
        },10)
    }

    // ********************************************************************
    // 不同敌方飞机的数据
    var enemy = [
        {
            img: './images/enemy1.png',
            imgB: './images/enemy1b.png',
            width: 34,
            height: 24,
            blood: 1
        },
        {
            img: './images/enemy2.png',
            imgB: './images/enemy2b.png',
            width: 46,
            height: 60,
            blood: 5
        },
        {
            img: './images/enemy3.png',
            imgB: './images/enemy3b.png',
            width: 110,
            height: 164,
            blood: 10
        }
    ]
    // 创建敌方飞机的构造函数
    function Enemyplane() {
        var emy = null;
        var random = Math.random();
        if (random <= 0.5) {
            emy = enemy[0];
        } else if (random <= 0.9) {
            emy = enemy[1];
        } else {
            emy = enemy[2];
        }
        this.enemyWidth = emy.width;
        this.enemyHeight = emy.height;
        this.enemyBlood = emy.blood;
        this.enemyImg = emy.img;
        this.enemyImgB = emy.imgB;
        this.enemyX = Math.random() * (gameWidth - this.enemyWidth);
        this.enemyY = -this.enemyHeight;
        this.currentEnemyPlane = null;
    }

    // 创建敌方飞机的方法
    Enemyplane.prototype.createEnemyPlane = function() {
        this.currentEnemyPlane = document.createElement('img');
        this.currentEnemyPlane.src = this.enemyImg;
        this.currentEnemyPlane.style.width = this.enemyWidth + 'px';
        this.currentEnemyPlane.style.height = this.enemyHeight + 'px';
        this.currentEnemyPlane.style.position = 'absolute';
        this.currentEnemyPlane.style.left = this.enemyX + 'px';
        this.currentEnemyPlane.style.top = this.enemyY + 'px';

        game.appendChild(this.currentEnemyPlane);
    }

    // 移动敌方飞机
    Enemyplane.prototype.moveEnemyPlane = function(index) {
        this.enemyY += 2;
        if (this.enemyY > gameHeight) {
            enemys.splice(index,1);
            this.currentEnemyPlane.remove();
        }
        this.currentEnemyPlane.style.top = this.enemyY + 'px';
    }

    // 创建每一辆敌方飞机
    var enemys = [];
    enemytimer = setInterval(function() {
            var enemyPlane = new Enemyplane();
            enemyPlane.createEnemyPlane();
            enemys.push(enemyPlane);    
    },1000)

    // 移动每一家敌方飞机
    function moveEveryEnemy() {
        move_enemy = setInterval(function() {
            for (var i = 0; i < enemys.length; i++) {
                enemys[i].moveEnemyPlane(i);
            }
        },10)
    }

    // 封装的绑定事件的方法
    function addEvent(element, type, fn, isCapture){
        var isisCapture = isCapture ? true : false;
        
        if(window.addEventListener){
            // w3c标准浏览器 绑定事件: addEventListener(type,fn,boolean)
            element.addEventListener(type, fn, isisCapture);
        }else{
            // ie 标准浏览器 绑定事件: attachEvent('on'+type, fn)
            element.attachEvent('on'+type, fn);
        }
    }

    // 获取元素的方法
    function getEle(opt) {
        var ele = document.querySelectorAll(opt);
        if (ele.length == 1) {
            return ele[0];
        } else {
            return ele;
        }
    }
})