(function () {
    var ShopkeeperPageSize = 5;
    var ProductsOageSize = 6;
    var is_actionscroll = false;
    var is_warning = false;
    var isClick = true;
    var gallery_nodedata = 'yes';
    var commodity_nodedata = 'yes';
    var search_shade = $("#search #sc_shade");
    var search_input = function () {
        return $('#search_input').val();
    };

    var search_Shopkeeper_oversearch = function () {
        return $('#search .SearchResult').hasClass('overserch') ? "isoverserch" : "nooverserch";
    }

    var search_Products_oversearch = function () {
        return $('#search .CommoditySection_box').hasClass('overserch') ? "isoverserch" : "nooverserch";
    }

    var recomend_Shopkeeper = function () {
        return $('#search  .Gallery  .DefaultSearch').hasClass('overhas') ? "ishas" : "nohas";
    }
    var recomend_Products = function () {
        return $('#search .commodity .DefaultSearch').hasClass('overhas') ? "ishas" : "nohas";
    }

    var scroll_dom = function () {
        return $('#search .diyi').hasClass('tabhover') ? $('#search .Gallery') : $('#search .commodity');
    };

    var render_dom = function () {
        return $('#search .diyi').hasClass('tabhover') ? $("#search .SearchResult") : $("#search .CommoditySection_box");
    };
    var tab_type = function () {
        return $('#search .diyi').hasClass('tabhover') ? "gallery" : "commodity";
    };

    var search_data = {
        Shopkeeper: {
            NickName: '',
            Marker: 0,
            PageSize: ShopkeeperPageSize,
            IsTruncated: true,
            is_oversearch: false
        },
        Products: {
            Name: '',
            Marker: 0,
            PageSize: ProductsOageSize,
            IsTruncated: true,
            is_oversearch: false
        }
    }

    var search = {
        //绑定初始事件
        init: function () {
            //画廊和商品切换
            $('#search .tabtitle em').click(function () {
                if (!isClick) {
                    return false;
                }
                $(this).css('color', '#fa9c14').addClass("tabhover").siblings().css('color', '#000').removeClass('tabhover');
                search.search_befor_action();
            });
            //点消除按钮
            $("#search .nav  .shopsearch-mistake").off('click').on("click", function () {
                $('.shopsearch-mistake  > img').css('display', 'none');
                $("#search   .shop-search-ipt").val("");
            });

            //搜索有内容才出现取消按钮
            $("#search_input").off('input').on('input', function (e) {
                var ThisVal = $(this).val();
                if (ThisVal.length > 0) {
                    $('.shopsearch-mistake  > img').css('display', 'block');
                } else {
                    $('.shopsearch-mistake  > img').css('display', 'none')
                }
            });

            //进入搜索界面
            $('.Shop-nav-top .ShopSearch').on('click', function () {
                $('.Shop-nav-top .shopsearch input').blur();
                $(".AllShop_fix").hide();
                $('.Shop-nav-top').removeClass('moveDown');
                $('#xd_content .Shop-banxin').removeClass('moveDown');
                $('.Shop-nav-top').addClass("moveUp");
                $('#xd_content .Shop-banxin').addClass("moveUp");
                $('#search .nav .shopsearch-form .shopsearch-form-box .shopsearch .shop-search-ipt').focus();
                $('#search').css('opacity', '0').css('opacity', '1');
                setTimeout(function () {
                    $("#search").css("z-index", "999");
                    $("#xd_content").hide();
                    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                        document.getElementsByClassName("ios_box")[0].style.display = "block";
                        $("#search .commodity, #search .Gallery").css("top", "336px");
                        $("#sc_shade").css("top", "336px");
                        $("#search .sc_main").css("padding-top", "336px");
                    } else {
                        document.getElementsByClassName("ios_box")[0].style.display = "none";
                        $("#search .commodity, #search .Gallery").css("top", "268px");
                        $("#sc_shade").css("top", "268px");
                        $("#search .sc_main").css("padding-top", "268px");
                    }
                    search.search_befor_action();
                }, 400);
            });

            /*取消搜索*/
            $('#search .shopCancel').on('click', function () {
                //初始话一遍人气小店
                Popularhop.startFunc();
                $('.Shop-nav-top').removeClass('moveUp');
                $('#xd_content .Shop-banxin').removeClass('moveUp');
                $('#xd_content .Shop-banxin').addClass("moveDown");
                $('.Shop-nav-top').addClass("moveDown");
                $("#xd_content .Shop-banxin").animate({ "scrollTop": 10 }, 400);
                setTimeout(function () {
                    $("#search").css("z-index", "-1");
                    $('#search').css('opacity', '1').css('opacity', '0');
                    $("#xd_content").show();
                    search.delete_data();
                }, 400);
            });

            //手机点击搜索事件
            $("#search_input").on('keypress', function (e) {
                if (!isClick) {
                    return false;
                }
                var keycode = e.keyCode;
                var searchName = $('#search_input').val();
                if (keycode == '13') {
                    e.preventDefault();
                    var searchName = search_input();
                    search_data.Shopkeeper.NickName = searchName;
                    search_data.Products.Name = searchName;
                    $('#search .nav .shopsearch-form .shopsearch-form-box .shopsearch .shop-search-ipt').blur();
                    search.search_befor_action('newcon');
                }
            });
            //点击页面搜索图标事件
            $('#search .shopsearch-form-action').on('click', function () {
                if (!isClick) {
                    return false;
                }
                $('#search .nav .shopsearch-form .shopsearch-form-box .shopsearch .shop-search-ipt').blur();
                var searchName = search_input();
                search_data.Shopkeeper.NickName = searchName;
                search_data.Products.Name = searchName;
                search.search_befor_action('newcon');
            });

        },
        search_befor_action: function (type) {
            if (type == "newcon") {
                search.clear_data();
                $("#search  .commodity .DefaultSearch").addClass('overrecom');
                $("#search  .Gallery .DefaultSearch").addClass('overrecom');
                var searchName = search_input();
                search_data.Shopkeeper.NickName = searchName;
                search_data.Products.Name = searchName;
            }
            var tabType = tab_type();
            var searchName = search_data.Shopkeeper.NickName;
            var ajax_action = {
                recommend_action_gallery: function () {
                    search.search_action('recommend', 'gallery'); //加载推荐内容
                },
                recommend_action_commodity: function () {
                    search.search_action('recommend', 'commodity'); //加载推荐内容
                },
                noRecommend_action_gallery: function () {
                    search.search_action("noRecommend", 'gallery'); //加载内容
                },
                noRecommend_action_commodity: function () {
                    search.search_action("noRecommend", 'commodity');//加载内容
                },
            }
            if (searchName == '') {    //搜索内容为空，说明是推荐或者已经有推荐
                if (tabType == "gallery") {
                    if ($('#search .Gallery .DefaultSearch').hasClass('overhas')) {
                        search.show_data(); //直接展示
                    } else {
                        search_shade.show(0, ajax_action.recommend_action_gallery);
                    }
                } else {
                    if ($('#search .commodity .DefaultSearch').hasClass('overhas')) {
                        search.show_data();//直接展示
                    } else {
                        search_shade.show(0, ajax_action.recommend_action_commodity);
                    }
                }
            } else {
                if (tabType == "gallery") {
                    if ($('#search .Gallery .SearchResult').hasClass('overserch')) {
                        search.show_data(); //直接展示
                    } else {
                        search_shade.show(0, ajax_action.noRecommend_action_gallery);
                    }
                } else {
                    if ($('#search .commodity .CommoditySection_box').hasClass('overserch')) {
                        search.show_data(); //直接展示
                    } else {
                        search_shade.show(0, ajax_action.noRecommend_action_commodity);
                    }
                }
            }
        },
        bind: function () {
            //点击热门搜索 进行搜索操作
            $('#search  .sc_main .body  .DefaultSearch .Specificot ul li').unbind('click').on('click', function () {
                var name = $(this).children('span').eq(1).text();
                $('#search_input').val(name);
                search_data.Shopkeeper.NickName = name;
                search_data.Products.Name = name;
                console.log(search_data);
                $('.shopsearch-mistake  > img').css('display', 'block');
                search.search_befor_action();
            });
            //点击搜索结果跳转到相应页面
            $('#search  .sc_main .body  .Searchres_list  .StudioAuthor').unbind("click").on('click', function () {
                var uid = $(this).attr("uid");
                if (app.config.isMomanApp) {
                    mcAPI.openSpecificSpacePageById(uid);
                } else {
                    window.location = "https://artist.momentcam.net/page/MySpace.html?language=zh&appversion=87&fromtype=html%3A1.0%3Ah5&userid=" + uid;
                }

            })
            $('#search  .sc_main .body .StudioPicList .photoClick').unbind('click').on('click', function () {
                var pid = $(this).attr("pid");
                $.cookie("fromMagicshop", "true");
                var trace = encodeURIComponent("fuid:" + $(this).attr('uid'));
                window.location = "https://artist.momentcam.net/page/DetailsPage.html?productid=" + pid + "&trace=" + trace;
            });
            //点击搜索结果跳转到相应页面
            $('#search  .sc_main .body  .CommoditySection  .describe').unbind("click").on('click', function () {
                var uid = $(this).attr("uid");
                if (app.config.isMomanApp) {
                    mcAPI.openSpecificSpacePageById(uid);
                } else {
                    window.location = "https://artist.momentcam.net/page/MySpace.html?language=zh&appversion=87&fromtype=html%3A1.0%3Ah5&userid=" + uid;
                }
            })
            $('#search  .sc_main .body  .CommoditySection  .topphoto').unbind('click').on('click', function () {
                var pid = $(this).attr("pid");
                $.cookie("fromMagicshop", "true");
                var trace = encodeURIComponent("fuid:" + $(this).attr('uid'));
                window.location = "http://artist.momentcam.net/page/DetailsPage.html?productid=" + pid + "&trace=" + trace;
            });
        },

        search_action: function (type, tab_typeName) {
            isClick = false;
            //发起搜索操作
            if (type == 'noRecommend') {
                if (tab_typeName == 'gallery') {
                    var data = {}
                    data.NickName = search_data.Shopkeeper.NickName;//替换成name
                    data.Marker = search_data.Shopkeeper.Marker;
                    data.PageSize = search_data.Shopkeeper.PageSize;
                    search.Search_Ajax(type, app.urls.GetShopkeeper, data, tab_typeName);
                } else {
                    var data2 = {}
                    data2.Name = search_data.Products.Name; //替换成name
                    data2.Marker = search_data.Products.Marker;
                    data2.PageSize = search_data.Products.PageSize;
                    console.log(data2);

                    search.Search_Ajax(type, app.urls.GetUserProducts, data2, tab_typeName);
                }
            } else {
                if (tab_typeName == 'gallery') {
                    search.Search_Ajax(type, app.urls.GetKeywordsShopkeeper, '', tab_typeName);
                } else {
                    search.Search_Ajax(type, app.urls.GetKeywordsProducts, '', tab_typeName);
                }
            }
        },

        Search_Ajax: function (isRecommend, app_url, data, tab_typeName) {
            //search_shade.css('display', 'block');//这里需要加载效果
            if (isRecommend == "recommend") {
                SearchCallAjax(app_url, '', "GET", function (res) {
                    search.Render_data(res, isRecommend, tab_typeName);
                });
            } else {
                SearchCallAjax(app_url, data, "POST", function (res) {
                    search.Render_data(res, isRecommend, tab_typeName);
                });
            }
        },
        //渲染传值回来的数据
        Render_data: function (res, type, tab_typeName) {
            if (type == "recommend") {       //热门搜索
                var result = res;
                var Keywordhtml = '';
                for (var i = 0; i < result.Response.length; i++) {
                    var className = (i < 3) ? "SerialNumber" : "hui";
                    Keywordhtml +=
                        '<li><span class="' + className + '">' + (i + 1) + "." + '</span><span  >' + result.Response[i].Keywords + '</span></li>'
                }
                if (tab_typeName == "gallery") {
                    $("#search  .Gallery  .DefaultSearch .Specificot ul").html(Keywordhtml);
                    $("#search  .Gallery  .DefaultSearch ").addClass('overhas');
                } else {
                    $("#search .commodity .DefaultSearch .Specificot ul").html(Keywordhtml);
                    $("#search .commodity .DefaultSearch ").addClass('overhas');
                }
                search.show_data(type);
            } else {  //商品信息---渲染的时候往页面上加 overserch 这个class
                if (tab_typeName == "gallery") {
                    search.Gallery_add(res, function () {
                        search.show_data(type);
                    });
                } else {
                    search.Products_add(res, function () {
                        search.show_data(type);
                    });
                }
            }
        },
        Products_add: function (result, callback) {
            if (result.StatusCode == 0) {
                var data_length = result.Response.Products.length;
                if (data_length) {
                    var productshtml = '';
                    for (var i = 0; i < data_length; i++) {
                        var ptoduct_top = result.Response.Products;
                        var TopImage = ptoduct_top[i].Poster != '' && ptoduct_top[i].Poster != null ? app.getOptimizedImgUrl(ptoduct_top[i].Poster, 350) : "'https://mall-res.manboker.com/newmall/CN/goodsImg/search/default_picture.png'";
                        console.log(TopImage);
                        productshtml += '<div class="CommoditySection">' +
                            '<div class="topphoto"  style="background:url(' + TopImage + ') no-repeat center center;background-size:cover;"   pid="' + ptoduct_top[i].ProductId + '"   uid="' + ptoduct_top[i].UserId + '">  </div>' +
                            ' <div class="describe" uid="' + ptoduct_top[i].UserId + '">' +
                            '<div class="DetailName">' +
                            '<span class="GoodsType  CommodityCategory">' + ptoduct_top[i].CategoryName + '</span>' +
                            '<span class="line"></span>' +
                            '<span class="GoodsName">' + ptoduct_top[i].ProductName + '</span></div>' +
                            ' <div class="AvatarName">' +
                            '<div class="Avatar">' +
                            '<img src="' + ptoduct_top[i].Avatar + '"  uid="' + ptoduct_top[i].UserId + '" alt="" width="50" height="50" style="border-radius: 50%">' +
                            '</div>' +
                            '<div class="ShopName">' +
                            '<p>' + ptoduct_top[i].NickName + '</p>' +
                            '</div>' +
                            '</div>' +
                            ' <div class="price">' +
                            '<p> ￥ ' + ptoduct_top[i].SalePrice + '</p>' +
                            '</div> ' +
                            '</div>' +
                            '</div>';
                    }
                }
            }
            $("#search .CommoditySection_box").append(productshtml)
            $("#search .CommoditySection_box").addClass('overserch');
            search_data.Products.Marker = result.Response.NextMarker;
            search_data.Products.IsTruncated = result.Response.IsTruncated;
            if (callback) {
                return callback();
            }
        },

        Gallery_add: function (result, callback) {
            console.log(result);
            if (result.StatusCode == 0) {
                var Gallerydata_length = result.Response.Users.length;
                if (Gallerydata_length) {
                    var html = '';
                    for (var i = 0; i < result.Response.Users.length; i++) {
                        var Shopkeeper = result.Response.Users;
                        if (Shopkeeper[i].UserSign == "" && Shopkeeper[i].Intro != '') {
                            Shopkeeper[i].UserSign = Shopkeeper[i].Intro
                        }
                        if (Shopkeeper[i].UserSign == "" && Shopkeeper[i].Intro == '') {
                            Shopkeeper[i].UserSign = "魔漫相机，遇见更好的自己"
                        }
                        (Shopkeeper[i].IsArtist == true) ? Shopkeeper[i].IsArtist = 'https://mall-res.manboker.com/newmall/CN/goodsImg/search/myspace_Notcertified.png' : Shopkeeper[i].IsArtist = '';
                        (Shopkeeper[i].CertifiedType > 0) ? Shopkeeper[i].CertifiedType = "https://mall-res.manboker.com/newmall/CN/goodsImg/search/myspace_ordinary.png" : Shopkeeper[i].CertifiedType = '';
                        if (Shopkeeper[i].Products.length == 1) {
                            html += '<div class="Searchres_list">' +
                                '<div class="StudioAuthor"  uid="' + Shopkeeper[i].UserId + '">' +
                                '<div class="StudioAuthorIcon">' +
                                '  <img src="' + Shopkeeper[i].Avatar + '" uid="' + Shopkeeper[i].UserId + '" width="118"  height="118"  style="border-radius: 50%" >' +
                                ' </div>' +
                                '<div class="StudioAuthorWords"> ' +
                                '<div>' +
                                '<p class="StudioAuthorName">' + Shopkeeper[i].NickName + '</p>' +
                                '<img src="' + Shopkeeper[i].IsArtist + '" >' +
                                '<img src="' + Shopkeeper[i].CertifiedType + '" >' +
                                ' </div>' +
                                '<p class="StudioAuthorDetail">' + Shopkeeper[i].UserSign + '</p>' +
                                '</div>　</div> ' +
                                '<div  class="StudioPicList">' +
                                ' <div class="StudioPicListLeft  photoClick"  style="background:url(' + app.getOptimizedImgUrl(Shopkeeper[i].Products[0].Poster, 350) + ' ) no-repeat center center;background-size:cover"   pid="' + Shopkeeper[i].Products[0].ProductId + '"   uid="' + Shopkeeper[i].UserId + '"> </div>' +
                                '</div><div class="botomborder"></div> </div> '

                        }
                        if (Shopkeeper[i].Products.length == 2) {
                            html += '<div class="Searchres_list">' +
                                '<div class="StudioAuthor" uid="' + Shopkeeper[i].UserId + '">' +
                                '<div class="StudioAuthorIcon">' +
                                '  <img src="' + Shopkeeper[i].Avatar + '" uid="' + Shopkeeper[i].UserId + '" width="118"  height="118"  style="border-radius: 50%" > </div>' +
                                '<div class="StudioAuthorWords"> <div>' +
                                '<p class="StudioAuthorName">' + Shopkeeper[i].NickName + '</p>' +
                                '<img src="' + Shopkeeper[i].IsArtist + '" >' +
                                '<img src="' + Shopkeeper[i].CertifiedType + '" >' +
                                ' </div><p class="StudioAuthorDetail">' + Shopkeeper[i].UserSign + '</p></div></div> ' +
                                '<div  class="StudioPicList">' +
                                ' <div class="StudioPicListLeft   photoClick "  style="background:url(' + app.getOptimizedImgUrl(Shopkeeper[i].Products[0].Poster, 350) + ' ) no-repeat center center;background-size:cover"   pid="' + Shopkeeper[i].Products[0].ProductId + '"   uid="' + Shopkeeper[i].UserId + '"> </div>' +
                                ' <div  class="StudioPicListmid  photoClick"  style="background:url(' + app.getOptimizedImgUrl(Shopkeeper[i].Products[1].Poster, 350) + ' ) no-repeat center center;background-size:cover"   pid="' + Shopkeeper[i].Products[1].ProductId + '"   uid="' + Shopkeeper[i].UserId + '"></div>' +
                                '</div><div class="botomborder"></div> </div> '
                        }
                        if (Shopkeeper[i].Products.length == 3) {
                            html += '<div class="Searchres_list">' +
                                '<div class="StudioAuthor" uid="' + Shopkeeper[i].UserId + '">' +
                                '<div class="StudioAuthorIcon">' +
                                '  <img src="' + Shopkeeper[i].Avatar + '" uid="' + Shopkeeper[i].UserId + '" width="118"  height="118"  style="border-radius: 50%"> </div>' +
                                '<div class="StudioAuthorWords"> <div>' +
                                '<p class="StudioAuthorName">' + Shopkeeper[i].NickName + '</p>' +
                                '<img src="' + Shopkeeper[i].IsArtist + '" >' +
                                '<img src="' + Shopkeeper[i].CertifiedType + '" >' +
                                ' </div><p class="StudioAuthorDetail">' + Shopkeeper[i].UserSign + '</p></div></div> ' +
                                '<div  class="StudioPicList">' +
                                ' <div class="StudioPicListLeft  photoClick"  style="background:url(' + app.getOptimizedImgUrl(Shopkeeper[i].Products[0].Poster, 350) + ' ) no-repeat center center;background-size:cover"   pid="' + Shopkeeper[i].Products[0].ProductId + '"   uid="' + Shopkeeper[i].UserId + '"> </div>' +
                                ' <div  class="StudioPicListmid   photoClick"  style="background:url(' + app.getOptimizedImgUrl(Shopkeeper[i].Products[1].Poster, 350) + ' ) no-repeat center center;background-size:cover"   pid="' + Shopkeeper[i].Products[1].ProductId + '"   uid="' + Shopkeeper[i].UserId + '"></div>' +
                                ' <div  class="StudioPicListright  photoClick"  style="background:url(' + app.getOptimizedImgUrl(Shopkeeper[i].Products[2].Poster, 350) + ' ) no-repeat center center;background-size:cover"   pid="' + Shopkeeper[i].Products[2].ProductId + '"   uid="' + Shopkeeper[i].UserId + '"></div>' +
                                '</div><div class="botomborder"></div> </div> '
                        }
                    }
                }
                $("#search .sc_main .body  .SearchResult").append(html);
                $('#search .sc_main .body  .SearchResult').addClass('overserch');
                search_data.Shopkeeper.Marker = result.Response.NextMarker;
                search_data.Shopkeeper.IsTruncated = result.Response.IsTruncated;
            }
            if (callback) {
                return callback();
            }
        },

        show_data: function (type) {
            if (type == 'recommend') {
                function close_shade() {
                    search.bind();
                    search_shade.fadeOut(0);
                    isClick = true;
                    //$('#search .nav .shopsearch-form .shopsearch-form-box .shopsearch .shop-search-ipt').blur();
                }
            } else {
                function close_shade() {
                    search.search_scroll();
                    search.bind();
                    $('div').remove('.sc_waiting');
                    is_actionscroll = false;
                    search_shade.fadeOut(0);
                    isClick = true;
                    //$('#search .nav .shopsearch-form .shopsearch-form-box .shopsearch .shop-search-ipt').blur();
                }
            }
            if (tab_type() == 'gallery') {
                search.Gallery(close_shade);
            } else {
                search.Commodity(close_shade);
            }
        },
        Gallery: function (callback) {
            $('.Gallery').show();
            $('.commodity').hide();
            var is_tuijian = search_Shopkeeper_oversearch();
            if (is_tuijian !== "isoverserch") {

                if (!$('#search  .Gallery  .DefaultSearch').hasClass('overrecom')) {
                    $('.Gallery .DefaultSearch').css('display', 'block');
                    $('.Gallery .SearchResult').css('display', 'none');
                    $('.Gallery .CannotSearch').css('display', 'none');
                } else {
                    $('.Gallery .DefaultSearch').css('display', 'none');
                    $('.Gallery .SearchResult').css('display', 'none');
                    $('.Gallery .CannotSearch').css('display', 'block');
                }

            } else {
                var list_num = $('.Searchres_list').length;
                if (list_num == 0) { //
                    $('.Gallery .DefaultSearch').css('display', 'none');
                    $('.Gallery .SearchResult').css('display', 'none');
                    $('.Gallery .CannotSearch').css('display', 'block');
                } else {
                    $('.Gallery .DefaultSearch').css('display', 'none');
                    $('.Gallery .SearchResult').css('display', 'block');
                    $('.Gallery .CannotSearch').css('display', 'none');
                }
            }
            if (callback) {//关闭加载
                callback();
            }
        },
        Commodity: function (callback) { //选择框为商品
            $('.commodity').show();
            $('.Gallery').hide();
            var is_tuijian = search_Products_oversearch();
            if (is_tuijian !== "isoverserch") {
                if (!$('#search  .commodity  .DefaultSearch').hasClass('overrecom')) {
                    $('.commodity .DefaultSearch').css('display', 'block');
                    $('.commodity .CommoditySection_box').css('display', 'none');
                    $('.commodity .CannotSearch').css('display', 'none');
                } else {
                    $('.commodity .DefaultSearch').css('display', 'none');
                    $('.commodity .CommoditySection_box').css('display', 'none');
                    $('.commodity .CannotSearch').css('display', 'block');
                }
            } else {
                var list_num = $('.CommoditySection').length;
                if (list_num == 0) {//
                    $('.commodity .DefaultSearch').css('display', 'none');
                    $('.commodity .CommoditySection_box').css('display', 'none');
                    $('.commodity .CannotSearch').css('display', 'block');
                } else {
                    $('.commodity .DefaultSearch').css('display', 'none');
                    $('.commodity .CommoditySection_box').css('display', 'block');
                    $('.commodity .CannotSearch').css('display', 'none');
                }
            }
            if (callback) {   //关闭加载
                callback();
            }
        },

        //监听滑动
        search_scroll: function () { //监听滑动
            var renderDom = render_dom();
            var tabTypeName = tab_type();
            scroll_dom().unbind('scroll').scroll(function () {
                var $this = $(this),
                    viewH = $(this).height(), //可见高度
                    contentH = $(this).get(0).scrollHeight, //内容高度
                    scrollTop = $(this).scrollTop(); //滚动高度
                console.log(scrollTop);
                // console.log(contentH - viewH - scrollTop);
                if (contentH - viewH - scrollTop <= 350) { //到达底部100px时,加载新内容
                    var scrollIsTruncated = tab_type() == "gallery" ? search_data.Shopkeeper.IsTruncated : search_data.Products.IsTruncated;
                    //添加 如果没有加载内容就应该为false
                    //if (!render_dom().hasClass('overserch')) {
                    //    scrollIsTruncated = false;
                    //}
                    if (scrollIsTruncated === true) {    //说明还有数据可以加载
                        if (is_actionscroll == false) {
                            search.go_scroll();
                        }
                    } else {
                        if (tabTypeName == 'gallery') {
                            if ($('#search .Gallery .SearchResult').css('display') !== 'none') {
                                if (contentH - viewH - scrollTop == 0) {
                                    if (gallery_nodedata == 'yes') {
                                        search.search_warning('没有数据了');
                                        gallery_nodedata = 'no';
                                    }
                                }
                            }
                        } else {
                            if ($('#search  .commodity .CommoditySection_box').css('display') !== 'none') {
                                if (contentH - viewH - scrollTop == 0) {
                                    if (commodity_nodedata == 'yes') {
                                        search.search_warning('没有数据了');
                                        commodity_nodedata = 'no';
                                    }
                                }
                            }
                        }

                    }
                }
            });
        },
        //上拉加载数据
        go_scroll: function () {
            var tabtype_name = tab_type();
            var api_url = tabtype_name == "gallery" ? app.urls.GetShopkeeper : app.urls.GetUserProducts;
            var api_name = tabtype_name == "gallery" ? search_data.Shopkeeper.NickName : search_data.Products.Name;

            var api_data = tabtype_name == "gallery" ? search_data.Shopkeeper : search_data.Products;
            var api_nextmarker = api_data.Marker;
            var api_PageSize = api_data.PageSize;

            if (tab_type() == "gallery") {
                var ajax_data = {}
                ajax_data.NickName = api_name,
                    ajax_data.Marker = api_nextmarker,
                    ajax_data.PageSize = api_PageSize
            } else {
                var ajax_data = {}
                ajax_data.Name = api_name,
                    ajax_data.Marker = api_nextmarker,
                    ajax_data.PageSize = api_PageSize
            }

            if (api_name != '') {
                isClick = false;
                is_actionscroll = true;
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: api_url,
                    timeout: 25000,
                    cache: true,
                    data: ajax_data,
                    beforeSend: function (request) {
                        var html = '<div class="sc_waiting">' +
                            '<img src="http://mall-res.manboker.com/newmall/CN/loading.gif"  style="margin-top: 0px;"/>' +
                            '</div>';
                        render_dom().append(html);
                    },
                    success: function (data) {
                        if (data.StatusCode == 0) {
                            if (tabtype_name == "gallery") {
                                search.Gallery_add(data, search.show_data);
                            } else {
                                search.Products_add(data, search.show_data);
                            }
                        } else {
                            search.search_warning('请稍后重试');
                            $('div').remove('.sc_waiting');
                            search.search_scroll();
                            is_actionscroll = false;
                        }
                    },
                    error: function () {
                        search.search_warning('请稍后重试');
                        $('div').remove('.sc_waiting');
                        search.search_scroll();
                        is_actionscroll = false;
                        console.log('出错了！！！');
                    }
                });
            }
        },

        //警告
        search_warning: function (msg) {
            if (is_warning == false) {
                is_warning = true;
                var html_msg = '<div class="warning_msg" style="display: none;">' + msg + '</div>';
                $("#search").append(html_msg);
                $("#search .warning_msg").fadeIn(500);
                setTimeout(function () {
                    $("#search .warning_msg").fadeIn(500, function () {
                        $("#search .warning_msg").remove();
                        is_warning = false;
                    });
                }, 1500);
            }
        },

        clear_data: function () {
            is_actionscroll = false;
            is_warning = false;
            //删除已经搜索出来的内容，初始化细节
            $("#search .CommoditySection_box").html('');
            $("#search  .SearchResult").html('');
            $("#search  .SearchResult").removeClass('overserch');
            $("#search  .CommoditySection_box").removeClass('overserch');

            search_data = {
                Shopkeeper: {
                    NickName: '',
                    Marker: 0,
                    PageSize: ShopkeeperPageSize,
                    IsTruncated: true
                },
                Products: {
                    Name: '',
                    Marker: 0,
                    PageSize: ProductsOageSize,
                    IsTruncated: true
                }
            }
            gallery_nodedata = 'yes';
            commodity_nodedata = 'yes';
        },


        delete_data: function () {
            is_actionscroll = false;
            is_warning = false;
            //删除已经搜索出来的内容，初始化细节
            $("#search .DefaultSearch ").removeClass('overhas');
            $('#search .DefaultSearch ').removeClass('overrecom');

            $("#search .CommoditySection_box").removeClass('overserch');
            $('#search .SearchResult').removeClass('overserch');

            $("#search .CommoditySection_box").html('');
            $("#search  .SearchResult").html('');

            $("#search  .DefaultSearch .Specificot ul").html('');
            search_data = {
                Shopkeeper: {
                    NickName: '',
                    Marker: 0,
                    PageSize: ShopkeeperPageSize,
                    IsTruncated: true
                },
                Products: {
                    Name: '',
                    Marker: 0,
                    PageSize: ProductsOageSize,
                    IsTruncated: true
                }
            }
            //给第一个选项默认画廊
            $('#search .tabtitle em').removeClass('tabhover').css('color', '#000');
            $('#search .tabtitle .diyi').addClass('tabhover').css('color', '#fa9c14');
            //清空搜索里面的数据
            $('#search_input').val('');
        },
    }

    $(function () {
        search.init();

    })
}());


function loadImage(a, b) {
    var c = new Image;
    c.onload = function () {
        c.onload = null,
            b(c)
    },
        c.src = a
}


function SearchCallAjax(url, data, type, callback) {
    $.ajax({
        type: type,
        async: true,
        url: url,
        data: data,
        timeout: 25000,
        cache: false,
        dataType: "json",
        success: function (result) {
            return callback(result);
        }
    });
}
