//console.log = function () { };
if (!('app' in window)) {
    window['app'] = {}
}
//去掉客户端标题
app.config = {
    isAndroid: !!navigator.userAgent.match(/Android|Adr/i),
    isIos: !!navigator.userAgent.match(/iPhone|iPad|iPod|iOS/i),
    isMomanApp: false,
    platform: 'html:1.0:h5-mall',
    countryCode: '',
    lang: '',
    ip: '',
    isSupportWebp: false,
    imageSuffix: "x-oss-process=image/resize,m_lfit,h_100,w_100/format,jpg",
};
app.urls = {
    GetMartDailyCN: "//product.manboker.com/api/Mart/GetMartDailyActivityByPlace?countryCode=CN",
    GetMartDailyTW: "//product.manboker.com/api/Mart/GetMartDailyActivityByPlace?countryCode=TW",
    GetMartDailyUS: "//product.manboker.com/api/Mart/GetMartDailyActivityByPlace?countryCode=US",
    GetMartDailyJP: "//product.manboker.com/api/Mart/GetMartDailyActivityByPlace?countryCode=JP",
    GetMartDailyKR: "//product.manboker.com/api/Mart/GetMartDailyActivityByPlace?countryCode=KR",
    StudioRecommendsURL: "//mystudioapi.manboker.com/Api/ProductInfos/Recommends",//小店推荐地址
    BoutiquesURL: "//mystudioapi.manboker.com/api/ShopInfos/Boutiques",//小店精品地址
   StudioContentURL: "//mystudioapi.manboker.com/api/ShopInfos?pageSize=5",//全部小店地址
    MySpaceURL: "//artist.momentcam.net/page/MySpace.html?userid=",  //小店头像地址
    ProductDetailURL: "//artist.momentcam.net/page/DetailsPage.html",  //小店图片地址
    GetTotalStoreURL: "//mystudioapi.manboker.com/Api/ShopInfos/Summary", //小店总数
    GetShopkeeper: "//es.momentcam.net/api/User/GetShopkeeper",//搜索店主
    GetUserProducts: "//es.momentcam.net/api/Product/GetUserProducts",//搜索店铺商品
    GetKeywordsProducts: '//es.momentcam.net/api/Key/GetKeywords?category=1',//热门店铺商品
    GetKeywordsShopkeeper: '//es.momentcam.net/api/Key/GetKeywords?category=2',//热门店主
    GetPopularhopURL: "//mystudioapi.manboker.com/api/ShopInfos/Boutiques?showType=1", // 人气小店
    GetIndexBanner: "//product.manboker.com/api/Mart/GetMartDailyActivityByPlace?countryCode=CN" // 首页轮播图

};
//cookie storage
app.cookie = {
    /**
     * 获取cookie指定name值
     */
    get: function (name) {
        var cookie = document.cookie,
            e, p = name + "=",
            b;
        if (!cookie)
            return;
        b = cookie.indexOf("; " + p);
        if (b == -1) {
            b = cookie.indexOf(p);
            if (b != 0)
                return null;
        } else {
            b += 2;
        }
        e = cookie.indexOf(";", b);
        if (e == -1)
            e = cookie.length;
        return decodeURIComponent(cookie.substring(b + p.length, e));
    },
    /**
     * 设置cookie
     *
     *  expires参数可以是js Data()对象或过期的秒数     *
     */
    set: function (name, value, expires, path, domain, secure) {
        var d = new Date();
        if (typeof (expires) == 'object' && expires.toUTCString) {
            expires = expires.toUTCString();
        } else if (parseInt(expires, 10)) {
            d.setTime(d.getTime() + (parseInt(expires, 10) * 1000));
            expires = d.toUTCString();
        } else {
            expires = '';
        }
        document.cookie = name + "=" + encodeURIComponent(value) +
            ((expires) ? "; expires=" + expires : "") +
            ((path) ? "; path=" + path : ";path=/") +
            ((domain) ? "; domain=" + domain : "") +
            ((secure) ? "; secure" : "");
    },
    /**
     * 删除cookie
     */
    remove: function (name, path) {
        this.set(name, '', -1000, path);
    }
};
app.storage = {
    get: function (key) {
        return window['sessionStorage'].getItem(key);
    },
    set: function (key, value) {
        window['sessionStorage'].setItem(key, value);
    },
    remove: function (key) {
        window['sessionStorage'].removeItem(key);
    }
};
/**
 * 获取当前用户信息
 * @return {token:'123123',user_id:'12313',user_uid:'3333', "user_type": "Guest",IsGuest:Function}
 */
