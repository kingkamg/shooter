
cc.Class({
    extends: cc.Component,

    properties: {
        bulletBuff: 5,
        bulletPrefab: {
            default: null,
            type: cc.Prefab
        },
        aimLen: 20,
        // dealyT : 0.5
    },


    start () {
        this.dealyTime = 0;
        this.angle = 0;
        this.bulletCnt = 0;
        this.readyStatus = false;
    },

    spawnBullet () {
        if (this.bulletCnt < 1) {
            this.readyStatus = false;
            this.sendEndStatus();
            return;
        }
        this.bulletCnt --;
        var bullet;
        var pos = this.node.parent.position;
        var coff = 1;

        if (pos.x >= 320) {
            coff = -1;
        }
        
        bullet = cc.instantiate(this.bulletPrefab);
        this.node.addChild(bullet);

        bullet.position = cc.v2(-this.node.width,0);
        
        var d = 2000;
        var xx = d * Math.cos(this.angle) * coff;
        var yy = d * Math.sin(this.angle);
        var _body = bullet.getComponent(cc.RigidBody);
        
        _body.linearVelocity = cc.v2(xx, yy);
        _body.active = true;
        return bullet;
    },



    update (dt) {
        if (this.readyStatus) {
            this.dealyTime += dt;
            if (this.dealyTime > 0.1) {
                this.spawnBullet();
                this.dealyTime = 0;
            }
        }
    },

    setAngle(angle) {
        this.angle = angle;
    },

    startShoot() {
        console.log('SSSSSS:' + this.bulletBuff);
        this.readyStatus = true;
        this.bulletCnt = this.bulletBuff;
        
    },

    sendEndStatus() {
        this.scheduleOnce(function(){
            var event = new cc.Event.EventCustom("end_shooter", true);
            this.node.dispatchEvent(event);
        }, 0.5);
    }

});
