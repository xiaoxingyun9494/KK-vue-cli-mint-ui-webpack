var Mock = require('mockjs');

module.exports = Mock.mock(
{
    "code": "200",
    "status": "1056",
    "tips": function(){
        if (this.status==1056) {
            return "查询成功"
        }else{
            return "查询失败"
        }
    },
    "result": function(){
        if (this.status==1057) {
            return "查询首页数据异常"
        }else{
            return {
        "carousel": [
            {
                "img_url": "http://m.qiyipic.com/common/lego/20171110/efec3d6eff734894b919bbc320cbd345.jpg",
                "link_url": ""
            },
            {
                "img_url": "http://m.qiyipic.com/common/lego/20171112/2f11b4e5bc1342728023b8648fe2bafb.jpg",
                "link_url": ""
            },
            {
                "img_url": "http://m.qiyipic.com/common/lego/20171126/525cdd68784f42ad8f739bf8a44dd779.jpg",
                "link_url": ""
            }
        ],
        "data": [
            {
                "name": "最新上映",
                "sorted": "newest",
                "data": [
                    {
                        "id": "4028803a5fe6e4ae015fe76250f856a1",
                        "name": "权力的游戏第七季",
                        "img_url": "//puui.qpic.cn/vcover_vt_pic/0/vqm1l9en588rdtx1501731985/220"
                    },
                    {
                        "id": "4028803a5fe6e4ae015fe76250f856e6",
                        "name": "黑名单：救赎",
                        "img_url": "//puui.qpic.cn/vcover_vt_pic/0/kr7lhhd4nl8pada1486622131/220"
                    },
                    {
                        "id": "4028803a5fe6e4ae015fe76250f95750",
                        "name": "大小谎言",
                        "img_url": "//puui.qpic.cn/vcover_vt_pic/0/857m263ty48bcgj1487556521/220"
                    },
                    {
                        "id": "4028803a5fe6e4ae015fe76250f856c4",
                        "name": "X战警：军团",
                        "img_url": "//puui.qpic.cn/vcover_vt_pic/0/lnnijsrcp2djcm51486521554/220"
                    },
                    {
                        "id": "4028803a5fe6e4ae015fe76254605862",
                        "name": "亿万第一季",
                        "img_url": "//puui.qpic.cn/vcover_vt_pic/0/njylr2zc6uqi463t1457496046.jpg/220"
                    },
                    {
                        "id": "4028803a5fe6e4ae015fe7626c55603b",
                        "name": "绿野血踪第一季",
                        "img_url": "http://r1.ykimg.com/051600005922B042ADBC096E800D5C96"
                    }
                ]
            },
            {
                "name": "最多播放",
                "sorted": "hot",
                "data": [
                    {
                        "id": "4028803a5fe6e4ae015fe762546058d1",
                        "name": "权力的游戏全集",
                        "img_url": "//puui.qpic.cn/vcover_vt_pic/0/zf2z0xpqcculhcz1491532394/220"
                    },
                    {
                        "id": "4028803a5fe6e4ae015fe76250f856a1",
                        "name": "权力的游戏第七季",
                        "img_url": "//puui.qpic.cn/vcover_vt_pic/0/vqm1l9en588rdtx1501731985/220"
                    },
                    {
                        "id": "4028803a5fe6e4ae015fe7625ca55b27",
                        "name": "越狱第一季",
                        "img_url": "//photocdn.sohu.com/kis/fengmian/1030/1030961/1030961_ver_big.jpg"
                    },
                    {
                        "id": "4028803a5fe6e4ae015fe76258985a53",
                        "name": "反击全集",
                        "img_url": "//puui.qpic.cn/vcover_vt_pic/0/4e83tk3iptm57ant1453269629.jpg/220"
                    },
                    {
                        "id": "4028803a5fe6e4ae015fe7625ca55c4a",
                        "name": "尼基塔第一季",
                        "img_url": "//photocdn.sohu.com/kis/fengmian/89/89171/89171_ver_big_20160218162503.jpg"
                    },
                    {
                        "id": "4028803a5fe6e4ae015fe7625ca55b3f",
                        "name": "越狱第二季",
                        "img_url": "//photocdn.sohu.com/kis/fengmian/1030/1030962/1030962_ver_big.jpg"
                    }
                ]
            }
        ]
    }
        }
    }

});
