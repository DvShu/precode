/**
 * precode插件,使用闭包
 * Created by haoran.shu on 2015/12/6.
 */
(function($){
    /**
     * 使用面向对象的方式构建内部插件
     * @param options   配置参数
     * @constructor
     */
    var Precode = function(ele, opts){
        this.component = "precode v1.1"
        // 保存节点
        this.$element = ele;
        // 默认的配置参数
        this.defaults = {
            'title' : '代码片段', // 标题
            'isShowComponent' : true, // 是否显示组件,默认为true显示组件,
            'height' : "auto" // 高度
        }
        /*
            配置参数：将默认参数和配置的参数重新整合到一个新的对象中
            如果出现配置重复的,则以后面配置(opts)的为准,并且保留默认配置
         */
        this.options = $.extend({}, this.defaults, opts)
    }

    // 定义Precode的方法
    Precode.prototype = {
        precode: function(content, line, tag){
            var parentElem = this.$element.parent(); // 获取父节点
            var versionDom = ""; // 显示组件的标签
            // 判断是否显示组件，如果显示组件,则拼接啊组件标签
            if(this.options.isShowComponent){
                versionDom = "<span class='code_component'>"+this.component+"</span>";
            }

            var lineElem = "";
            // 如果有2个换行节点，代表内容是3行,拼接行号
            for(var i = 0; i < line; i++){
                lineElem = lineElem+"<li>" + (i + 1) + "</li>";
            }
            // 拼接组装代码区域的id
            var precode_id = this.$element.attr("id") + "_precode";
            // 拼接内容组成部分
            var contentCompoent = "";
            if(tag == "code"){
                var contentCompoent = "<code>" + content + "</code>"
            }else if(tag == "pre"){
                var contentCompoent = "<pre>" + content + "</pre>"
            }
            // 拼接节点
            var appendElem = "<div id='"+precode_id+"' class='precode_code'><div class='code_title_group'><span class='code_title'>"+this.options.title+"</span>"+versionDom+"</div><div class='code_box'><ul class='conde_line_number'>"+lineElem+"</ul><div class='code_content'>"+contentCompoent+"</div></div></div>";
            // 用新的节点替换元素
            this.$element.replaceWith(appendElem);
            var replaceElem = parentElem.find("#"+precode_id); // 获取替换的节点
            var code_box = replaceElem.find("div.code_box");
            // 获取需要替换的高度
            var height = this.options.height;
            if(height== "auto"){ // 高度自适应
                // 不显示垂直滚动条
                code_box.css("overflow-y", "auto");
            }else{
                // 不显示垂直滚动条
                code_box.css("overflow-y", "scroll");
            }
            // 更新高度
            code_box.height(height);
        }
    }

    // 扩展jquery方法
    $.fn.precode = function(options){
        // 获取当前的标签名称
        var tagName = $(this)[0].tagName;
        var codeHtml = this.html(); // 获取内容部分
        codeHtml = codeHtml.replace(/<p>/g, ""); // 替换所有的<p>
        codeHtml = codeHtml.replace(/(<\/p>)/g, ""); // 替换所有的</p>
        //console.log(codeHtml);
        // 初始化Precode
        var precode = new Precode(this, options);
        // 根据标签名称判断执行的Precode的方法
        if(tagName == "CODE"){
            // 获取换行节点的数量
            var brLength = this.find("br").length;
            precode.precode(codeHtml, (brLength + 1), "code"); // 执行code方法
        }else if(tagName == "PRE"){
            codeHtml = codeHtml.replace(/[\t]/g,"") //替换回车符为换行标签
            // 获取当前代码区域的高度,按换行符拆分\n,拆分后的数组数量即为行数
            var line = this.text().split("\n").length;
            console.log("行数：" + line);
            precode.precode(codeHtml, line, "pre"); // 执行pre方法
        }
    }
})(jQuery);

