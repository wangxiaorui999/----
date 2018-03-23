console.log = function () { };
//	==================================将点击切换的函数进行分装==================================
var lastShopID = 0;
var sortType ;
var loadingIconURL = "https://mall-res.manboker.com/newmall/CN/loading.gif";
var defaultPic = "//moman-res-ali.manboker.com/newmall/DefaultPicture/Online-retailers_loading_photoframe.jpg";
var clickCheck = false;
var AllowClick = true;
var mfxdflag = true;
var isClick = false;
//	==================================将点击切换的函数进行分装==================================
function mfxd(sortType, id, callback) {
    jQuery.ajax({
        type: "get",
        async: true,
        url: app.urls.StudioContentURL + "&sortType=" + sortType + "&lastShopId=" + id,
        timeout: 25000,
        cache: true,
        beforeSend: function (request) {
            $('div').remove('.waiting');
            var html = '<div class="waiting">' +
                '<img src="' + loadingIconURL + '" />' +
                '</div>';
            $(".jtnr").append(html);
            AllowClick = false;
        },
        //==================请求的数据==============================
        success: function (data) {
            $('div').remove('.waiting');
            //$(".jtnr").css("height", "100%");
            RenderDom(data);
        }
    });
}

var AllShopMall = {
    // 分装点击的切换的下拉框事件
    select_click(ops) {
        lastShopID = 0;
        $(".Prompt").css("display", "none");
        if ($(".Shop-banxin").scrollTop() > 3170) {
            $('.Shop-banxin').animate({ scrollTop: 3150 }, 0);
        };
        ops.parent().parent().parent().parent().siblings('div').removeClass('active')
        $('select .ck ul').css('z-index', '888888')
        ops.addClass('cur').siblings().removeClass('cur');

        var txtx = ops.html();
       
        if (ops.parent().siblings().hasClass('down1')) {
            ops.parent().siblings().addClass('up').removeClass('down1')
        }
        ops.parent().siblings().addClass('up').removeClass('stopClick')
        ops.parent().siblings('span').html(txtx);
        ops.parent().addClass('hide');
        if (ops.hasClass("cur")) {
            ops.addClass("active").siblings('li').removeClass("active");
        }
        var sortId = ops.attr("data-id");
        if ($("ul .cur").text() == $("ul .ck span").text()) {
            $("ul .ck span").addClass("active")
        }
        console.log(sortId)
        //$(".jtnr").html('');
        Counter(txtx + "按钮点击-全部小店页面");
        mfxd(sortId, 0);
    },
    //销量和或赞数点击
    Tap_click(tapli) {
        if (AllowClick) {
            $(".Prompt").css("display", "none");
            if ($(".Shop-banxin").scrollTop() > 3170) {
                console.log("ccccc");
                $('.Shop-banxin').animate({ scrollTop: 3180 }, 0);
            };
            tapli.addClass("active").siblings().removeClass("active");
            $(".zxxd ul .ck span").removeClass("active");
            $(".zxxd ul .ck  .second  li").removeClass("active");
            if ($("ul .ck span").hasClass("up")) {
                $("ul .ck span").removeClass("up").addClass("down")
            }
            if ($("ul .ck span").hasClass("stopClick")) {
                $("ul .ck span").removeClass("stopClick").addClass("down")
            }
            if ($("ul .ck span").hasClass("down1")) {
                $("ul .ck span").removeClass("down1").addClass("down")
            }
            $("ul .ck span").removeClass("active")
            $("ul .ck .second li").removeClass("active")
            $(".select .second").addClass("hide")
            var sortId = tapli.attr("data-id");
            console.log(sortId);
            var name = $(this).text();
            console.log(name);
            Counter(name + "按钮点击-全部小店页面");
            //$(".jtnr").html('');
            mfxd(sortId, 0);
        }
    },
    Bind_click() {
        $(".xlyx").off("click").on("click", function () {
           // $(".jtnr").css("height", "100px");
            //$(".jtnr").html('');
            isClick = true;
            AllShopMall.Tap_click($(".xlyx"))
        }),
            $(".hzs").off("click").on("click", function () {
               // $(".jtnr").css("height", "100px");
                //$(".jtnr").html('');
                isClick = true;
                AllShopMall.Tap_click($(".hzs"))               
            }),
            $(".newpm").off("click").on("click", function () {
                //$(".jtnr").css("height", "100px");
                isClick = true;
                AllShopMall.select_click($(".newpm"))
            }),

            $(".newfb").off("click").on("click", function () {
                //$(".jtnr").css("height", "100px");
                isClick = true;
                AllShopMall.select_click($(".newfb"))
            }),
            $(".newxshop").off("click").on("click", function () {
                //$(".jtnr").css("height", "100px");
                isClick = true;
                AllShopMall.select_click($(".newxshop"));
            })
    }
}
AllShopMall.Bind_click();
function RenderDom(data) {
    console.log(data);
    if (data.StatusCode == 200) {
        
        clickCheck = false;
        if (data.Data.length == 0) {
            $(".Prompt").css("display", "block")
            setTimeout(function () {
                $(".Prompt").css("display", "none")
            }, 1500)
            clickCheck = true;
            AllowClick = true;
            return false;
        }
        var html = '';
        for (var i = 0; i < data.Data.length; i++) {
           

            var certifiedImgs = ["", "https://mall-res.manboker.com/newmall/CN/newstudio/myspace_ordinary.png", "https://mall-res.manboker.com/newmall/CN/newstudio/myspace_Artist.png"];
            
            if (data.Data.length == 1) {
                if (lastShopID == data.Data[0].Id) {
                    clickCheck = true;
                    return false;
                }
            }

            if (data.Data[i].ProductInfos.length > 0) {
                lastShopID = data.Data[data.Data.length - 1].Id;
                // console.log(lastShopID);
                var santutop = data.Data[i];
                var santu = data.Data[i].ProductInfos;
                if (santutop.UserSign == "") {
                    santutop.UserSign = "魔漫相机，遇见更好的自己"
                }
                var authorContent = '<div class="yt-top  clearfix">' +
                    '<div class="yt-top-l">' +
                    '<img src="' + app.appendWebpForImgUrl(santutop.UserIcon).replace("http://", "https://") + '"  uid="' + santutop.UserId + '"   CheckImgExists()    alt=""    class="hha"  /></div>' +
                    '<div class="yt-top-c">' +
                    '<div ><p  class="top">店主: ' + santutop.UserName + '</p> <img src= "' + app.appendWebpForImgUrl(certifiedImgs[data.Data[i].CertifiedType]).replace("http://", "https://") + '" /></div>' +
                    '<p class="bot">' + eval("'" + santutop.UserSign + "'") + '</p> </div>';
                if (data.Data[i].ProductInfos.length == 3) {
                    html += '<div class="santu">' +
                        authorContent +
                        '<div class="yt-top-r"   style="display:none;">' +
                        '<p>关注</p> </div> </div> ' +
                        '<div class="st-b-tu  clearfix">' +
                        '<div class="st-b-l p   pictureClick"  style="background:url(' + app.getOptimizedImgUrl(santu[0].Poster, 350).replace("http://", "https://") + ' ) no-repeat center center;background-size:cover" uid="' + santutop.UserId + '"  pid="' + santu[0].ProductId + '"></div>' +
                        '<div class="st-b-r">' +
                        '<div class="st-b-r-t p  pictureClick"    style="background:url(' + app.getOptimizedImgUrl(santu[1].Poster, 350).replace("http://", "https://") + ' ) no-repeat center center;background-size:cover" uid="' + santutop.UserId + '"      pid="' + santu[1].ProductId + '"></div>' +
                        '<div class="st-b-r-b   p  pictureClick"   style="background:url(' + app.getOptimizedImgUrl(santu[2].Poster, 350).replace("http://", "https://") + ' )no-repeat center center;background-size:cover" uid="' + santutop.UserId + '"      pid="' + santu[2].ProductId + '"></div>' +
                        '</div> </div> </div>'

                } else if (data.Data[i].ProductInfos.length == 1) {
                    html += '<div class="ertu">' +
                        authorContent +
                        '<div class="yt-top-r"  style="display:none;">' +
                        '<p>关注</p> </div> </div> ' +
                        '<div class="et-b-tu p    pictureClick"  style="background:url(' + app.getOptimizedImgUrl(santu[0].Poster, 350).replace("http://", "https://") + ' )no-repeat center center;background-size:cover"   uid="' + santutop.UserId + '" pid="' + santu[0].ProductId + '"></div>' +
                        '</div> </div>'
                } else if (data.Data[i].ProductInfos.length == 2) {
                    html += '<div class="yitu">' +
                        authorContent +
                        '<div class="yt-top-r"   style="display:none;">' +
                        '<p>关注</p> </div> </div> ' +
                        '<div class="yt-bot clearfix ">' +
                        '<div class="yt-bot-l p  pictureClick "  style="background:url(' + app.getOptimizedImgUrl(santu[0].Poster, 350).replace("http://", "https://") + ' ) no-repeat center center;background-size:cover"  uid="' + santutop.UserId + '"    pid="' + santu[0].ProductId + '" ></div>' +
                        '<div class="yt-bot-r p  pictureClick"  style="background:url(' + app.getOptimizedImgUrl(santu[1].Poster, 350).replace("http://", "https://") + ' ) no-repeat center center;background-size:cover"   uid="' + santutop.UserId + '"      pid="' + santu[1].ProductId + '" ></div>' +
                        '</div>  </div> </div> ';

                }
            }
            
            
      
        }
        
        AllowClick = true;
        if (isClick){
            $(".jtnr").html(html);
            
            isClick = false;
        }else
            $(".jtnr").append(html);
        console.log(html);
        
        html = "";
        $('.yt-top').unbind("click").on('click', function (e) {
            e.preventDefault();
            var uid = $(this).children(".yt-top-l").children("img").attr("uid");
            if (app.config.isMomanApp) {
                mcAPI.openSpecificSpacePageById(uid);
            } else {
                window.location = "https://artist.momentcam.net/page/MySpace.html?language=zh&appversion=87&fromtype=html%3A1.0%3Ah5&userid=" + uid;
            }
        });
        $('.pictureClick').on('click', function () {
            var pid = $(this).attr("pid");
            var trace = encodeURIComponent("fuid:" + $(this).attr('uid'));
            window.location = app.urls.ProductDetailURL + "?productid=" + pid;
        });

    }
}



