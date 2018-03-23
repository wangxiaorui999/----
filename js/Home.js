console.log = function () { };
$("body").Loading(" ");
$("body .HuiCeng  .loading  img").css({ "margin-top": "800px", "width": "70px", "height": "70px" });
var urlLinks = window.location.search == "" ? "?v=1" : window.location.search;
var loadingIconURL = "https://mall-res.manboker.com/newmall/CN/loading.gif";
var fromMagicShop = $.cookie("fromMagicshop");
var Mall = {
    isLoaded: false,
    recommendSaver: {},
    getRecommend: function (callback) {
        try {
            var _ = this;
            var _callback = callback;
            CallAjax(app.urls.StudioRecommendsURL, "", "get", false, function (data) {
                _.recommendSaver = data;
                if (!fromMagicShop && !callback) {
                }
                else
                    return callback(data);
            });
        } catch (e) {
            console.log(e);
        }
    },
    Common: function () {
        initSwiper(".swiper-container2", '.swiper-pagination2');
        function initSwiper(container, paginaionName) {
            new Swiper(container, {
                direction: 'horizontal',
                touchAngle: 20,
                autoplay: 4000,
                loop: true,
                observer: true,
                observeParents: true,
                pagination: paginaionName,
                autoplayDisableOnInteraction: false
            });
        }

        //判断hotDetail的奇偶性 设置样式
        if ($(".hot .hotDetail").length % 2 == 0) {
            $(".hotDetail:last").css("border-bottom", "none");
            $(".hotDetail:last").prev().css("border-bottom", "none");
        } else {
            $(".hotDetail:last").css("border-bottom", "none");
        }
    },
    Bind: function () {
        $(".mallGoods").on("click", function () {
            var id = $(this).attr("id");
            window.location.href = app.urls.ProductDetailURL + "?productid=" + id;
        });
        $(".mallLogo").on("click", function () {
            window.location.href = "//artist.momentcam.net/page/WorksShow.html";
        });
        // 点击跳转到魔漫图专区
        $(".CommodityZone  .CommodityZoneGoodsBtn").on('click', function () {
            $(".CommodityZone  .CommodityZoneGoodsBtn").css("background-color", "#6e6e6e");
            setTimeout(function () {
                $(".CommodityZone  .CommodityZoneGoodsBtn").css("background-color", "#4e4e4e");
            },300)
            window.location.href = "CommodityZone.html";
        })
        //主页返回按钮
        $(".return").on("click", ClientReturn);
        //返回顶部
        $(".GoTop").on("click", function () {
            $(".Shop-banxin").animate({ "scrollTop": 0 }, 800)
            return false;
        });
        //点击分类按钮 弹出分类
        $(".classification").on("click", function () {
            window.location.href = "Class.html" + urlLinks;
        });
        //点击查看更多
        $(".MoreBtn").on("click", function () {
            var url = $(this).attr("url");
            console.log(url);
            window.location.href = url + urlLinks;
        });
        //点击跳转到顶部
        $(".GoTop").on("click", function () {
            $('#CommodityZoneBox').animate({
                scrollTop: 0
            }, 1000);
            return false;
        });
        //点击购物车按钮
        $(".shapCart").on("click", function () {
            var isUserLogin = false;
            mcAPI.isLogin(function (isLogin) {
                isUserLogin = isLogin;
            });
            if (isUserLogin) {
                mcAPI.openCartListActivity();
            } else {
                mcAPI.login();
            }
        });
    },
    //魔漫图专区页面商品
    ProductPhotos: function () {
        try {
            ProductAjax(function (result) {
                console.log(result)
                if (result.StatusCode == 0) {
                    var resultData = result.Response[0];
                    var html1 = "",
                        html2 = "",
                        html3 = "";
                    var Defaultdiagram = app.getOptimizedImgUrl("https://mall-res.manboker.com/newmall/DefaultPicture/Defaultdiagram.jpg", 100);
                    for (var i = 0; i < resultData.Places.length; i++) {
                        for (var j = 0; j < resultData.Places[i].Products.length; j++) {
                            var imgsrc = resultData.Places[i].Products[j].ShowImage.replace("http://", "https://");
                            var Iconsrc = resultData.Places[i].Products[j].AvatarIcon.replace("http://", "https://");
                            imgsrc = app.getOptimizedImgUrl(imgsrc, 200);
                            Iconsrc = app.getOptimizedImgUrl(Iconsrc, 100);
                            if (resultData.Places[i].Title == "人气热卖") {
                                html1 += '<div class="hotDetail" id="' + resultData.Places[i].Products[j].ProductId + '">' +
                                    '<div class="hotPic">' +
                                    '<img class="icon lazy" src="' + Defaultdiagram + '" data-original="' + Iconsrc + '" />' +
                                    '<div class="goodsBox" style="background:url(' + imgsrc + ') no-repeat center;background-size:contain;">' +
                                    '</div>' +
                                    '</div>' +
                                    '<p class="goodsName"><img src="' + app.appendWebpForImgUrl("https://mall-res.manboker.com/newmall/CN/HOT.png") + '" />' + resultData.Places[i].Products[j].CategoryName + '</p>' +
                                    '<p class="goodsNameDetail">' + resultData.Places[i].Products[j].ProductName + '</p>' +
                                    '<p class="Price">¥ ' + resultData.Places[i].Products[j].SalePrice + '</p>' +
                                    '</div>';
                            }
                            if (resultData.Places[i].Title == "新品首发") {
                                html2 += '<div class="hotDetail" id="' + resultData.Places[i].Products[j].ProductId + '">' +
                                    '<div class="hotPic">' +
                                    '<img class="icon lazy" src="' + Defaultdiagram + '" data-original="' + Iconsrc + '" />' +
                                    '<div class="goodsBox" style="background:url(' + imgsrc + ') no-repeat center;background-size:contain;">' +
                                    '</div>' +
                                    '</div>' +
                                    '<p class="goodsName"><img src="' + app.appendWebpForImgUrl("https://mall-res.manboker.com/newmall/CN/NEW.png") + '" />' + resultData.Places[i].Products[j].CategoryName + '</p>' +
                                    '<p class="goodsNameDetail">' + resultData.Places[i].Products[j].ProductName + '</p>' +
                                    '<p class="Price">¥ ' + resultData.Places[i].Products[j].SalePrice + '</p>' +
                                    '</div>';
                            }
                            if (resultData.Places[i].Title == "猜你喜欢") {
                                html3 += '<div class="hotDetail" id="' + resultData.Places[i].Products[j].ProductId + '">' +
                                    '<div class="hotPic">' +
                                    '<img class="icon lazy" src="' + Defaultdiagram + '" data-original="' + Iconsrc + '" />' +
                                    '<div class="goodsBox" style="background:url(' + imgsrc + ') no-repeat center;background-size:contain;">' +
                                    '</div>' +
                                    '</div>' +
                                    '<p class="goodsName">' + resultData.Places[i].Products[j].CategoryName + '</p>' +
                                    '<p class="goodsNameDetail">' + resultData.Places[i].Products[j].ProductName + '</p>' +
                                    '<p class="Price">¥ ' + resultData.Places[i].Products[j].SalePrice + '</p>' +
                                    '</div>';
                            }

                        }
                    }
                    $(".part1 .hotList").html(html1);
                    $(".part3 .hotList").html(html2);
                    $(".part4 .hotList").html(html3);                
                    Mall.part3_show();
                    //点击单个商品跳转
                    $(".hotDetail").on("click", function () {
                        var id = $(this).attr("id");
                        mcAPI.openProductDetail(id);
                    });
                    setTimeout(function () {
                        $("#CommodityZoneBox img.lazy").lazyload({
                            effect: "fadeIn",
                            container: $("#CommodityZoneBox"),
                            threshold: 200
                        });
                        $(window).resize();
                    }, 100);
                }
            })
        } catch (e) {
            console.log(e);
        }

    },
    //首页魔漫图专区图 
    ProductPhotosIndex: function () {
        try {
            ProductAjax(function (result) {
                console.log(result);
                //alert(result);
                if (result.StatusCode == 0) {
                    var resultData = result.Response[0];
                    var html4 = "";
                    var IndexBannertml = " ";
                    var Defaultdiagram = app.getOptimizedImgUrl("https://mall-res.manboker.com/newmall/DefaultPicture/Defaultdiagram.jpg", 100);
                    for (var i = 0; i < resultData.Places.length; i++) {
                        for (var j = 0; j < 3; j++) {
                            if (resultData.Places[i].Title == "魔漫专区") {
                                html4 += `<div class="CommodityZoneGoods  hotDetail" id="${resultData.Places[i].Products[j].ProductId}">
                                        <div class="CommodityZoneGoodsPic">
                                        <img class="icon" src="${resultData.Places[i].Products[j].AvatarIcon} ">
                                        <div class="goodsBox" style="background:url(${resultData.Places[i].Products[j].ShowImage}) no-repeat center;background-size:contain;">
                                        </div>
                                        </div>
                                        <p class ="goodsName"> ${resultData.Places[i].Products[j].CategoryName}  </p>
                                        <p class ="CommodityZoneGoodsTitle">${resultData.Places[i].Products[j].ProductName}</p>
                                        <p class="CommodityZoneGoodsPrice">¥ ${resultData.Places[i].Products[j].SalePrice}</p>
                                    </div>`
                            }
                          
                        }
                    }
                    $(".CommodityZoneList").html(html4);
              
                    
                    //点击单个商品跳转
                    $(".hotDetail").on("click", function () {
                        var id = $(this).attr("id");
                        mcAPI.openProductDetail(id);
                 
                    });

                }
            })
        } catch (e) {
        }

    },
    //首页滚动时候加载样式
    ShopBanxinScroll: function () {
        $(".Shop-banxin").scroll(function (e) {
            var this_scrollTop = $(".Shop-banxin").scrollTop();
            var AllShopTitleTop = $(".AllShop").offset().top;
            //console.log(this_scrollTop);
            if (this_scrollTop > 3155) {

                // $(".Shop-nav-top").hide();
                $(".GoTop").fadeIn(500).removeClass("goDown").addClass("goUp");
                $(".shapCart").removeClass("goDown").addClass("goUp");
                //$(".Shop-nav-top").css("z-index","-1").hide();
                //$("#xd_content").css("paddingTop", "0px")
                $(".AllShop_fix").show().css("z-index", "9999");
            } else {
                // $(".Shop-nav-top").show();
                if ($(".GoTop").hasClass("goUp")) {
                    $(".GoTop").fadeOut(500).addClass("goDown");
                    $(".shapCart").addClass("goDown");
                }
                //$(".Shop-nav-top").show().css("z-index","9999");
                $(".AllShop_fix").hide().css("z-index", "-1");
            }
        })
    },
    //点击回到顶部
    part3_show: function () {
        var flag = false;261251212
        $("#CommodityZoneBox").scroll(function () {
            var this_scrollTop = $(this).scrollTop();
            var GoToptop = $(".part3").offset().top;
            console.log(this_scrollTop);
            if (this_scrollTop < 10) return;
            if (this_scrollTop > 1800) {
                $(".GoTop").fadeIn(500).removeClass("goDown").addClass("goUp");
                $(".shapCart").removeClass("goDown").addClass("goUp");
            } else {
                if ($(".GoTop").hasClass("goUp")) {
                    $(".GoTop").fadeOut(500).addClass("goDown");
                    $(".shapCart").addClass("goDown");
                }
            }
        });
    },
   
    //首页轮播图
    Indexbanner:function () {
         try {
             BannerAjax(app.urls.GetIndexBanner + '&title=banner', function (result) {
                 console.log();
                 if (result.StatusCode == 0) {
                     var resultData = result.Response[0];
                     var IndexBannertml = "";
                     for (var i = 0; i < resultData.Places.length; i++) {
                      
                                 var imgsrc = resultData.Places[i].PlaceImgUrl.replace("http://", "https://");
                                 imgsrc = app.getOptimizedImgUrl(imgsrc, 540);
                                 IndexBannertml += ' <div class ="swiper-slide"   dataMode="' + resultData.Places[i].PlaceMode + '"  style="width: 1080px;height:652px"  dataUrl="' + resultData.Places[i].PlaceUrl + '"   ItemTitle="' + resultData.Places[i].Title + '"    name="' + resultData.Title + '"   BannerId="' + resultData.Places[i].Id + '">' +
                                                           '<img src= "' + imgsrc + '"    /></div>';

                             }
                                             
                  
                     $(".header  .swiper-container1  .swiper-wrapper").html(IndexBannertml);
     
                     initSwiper(".header .swiper-container1", '.swiper-pagination1');
                     function initSwiper(container, paginaionName) {
                         new Swiper(container, {
                             direction: 'horizontal',
                             touchAngle: 20,
                             autoplay: 4000,
                             loop: true,
                             observer: true,
                             observeParents: true,
                             pagination: paginaionName,
                             autoplayDisableOnInteraction: false
                         });
                     }

                     $(document).on("click", ".swiper-slide", function () {
                         var Mode = $(this).attr("datamode");
                         var dataUrl = $(this).attr("dataurl");
                         if (Mode == 2) {
                             window.location.href = dataUrl + urlLinks
                         } else if (Mode == 1) {
                             window.location.href = "items.html" + urlLinks + "&name=" + $(this).attr('name') + "&id=" + $(this).attr('BannerId');
                         }
                     })

                 }
             });
         } catch (e) {
             console.log(e);
         }
        
     },
    init: function () {
        if (!this.isLoaded) {
            fromMagicShop = false;
            this.isLoaded = true;       
            this.Bind();
            this.getRecommend();
            this.ProductPhotosIndex();
            this.ShopBanxinScroll();
            this.Indexbanner();
            this.Common();
        }
    }
};

