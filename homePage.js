/**
 * 搜索框
 */
function baiduSuggestion(word, callback) {
    jsonp('http://suggestion.baidu.com/su',
        {wd: word}, 'cb', function (data) {
            callback(data);
        });
}
window.onload = function () {
    var searchInput = document.getElementById('#text1');
    var searchBtn = document.getElementById('#text2');
    var div = document.getElementsByTagName("div");
    var ul = div.getElementsByTagName('ul');
    ul.onclick = function (e) {
        e || (e = window.event);
        var target = e.target || e.srcElement;
        window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(target.innerHTML), '_blank');
    };
    searchBtn.onclick = function () {
        var val = searchInput.value;
        if (val) {
            baiduSuggestion(val, function (data) {
                ul.innerHTML = '';
                var list = data.s;
                if (list.length === 0) {
                    return;
                }
                var fragement = document.createDocumentFragment();
                for (var i = 0, len = list.length; i < len; i++) {
                    var li = document.createElement('li');
                    li.innerHTML = list[i];
                    fragement.appendChild(li);
                }
                ul.appendChild(fragement);
            })
        }
    }
}


/**
 * 轮播图
 * @type {Element}
 */
var oPlaying = document.getElementById("playing");
var inner = document.getElementById("inner");
var lis = inner.getElementsByTagName("li");
var list = document.getElementById("focus");
var oLis = list.getElementsByTagName("span");
var step = 0;
var interval = 2000;
var autoTimer = 0;
var first = inner.getElementsByTagName("li")[0];
var cloneLi = first.cloneNode(true);
inner.appendChild(cloneLi);
inner.style.width = inner.offsetWidth + first.offsetWidth + "px";
function animation(ele, obj) {
    var time = null, interval = 100, duration = 2000;
    var begin = {};
    var change = {};
    var linear = function (t, d, c, b) {
        return t / d * c + b;
    };
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            begin[key] = parseFloat(getComputedStyle(ele, null)[key]);
            change[key] = obj[key] - begin[key]
        }
    }
    clearInterval(ele.timer);
    ele.timer = setInterval(function () {
        time += interval;
        if (time > duration) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    ele.style[key] = key == 'opacity' ? obj[key] : obj[key] + "px";
                }
            }
            clearInterval(ele.timer);
            return;
        } else {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var posCur = linear(time, duration, change[key], begin[key]);
                    ele.style[key] = key == 'opacity' ? posCur : posCur + "px";
                }
            }
        }
    }, 15)
}
autoTimer = setInterval(autoMove, interval);
function autoMove() {
    if (step >= lis.length + 1) {
        step = 0;
        inner.style.left = -step * 1349 + "px";
    }
    step++;
    animation(inner, {'left': -step * 1349});
    bannerTip(step)
}

function bannerTip(n) {
    if (n == lis.length + 1) {
        n = 0;
    }
    for (var i = 0; i < oLis.length; i++) {
        oLis[i].className = "";
    }
    oLis[n].className = "select";
}

oPlaying.onmouseover = function () {
    clearInterval(autoTimer);
};
oPlaying.onmouseout = function () {
    autoTimer = setInterval(autoMove, interval);
};
function change() {
    for (var i = 0; i < oLis.length; i++) {
        oLis[i].index = i;
        oLis[i].onclick = function () {
            step = this.index;
            animation(inner, {'left': -step * 1349}, 1000);
            bannerTip(step);
        }
    }
}
change();


/**
 * 穿墙
 */
function a2d(a) {
    return a * 180 / Math.PI;//弧度的计算：当前多少弧度
} //判断移入的方向
function hoverDir(ele, oEvent) {
    var x = ele.offsetLeft + ele.offsetWidth / 2 - oEvent.clientX;//x的最小值是-ele.offsetWidth / 2    最大值是ele.offsetWidth / 2
    var y = ele.offsetTop + ele.offsetHeight / 2 - oEvent.clientY;
    console.log(Math.atan2(y, x));
    return Math.round((a2d(Math.atan2(y, x)) + 180) / 90) % 4;//Math.atan2(y, x ) 返回的值是-PI---PI之间的数----所以a2d(a)返回的值是一个0到180的数  -----所以hoverDir返回值是一个0,1,2,3
}