app.getUser = function () {
    if (app.config.isMomanApp) {
        var isUserLogin = false;
        mcAPI.isLogin(function (isLogin) {
            isUserLogin = isLogin;
        });
        //已经登录魔漫app
        if (isUserLogin) {
            var user = null;
            //{"userIntID":89022,"userToken":"3vVB5vINs4qiFesObpUbzLfRVSU_CN","userType":"","userUID":"49ead077-8a7a-4048-9295-d2c0b93b0f65"}
            mcAPI.getUserInfo(function (userInfo) {
                var currentUser = userInfo == '' ? null : JSON.parse(userInfo);
                if (currentUser) {
                    user = {};
                    user.token = currentUser.userToken || '';
                    user.user_uid = currentUser.userUID || '';
                    user.user_id = currentUser.userIntID || 0;
                    user.user_type = currentUser.userType;
                    user.isGuest = function () {
                        return this.user_type == 'Guest';
                    };
                }
            });
            return user;
        }
        return null;
    }
    //微信或手机浏览器
    else {
        var user = app.cookie.get('__u');
        if (!user) {
            return null;
        }
        user = JSON.parse(unescape(user));
        user.isGuest = function () {
            return this.user_type == 'Guest';
        }
        return user;
    }
};
/**
 *
 * @param {token:'123123',user_id:'12313',user_uid:'3333', "user_type": "Guest"}
 */
app.setUser = function (user) {
    if (app.config.isMomanApp) {
        return;
    }
    app.cookie.set('__u', escape(JSON.stringify(user)));
};
app.clearUser = function () {
    app.cookie.remove('__u');
};

//如果浏览器支持webp图像格式,为图像增加webp
app.appendWebpForImgUrl = function (imgUrl) {
    if (!imgUrl || !app.config.isSupportWebp) {
        return imgUrl;
    }
    return imgUrl + '?x-oss-process=image/format,' + (app.config.isSupportWebp ? 'webp' : 'jpg') + '/resize,w_350';
};

//根据浏览器获取最优的图片地址
app.getOptimizedImgUrl = function (imgUrl, maxWidth) {
    if (!imgUrl) {
        return imgUrl;
    }
    var param = '?x-oss-process=image/format,' + (app.config.isSupportWebp ? 'webp' : 'jpg');

    if (maxWidth && maxWidth > 0) {
        param += '/resize,w_' + maxWidth;
    }
    return imgUrl + param;
};

/**
 *获取当前url参数
 * 返回key value字典
 */
app.getCurrentUrlQueryString = function () {
    var pattern = /(\w+)=([^&]*)/g;
    var parames = {};
    window.location.search.replace(pattern, function (a, b, c) {
        parames[b] = decodeURIComponent(c);
    });
    return parames;
};

//获取漫画图地址 type:icon,pic
app.getCartoonUrl = function (cartoonCode, type) {
    if (!cartoonCode) {
        return '';
    }
    if (type === 'icon') {
        return app.urls.CartoonIconUrl + cartoonCode + '19.jpg';
    }
    return app.urls.CartoonUrl + cartoonCode + '06.jpg';

}
//jq 弹框
;
(function ($) {
    var dialogs = [];
    var h5Dialog = function () {
        dialogs.push(this);
        var tmpl = '<div style="background-color:black;opacity:.6;padding:40px 60px;border-radius:5px;position:absolute;z-index:9999;transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%); left:50%;top:50%;white-space:nowrap;">' +
            '<span style="color:white;font-size:48px;">{text}</span></div>';
        var thisHtml = null;
        var thisDialog = this;
        this.show = function (content, second) {
            thisHtml = $(tmpl.replace('{text}', content));
            $(document.body).append(thisHtml);
            if (second) {
                setTimeout(function () {
                    thisDialog.destroy();
                }, 1000 * second);
            }
        };
        this.destroy = function () {
            if (thisHtml) {
                thisHtml.remove();
            }
        };

    };
    var dialogExtend = {
        tips: function (content, second) {
            //不支持多次弹框
            var delDialog;
            while (dialog = dialogs.shift()) {
                dialog.destroy();
            }
            second = second || 1.5;
            var dialog = new h5Dialog();
            dialog.show(content, second);
        }
    };
    $.extend({
        dialog: dialogExtend
    });

})(jQuery);

