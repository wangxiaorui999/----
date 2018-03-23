$(function () {
    $(".SubmitBtn").on("click", function () {
        window.location.href = "//artist.momentcam.cn/page/ChooseType.html";
    });

    var a = getQueryString("a");
    $(".return").on("click", function () {
        if (a == 2) {
            $.cookie("fromMagicshop", "true");
            history.go(-1);
        } else {
            ClientReturn();
        }
    });
})