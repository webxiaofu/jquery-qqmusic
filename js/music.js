$(function(){
    var $audio = $("audio");
    var player = new Player($audio);
    var progress;
    var voiceprogress;
    var lyric;
    
    //3、ajax加载本地歌曲json文件
    getPlayerList();
    
    function getPlayerList(){
        $.ajax({
            url: "./source/musiclist.json",
            dataType:"json",
            
            success:function (data) {
                player.musicList = data;
                //3.1遍历获取到的数据, 创建每一条音乐
                var $musicList = $(".overview ");
                $.each(data,function(index,ele){
                    var $item = crateMusicItem(index, ele);
                    $musicList.append($item);
                    
                });
                //初始化歌曲信息
                initMusicInfo(data[0]);
                initMusicLyric(data[0]);
                //0、自定义滚动条样式
                $(".overview").mCustomScrollbar();
                
            },
            error:function(e){
                console.log(e)
            },
            
        });

        // $.getJSON("./source/musiclist.json", "", function (data) {
        //     　  //each循环 使用$.each方法遍历返回的数据date
        //     player.musicList = data;
        //     // 3.1遍历获取到的数据, 创建每一条音乐
        //     var $musicList = $(".overview ");
        //     $.each(data,function(index,ele){
        //         var $item = crateMusicItem(index, ele);
        //         $musicList.append($item);
                
        //     });
        //     //初始化歌曲信息
        //     initMusicInfo(data[0]);
        //     initMusicLyric(data[0]);
        //     //0、自定义滚动条样式
        //     $(".overview").mCustomScrollbar();
        // });
    }
    //2、初始化歌曲信息
    function initMusicInfo(music) { 
        var $songimg= $(".img")
        var $songname= $(".songname a")
        var $singername= $(".singername a")
        var $zhuanjiname= $(".zhuanjiname a")
        var $music_progress_name= $(".music_progress_name")
        var $music_progress_time= $(".music_progress_time")
        var $mskbg =$(".msk-bg")
 
        $songimg.attr("src",music.cover)
        $songname.text(music.name)
        $singername.text(music.singer)
        $zhuanjiname.text(music.album)
        $music_progress_name.text(music.name+" / "+music.singer)
        $music_progress_time.text("00:00 / "+music.time)
        $mskbg.css("background","url('"+music.cover+"')")


     }
     //初始化歌词信息
     function initMusicLyric(music){
        lyric = new Lyric(music.link_lrc);
        var $songlyric=$(".song-lyric");
        //清空上一首歌音乐的时间
        $songlyric.html("");
        lyric.loadLyric(function () {
            // 创建歌词列表
            $.each(lyric.lyrics, function (index, ele) {
                var $item = $("<li>"+ele+"</li>");
                $songlyric.append($item);
            });
        });
    }
    
     //初始化进度条信息
     initProgress();
    function initProgress(){
    var $musicprogressbar=$(".music-progress-bar")
    var $musicprogressline=$(".music-progress-line")
    var $musicprogressdot=$(".music-progress-dot")
    progress =  Progress($musicprogressbar,$musicprogressline,$musicprogressdot)
    progress.progressClick(function(value){
        player.musicSeekTo(value);
    });
    progress.progressMove(function(value){
        player.musicSeekTo(value);
    });

    var $musicvoicebar=$(".music-voice-bar")
    var $musicvoiceline=$(".music-voice-line")
    var $musicvoicedot=$(".music-voice-dot")
    voiceprogress =  Progress($musicvoicebar,$musicvoiceline,$musicvoicedot)
    voiceprogress.progressClick(function(value){
        player.musicVoiceSeekTo(value);
    });
    voiceprogress.progressMove(function(value){
        player.musicVoiceSeekTo(value);
    }); 

        
    }
    
    initEvents();
    //事件监听函数
    function initEvents() {    
    //1、监听歌曲移入移出事件
$(".overview").delegate(".songlist","mouseenter",function(){
    $(this).find(".list-menu").stop().fadeIn(100)
    $(this).find(".time a").stop().fadeIn(100)
    //隐藏时长
    $(this).find(".time span").stop().fadeOut(100)
});
$(".overview").delegate(".songlist","mouseleave",function(){
    $(this).find(".list-menu").stop().fadeOut(100)
    $(this).find(".time a").stop().fadeOut(100) 
    //显示时长
    $(this).find(".time span").stop().fadeIn(100) 
});
//添加子菜单播放按钮的监听事件
var $musicPlay = $(".music-play");
$(".overview").delegate(".list-menu-play","click",function(){
    var $item = $(this).parents(".songlist");
    console.log($item.get(0).index);
    console.log($item.get(0).music);
    
    //点击播放改变成播放状态
    $(this).toggleClass("list-menu-play2");
    //其他变回暂停状态
    $item.siblings().find(".list-menu-play").removeClass("list-menu-play2");
    //同步底部播放按钮
    if($(this).hasClass("list-menu-play2")){
        // 当前子菜单的播放按钮是播放状态
        $musicPlay.addClass("music-play2");
    }else{
        // 当前子菜单的播放按钮是暂停状态
        $musicPlay.removeClass("music-play2");
    }

    //点击播放则切换序号的状态
    $item.find(".number").toggleClass("number2");
    $item.siblings().find(".number").removeClass("number2");
    //播放音乐
    player.playMusic($item.get(0).index, $item.get(0).music);
    //切换歌曲后，改变相应的歌曲信息
    initMusicInfo($item.get(0).music);
    //切换歌曲后，改变相应的歌词信息
    initMusicLyric($item.get(0).music);
    
});
//添加子菜单删除按钮的监听事件
$(".overview").delegate(".list-menu-dle","click",function(){
    // 找到被点击的音乐
    var $item=$(this).parents(".songlist")
    // 判断当前删除的是否是正在播放的
    if($item.get(0).index == player.currentIndex){
        $(".music-next").trigger("click")
    }
    //删除这条音乐ul
    $item.remove();
    player.changeIndex($item.get(0).index)
    //重新对歌曲排序
    $(".songlist").each(function (index, ele) {
        ele.index = index;
        $(ele).find(".number").text(index + 1);
    });

});
//监听底部前进后退播放按钮
$musicPlay.click(function() {
    if(player.currentIndex == -1){
        // 没有播放过音乐
        $(".songlist").eq(0).find(".list-menu-play").trigger("click");
    }else{
        // 已经播放过音乐
        $(".songlist").eq(player.currentIndex).find(".list-menu-play").trigger("click");
    }
});
$(".music-pre").click(function(){
    $(".songlist").eq(player.preIndex()).find(".list-menu-play").trigger("click");
});
$(".music-next").click(function(){
    $(".songlist").eq(player.nextIndex()).find(".list-menu-play").trigger("click");
}); 
// 监听播放进度
player.musicTimeUpdate(function (currentTime, duration, timeStr) {
    //时间同步
    $(".music_progress_time").text(timeStr);
    //实现进度条按比例增长
    var value = currentTime / duration * 100;
    progress.setProgress(value);
    //歌词同步
    var index = lyric.currentIndex(currentTime);
            var $item = $(".song-lyric li").eq(index);
            $item.addClass("cur");
            $item.siblings().removeClass("cur");

            // 实现歌词滚动
            if(index <= 4) return;
            $(".song-lyric").css({
                marginTop: (-index + 4) * 30
            });
});
$(".music-voice").click(function(){
    // 图标切换
    $(this).toggleClass("music-voice2")
    // 声音切换
    if($(this).hasClass("music-voice2")){
        // 变为没有声音
        player.musicVoiceSeekTo(0);
    }else{
        // 变为有声音
        player.musicVoiceSeekTo(1);
    }
});

//监听底部喜欢循环等按钮
$(".music-mode").click(function(){

        $(this).toggleClass("music-mode2")
        console.log(1);
        
        $(".music-mode").click(function(){
            $(this).toggleClass("music-mode3")
            console.log(2);
            
            $(".music-mode").click(function(){
                $(this).toggleClass("music-mode4")
                console.log(3);
                
            })
        })
});
// var kk=0;
// $(".music-mode").click(function(){
//     kk+=1;
//     switch(kk){
//         case 1 :$(this).toggleClass("music-mode2");
//         break;
//         case 2 :$(this).toggleClass("music-mode3");
//         break;
//         case 3 :$(this).toggleClass("music-mode4");
//         break;
//         case 4 :kk=0;
//         break;
//     }
// });






$(".music-fav").click(function(){
    $(this).toggleClass("music-fav2")
});
$(".music-only").click(function(){
    $(this).toggleClass("music-only2")
});
     



    }



//定义一个方法创建一条音乐信息
function crateMusicItem(index,music){
    var $item=$( ""+
        
    "<ul class=\"songlist\">\n"+
        "<input type=\"checkbox\">\n"+
        "<li class=\"number\">"+(index+1)+"</li>\n"+
        "<li class=\"name\">"+music.name+" " +
            "<div class=\"list-menu\">\n"+
                "<a href=\"javascript:;\" title=\"播放\" class=\"list-menu-play\"></a>\n"+
                "<a href=\"javascript:;\" title=\"添加\"></a>\n"+
                "<a href=\"javascript:;\" title=\"下载\"></a>\n"+
                "<a href=\"javascript:;\" title=\"分享\"></a>\n"+
            "</div>\n"+

        "</li>\n"+
        "<li class=\"singer\">"+music.singer+"</li>\n"+
        "<li class=\"time\">\n"+
            "<span>"+music.time+"</span>\n"+
            "<a href=\"javascript:;\" title=\"删除\" class=\"list-menu-dle\"></a>\n"+
        "</li>\n"+
    "</ul>");
    $item.get(0).index = index;
    $item.get(0).music = music;

    return $item;
     

}
    
});
