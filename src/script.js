;
(function () {
    const hamburger = document.querySelector('#hamburger'),
        container = document.querySelector('#container'), // null
        toc = document.querySelector('#toc');

    // const aa = document.getElementById('hamburger');
    // console.log(aa); // 效果相同

    // console.log(hamburger.classList);
    // console.log(container);
    // console.log(toc.style.display);

    const toggleTable = function () {
        if (hamburger.classList.contains('transFormed')) {
            hamburger.classList.remove('transFormed');
            toc.style.display = 'none';
        } else {
            hamburger.classList.add('transFormed');
            toc.style.display = 'block';
        }
    };

    // 根据屏幕缩进，来改变右侧栏的位置及宽度
    const checkScreen = function () {
        if (getComputedStyle(toc).left === '0px') {
            hamburger.classList.toggle('transFormed', false);
            toc.style.display = 'none';
        } else {
            //计算左边主内容区域的宽度，剩下宽度为侧边栏的
            //注意！！offset得到的是container右侧到视窗左边的位置！！
            const offset = container.getBoundingClientRect().right;
            toc.style.display = 'block';
            toc.style.left = offset + 'px';
        }
    };


    checkScreen();
    window.addEventListener('resize', checkScreen, false);
    window.toggleTable = toggleTable;
})();

// https://vivotx.ceping.com/Login/Elink?elink=Cga5XnbI1FLEJ27RA3zCbaMzxcChina25EboCbaMzxcChina25do7WqeV882zJV9tA5jap47ONmJssBA==&v=1#quiz%2Flogin-error