//Math.atan2(y, x)   以盒子的中心位置为坐标原点，当从盒子的右侧滑入时
function hoverGo(ele) {
    var oS = ele.children[0];//表示的就是SPAN标签
    ele.onmouseover = function (ev) {
        var oEvent = ev || window.event;
        var oFrom = oEvent.fromElement || oEvent.relatedTarget;//relatedTarget 事件属性返回与事件的目标节点相关的节点。对于 mouseover 事件来说，该属性是鼠标指针移到目标节点上时所离开的那个节点。对于 mouseout 事件来说，该属性是离开目标时，鼠标指针进入的节点。
        if (ele.contains(oFrom))return;//contains方法。如果A元素包含B元素，则返回true，否则false。---->表明鼠标已经移入到盒子里了
        var dir = hoverDir(ele, oEvent); //根据方向重新设定遮罩层位置
        switch (dir) {
            case 0:
                oS.style.left = '135px';
                oS.style.top = 0;
                break;
            case 1:
                oS.style.left = 0;
                oS.style.top = '135px';
                break;
            case 2:
                oS.style.left = '-135px';
                oS.style.top = 0;
                break;
            case 3:
                oS.style.left = 0;
                oS.style.top = '-135px';
                break;
        }
        startMove(oS, {top: 0, left: 0});
    };
    ele.onmouseout = function (ev) {
        var oEvent = ev || event;
        var oTo = oEvent.toElement || oEvent.relatedTarget;
        if (ele.contains(oTo))return;
        var dir = hoverDir(ele, oEvent); //根据移除的方向遮罩层进行相应的运动
        switch (dir) {
            case 0:
                startMove(oS, {left: 135, top: 0});
                break;
            case 1:
                startMove(oS, {left: 0, top: 60});
                break;
            case 2:
                startMove(oS, {left: -135, top: 0});
                break;
            case 3:
                startMove(oS, {left: 0, top: -60});
                break;
        }
    };
}
window.onload = function () {
    var oUl = document.body.children[0];
    var aLi = oUl.children;
    for (var i = 0; i < aLi.length; i++) {
        hoverGo(aLi[i]);
    }
};
function getStyle(ele, sName) {
    return (ele.currentStyle || getComputedStyle(ele, false))[sName];
}
function startMove(ele, obj, options) {//obj--当前元素  obj--->对象-->
    options = options || {};
    options.time = options.time || 700;
    options.type = options.type || 'ease-out';
    var begin = {};
    var change = {};
    for (var attr in obj) {//遍历数组
        begin[attr] = parseFloat(getStyle(ele, attr));//起始值：当前元素属性开始的值
        if (isNaN(begin[attr])) {
            switch (attr) {
                case 'top':
                    begin[attr] = ele.offsetTop;
                    break;
                case 'left':
                    begin[attr] = ele.offsetLeft;
                    break;
                case 'width':
                    begin[attr] = ele.offsetWidth;
                    break;
                case 'height':
                    begin[attr] = ele.offsetHeight;
                    break;
                case 'opacity':
                    begin[attr] = 1;
                    break;
                case 'borderWidth':
                    begin[attr] = 0;
                    break;
            }
        }
        change[attr] = obj[attr] - begin[attr];
    }
    var duration = Math.floor(options.time / 30);
    var n = 0;
    clearInterval(ele.timer);
    ele.timer = setInterval(function () {//这个类似于动画库----animate
        n++;//(类似于动画库中的时间累加)
        for (var attr in obj) {//start[attr]  开始的位置
            switch (options.type) {
                case 'linear':
                    var cur = begin[attr] + change[attr] * n / duration;
                    break;
                case 'ease-in':
                    var a = n / duration;
                    var cur = begin[attr] + change[attr] * Math.pow(a, 3);
                    break;
                case 'ease-out':
                    var a = 1 - n / duration;
                    var cur = begin[attr] + change[attr] * (1 - Math.pow(a, 3));
                    break;
            }
            if (attr == 'opacity') {
                ele.style.opacity = cur;
                ele.style.filter = 'alpha(opacity:' + cur * 100 + ')';
            } else {
                ele.style[attr] = cur + 'px';
            }
        }
        if (n == duration) {
            clearInterval(ele.timer);
            options.end && options.end();
        }
    }, 30);
}


/**
 * 购物车定位
 */
window.onscroll = function computedDisplay() {
    var oFloor = document.getElementById("floor");
    var top = document.documentElement.clientHeight || document.body.clientHeight;
    var oBody = document.body.scrollTop;
    if (oBody <= top * 2) {
        oFloor.style.display = "none"
    } else {
        oFloor.style.display = "block"
    }
};
/**
 * 回到顶部
 * @type {Element}
 */
var oFloor = document.getElementById("floor");
var backTop=oFloor.getElementsByTagName("li");
var back=backTop[5];
back.onclick=function(){
    window.onscroll=null;
    /*utils.win('scrollTop',0)*/
    var target=utils.win('scrollTop');
    var duration=500;
    var interval=10;
    var step=(target/duration)*interval;
    clearInterval(timer);
    var timer=setInterval(function(){
        var curT=utils.win('scrollTop');
        if(curT<=0){
            clearInterval(timer);
            //window.onscroll=computedDisplay;
            return;
        }
        curT-=step;
        utils.win('scrollTop',curT)
    },interval);
    if(target==0){
        oFloor.style.display = "none"
    }
};
/**
 *选项卡
 */
var oTab = document.getElementById("tab");
var lis = oTab.getElementsByTagName("li");
var oDivs = oTab.getElementsByTagName("div");
for (var i = 0; i < lis.length; i++) {
    var li = lis[i];
    li.index = i;
    li.onclick = function () {
        for (var j = 0; j < lis.length; j++) {
            lis[j].className = "";
            oDivs[j].className = "";
        }
        this.className = "show1";
        oDivs[this.index].className = "show1";
    }
}
/**
 * 回到顶部
 */
