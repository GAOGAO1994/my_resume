;
(function () {
    'use strict';

//    修改初始大小
    function inView() {
        if (pictures.length) {
            requestAnimationFrame(function () {
                var windowTop = window.pageYOffset,
                    windowBottom = windowTop + window.innerHeight;
                var imageInfo,
                    pictureTop,
                    pictureBottom;

            //    检查每幅图片
                for (var i = 0; i < pictures.length; i++) {
                    imageInfo = pictures[i].getBoundingClientRect();
                    pictureTop = windowTop + imageInfo.top;
                    pictureBottom = pictureTop + imageInfo.height;

                    if (windowTop < pictureBottom && windowBottom > pictureTop) {
                        loadFullImage(pictures[i]);
                    }
                    // } else {
                    //     pictures[i].src = pictures[i].getAttribute('data-origin');
                    //     pictures[i].classList.remove('reveal');
                    //     pictures[i].classList.add('preview');
                    // }
                }

            //    更新需要恢复的照片(防止infinite load加载更多)
                pictures = [].slice.call(document.querySelectorAll('.progressive .preview'));
            });
        }
    }

    /**
     * 恢复指定图片
     * @param {Element} item
     */
    function loadFullImage(item) {
        var href = item && (item.getAttribute('data-actual') || item.href);
        if (!href) return;

    //    预加载，放入缓存
        var img = new Image();
        img.src = href;
        img.onload = function () {
            // 从缓存中读取
            requestAnimationFrame(function () {
                item.src = href;
                item.classList.remove('preview');
                item.classList.add('reveal');
            })
        }
    }

    /**
     * 每0.5s执行一次
     */
    function throttledLoad() {
        throttler = throttler || setTimeout(function () {
            throttler = null;
            inView();
            console.log('okok');
        }, 500)
    }


    var pictures = [].slice.call(document.querySelectorAll('.progressive .preview'));
    var throttler = null;

    //初始检查
    inView();

    window.addEventListener('scroll', throttledLoad,false);
    window.addEventListener('resize', throttledLoad,false);
})();
