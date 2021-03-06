(function($) {
  $.Redactor.prototype.filemanager = function() {
    return {
      init: function() {
        if (!this.opts.fileManagerJson) return;
        this.filemanager.page = 1;
        this.modal.addCallback('file', this.filemanager.load);
        var that = this;
        $(document).on('click', '#file-paginator span', function(e){
          e.preventDefault();
          var link = $(this).find('a');
          if (link.length == 0) return;
          that.filemanager.page = that.filemanager.get_page($(link));
          if (!that.filemanager.page) that.filemanager.page = 1;
          that.filemanager.draw_file_list(that.filemanager.page);
        });
        $(document).off('click', '#file-paginator a');
      },
      load: function() {
        var $modal = this.modal.getModal();
        this.modal.createTabber($modal);
        this.modal.addTab(1, this.lang.get('upload'), 'active');
        this.modal.addTab(2, this.lang.get('choose'));
        $('#redactor-modal-file-upload-box').addClass('redactor-tab redactor-tab1');
        var $box = $('<div id="redactor-file-manager-box" style="height: 300px;" class="redactor-tab redactor-tab2">').hide();
        $modal.append($box);
        $('#redactor-file-manager-box').prepend("<div id='file-paginator'>");
        $('#redactor-file-manager-box').append("<div class='file-list'>");
        this.filemanager.draw_file_list(this.filemanager.page);
      },
      insert: function(e) {
        e.preventDefault();
        var $target = $(e.target).closest('.redactor-file-manager-link');
        this.file.insert('<a href="' + $target.attr('rel') + '" target="_blank">' + $target.attr('title') + '</a>');
      },
      draw_file_list: function(page) {
        $('#redactor-file-manager-box .file-list').html(this.filemanager.loading_animation);
        $.ajax({
          dataType: 'json',
          cache: false,
          url: this.opts.fileManagerJson + '&page=' + page
        })
        .done($.proxy(function(json) {
          var data = json.data,
          ul = $('<ul id="redactor-modal-list">'),
          pagination = json.pagination;
          $('#redactor-file-manager-box .file-list').html('');
          this.filemanager.draw_pagination(pagination);
          $.each(data, $.proxy(function(key, val) {
            var a = $('<a href="#" title="' + val.title + '" rel="' + val.link + '" class="redactor-file-manager-link">' + val.title + ' <span style="font-size: 11px; color: #888;">' + val.name + '</span> <span style="position: absolute; right: 10px; font-size: 11px; color: #888;">(' + val.size + ')</span></a>');
            var li = $('<li />');
            a.on('click', $.proxy(this.filemanager.insert, this));
            li.append(a);
            ul.append(li);
          }, this));
          $('#redactor-file-manager-box  .file-list').append(ul);
        }, this))
        .fail($.proxy(function() {
          var error_ele = $("<span class='error'>");
          error_ele.text(this.lang.get('get_file_error'));
          $('#redactor-file-manager-box .file-list').html(error_ele);
        }, this))
      },
      draw_pagination: function(pagination) {
        var pagination_ele = "#file-paginator";
        $(pagination_ele).html(pagination);
      },
      get_page: function(ele) {
        var ele_url = ele.attr('href');
        var url_variables = ele_url.split('&');
        for (var i = 0; i < url_variables.length; i++){
          var param_names = url_variables[i].split('=');
          if (param_names[0] == 'page') {
            return param_names[1];
          }
        }
      },
      loading_animation: function() {
        return '<div class="spinner"><div class="cube1"></div><div class="cube2"></div></div>';
      }
    };
  };
})(jQuery);
