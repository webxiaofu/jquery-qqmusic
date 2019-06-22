(function (window) {
    function Progress($musicprogressbar,$musicprogressline,$musicprogressdot) {
        return new Progress.prototype.init($musicprogressbar,$musicprogressline,$musicprogressdot);
    }
    Progress.prototype = {
        constructor: Progress,
        isMove: false,
        init: function ($musicprogressbar,$musicprogressline,$musicprogressdot) {
            this.$musicprogressbar=$musicprogressbar
            this.$musicprogressdot=$musicprogressdot
            this.$musicprogressline=$musicprogressline
            
        },
        progressClick:function(callBack){
            var $this = this; // 此时此刻的this是progress
            // 监听背景的点击
            this.$musicprogressbar.click(function (event) {
                // 获取背景距离窗口默认的位置
                var normalLeft = $(this).offset().left;
                // 获取点击的位置距离窗口的位置
                var eventLeft = event.pageX;
                // 设置前景的宽度
                $this.$musicprogressline.css("width", eventLeft - normalLeft);
                $this.$musicprogressdot.css("left", eventLeft - normalLeft);
                var value = (eventLeft - normalLeft) / $(this).width();
                callBack(value);
            });
        },
        progressMove:function(callBack){
            var $this=this
            var normalLeft = this.$musicprogressbar.offset().left;
            var barWidth = this.$musicprogressbar.width();
            var eventLeft
            // 1.监听鼠标的按下事件
            this.$musicprogressbar.mousedown(function () {
                 // 2.监听鼠标的移动事件
                 $this.isMove = true;
                 $(document).mousemove(function (event) {
                    // 获取背景距离窗口默认的位置
                    
                    // 获取点击的位置距离窗口的位置
                     eventLeft = event.pageX;
                    var offset = eventLeft - normalLeft;
                    //限制移动，不可以超出范围
                    if(offset >=0 && offset <= barWidth){
                        // 设置前景的宽度
                    $this.$musicprogressline.css("width", offset);
                    $this.$musicprogressdot.css("left", offset);
                    }
                    
                });
            })
            // 3.监听鼠标的抬起事件
            $(document).mouseup(function () {
                $(document).off("mousemove");
                $this.isMove = false;
                var value = (eventLeft - normalLeft) / barWidth;
                callBack(value);
            });

        },
        setProgress: function (value) {
            if(this.isMove) return;
            if(value < 0 || value > 100) return;
            this.$musicprogressline.css({
                width: value+"%"
            });
            this.$musicprogressdot.css({
                left: value+"%"
            });
        }
        
        
        
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);