try {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        mcAPI.isIOS = app.config.isIos = true;
    } else {
        mcAPI.isIOS = app.config.isIos = false;
    }
    mcAPI.hasClientTitle(false, null);
    var canvas = document.createElement('canvas');
    app.config.isSupportWebp = canvas.getContext && canvas.getContext('2d') && canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    //这里要先缓存,ios检测不到异常
    app.storage.set('_app_config', JSON.stringify(app.config));

    //从app端抓取信息{"country":"CN","ip":"10.0.2.15","language":"zh","platform":"Android/iOS","version":"3.3.10"}
    mcAPI.getClientInfo(function (clientInfo) {
        var info;
        if (typeof (clientInfo) == 'string') {
            info = JSON.parse(clientInfo);
        }
        if (typeof (clientInfo) == 'object') {
            info = clientInfo;
        }
        app.config.countryCode = info.country;
        app.config.lang = info.language;
        app.config.ip = info.ip;
        app.config.platform = info.platform + ':' + info.version + ':' + 'h5';
        app.config.isAndroid = info.platform.toLowerCase() == 'android';
        app.config.isMomanApp = true;
        app.storage.set('_app_config', JSON.stringify(app.config));
    });
} catch (err) {
    app.storage.set('_app_config', JSON.stringify(app.config));
}

$.ajaxSetup({
    headers: {
        // 默认添加请求头
        'Lang': app.config.lang,
        'Platform': app.config.platform,
        'EncryptType': 'NONE'
    }
});
//页面初始化设置
var scale = parseInt(window.screen.width) / 1080;
if (app.config.isIos) {
    $('meta[name="viewport"]').attr("content", 'width=1080, minimum-scale=' + scale + ', maximum-scale=' + scale + ',user-scalable=no' + ',target-densitydpi=device-dpi');
} else {
    $('meta[name="viewport"]').attr("content", 'width=1080, minimum-scale=' + scale + ', maximum-scale=' + scale + ',target-densitydpi=device-dpi');
}

String.prototype.startWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length)
        return false;
    if (this.substr(0, s.length) == s)
        return true;
    else
        return false;
    return true;
};

String.prototype.endWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length)
        return false;
    if (this.substring(this.length - s.length) == s)
        return true;
    else
        return false;
    return true;
};
//页面初始化
$(function () {
    $('head').append('<meta http-equiv="pragma" content="no-cache">').append('<meta http-equiv="cache-control" content="no-cache">').append('<meta http-equiv="expires" content="0">').append('<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE9" />');
    //解决ios click 300ms延迟问题
    if (app.config.isIos && window.FastClick) {
        window.addEventListener("load", function () {
            FastClick.attach(document.body);
        }, false);
    }
});

function ClientReturn() {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        var src = "close://";
        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", src);
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
    } else {
        ProductListActivityJump.finish();
    }
}

function details(id) {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        GoiOS("hasClientTitle://ifHasTitle=false");
        if (iosVer.substr(0, 1) == 1) {
            GoiOS("homeproductdetail://productID-" + id);
        } else {
            GoiOS("homeproductdetail://productID=" + id);
        }
    } else {
        ProductListActivityJump.entryCustomProductActivity(id);
    }
};

function GoiOS(src) {
    var src = src;
    var iframe = document.createElement("IFRAME");
    iframe.setAttribute("src", src);
    document.documentElement.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
    iframe = null;
};

if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    GoiOS("finishloading://");
} else {
    try {
        ProductListActivityJump.finishloading();
    } catch (e) {

    }
}

function getQueryString(key) {
    var url = window.location.search;
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var result = url.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
}