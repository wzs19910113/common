<template>
    <div class="main">
        <div class="map" v-if="data.map&&data.map.length==(WI*HI+WI)">
            <a class="btn cell" :class="{'cell-sel':index==curCellIndex,'cell-red':index<36,'cell-blue':index>=45}" :style="`width:${100/WI}%;height:${100/HI}%`" @click="onClickCell(index)" v-for="(number,index) in WI*HI">
                <span class="item">
                    <span class="flag" v-if="data.map[index].type==1">旗</span>
                    <span class="block" v-if="data.map[index].type==3"></span>
                </span>
                <span class="item">
                    <span class="building" :class="`${data.map[index].type==3?'block-building':''}`" v-if="data.map[index].name">{{data.map[index].name}}</span>
                </span>
                <span class="item">
                    <span class="card" :class="`card-${data.map[index].card}`" v-if="data.map[index].type==2&&data.map[index].show">{{CNLIST[data.map[index].card-1]}}</span>
                    <span class="card" v-if="data.map[index].type==2&&!data.map[index].show">{{(manager&&index==curCellIndex)?CNLIST[data.map[index].card-1]:'?'}}</span>
                </span>
                <span class="role-wrap">
                    <span class="role" :class="`role-color-${role}`" v-for="(role,index) in data.map[index].roles">{{RNLIST[role-1]}}</span>
                </span>
                <span v-if="manager">
                    <span class="lab lab-t" v-if="index<WI">{{index+1}}</span>
                    <span class="lab lab-l" v-if="index%HI==0">{{LBLIST[Math.floor(index/HI)]}}</span>
                    <span class="lab lab-b" v-if="index<WI*HI&&index>=WI*(HI-1)">{{index-WI*(HI-1)+1}}</span>
                    <span class="lab lab-r" v-if="index%HI==(WI-1)">{{LBLIST[Math.floor(index/HI)]}}</span>
                </span>
            </a>
        </div>
        <div class="death" v-if="data.map&&data.map.length==(WI*HI+WI)">
            <a class="btn cell" :class="{'cell-sel':index==curCellIndex}" :style="`width:${100/WI}%;height:100%`" @click="onClickCell(index+WI*HI)" v-for="(number,index) in WI">
                <span class="item">
                    复活{{WI-number+1}}
                </span>
                <span class="role-wrap">
                    <span class="role" :class="`role-color-${role}`" v-for="(role,index) in data.map[index+WI*HI].roles">{{RNLIST[role-1]}}</span>
                </span>
            </a>
        </div>
        <div class="round" v-if="!manager">回合：{{data.round}}</div>
        <div class="coord" v-if="!manager&&curCellIndex>=0&&curCellIndex<WI*HI">坐标：{{getCellCoords()}}</div>
        <a class="btn btn-asyn" @click="onClickLoad()" v-if="!manager">同步</a>
        <a class="btn btn-login" @click="showLoginPop=true" v-if="!manager">主持人登录</a>
        <div class="option" v-if="manager">
            <div class="row row-title">
                <div>
                    管理员：{{manager}}
                    <a class="btn" @click="onClickLogout()">注销</a>
                    <a class="btn" @click="onClickClear()">清场</a>
                </div>
                <div>
                    回合：{{data.round}}
                    <a class="btn" @click="onClickRoundCount(1)">+</a>
                    <a class="btn" @click="onClickRoundCount(-1)">-</a>
                    <a class="btn" @click="onClickRoundCount(0)">归0</a>
                </div>
            </div>
            <div class="row row-roles" v-if="curCellIndex>=0">
                <div class="row-name">移动至{{getCellCoords()}}：</div>
                <a class="btn btn-move" :class="`btn-move-${number}`" @click="onClickMove(number)" v-for="(number,index) in 6">{{RNLIST[index]}}</a>
                <br/>
                <a class="btn btn-move" @click="onClickMove(7)">敌</a>
            </div>
            <div class="row" v-if="curCellIndex>=0">
                <div>
                    <a class="btn" @click="onClickSetType(1)">设为战旗</a>
                    <a class="btn" @click="onClickSetType(3)">设为电墙</a>
                </div>
                <div>
                    <a class="btn" @click="onClickSetType(2,1)">设为攻牌</a>
                    <a class="btn" @click="onClickSetType(2,2)">设为闪牌</a>
                    <a class="btn" @click="onClickSetType(2,3)">设为蓄牌</a>
                    <a class="btn" @click="onClickSetShow()">{{data.map[curCellIndex].show?'盖住':'翻开'}}</a>
                </div>
            </div>
            <div class="row" v-if="curCellIndex>=0">
                <div>
                    <input class="inp" v-model="cellname" placeholder="设置方格的文字" :disabled="false"/>
                    <a class="btn" @click="onClickSetName()">确定</a>
                </div>
                <div>
                    <a class="btn" @click="onClickSetType(0)">清空此方格</a>
                </div>
            </div>
            <a class="btn btn-asyn" @click="onClickSave()">同步</a>
            <!-- <div class="option-cell" v-if="curCellIndex>=0">
                <div class="crow" v-if="curCellIndex>=0">选中的格子坐标：</div>
                <div class="crow">
                    移动至此：<br/>
                    <a class="btn btn-move" :class="`btn-move-${number}`" @click="onClickMove(number)" v-for="(number,index) in 6">{{RNLIST[index]}}</a>
                    <br/>
                    <a class="btn btn-move" @click="onClickMove(7)">敌</a>
                </div>
                <div class="brow"></div>
                <div class="crow">
                    <a class="btn" @click="onClickSetType(1)">设为战旗</a>
                    <a class="btn" @click="onClickSetType(3)">设为电墙</a>
                </div>
                <div class="brow"></div>
                <div class="crow">
                    <a class="btn" @click="onClickSetType(2,1)">设为攻牌</a>
                    <a class="btn" @click="onClickSetType(2,2)">设为闪牌</a>
                    <a class="btn" @click="onClickSetType(2,3)">设为蓄牌</a>
                    <br/>
                    <a class="btn" @click="onClickSetShow()">{{data.map[curCellIndex].show?'盖住':'翻开'}}</a>
                </div>
                <div class="brow"></div>
                <div class="crow">
                    <nut-textinput class="inp" v-model="cellname" placeholder="设置方格的文字" :disabled="false"/>
                    <a class="btn" @click="onClickSetName()">确定</a>
                </div>
                <div class="brow"></div>
                <div class="crow">
                    <a class="btn" @click="onClickSetType(0)">清空此方格</a>
                </div>
            </div> -->
            <!-- <div class="row-wrap-bt">
                <div class="row"></div>
                <a class="btn row" :class="cursorMode==1?'btn-sel':''" @click="onClickSetCursor(1)">战旗画笔</a>
                <a class="btn row" :class="cursorMode==3?'btn-sel':''" @click="onClickSetCursor(3)">电墙画笔</a>
                <a class="btn row" :class="cursorMode==4?'btn-sel':''" @click="onClickSetCursor(4)">擦除画笔</a>
                <div class="row"></div>
                <a class="btn row" @click="onClickClear()">清场</a>
                <div class="row"></div>
                <a class="btn btn-asyn row" @click="onClickSave()">同步</a>
            </div> -->
        </div>

        <nut-popup v-model="showLoginPop">
            <nut-textinput class="inp" v-model="username" @keyup="onUsernameChange" placeholder="主持人名字" :disabled="false"/>
        </nut-popup>

    </div>
