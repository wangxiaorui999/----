console.log = function () { };
/// <reference path="../../TianYi/Page/index.html" />
function getQueryString(key) {
    var url = window.location.search;
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var result = url.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
}
(function () {
    var coupon = getQueryString("coupon") || "";
    var placeTitle = decodeURIComponent(getQueryString("name"));
 
    var Id = decodeURIComponent(getQueryString("id"));
    var isSplash = getQueryString("isSplash") || "Long";
    
    var isClient = false;

    var initHeaderTitle = function (title) {      
        document.title = title;
        $(".TitleBar span").html(title);
    };
    var Items = {
        init: function () {
            //if (Id != 0) {
            //     name='banner'
            //}
            getData(function (result) {
                
                console.log(result);
                var html = '';
                var products = result.Response[0].Places[0].Products;
                var name = result.Response[0].Places[0].Title;               
                if (Id > 0) {
                    $(result.Response[0].Places).each(function (item) {
                        if (item.Id == Id) {
                            products = item.Products;
                            name = item.Title;
                            return;
                        }
                    });
                }
                initHeaderTitle(name);
                if (products.length < 2) {
                    $(".box").css("text-align", "left");
                }
                if (name == "TOMIC" || name == "tomic经典款玻璃杯") {
                    html += '<div style="width:100%;overflow:hidden;"><img style="display:block;width:100%;" src="https://mall-res.manboker.com/newmall/CN/Headbanner/TomicBanner.jpg" /></div>'
                }
                if (name == "国礼瓷") {
                    html += '<div style="width:100%;overflow:hidden;"><img style="display:block;width:100%;" src="https://mall-res.manboker.com/newmall/CN/goodsImg/topci.jpg" /></div>'
                }
                if (name == "诗婢家") {
                    var flag = true;
                    html += '<div style="width:100%;overflow:hidden;"><img style="display:block;width:100%;" src="https://mall-res.manboker.com/newmall/CN/Activity/Poem/poemTop.jpg" /></div>'
                }
                if (name == "唐妞") {
                    html += '<div style="width:100%;overflow:hidden;margin-bottom:20px;"><img style="display:block;width:100%;" src="https://mall-res.manboker.com/newmall/CN/Activity/Tangniu/tangniu.jpg" /></div>'
                }
                if (name == "阿唐奇遇") {
                    var flag = true;
                }
                var Defaultdiagram = app.getOptimizedImgUrl("https://mall-res.manboker.com/newmall/DefaultPicture/Defaultdiagram.jpg",100);
                var photoframe = app.appendWebpForImgUrl("https://mall-res.manboker.com/newmall/DefaultPicture/Online-retailers_loading_photoframe.jpg");
                for (var i = 0; i < products.length; i++) {
                    var productThumb = app.appendWebpForImgUrl(products[i].ShowImage).replace("http://", "https://");
                    var headThumb = app.appendWebpForImgUrl(products[i].AvatarIcon).replace("http://", "https://");
                    html += '<div id="' + products[i].ProductId + '" class="pic">' +
                                '<a href="javascript:void(0);">' +
                                    '<img class="tip ' + (flag ? '' : 'lazy') + '" style="display:' + (flag ? 'none' : 'block') + '" src="' + Defaultdiagram + '"  data-original="' + headThumb + '" />' +
                                    '<img class="phone lazy" src="' + photoframe + '" data-original="' + productThumb + '">' +
                                '</a>' +
                                '<a href="javascript:void(0);">' + products[i].ProductName + '</a>' +
                                '<a href="javascript:void(0);">¥ ' + products[i].SalePrice + '.00</a>' +
                            '</div>';
                }
                $(".contain").html(html);
                setTimeout(function () {
                    $("img.lazy").lazyload({
                        placeholder: "https://mall-res.manboker.com/newmall/DefaultPicture/Defaultdiagram.jpg",
                        effect: "fadeIn",
                        threshold: 700,
                        container: $(".box"),
                    });
                    $(window).resize();
                }, 100);
                $(".pic").last().css("margin-bottom", "30px");
                $(".pic").last().prev().css("margin-bottom", "30px");
                $(".pic").on("click", function () {
                    Counter("商品列表页面" + name+"-"+$(this).find("a").eq(1).html() + "-商品点击");
                    var id = $(this).attr("id");
                    if (name == "照片书") {
                        var obj = {
                            "303094": "00511100102130",
                            "2493730": "00521100102140",
                            "2493733": "00521100102150",
                            "2493736": "00601100102160",
                            "2493976": "00601100102170",
                            "2493979": "00601100102180",
                        }
                        window.location = "../TianYi/Page/index.html?productid=" + id + "&cartooncodes="+obj[id];
                        return;
                    }
                    if (name == "阿唐奇遇" || name == "诗婢家") {
                        window.location = app.urls.ProductDetailURL + "?productid=" + id;
                        return;
                    }
                    if (app.config.isMomanApp) {
                        mcAPI.openProductDetail(id);
                    } else {
                        if (name == "移动电源") {
                            window.location = app.urls.ProductDetailURL + "?productid=" + id;
                        }
                    }
                });
            });
        },
    }
 
    function getData(callback) {
        $.ajax({
            type: "get",
            async: true,
            url: app.urls.GetIndexBanner + '&title=' + placeTitle,
            timeout: 25000,
            cache: true,
            beforeSend: function () {
                var html = '<div style="position:absolute;left:50%;top:500px;margin-left:-40px;">' +
                    '<img style="width:80px;" src="https://mall-res.manboker.com/newmall/CN/loading.gif" />' +
                    '</div>';
                $(".contain").append(html);
            },
            success: function (result) {
               
                $(".contain").html('');
                return callback(result);
            },
            error: function () {
                try {
                    $(".contain").html('');
                } catch (e) { }
            }
        });
    }
    $(function () {
       
        $(".return").on("click", function () {
            if (isSplash == "Long") {
                window.history.go(-1);
                return;
            } else {
                ClientReturn();
            }
        })
        try {
            mcAPI.finishloading();
        } catch (e) { }
        Items.init();
    });
})()
