/**
 * Created by Administrator on 2018/8/10.
 */
var newsRender = (function () {
    var _newsDate = null;//=>加下划线代表当前属性在该作用域下是公用的
    var _newsBox = document.getElementById('newsBox');
    // 使用ajax获取到需要绑定的数据
    function queryDate() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'my.json', false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                _newsDate = utils.toJson(xhr.responseText);
            }
        }
        xhr.send(null);

    }

    //根据获取的数据，把html绑定在页面当中
    function bindHTML() {
        if (!_newsDate) return;
        var str = ``;
        for (var i = 0; i < _newsDate.length; i++) {
            var item = _newsDate[i];
            str += `  <li>
        <a href="${item.link}">
            <div class="imgBox">
                <img src="" data-img="${item.img_data}" alt="">
            </div>
            <div class="con">
                <p class="title">${item.desc}</p>
                <span>${item.hot}</span>
            </div>
        </a>
    </li>`;
        }
        _newsBox.innerHTML = str;
    }

    //computed计算出那些图片需要延时加载
    function computed() {
        var imgList = _newsBox.getElementsByTagName('img');
        for (var i = 0; i < imgList.length; i++) {
            var curImg = imgList[i];
            var curBox = curImg.parentNode;
            if(curImg.isLoad)continue;//如果当前图片已经处理过了，我们不需要再重复处理，直接进入下一轮循环，验证下一章图片是否需要加载即可
            //获取图片所在盒子底边框距离body的距离A和浏览器底边框距离
            // body的距离B
            var A = curBox.offsetHeight + curBox.offsetTop;
            var B = document.documentElement.scrollTop + document.documentElement.clientHeight;
            if (A <= B) {
                //=>当前这张图片符合延迟加载的条件，我们开始延迟加载
                lazyImg(curImg);
            }
        }
    }

    //给某一张图片进行延迟加载
    function lazyImg(curImg) {
        // curImg.isLoad = true;//避免重复加载，isLoad是自定义属性
        var tempImg = new Image();
        tempImg.onload = function () {
            curImg.style.opacity=0;
            curImg.src = tempImg.src;
            // curImg.style.display = 'block';
            // 用透明度实现
            fadeIn(curImg);
            tempImg=null;
        }
        tempImg.src = curImg.getAttribute('data-img');
    }
// 透明度实现的懒加载
    function fadeIn(ele){
        if(ele.isLoad)return;//函数只能执行一次
        ele.style.opacity=0; // 先把元素的透明度设置为0,然后用定时器累加一个数，把这个数赋给元素的opacity; 当这个opacity 大于1 时； 清除定时器
        var opa=0.1;
        var timer=setInterval(function () {
            opa+=0.1;
            ele.style.opacity=opa;
            if(opa>=1){
                ele.style.opacity=1;
                clearInterval(timer);
                // 配合透明度
                ele.isLoad=true;
            }
        },20)
    }
    return {
        init: function () {
            //=>模块的入口：在入口当中协调控制，先做什么，再做什么
            queryDate();
            bindHTML();
            setTimeout(computed,500);//当页面中数据加载完成，过500ms再执行图片的延迟加载操作//=>也可用window.onload=computed:这个事件就是当整个页面都加载完毕才触发的
            window.onscroll=computed;//当滚动到具体的区域的时候，我们把当前符合条件的图片做延迟加载
        }
    }
})();
newsRender.init();