if (mfxdflag) {
    sortType = 5;
    mfxd(sortType, 0);
    mfxdflag = false;
}
   
    //进行下拉加载
$(".Shop-banxin").scroll(function () {

        
    var   viewH = $(".Shop-banxin").height(), //可见高度
            contentH = $(".Shop-banxin").get(0).scrollHeight, //内容高度
            scrollTop = $(".Shop-banxin").scrollTop(); //滚动高度
        //if (scrollTop < 100) {
        //    return false;
        //} else {
             
       
        if (contentH - viewH - scrollTop <= 200) { //到达底部100px时,加载新内容
            if (!clickCheck) {
                clickCheck = true;
                if ($('.hzs').hasClass("active")) {
                    sortType = $(".hzs").attr("data-id")
                }
                ;
                if ($('.xlyx').hasClass("active")) {
                    sortType = $(".xlyx").attr("data-id")
                }
                ;
                if ($(".second  .zxshop").hasClass("active")) {
                    sortType = $(".second  .zxshop").attr("data-id")
                }
                if ($(".second  .zxfb").hasClass("active")) {
                    sortType = $(".second  .zxfb").attr("data-id")
                }
                if ($(".second  .newpm").hasClass("active")) {
                    sortType = $(".second  .newpm").attr("data-id")
                }
                mfxd(sortType, lastShopID);
            }
        }
       // }
    });



   

