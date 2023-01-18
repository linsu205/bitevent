$(function() {
    var form = layui.form;
    var layer = layui.layer;
    initCate();
    initEditor();

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类型失败！');
                }
                var htmlStr = template('tplCate', res);
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 400 / 200,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $("#btnChooseImage").on('click', function() {
        $("#coverFile").click();
    })
    $("#coverFile").on('change', function(e) {
        var files = e.target.files;
        if (files === 0) {
            return;
        }
        var newImgRUL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy')
            .attr('src', newImgRUL)
            .cropper(options)

    })
    var art_state = '已发布';
    $('btnSave2').on('click', function() {
        art_state = '草稿';
    })
    $('#formPub').on('submit', function(e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        fd.append('state', art_state);
        $image
            .cropper('getCroppedCanvas', {
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                fd.append('cover_img', blob);
            })
        publishArticle(fd)
            // fd.forEach(function(v, k) {
            //     console.log(v, k);
            // })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg('发布文章成功！');
                location.href = "/article/art_list.html";
            }

        })
    }
})