$(document).ready(function () {
    //  魔漫专区的轮播图
    
    var htmlHomeMiddle = '';
    for (var i = 0; i < HomeSwiper.HomeMiddle.length; i++) {
        htmlHomeMiddle += ' <div class="swiper-slide" name="' + HomeSwiper.HomeMiddle[i].name + '">' +

            ' <img src="' + app.getOptimizedImgUrl(HomeSwiper.HomeMiddle[i].src, 540).replace("http://", "https://") + '" /></div>';
    }
    $(".swiper-container2  .swiper-wrapper").html(htmlHomeMiddle);
    $(document).on("click", ".swiper-slide", function () {
      
        Counter("新电商首页banner-" + name + "-点击");
        if ($(this).attr('url')) {
            if ($(this).attr('url') == "StudioIntro.html") {
                window.location.href = $(this).attr('url') + urlLinks;
            } else {
                window.location.href = $(this).attr('url') + urlLinks;
            }
        } else {
            if ($(this).attr('name') == "巧虎") {
                $.cookie("className", $(this).attr('name'));
                window.location.href = "Class.html" + urlLinks;
                return;
            }
            if ($(this).attr('name') == "情书") {
                $.cookie("className", $(this).attr('name'));
                window.location.href = app.urls.ProductDetailURL + urlLinks + "&productid=2613289";
                return;
            }
            if ($(this).attr('name') == "教师节活动") {
                window.location.href = "bannerHTML/Teacher.html" + urlLinks;
                return;
            }
            if ($(this).attr('name') == "爱丽丝梦游仙境") {
                mcAPI.openProductDetail("3551749");
                return;
            }
            window.location.href = "items.html" + urlLinks + "&name=" + $(this).attr('name');
        }
    });
    $(".goodsChoose li").on("click", function () {
        var name = $(this).html();
        Counter("新电商首页分类标签-" + name + "-点击");
        if ($(this).hasClass("orange")) {
            window.location.href = "Class.html" + urlLinks;
            return;
        }
        if (name == "巧虎") {
            $.cookie("className", name);
            window.location.href = "Class.html" + urlLinks;
            return;
        }
        if (name == "中国国家图书馆") {
            window.location.href = "bannerHTML/Library.html" + urlLinks;
            return;
        }
        window.location.href = "items.html" + urlLinks + "&name=" + name;
    });

    $(".FollowBtn").on('click', function () {
        $(this).css('background-color', "#FA9C14");
        $(this).css("color", "#ffffff");
    });

    Studio.init();
    Popularhop.startFunc();
    Mall.init();
})