</template>

<script>
import { query, r, bulbsort, getParentNode, getQueryVariable, arrContains, } from '../tools/utils';
import { DEBUG, CONFIG, CACHE, } from '../config/config';
const UN = 'fish';
const WI = 9;
const HI = 9;
const RNLIST = ['芙','坎','凡','道','雨','续','敌',];
const CNLIST = ['攻','闪','蓄',];
const LBLIST = ['A','B','C','D','E','F','G','H','I','J'];
export default {
    name: 'Home',
    data(){
        return {
            loading: false,

            data: {
                map: [],
                round: 0,
            },
            manager: '',
            cellname: '',
            curCellIndex: -1,
            cursorMode: 0, // [1:设置战旗|3:设置电墙|4:擦除]鼠标模式

            username: '',
            showLoginPop: false,

            itv: null,

            WI,HI,RNLIST,CNLIST,LBLIST,
            CONFIG,
            DEBUG,
        };
    },
    mounted(){
        this.manager = localStorage.getItem(CACHE.m);
        this.qload(data=>{
            if(!data.map&&this.manager){ // 初始化
                this.initData();
            }
            else{
                this.data = data;
                /*if(!this.manager){ // 玩家开启实时读取
                    this.itv = setInterval(_=>{
                        this.qload(data=>{
                            if(data&&data.map){
                                this.data = data;
                            }
                        });
                    },3000);
                }
                else{ // DM开启实时上传
                    this.itv = setInterval(_=>{
                        this.qsave(data=>{
                            if(data&&data.map){
                                this.data = data;
                            }
                        });
                    },3000);
                }*/
            }
        });
    },
    beforeDestroy(){
        if(this.itv){
            clearInterval(this.itv);
            this.itv = null;
        }
    },
    methods: {
        initData(){ // 初始化数据
            let mapLength = WI*HI;
            for(let i=0;i<mapLength+WI;i++){
                this.data.map.push({
                    roles: [],
                    type: 0, // [1:战旗|2:陷阱卡牌|3:电墙]
                    card: 0, // [1:攻|2:闪|3:蓄]
                    show: false,
                    name: '',
                });
            }
            this.data.round = 1;
            this.qsave();
        },
        qsave(callback){ // 覆盖存档
            if(this.loading) return;
            this.loading = this.$toast.loading();
            query('http://yulintraining.com/common/api/save.php',rdata=>{
                this.loading&&this.loading.hide();
                this.loading = null;
                this.$toast.text(`同步成功`,{duration:500});
                callback&&callback();
            },edata=>{
                this.loading&&this.loading.hide();
                this.loading = null;
                this.$toast.text(edata.msg);
            },1,{data:JSON.stringify(this.data)});
        },
        qload(callback){ // 读取存档
            if(this.loading) return;
            this.loading = this.$toast.loading();
            query('http://yulintraining.com/common/api/load.php',rdata=>{
                this.loading&&this.loading.hide();
                this.loading = null;
                this.$toast.text(`同步成功`,{duration:500});
                callback&&callback(JSON.parse(rdata.data.json));
            },edata=>{
                this.loading&&this.loading.hide();
                this.loading = null;
                this.$toast.text(edata.msg);
            },1,);
        },
        getCellCoords(){ // 格子坐标
            let x = '', y = '';
            let index = this.curCellIndex;
            x = index%WI;
            y = Math.floor(index/HI);
            return `${LBLIST[y]}-${x+1}`;
        },
        moveRole(roleIndex,cellIndex){ // 移动一个角色
            for(let i=0;i<this.data.map.length;i++){
                let newRoles = [];
                let cell = this.data.map[i];
                for(let j=0;j<cell.roles.length;j++){
                    if(cell.roles[j]!=roleIndex){
                        newRoles.push(cell.roles[j]);
                    }
                }
                this.data.map[i].roles = newRoles;
            }
            this.data.map[cellIndex].roles.push(roleIndex);
        },
        onUsernameChange(){
            if(this.username==UN){
                this.showLoginPop = false;
                this.manager = UN;
                localStorage.setItem(CACHE.m,UN);
            }
        },

        onClickCell(index){ // 点击【格子】按钮
            if(this.cursorMode>0){ // 有画笔
                this.curCellIndex = index;
                if(this.cursorMode==1||this.cursorMode==3){
                    this.data.map[this.curCellIndex].type = this.cursorMode;
                }
                else if(this.cursorMode==4){
                    this.data.map[this.curCellIndex].type = 0;
                    this.data.map[this.curCellIndex].name = '';
                }
            }
            else{ // 无画笔
                if(this.curCellIndex!=index){
                    this.curCellIndex = index;
                }
                else{
                    this.curCellIndex = -1;
                }
            }
            this.$forceUpdate();
        },
        onClickSetName(){ // 点击【设置文字】按钮
            this.data.map[this.curCellIndex].name = this.cellname;
            this.$forceUpdate();
        },
        onClickRoundCount(val){ // 点击【设置回合数量】按钮
            this.data.round += val;
            if(this.data.round<0||val==0){
                this.data.round = 0;
            }
            /* if(val==1){
                for(let i=WI-2;i>=0;i--){ // 遍历死亡区的 8 格
                    let cell = this.data.map[i+WI*HI];
                    let roles = cell.roles;
                    for(let j=0;j<roles.length;j++){ // 遍历 1 格中的所有角色
                        this.moveRole(roles[j],i+WI*HI+1);
                    }
                }
            }*/
            this.$forceUpdate();
        },
        onClickMove(index){ // 点击【移动】按钮
            this.moveRole(index,this.curCellIndex);
            this.$forceUpdate();
        },
        onClickSetType(type,card){ // 点击【设置格子类型】按钮
            this.data.map[this.curCellIndex].type = type;
            if(type==2){
                this.data.map[this.curCellIndex].card = card;
            }
            if(type==0){
                this.data.map[this.curCellIndex].name = '';
            }
            this.$forceUpdate();
        },
        onClickSetShow(){ // 点击【设置显示状态】按钮
            this.data.map[this.curCellIndex].show = !this.data.map[this.curCellIndex].show;
            this.$forceUpdate();
        },
        onClickSetCursor(mode){ // 点击【设置画笔】按钮
            if(this.cursorMode!=mode){
                this.cursorMode = mode;
            }
            else{
                this.cursorMode = 0;
            }
            this.$forceUpdate();
        },
        onClickSave(){ // 点击【同步上传】按钮
            this.qsave();
        },
        onClickLoad(){ // 点击【同步读取】按钮
            this.qload(data=>{
                this.data = data;
            });
        },
        onClickClear(){ // 点击【清场】按钮
            let _this = this;
            this.$dialog({
                title: '确认清场？',
                onOkBtn(e){
                    let temp = JSON.stringify(_this.data);
                    localStorage.setItem(CACHE.t,temp);
                    _this.curCellIndex = -1;
                    _this.cellname = '';
                    for(let i=0;i<_this.data.map.length;i++){
                        _this.data.map[i] = {
                            roles: [],
                            type: 0,
                            card: 0,
                            show: false,
                            name: '',
                        }
                    }
                    this.close();
                    _this.$forceUpdate();
                },
            });
        },
        onClickLogout(){ // 点击【注销】按钮
            this.manager = '';
            localStorage.removeItem(CACHE.m);
            this.$forceUpdate();
        },
    },
    components:{

    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .main{
        text-align: center;
        width: 100%;
        height: 100%;
        color: #4a4a4a;
        font-size: .24rem;
    }
    .map{
        width: 7.5rem;
        height: 7.5rem;
        margin-right: auto;
        margin-left: auto;
        margin-bottom: .2rem;
        line-height: 0;
    }
    .death{
        width: 7.5rem;
        height: .83333333rem;
        margin-right: auto;
        margin-left: auto;
        line-height: 0;
        margin-bottom: .2rem;
    }
    .btn{
        cursor: pointer;
        text-align: center;
        display: inline-block;
        font-weight: bold;
    }
    .btn:hover{
        opacity: .75;
    }
    .cell{
        position: relative;
        margin: 0;
        line-height: 0;
        background-color: #fff;
        box-shadow: 0 0 1px inset #000;
    }
    .death .cell{
        background-color: #333;
        box-shadow: 0 0 1px inset #fff;
    }
    .cell-sel{
        box-shadow: 0 0 2px 2px inset orangeRed;
    }
    .cell-blue{
        background-color: #E1FFFF;
    }
    .cell-red{
        background-color: #F0C0C0;
    }
    .cell .item{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        flex-flow: wrap;
        word-break: break-all;
        z-index: 90;
    }
    .death .cell .item{
        color: #888;
        font-size: .24rem;
    }
    .cell .item .block{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 90%;
        height: 90%;
        color: #fff;
        font-size: .24rem;
        background-color: #191970;
    }
    .cell .item .flag{
        color: #FFD700;
        background-color: #111;
        font-size: .3rem;
        width: 75%;
        height: .35rem;
        line-height: .35rem;
        text-align: center;
        opacity: .7;
        display: block;
        box-shadow: 0 0 2px 1px #FFD700;
        font-weight: bold;
    }
    .cell .item .building{
        color: #222;
        font-size: .18rem;
    }
    .block-building{
        color: #fff !important;
        width: 80%;
        height: 80%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: .02rem solid #fff;
    }
    .cell .item .card{
        width: 50%;
        height: 80%;
        border-radius: 4px;
        background-color: LightSlateGray;
        border: 2px solid #ccc;
        opacity: .7;
        color: #fff;
        font-size: .3rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .cell .item .card-1{
        background-color: red;
    }
    .cell .item .card-2{
        background-color: green;
    }
    .cell .item .card-3{
        background-color: blue;
    }
    .role-wrap{
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        right: 0;
        position: absolute;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        z-index: 100;
    }
    .role{
        width: .3rem;
        height: .3rem;
        border-radius: 50%;
        border: 1px solid #fff;
        font-size: .2rem;
        display: flex;
        color: #fff;
        font-weight: normal;
        justify-content: center;
        align-items: center;
        box-shadow: 2px 2px 3px 1px #555;
    }
    @keyframes roll {
        to{
            transform: rotateY(360deg);
        }
    }
    .role-color-1{
        background-color: #F08080;
        animation: roll 1.5s ease-in-out infinite;
    }
    .role-color-2{
        background-color: #228B22;
        animation: roll 1.7s ease-in-out infinite;
    }
    .role-color-3{
        background-color: #FFD700;
        animation: roll 1.9s ease-in-out infinite;
    }
    .role-color-4{
        background-color: #1E90FF;
        animation: roll 2.1s ease-in-out infinite;
    }
    .role-color-5{
        background-color: #778899;
        animation: roll 2.3s ease-in-out infinite;
    }
    .role-color-6{
        background-color: #9400D3;
        animation: roll 2.5s ease-in-out infinite;
    }
    .role-color-7{
        width: .4rem;
        height: .4rem;
        background-color: red;
        box-shadow: 0 0 4px 3px #a44;
        font-size: .28rem;
        animation: sc .5s ease-in-out infinite alternate;
    }
    @keyframes sc {
        to{
            transform: scale(1.2);
        }
    }
    .round,.coord{
        font-weight: bold;
        text-align: left;
        padding: 0 .1rem;
        font-size: .32rem;
    }
    .btn-login{
        position: absolute;
        margin: 0 auto;
        left: 0;
        right: 0;
        width: 100%;
        color: #fff;
        height: 40px;
        line-height: 40px;
        background-color: orangeRed;
        bottom: 0;
        z-index: 1001;
    }
    .btn-asyn{
        position: absolute;
        right: .2rem;
        top: 8.8rem;
        width: .9rem;
        height: .9rem;
        line-height: .9rem;
        border-radius: 50%;
        font-size: .3rem;
        background-color: #ff4f18;
        color: #fff;
    }

    .confirm-wrap{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 4rem;
        height: 2rem;
        background-color: #fff;
    }

    /* option */
    .option{
        background-color: #eee;
        padding: .1rem;
        width: 100%;
        text-align: left;
    }
    .option .row{
        height: .5rem;
        line-height: .5rem;
        font-size: .3rem;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .option .row-name{
        width: 1.8rem;
    }
    .option .row .inp{
        display: inline-block;
        height: .4rem;
        width: 2.5rem;
        font-size: .26rem;
        vertical-align: middle;
    }
    .option .row .btn{
        display: inline-block;
        min-width: .6rem;
        height: .4rem;
        line-height: .4rem;
        padding: 0 .04rem;
        font-size: .26rem;
        background-color: #ff4f18;
        color: #fff;
    }
    .option .row-title{
        justify-content: space-between;
    }
    .option .row-roles{
        height: .75rem;
        justify-content: flex-start;
    }
    .option .row-roles .btn-move{
        width: .5rem;
        height: .5rem;
        line-height: .5rem;
        border-radius: 50%;
        margin-right: .2rem;
        text-shadow: 2px 2px .02rem #222;
        box-shadow: 2px 2px .02rem .02rem #222;
    }
    .option .row-roles .btn-move-1{
        background-color: #F08080;
    }
    .option .row-roles .btn-move-2{
        background-color: #228B22;
    }
    .option .row-roles .btn-move-3{
        background-color: #FFD700;
    }
    .option .row-roles .btn-move-4{
        background-color: #1E90FF;
    }
    .option .row-roles .btn-move-5{
        background-color: #778899;
    }
    .option .row-roles .btn-move-6{
        background-color: #9400D3;
    }
    .option .btn-asyn{
        position: static;
        margin-top: .2rem;
        width: 100%;
        height: .6rem;
        line-height: .6rem;
        font-size: .3rem;
        background-color: #ff4f18;
        border-radius: 0;
        color: #fff;
    }

    .lab{
        position: absolute;
        display: block;
        height: 16px;
        width: 16px;
        line-height: 16px;
        text-align: center;
        color: #888;
        font-size: 14px;
        margin: auto;
    }
    .lab-t{
        top: 0;
        left: 0;
        right: 0;
    }
    .lab-l{
        top: 0;
        bottom: 0;
        left: 0;
    }
    .lab-b{
        bottom: 0;
        left: 0;
        right: 0;
    }
    .lab-r{
        top: 0;
        bottom: 0;
        right: 0;
    }

    /* pc */
    /* .pc .map{
        width: 700px;
        height: 700px;
        margin-top: 10px;
        margin-bottom: 10px;
        border: 2px solid orangeRed;
    }
    .pc .death{
        width: 700px;
        height: 83.33333333px;
        border: 2px solid orangeRed;
    }
    .pc .death .cell .item,
    .pc .cell .item .block,
    .pc .cell .item .flag,
    .pc .cell .item .building,
    .pc .cell .item .card,
    .pc .role,
    .pc .role-color-7{
        font-size: 18px;
    }
    .pc .cell .item .flag{
        height: 32px;
        line-height: 32px;
    }
    .pc .role{
        width: 25px;
        height: 25px;
    }
    .pc .role-color-7{
        width: 35px;
        height: 35px;
    }
    .pc .block-building{
        border: 1px solid #fff;
    } */
</style>
