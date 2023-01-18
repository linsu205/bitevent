$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    };
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    initTable();
    initCate();

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章失败！');
                }
                var htmlStr = template('tplTable', res);
                $(".layui-table tbody").html(htmlStr);
                renderPage(res.total);
            }
        })
    }

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                var htmlStr = template('tplCate', res);
                $(".layui-card-body [name=cate_id]").html(htmlStr);
                // console.log(htmlStr);
                form.render();
            }
        })
    }
    $("#formSearch").on('submit', function(e) {
        e.preventDefault();
        var cate_id = $("#formSearch [name=cate_id]").val();
        var state = $("#formSearch [name=state]").val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    });

    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            jump: function(obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        });
    }
    $("tbody").on('click', '#btnDelete', function() {
        var id = $(this).attr('data-id');
        var len = $("#btnDelete").length;
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function() {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })

            layer.close(index);
        });
    })
})