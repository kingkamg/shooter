cc.Class({
    extends: cc.Component,

    properties: {
        track: {
            default: null,
            type: cc.Graphics
        },
        gun: {
            default: null,
            type: cc.Node
        }
    },
    onLoad () {
        this.runStaus = 0;
        this.pathInfo = {};
        this.step = 0;
        this.stepTime = 0.1
        this.R = {
            alpha: 0,
            coff: 1,
            step: 3,
            delta: 0,
            rr: 30
        };
        this.shooterReady = true;
    },

    start () {
    },

    update (dt) {
        if (this.shooterReady) {
            this.drawShooter(dt);
        }
    },

    updatePos(paths, step) {
        this.pathInfo = paths;
        this.runStaus = 1;
        this.step = step;
        this.runMove();
    },

    runMove() {
        this.stopShooter();
        var w_runsArray = [];
        var p = this.pathInfo.paths;
        var coff = this.pathInfo.coff;
        var w_t = Math.abs((this.node.x - p[0].x) / this.step) * this.stepTime;

        console.log('time: ' + w_t);
        
        w_runsArray.push(cc.moveTo(w_t, p[0]));

        for (var i = 1; i < p.length; i++) {
            w_runsArray.push(cc.moveTo(this.stepTime, p[i]));
        }
        w_runsArray.push(cc.moveBy(this.stepTime, this.step * coff, 0));
        w_runsArray.push(cc.callFunc(this.endMove, this));
        var se = cc.sequence(w_runsArray);
        this.node.runAction(se);
        this.runStaus = 0;

    },
    endMove() {
        this.node.setScale(this.pathInfo.coff, 1);
        this.node.parent.getComponent('bgMap').upgardMap();

        this.shooterReady = true;
        
    },

    drawShooter(dt) {
        this.R.delta += dt;
        if (this.R.delta < 0.05) {
            return;
        }

        if (this.R.alpha < 0) {
            this.R.coff = 1;
        } else if (this.R.alpha > 45) {
            this.R.coff = -1;
        }
        this.R.alpha += this.R.step * this.R.coff;        
        this.drawStrack();

        this.gun.setRotation(this.R.alpha);
        this.R.delta = 0;

    },

    drawStrack() {
       
        var r = this.gun.width / 2 + this.R.rr;        
        var a = this.calcAlpha(this.R.alpha);
        var g = this.track;

        if (a < 0)
            return;
        g.clear();     
        g.fillColor = cc.color(0, 0, 0, 100);
        g.arc(0, 0, r, 0, a, true);
        g.lineTo(0, 0);
        g.close();
        g.fill();

        g.strokeColor = cc.color(255, 255, 255, 255);
        g.lineWidth = 2;
        g.moveTo(0, 0);
        g.lineTo(r * Math.cos(a), r * Math.sin(a));
        g.close();
        g.stroke();
    },
    calcAlpha(a) {
        return a * Math.PI / 180;
    },

    stopShooter() {
        this.shooterReady = false;
        this.R = {
            alpha: 0,
            coff: 1,
            step: 3,
            delta: 0,
            rr: 30
        };
        // this.drawStrack();
        this.track.clear();
        this.gun.setRotation(0);
    },

    getAngle() {
        return this.R.alpha;
    }
});
