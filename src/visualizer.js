(function(window){
    var MAX_HEIGHT = 50,
        MAX_WIDTH = 200,
        BORDER_RADIUS = 5,
        PADDING = 10,
        FONT_SIZE = 14;
    
    var vis = window.Visualizer = function(canvas, data){
        this.paper = Raphael(canvas, 960, 600);
        processData.call(this, data);
    }
    
    function processData(data){
        this.data = $.extend(true, {}, data);
    }
    
    function drawSources(){
        var sources = this.data.sources,
            sl = sources.length,
            x = y = 0,
            paper = this.paper,
            height = MAX_HEIGHT <= paper.height/sl ? MAX_HEIGHT : paper.height/sl,
            width = Math.max(MAX_WIDTH),
            font = paper.getFont('Times', 800);
        for (var i = 0; i < sl; i++) {
            var rect = paper.rect(x, y, width, height, BORDER_RADIUS),
                text = paper.text(x + width/2, y + height/2 - FONT_SIZE/2, sources[i].title, font, FONT_SIZE );
            y += height + PADDING;
        }
    }
    
    vis.prototype.draw = function(){
        // draw sources
        drawSources.call(this);
    }
})(this);