layui.define(['layer', 'laypage', 'laytpl', 'element'], function (exports) {
    var $ = layui.jquery,
        laypage = layui.laypage,
        layer = layui.layer,
        laytpl = layui.laytpl,
        element = layui.element;

    var tudou = {
        // url: "//" + location.host + "/api",
        url: "//localhost",
    };

    /**
     * 注册
     * @param {表单参数} formdata 
     * @param {回调} callback 
     */
    tudou.registe = function (formdata, callback) {
        var _this = this;
        $.ajax({
            type: "post",
            data: formdata,
            url: _this.url + '/registe',
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function (response) {
                if (response.code == 0) {
                    /*注册失败，显示msg给用户看*/
                    console.log(response.msg);
                    callback(response.msg)
                } else if (response.code == 1) {
                    /*注册成功*/
                    layer.open({
                        title: '提示',
                        content: response.msg,
                        closeBtn: 0,
                        yes: function (index, layero) {
                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                            location.href = '/login.html'
                        }
                    });
                }
            },
            error: function (response) {
                console.log(response.statusText);
            }
        })
    };

    /**
     * 登录
     * @param {表单参数} formdata 
     * @param {回调} callback 
     */
    tudou.login = function (formdata, callback) {
        var _this = this;
        $.ajax({
            type: "post",
            data: formdata,
            url: _this.url + '/login',
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function (response) {
                if (response.code == 0) {
                    /*登录失败，显示msg给用户看*/
                    console.log(response.msg);
                    callback(response.msg)
                } else if (response.code == 1) {
                    /*登录成功, 操作 data 项或显示 msg 给用户看*/
                    let data = response.data;
                    localStorage.setItem("login", JSON.stringify(data));
                    localStorage.setItem("flag", 'true');
                    localStorage.setItem('moduleList', JSON.stringify(treeMenu(data.menuList)));
                    location.href = '/admin/index';
                }
            },
            error: function (response) {
                console.log(response.statusText);
            }
        })
    };

    /**
     * 获取验证码
     * @param {验证码html对象} obj 
     */
    tudou.getValidateCode = function (obj) {
        obj.src = this.url + "/code?width=120&height=36?" + new Date().getMilliseconds();  //后面添加时间毫秒数 去缓存
    }

    /**
     * 菜单处理
     * @param {菜单json串} data 
     */
    function treeMenu(data) {
        var tree = data || [];
        var groups = {};

        for (var i = 0; i < tree.length; i++) {
            if (groups[tree[i].pid]) {
                groups[tree[i].pid].push(tree[i]);
            } else {
                groups[tree[i].pid] = [];
                groups[tree[i].pid].push(tree[i]);
            }
        }

        return getTree(groups[0], groups);
    }

    /**
     * 菜单处理 - 获取树
     * @param {*} data 
     * @param {*} groups 
     */
    function getTree(data, groups) {
        var result = [];

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (groups[item.id]) { item.submenu = getTree(groups[data[i].id], groups); }
            result.push(item);
        }

        return result;
    }

    /**
     * 错误提示
     * @param {错误消息} msg 
     */
    tudou.error = function (msg) {
        layer.msg(msg, {
            icon: 2,
            time: 2000 //2秒关闭（如果不配置，默认是3秒）
        }, function () {
            //do something
        });
    }

    exports('tudou', tudou);
})