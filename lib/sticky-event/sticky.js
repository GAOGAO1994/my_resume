'use strict';

;
(function () {
    'use strict';
    /**
     * 初始化界面
     * @param {!Element} container
     */

    function generatePage(container) {
        //    定义各标题栏
        var MSGS = ['个人简介', '项目经历', '实习经历', '教育经历', '个人技能', '简历说明'];

        // const t = container.querySelector('template');
        var toc = document.querySelector('#toc > ul');
        //
        // console.log(container,t);
        //    t2是#toc下的template
        var t2 = toc.querySelector('template');
        console.log(t2.content);

        MSGS.forEach(function (msg, i) {
            var h2 = container.querySelectorAll('h2')[i];
            // console.log(msg, i);
            // console.log(h2,i);
            if (h2) {
                // console.log(h2);
                //    更改sticky框的标题
                h2.textContent = msg;
                //    修正id（其实就是将空白符和感叹号，替换为‘-’的标题）
                h2.id = normalizeTitle(msg);
            }

            //    侧边栏菜单部分
            //    --深复制--侧边栏菜单节点！！！！！
            var tocClone = t2.content.cloneNode(true);
            var a = tocClone.querySelector('a');
            // console.log(tocClone,a);
            //    设置anchor的文本标题
            a.textContent = msg;
            //    设置anchor的链接地址（替换掉一些符号）
            a.href = '#' + normalizeTitle(msg);
            //    插入到侧边菜单的父容器中去
            toc.appendChild(tocClone);
        });
    }

    /**
     * 将空白符（空格，制表符，换行符等）和感叹号替换为‘-’
     */
    function normalizeTitle(title) {
        return title.replace(/[\s!]/g, '-');
    }

    var top = document.querySelector('nav').getBoundingClientRect().height;
    /**
    * @param {!Element} container #container容器
    * */
    function checkStickyChange(container) {
        var targets = Array.from(container.children);
        // console.log(targets); // div.subject *　６

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = targets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var target = _step.value;

                var targetInfo = target.getBoundingClientRect(),
                    stickyTarget = target.querySelector('.sticky'),
                    isShadow = Boolean(target.querySelector('.shadow'));
                var targetTop = targetInfo.top,

                // targetBottom是内容i 底部到顶部的高度减去 标题的高度
                targetBottom = targetInfo.bottom - stickyTarget.getBoundingClientRect().height;

                if (targetTop < top && targetBottom > top && !isShadow) {
                    fire(true, stickyTarget);
                    continue;
                }

                if ((targetTop >= top || targetBottom <= top) && isShadow) {
                    fire(false, stickyTarget);
                    continue;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }

    /**
     * 对指定的目标(target)触发'sticky-change'事件
     * 特别注意这里的事件由document发布，监听也应当由document监听
     * @param {boolean} stuck
     * @param {!Element} target Target element of event.
     * */

    function fire(stuck, target) {
        // 切换阴影
        target.classList.toggle('shadow', stuck); // 有则删除，没有添加

        // 如果为切换粘滞，更新侧边栏展开的栏目
        if (stuck) {
            allTocsItem.map(function (el) {
                // 对比黏滞目标是否与a的目标地址一致，若一致则添加class属性active，不一致移除
                var match = el.firstElementChild.getAttribute('href').slice(1) === target.firstElementChild.id;
                el.classList.toggle('active', match);
            });
        } else {
            //    向上滚动至停滞黏滞，回复原位
            var targetInfo = target.getBoundingClientRect();
            if (targetInfo.top > top) {
                target.style.top = '10px';
            }
        }
    }

    /**
     * 调整现有sticky框位置
     */
    function adjustStickyTarget() {
        var target = document.querySelector('.shadow');
        if (target) {
            var parent = target.parentElement,
                parentInfo = parent.getBoundingClientRect(),
                parentStyle = getComputedStyle(parent),
                paddingTop = Number.parseInt(parentStyle['padding-top']),
                paddingBottom = Number.parseInt(parentStyle['padding-bottom']);
            var _top = paddingTop - parentInfo.top,
                bottom = parentInfo.bottom - target.getBoundingClientRect().height - (paddingBottom + paddingTop),
                position = _top > 10 ? _top : 10;
            if (bottom > 0) {
                target.style.top = position + 'px';
                //    如果不需要ie9支持，选用translate3d，开启GPU渲染
                //     target.style.transform = 'translate3d(0, '+(position - 10) + 'px, 0)';
            }
        }
    }

    /**
     * Prevent default
     * @param {Element} el
     * @param {MouseEvent} event
     */
    function scrollToHeader(el, event) {
        event.preventDefault(); // 阻止冒泡！！！！
        var header = document.querySelector('#' + normalizeTitle(el.textContent));

        if (header) {
            var parent = header.parentElement.parentElement;
            // 让页面平滑滚动到指定位置
            window.scrollTo({
                top: parent.offsetTop - 48,
                left: 0,
                behavior: 'smooth'
            });
        }

        //    移动端模式下关闭菜单栏
        if (getComputedStyle(toc).left === '0px') {
            hamburger.classList.toggle('transFormed', false);
            toc.style.display = 'none';
            console.log('closed');
        }
    }

    /**
    * *****开始执行*******
     *
    * 1、初始化界面
    * */
    var container = document.querySelector('#container'),
        hamburger = document.querySelector('#hamburger'),
        toc = document.querySelector('#toc');
    generatePage(container);

    var allTocsItem = Array.from(toc.querySelectorAll('.toc-item'));

    /**
    * 2. 初次检测
    * */

    checkStickyChange(container);
    adjustStickyTarget();

    /**
     * 3. 注册事件监听器
    * */

    var throttler = null;
    var throttledCheck = function throttledCheck() {
        checkStickyChange(container);
        adjustStickyTarget();
        /* throttler = throttler || setTimeout(() => {
           throttler = null;
        }, 10); */
    };
    window.addEventListener('scroll', throttledCheck, false);
    window.addEventListener('resize', throttledCheck, false);

    window.scrollToHeader = scrollToHeader;
})();