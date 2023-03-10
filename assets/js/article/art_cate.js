$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                var htmlStr = template('tpl_table', res);
                $(".layui-table tbody").html(htmlStr);
            }
        })
    }
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        var indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#dialogAdd").html()
        });
    });
    $('body').on('submit', '#formAdd', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！');
                }
                initArtCateList();
                layer.msg('新增分类成功！');
                layer.close(indexAdd);
            }
        })
    });
    var indexEdit = null;
    $(".layui-table tbody").on('click', '#btnEdit', function() {
        var indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $("#dialogEdit").html()
        });
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('formEdit', res.data);
            }
        })
    })
    $('body').on('submit', '#formEdit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类失败！');
                }
                initArtCateList();
                layer.msg('更新分类成功！');
                layer.close(indexEdit);
            }
        })
    });
    $('body').on('click', '#btnDelete', function() {
        var id = $(this).attr('data-id');
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            var id =
                $.ajax({
                    method: 'GET',
                    url: '/my/article/deletecate/' + id,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg('删除分类失败！');
                        }
                        layer.msg('删除分类成功！');
                        layer.close(index);
                        initArtCateList();
                    }
                })

        });
    });
})