$(function(){
        var local_var = '';
        $.ajax({
            url: '/get_map_data',
            type: 'get',
            dataTpye: 'json',
            success: function (res) {
                local_var = res;
                mymap(res)
            }
        });
        function mymap(data) {
            var MapContainer = document.getElementById('map_1');
            var mapChart = echarts.init(MapContainer);
            // var parent = document.getElementById('map');
            // if (document.getElementById('btn')) {
            //     console.log(document.getElementById('btn'));
            //     parent.removeChild(document.getElementById('btn'));
            // }
            // 34个省、市、自治区的名字拼音映射数组
            var provinces = {
                // 23个省
                台湾: 'taiwan',
                河北: 'hebei',
                山西: 'shanxi',
                辽宁: 'liaoning',
                吉林: 'jilin',
                黑龙江: 'heilongjiang',
                江苏: 'jiangsu',
                浙江: 'zhejiang',
                安徽: 'anhui',
                福建: 'fujian',
                江西: 'jiangxi',
                山东: 'shandong',
                河南: 'henan',
                湖北: 'hubei',
                湖南: 'hunan',
                广东: 'guangdong',
                海南: 'hainan',
                四川: 'sichuan',
                贵州: 'guizhou',
                云南: 'yunnan',
                陕西: 'shanxi2',
                甘肃: 'gansu',
                青海: 'qinghai',
                // 5个自治区
                新疆: 'xinjiang',
                广西: 'guangxi',
                内蒙古: 'neimenggu',
                宁夏: 'ningxia',
                西藏: 'xizang',
                // 4个直辖市
                北京: 'beijing',
                天津: 'tianjin',
                上海: 'shanghai',
                重庆: 'chongqing',
                // 2个特别行政区
                香港: 'xianggang',
                澳门: 'aomen'
              };
            var special = ['北京', '天津', '上海', '重庆', '香港', '澳门'];
            var option = {
                title: {
                    text: '全国疫情地图',
                    left: 'center',
                    textStyle: {
                        color: '#fff',
                        fontSize:'16'
                    }
                },
                tooltip: {
                    trigger: 'item'
                },
                visualMap: {
                    min: 0,
                    max: 1500,
                    show: false,
                    left: 'right',
                    top: 'bottom',
                    text: ['高', '低'], // 文本，默认为数值文本
                    calculable: true,
                    //		color: ['#26cfe4', '#f2b600', '#ec5845'],
                    textStyle: {
                        color: '#fff'
                    }
                },
                series: [{
                        name: '确诊人数',
                        type: 'map',
                        aspectScale: 0.75,
                        zoom: 1.2,
                        mapType: 'china',
                        roam: false,
                        label: {
                            show: true,
                            normal: {
                                show: true,//显示省份标签
                                textStyle:{color:"#c71585"}//省份标签字体颜色
                            },
                            emphasis: {//对应的鼠标悬浮效果
                                show: false,
                                textStyle:{color:"#800080"}
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: .5,//区域边框宽度
                                borderColor: '#002097',//区域边框颜色
                                areaColor:"#4c60ff",//区域颜色
                            },
                            emphasis: {
                                borderWidth: .5,
                                borderColor: '#4b0082',
                                areaColor:"#ffdead",
                            }
                        },
                        data: data['country']
                        // data: [{'name': '湖北', 'value': 300}, {'name': '辽宁', 'value': 120}, {'name': '新疆', 'value': 13},
                        //     {'name': '重启', 'value': 14}]

                    }
                ]
            };
            mapChart.setOption(option);

            // 使用刚指定的配置项和数据显示图表。
            mapChart.setOption(option);
            mapChart.on('click', function (params) {//点击事件
                if (params.name in provinces) {
                    $.getJSON('https://data.jianshukeji.com/geochina/' + provinces[params.name] + '.json', function (jsondata) {
                        echarts.registerMap(params.name, jsondata);
                        var d = [];
                        for (var i = 0; i < jsondata.features.length; i++) {
                            d.push({
                              name: jsondata.features[i].properties.name
                              })
                          }
                            renderMap(params.name, data)
                    })
                }
            })
            }

        function renderMap (map, data) {
            // 初始化绘制省市地图配置
            var cityMapContainer = document.getElementById('map_1');
            // var pos = document.getElementById('map');
            // var btn = document.createElement('button');
            // btn.innerText = "点击标题返回全国地图";
            // // btn.type = 'button';
            // btn.id = 'btn';
            // pos.appendChild(btn);
            var myMapChart = echarts.init(cityMapContainer);
            option.title = {
                text: map + '疫情地图',
                subtext: '点击标题返回全国地图',
                // sublink: window.location.protocol+"//"+window.location.host,
                // subtarget: 'self',
                triggerEvent: true
            };
            option.tooltip = {
                    trigger: 'item'
                };
            option.visualMap = {
                min: 0,
                max: 1500,
                show: false,
                left: 'right',
                top: 'bottom',
                text: ['高', '低'], // 文本，默认为数值文本
                calculable: true,
                //		color: ['#26cfe4', '#f2b600', '#ec5845'],
                textStyle: {
                    color: '#fff'
                }
            };
            option.series = [
              {
                name: '确诊人数',
                type: 'map',
                mapType: map,
                roam: false,
                data: data['city'][map],
    //             data: [{'name': '拉萨', 'value': 300}, {'name': '日喀则', 'value': 120}, {'name': '昌都', 'value': 13},
    //                     {'name': '林芝', 'value': 14}, {'name': '那曲', 'value': 250}, {'name': '阿里', 'value': 100},
    //                 {'name': '山南', 'value': 120}],
                //  data: convertedData[0],
                label: {
                    show: true,
                    emphasis: {//对应的鼠标悬浮效果
                        show: false,
                        textStyle:{color:"#800080"}
                    }
                },
                itemStyle: {
                    normal: {
                        borderWidth: .5,//区域边框宽度
                        borderColor: '#002097',//区域边框颜色
                        areaColor:"#4c60ff",//区域颜色
                    },
                    emphasis: {
                        borderWidth: .5,
                        borderColor: '#4b0082',
                        areaColor:"#ffdead",
                    }
                }
              }
            ];
            // 渲染地图
            myMapChart.setOption(option);
            myMapChart.on('click', function (params) {
                if (params.componentType == 'title') {
                    mymap(local_var)
                }
            })
        }
	}
    // $('.map').delegate('.btn', 'onclick', function () {
    //     alert('你好，世界!');
    // }),
    // $('.map').on('onclick', 'button', function () {
    //     alert('你好，世界!');
    // })
);