$(function () {
    $('.select  .ck  span').on('click', function (event) {
        // 点击切换的箭头
        if ($('.select  .ck  span').hasClass('down1')) {
            $('.select  .ck  span').addClass('down').removeClass("down1");
            $('.select  .ck  span').siblings().addClass('hide').removeClass("show");
            return
        }
        if ($('.select  .ck  span').hasClass('stopClick') && $('.select  .ck  span').hasClass('active') && $('.select  .ck  span').siblings().hasClass('show')) {
            $('.select  .ck  span').siblings().addClass('hide').removeClass("show");
            $('.select  .ck  span').addClass('up').removeClass('stopClick')
            return
        }
        if ($('.select  .ck  span').hasClass('up') && $('.select  .ck  span').hasClass('active') && $('.select  .ck  span').siblings().hasClass('hide')) {
            $('.select  .ck  span').siblings().addClass('show').removeClass("hide");
            //进行图片的旋转
            $('.select  .ck  span').addClass('stopClick').removeClass('up')
            return
        }
        if ($('.select  .ck  span').hasClass('down')) {
            $('.select .second').addClass('show').removeClass('hide');
            $('.select  .ck  span').addClass('down1').removeClass('down')
        } else {
            $('.select  .ck  span').addClass('down').removeClass('up');
            $('.select  .ck  span').removeClass("active")
            $('.select  .ck  span').siblings().addClass('hide').removeClass("show");
        }
    });


});