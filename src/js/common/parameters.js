function Parameters() {
    this.share = {
        'shareText': '您附近的酒店今夜大甩卖啦！', //分享文案
        'shareDesc': '艺龙酒店低价狂甩。每天16点准时开抢，周边特价房天天有！', //分享内容描述
        'shareLink': window.location.href, //分享链接
        'shareImgSrc': 'http://promotion.elong.com/test/endroom/dist/usecase/img/wxshare.png', //分享图片路径(绝对路径)
        'weiXinShareType': 3, //如果规则 没有获取到，则默认分享方式为3 （即 支持 好友和朋友圈）
        'shortLink': 'http://d.elong.cn/' //短链接
    };


    //城市名的传参
    this.cityBar = {
        'promDataSourceId': '' //数据集
    };

    //城市列表的传参
    this.cityList = {
        'promCityDataId': '', //数据集默认展示的城市数据ID
        'promDataSourceId': '', //数据集
        'pageNo': 1, //页码 默认展示第一页
        'pageSize': 12, //酒店产品列表展示个数
        'pageType': 0, //pc 0, h5 1
        'channelId': 1 //ref值
    };

    //活动过期提醒  日期填写格式要求为年月日
    this.activityExpired = {
        'onlineDate': '', //头部图片banner 路径设置  == 上线日期
        'deadlineDate': '',  //活动截止日期
        'expiredLink': '' //要求填写标准url  查看更多优惠，以及关闭浮层的链接跳转地址
    };

    //促下载屏蔽的渠道号
    this.shieldChannel = ['zdwshwh5', 'wxqbh5']; //添加渠道号，则会屏蔽对应的渠道促下载浮层功能


}

var parameters = new Parameters();

module.exports = parameters;


