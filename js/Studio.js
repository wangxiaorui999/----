


var Studio = (function () {
    Counter("魔法小店首页浏览");
    var loadingIconURL = "https://mall-res.manboker.com/newmall/CN/loading.gif";
    //===========新品推荐拼接数据=================
    jQuery.ajax({
        type: "get",
        async: true,
        url: app.urls.StudioContentURL,
        timeout: 25000,
        cache: false,
        beforeSend: function (request) {
            //request.setRequestHeader("EncryptType", "NONE");
            var html = '<div class="waiting">' +
           '<img src="' + loadingIconURL + '" />' +
           '</div>';
            $(".NewList").append(html);
        },

        success: function (data) {
            console.log(data);
            try {
                console.log(data)
                if (data.StatusCode == 200) {

                    var html = '';
                    for (var i = 0; i < Math.ceil(data.Data.length / 1) ; i++) {
                        for (var h = i * 1; h < (i * 1 + 1) ; h++) {
                            if (h + 1 > data.Data.length) break;
                            html += '<div  class="NewModel  swiper-slide">' +
                                     '<img src="' + data.Data[i].Poster + '" />' +
                                     '<div class="DetailWords">' +
                                     '<div class="Detail">' +
                                     '<div class="DetailName">' +
                                     '<span class="GoodsType">' + data.Data[i].CategoryName + '</span>' +
                                    '<span class="line"></span>' +
                                    '<span class="GoodsName">' + data.Data[i].Name + '</span></div>' +
                                    '<div class="DetailPrice">' +
                                    '<span>¥</span>' +
                                    '<span>' + data.Data[i].Price + '</span> </div>  </div>' +
                                    '<div class="Author">' +
                                    '<img class="AuthorIcon" src="' + data.Data[i].UserIcon + '" />' +
                                    '<span>' + data.Data[i].UserName + '</span>' +
                                    '</div>  </div>  </div>';

                        }
                        $(".NewList").html(html);


                    }
                    console.log($('#dier').hasClass("tabhover"));


                }

                //return callback(JSON.parse(data));
            } catch (e) {
                //return callback("");
            }
        }
    });


    //==============================下面的精品小店部分================================
    jQuery.ajax({
        type: "get",
        async: true,
        url: app.urls.BoutiquesURL,
        timeout: 25000,
        cache: false,
        beforeSend: function (request) {
            var html = '<div class="waiting">' +
            '<img src="' + loadingIconURL + '" />' +
            '</div>';
            $(".Studio").append(html);
        },

        success: function (data) {
            //$('div').remove('.waiting');
        
            try {
                console.log(data);
                console.log(data.Data[1].LatestProducts.length);
                if (data.StatusCode == 200) {
                 
                    for (var i = 0; i < data.Data.length; i++) {
                        var html1 = '';
                        //console.log(data.Data[i].LatestProducts.length)                                 
                        if (data.Data[i].LatestProducts.length > 0) {
                            var santutop = data.Data[i];
                            var santu = data.Data[i].LatestProducts;
                            if (data.Data[i].LatestProducts.length == 3) {


                                console.log(santu[0].Name)


                                html1 += '<div class="StudioAuthor">' +
                                     '<div class="StudioAuthorIcon">' +
                                     '<img src="' + santutop.UserIcon + '" /> </div>' +
                                     '<div class="StudioAuthorWords">' +
                                     '<p class="StudioAuthorName">' + santutop.UserName + '</p>' +
                                     '<p class="StudioAuthorDetail">>' + santutop.UserSign + '</p>  </div>' +
                                     ' <div class="FollowBtn"  style="display:none;">关注</div> </div>' +

                                      '<div class="StudioPicList">' +
                                      '<div class="StudioPicListLeft">' +
                                      '<img src="' + santu[0].Poster + '" /></div>' +
                                      ' <div class="StudioPicListRight">' +
                                      '<img src="' + santu[1].Poster + '" />' +
                                      '<img src="' + santu[2].Poster + '" /> </div> </div>';

                            }
                            if (data.Data[i].LatestProducts.length == 1) {

                                html1 += '<div class="StudioAuthor">' +
                                      '<div class="StudioAuthorIcon">' +
                                      '<img src="' + santutop.UserIcon + '" /> </div>' +
                                      '<div class="StudioAuthorWords">' +
                                      '<p class="StudioAuthorName">' + santutop.UserName + '</p>' +
                                      '<p class="StudioAuthorDetail">>' + santutop.UserSign + '</p>  </div>' +
                                      ' <div class="FollowBtn"  style="display:none;"> 关注</div> </div>' +

                                       '<div class="StudioPicList">' +
                                       '<div class="StudioPicListLeft  yitu">' +
                                       '<img src="' + santu[0].Poster + '"  class="yidt"/></div>  </div>';


                            }
                            if (data.Data[i].LatestProducts.length == 2) {

                                html1 += '<div class="StudioAuthor">' +
                                      '<div class="StudioAuthorIcon">' +
                                      '<img src="' + santutop.UserIcon + '" /> </div>' +
                                      '<div class="StudioAuthorWords">' +
                                      '<p class="StudioAuthorName">' + santutop.UserName + '</p>' +
                                      '<p class="StudioAuthorDetail">>' + santutop.UserSign + '</p>  </div>' +
                                      ' <div class="FollowBtn"  style="display:none;"> 关注</div> </div>' +

                                       '<div class="StudioPicList">' +
                                       '<div class="Studioertu-left  ertu">' +
                                       '<img src="' + santu[0].Poster + '"  /> </div>' +
                                        '<div class="Studioertu-right  ertu">' +
                                       '<img src="' + santu[1].Poster + '"  /> </div>' +
                                       '  </div>';


                            }



                        }
                        $(".Studio").html(html1);


                    }

                }

            } catch (e) {

            }
        }
    });
    //======================================点击跳转===============================

    $(".SeeAll").on("click", function () {
        window.location.href = "./Modaxdxq.html";
    });
    $(".LookAll").on("click", function () {
        window.location.href = "Modaxdxq.html";
    });

})


var a = false;
window.onload = function () {
    $("body").on('click', '.FollowBtn', function () {
        $(this).css('background-color', "#FA9C14");
        $(this).css("color", "#ffffff");
    })


    $(".Studio").scroll(function () {
        var $this = $(this),
            viewH = $(this).height(), //可见高度
            contentH = $(this).get(0).scrollHeight, //内容高度
            scrollTop = $(this).scrollTop(); //滚动高度
        if (contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
            // if (scrollTop / (contentH - viewH) >= 0.95) { //到达底部100px时,加载新内容
            // 这里加载数据..
            if (!a) {
                a = true;
                mfxd();

            }
        }
    });


}
