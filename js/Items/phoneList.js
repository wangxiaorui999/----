(function () {
    var PhoneList = {
        bind: function () {
            $(".return").on("click", function () {
                window.history.go(-1);
            });
            $(".pic").on("click", function () {
                var id = $(this).attr("id");
                if (id == "303094") {
                    window.location = "//mall.manboker.com/newmall/tianyi/page/index.html?productid=303094&v=" + Date.now();
                    return;
                }
                if ($(this).hasClass("a")) {
                    mcAPI.openProductDetail(id);
                } else {
                    window.location.href = "//artist.momentcam.cn/page/DetailsPage.html?productid=" + id;
                }
                
            });
        },
        init: function () {
            this.bind();
        }
    }
    $(function () {
        
        PhoneList.init();
        if (app.config.isMomanApp) {
            mcAPI.finishloading();
        }
    });
})()
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}