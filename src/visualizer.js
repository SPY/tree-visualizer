(function(window){
    var MAX_HEIGHT = 30,
        MAX_WIDTH = 200,
        BORDER_RADIUS = 5,
        PADDING = 10,
        FONT_SIZE = 10;
    
    var vis = window.Visualizer = function(canvas, data){
        this.paper = Raphael(canvas, 960, 600);
        processData.call(this, data);
    }
    
    function processData(data){
        //convert json to javascript obect with relations 
        this.data = $.extend(true, {}, data);
        var edges = this.data.edges,
            sources = this.data.sources,
            nodes = this.data.nodes,
            allNodes = this.data.allNodes = {};
        for ( var i = 0, sl = sources.length; i < sl; i++) {
            var id = sources[i].id;
            allNodes[id] = sources[i];
            sources[i].count = 0;
            sources[i].output = {};
            for (var ii = 0, el = edges.length; ii < el; ii++) {
                if (edges[ii].from == id) {
                    sources[i].count += edges[ii].count;
                    sources[i].output[edges[ii].to] = {
                        node: null,
                        weight: edges[ii].count
                    }
                }
            }
        }
        for ( var i = 0, nl = nodes.length; i < nl; i++) {
            var id = nodes[i].id;
            allNodes[id] = nodes[i];
            nodes[i].inCount = nodes[i].outCount = 0;
            nodes[i].output = {};
            nodes[i].input = {};
            for (var ii = 0, el = edges.length; ii < el; ii++) {
                if ( edges[ii].from == id ) {
                    nodes[i].outCount += edges[ii].count;
                    nodes[i].output[edges[ii].to] = {
                        node: allNodes[edges[ii].to],
                        weight: edges[ii].count
                    };
                }
                if ( edges[ii].to == id ) {
                    nodes[i].inCount += edges[ii].count;
                    nodes[i].input[edges[ii].from] = {
                        node: allNodes[edges[ii].from],
                        weight: edges[ii].count
                    };
                }
            }
        }
        for ( var nodeId in allNodes) {
            var node = allNodes[nodeId];
            for ( var k in node.input ) {
                if ( node.input.hasOwnProperty(k) && !node.input[k].node ) {
                    node.input[k].node = allNodes[k];
                }
            }
            for ( var k in node.output ) {
                if ( node.output.hasOwnProperty(k) && !node.output[k].node ) {
                    node.output[k].node = allNodes[k];
                }
            }
        }
    }
    
    function drawNode(x, y, width, height, node){
        var paper = this.paper,
            st = paper.set(),
            rect = paper.rect(x, y, width, height, BORDER_RADIUS),
            text = paper.text(x + width/2, y + height/2 - FONT_SIZE/2, node.title);
        st.push(rect, text);
        rect.attr({
            'stroke': '#3f72bf',
            'stroke-linecap': 'round',
            'stroke-width': 3
        });
        return st;
    }
    
    function drawSources(){
        var sources = this.data.sources,
            sl = sources.length,
            x = y = 5,
            paper = this.paper,
            height = MAX_HEIGHT <= paper.height/sl ? MAX_HEIGHT : paper.height/sl,
            width = Math.max(MAX_WIDTH);
        for (var i = 0; i < sl; i++) {
            drawNode.call(this, x, y, width, height, sources[i]);
            y += height + PADDING;
        }
    }
    
    vis.prototype.draw = function(){
        // draw sources
        drawSources.call(this);
    }
})(this);