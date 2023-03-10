$(function() {
    $("#linkReg").on('click', function() {
        $(".loginBox").hide();
        $(".regBox").show();
    })
    $("#linkLogin").on('click', function() {
            $(".regBox").hide();
            $(".loginBox").show();
        })
        // 密码验证自定义规则 
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            var pwd = $(".regBox [name=password]").val();
            if (value !== pwd) {
                return '两次输入密码不一致';
            }
        }
    });
    // 监听注册表单的提交事件
    $("#formReg").on('submit', function(e) {
        e.preventDefault();
        var data = { username: $("#formReg [name=username]").val(), password: $("#formReg [name=password]").val() };
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录！');
            $("#linkLogin").click();
        })
    });
    // 监听登录表单的提交事件
    $("#formLogin").on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功！');
                // console.log(res.token);
                localStorage.setItem('token', res.token);
                location.href = '/index.html';
            }
        });
    });
})