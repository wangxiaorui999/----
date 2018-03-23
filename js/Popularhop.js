var Popularhop ={
    renderDom:function () {
        CallAjax(app.urls.GetPopularhopURL, '', "get",false, function (result) {
            console.log(result);
            var Popularhophtml = '';
            for (var i = 0; i < result.Data.length; i++) {
                if (result.Data[i].UserSign == "") {
                    result.Data[i].UserSign = "魔漫相机，遇见更好的自己"
                } else {                
                    var str = eval("'" + result.Data[i].UserSign + "'");
                    result.Data[i].UserSign = unescape(str);                  
                   
                }
              
                var certifiedImgs = ["", "https://mall-res.manboker.com/newmall/CN/newstudio/myspace_ordinary.png", "https://mall-res.manboker.com/newmall/CN/newstudio/myspace_Artist.png"];
                if(result.Data[i].LatestProducts.length == 0){
                    Popularhophtml += '<div class="swiper-slide  swiper-no-swiping">'+
                        '<div class="PopularShopcontent"   uid="' + result.Data[i].UserId + '">' +
                        '<div class="StudioAuthor">'+
                        '<div class="StudioAuthorIcon">'+
                        '<img src="' + result.Data[i].UserIcon.replace("http://", "https://") + '" uid="' + result.Data[i].UserId + '"  width="86"  height="86"  style="border-radius:50% ">' +
                        '</div>'+
                        '<div class="StudioAuthorWords">'+
                        '<div>'+
                        '<p class="StudioAuthorName">'+result.Data[i].UserName+'</p>'+
                        '<img src="' + app.appendWebpForImgUrl(certifiedImgs[result.Data[i].CertifiedType]).replace("http://", "https://") + '"  uid="">' +
                        '</div>'+
                        '<p class="StudioAuthorDetail">' + result.Data[i].UserSign + '</p>' +
                        '</div>'+
                        '</div>'+
                        '</div></div>'
                }
                if(result.Data[i].LatestProducts.length == 1){
                    Popularhophtml += '<div class="swiper-slide  swiper-no-swiping">'+
                        '<div class="PopularShopcontent"   uid="' + result.Data[i].UserId + '">' +
                        '<div class="StudioAuthor">'+
                        '<div class="StudioAuthorIcon">'+
                        '<img src="' + result.Data[i].UserIcon + '" uid="' + result.Data[i].UserId + '"  width="86"  height="86"  style="border-radius:50% ">' +
                        '</div>'+
                        '<div class="StudioAuthorWords">'+
                        '<div>'+
                        '<p class="StudioAuthorName">'+result.Data[i].UserName+'</p>'+
                        '<img src="' + app.appendWebpForImgUrl(certifiedImgs[result.Data[i].CertifiedType]).replace("http://", "https://") + '"  uid="">' +
                        '</div>'+
                        '<p class="StudioAuthorDetail">' + result.Data[i].UserSign + '</p>' +
                        '</div>'+
                        '</div>'+
                        '<div class="PopularShopimg">'+
                        '<div class="left"  uid="' + result.Data[i].UserId + '"   pid="' + result.Data[i].LatestProducts[0].ProductId + '">' +
                        '<img src="' + app.getOptimizedImgUrl(result.Data[i].LatestProducts[0].Poster, 350).replace("http://", "https://") + '" alt=""  width="126"  height="126"  pid="' + result.Data[i].LatestProducts[0].ProductId + '"   uid="' + result.Data[i].UserId + '">' +
                        '</div>'+
                        '</div></div></div>'
                }
                if (result.Data[i].LatestProducts.length >1 ) {
                    if (!result.Data[i].LatestProducts[0]) {
                        result.Data[i].LatestProducts[0] = "img/default_picture.png"
                    }
                    if (!result.Data[i].LatestProducts[1]) {
                        result.Data[i].LatestProducts[1] = "img/default_picture.png"
                    }
                    Popularhophtml += '<div class="swiper-slide  swiper-no-swiping">'+
                        '<div class="PopularShopcontent"  uid="' + result.Data[i].UserId + '">' +
                        '<div class="StudioAuthor">'+
                        '<div class="StudioAuthorIcon">'+
                        '<img src="' + result.Data[i].UserIcon.replace("http://", "https://") + '" uid="' + result.Data[i].UserId + '"  width="86"  height="86" style="border-radius:50% ">' +
                        '</div>'+
                        '<div class="StudioAuthorWords">'+
                        '<div>'+
                        '<p class="StudioAuthorName">'+result.Data[i].UserName+'</p>'+
                        '<img src="' + app.appendWebpForImgUrl(certifiedImgs[result.Data[i].CertifiedType]).replace("http://", "https://") + '"  uid="">' +
                        '</div>'+
                        '<p class="StudioAuthorDetail">' + result.Data[i].UserSign + '</p>' +
                        '</div>'+
                        '</div>'+
                        '<div class="PopularShopimg">'+
                        '<div class="left"  uid="'+result.Data[i].UserId+'">'+
                        '<img src="' + app.getOptimizedImgUrl(result.Data[i].LatestProducts[0].Poster, 350).replace("http://", "https://") + '" alt=""  width="126"  height="126"   pid="' + result.Data[i].LatestProducts[0].ProductId + '"   uid="' + result.Data[i].UserId + '">' +
                        '</div>'+
                        '<div class="right"   uid="'+result.Data[i].UserId+'">'+
                        '<img src="' + app.getOptimizedImgUrl(result.Data[i].LatestProducts[1].Poster, 350).replace("http://", "https://") + '" alt=""  width="126"  height="126"   pid="' + result.Data[i].LatestProducts[1].ProductId + '"   uid="' + result.Data[i].UserId + '">' +
                        '</div></div></div></div>'
                }
            }
            $(".PopularShopcontent  .swiper-container4  .swiper-wrapper").html(Popularhophtml);
    
            $('.PopularShop .PopularShopcontent').off('click').on('click', function () {
                var uid = $(this).attr("uid");
                console.log(uid);
                if (app.config.isMomanApp) {
                    mcAPI.openSpecificSpacePageById(uid);
                    return false;
                } else {
                    window.location = "https://artist.momentcam.net/page/MySpace.html?language=zh&appversion=87&fromtype=html%3A1.0%3Ah5&userid=" + uid;
                    return false;
                }
            });
            //init('index');
            //bind();
        })
    },
    init: function (index) {
        if (index == "index") {
            if (Popularhop.init.PopularShopSwiper) {
                Popularhop.init.PopularShopSwiper.destroy(false);
            }
        }
        Popularhop.init.PopularShopSwiper = new Swiper('.swiper-container4', {
            direction: 'vertical',
            loop: true,
            observer:true,
            observeParents: true,
             autoplayDisableOnInteraction : false,
             autoplay:1000
        });
    },
   
    startFunc: function(){
        this.init('index');
       
       
    }
}
$(function () {
    Popularhop.renderDom();
});