var Studio = {
    loadingIconURL: "//mall-res.manboker.com/newmall/CN/loading.gif",
    isLoaded: false,
    loadingDIV: '<div class="waiting"><img src="' + this.loadingIconURL + '" /></div>',
    //初始化
    init: function () {
        if (!this.isLoaded) {
            this.isLoaded = true;
            var _ = this;
            if (!$.isEmptyObject(Mall.recommendSaver))
                _.getRecommend1(Mall.recommendSaver);
            else {
                CallAjax(app.urls.StudioRecommendsURL, "", "get", false, function (data) {
                    _.getRecommend1(data);
                });
            }
        }
    },
    //获取新品推荐
    getRecommend1: function (data) {
        console.log(data.Data.length);
        var _ = this;
        $(".NewList").append(this.loadingDIV);
        var NewListwidth;
        NewListwidth = data.Data.length * 690;
        console.log(NewListwidth);
        $(".NewArrivals .NewBox .NewList").width(NewListwidth);
        var html = '';
        for (var i = 0; i < data.Data.length; i++) {
            var certifiedImgs = ["", "https://mall-res.manboker.com/newmall/CN/newstudio/myspace_ordinary.png", "https://mall-res.manboker.com/newmall/CN/newstudio/myspace_Artist.png"];
            html += '<div  class="NewModel"  style="background:url(' + app.getOptimizedImgUrl(data.Data[i].Poster, 350).replace("http://", "https://") + ' ) no-repeat center center;background-size:cover"  pid="' + data.Data[i].ProductId + '"  uid="' + data.Data[i].UserId + '">' +
                //'<img src="' + data.Data[i].Poster + '"    pid="' + data.Data[i].ProductId + '"     uid="' + data.Data[i].UserId + '"  />' +
                '<div class="_clickNewModel"   pid="' + data.Data[i].ProductId + '"  uid="' + data.Data[i].UserId + '"></div>' +
                '<div class="DetailWords">' +
                '<div class="Detail">' +
                '<div class="DetailName">' +
                '<span class="GoodsType  CommodityCategory">' + data.Data[i].CategoryName + '</span>' +
                '<span class="line"></span>' +
                '<span class="GoodsName">' + data.Data[i].Name + '</span></div>' +
                '<div class="DetailPrice">' +
                '<span>¥</span>' +
                '<span>' + data.Data[i].Price + '</span> </div>  </div>' +
                '<div class="Author">' +
                '<img class="AuthorIcon" src="' + app.appendWebpForImgUrl(data.Data[i].UserIcon).replace("http://", "https://") + '"   uid="' + data.Data[i].UserId + '" />' +
                '<div ><span>店主: ' + data.Data[i].UserName + ' </span><img  alt="Alternate Text"  src= "' + app.getOptimizedImgUrl(certifiedImgs[data.Data[i].CertifiedType], 350).replace("http://", "https://") + '"   /></div>' +
                '</div>  </div>  </div>';
        }
        $(".NewList").html(html);
        setTimeout(function () {
            $("body").Loading("hide");
        }, 1000)
  
        
        $('.NewModel').on('click', function () {
            var uid = $(this).attr("uid");
            if (app.config.isMomanApp) {
                mcAPI.openSpecificSpacePageById(uid);
            } else {

                window.location = "https://artist.momentcam.net/page/MySpace.html?language=zh&appversion=87&fromtype=html%3A1.0%3Ah5&userid=" + uid;
            }
        });
    },

}

function loadImage(a, b) {
    var c = new Image;
    c.onload = function () {
        c.onload = null,
            b(c)
    },
        c.src = a
}




function CallAjax(url, data, type, flag, callback) {
    $.ajax({
        type: type,
        async: true,
        url: url,
        timeout: 25000,
        cache: flag,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            return callback(result);
        }
    });
}

function ProductAjax(callback) {
    $.ajax({
        type: "get",
        async: true,
        url: app.urls.GetMartDailyCN + "&title=shouye",
        timeout: 25000,
        cache: true,
        success: function (result) {
            return callback(result);
            $("body").Loading("hide");
        }
    })
}

//首页轮播图
function BannerAjax(url , callback) {
    $.ajax({
        type: "get",
        async: true,
        url: url,
        timeout: 25000,
        cache: true,
        success: function (result) {
            console.log(result)
           return callback(result);
           
        }
    })
}

        
