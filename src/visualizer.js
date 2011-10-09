(function(window, Raphael){
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
    
    Raphael.fn.node = function(x, y, width, height, text){
        var st = this.set(),
            rect = this.rect(x, y, width, height, BORDER_RADIUS),
            text = this.text(x + width/2, y + height/2 - FONT_SIZE/2, text);
        st.push(rect, text);
        rect.attr({
            'stroke': '#3f72bf',
            'stroke-linecap': 'round',
            'stroke-width': 3
        });
        return st;
    }
    
    Raphael.fn.edge = function(from, to, count){
        var fromBBox = from.getBBox(),
            toBBox = to.getBBox(),
            path = {
                from: {
                    x: fromBBox.x + fromBBox.width/2,
                    y: fromBBox.y + fromBBox.height/2
                },
                to: {
                    x: toBBox.x + toBBox.width/2,
                    y: toBBox.y + toBBox.height/2
                }
            },
            xDiff = fromBBox.x - toBBox.x,
            yDiff = fromBBox.y - toBBox.y;
        if ( Math.abs(xDiff) > Math.max(fromBBox.width, toBBox.width) ) {
            path.from.x = xDiff < 0 ? fromBBox.x + fromBBox.width : fromBBox.x;
            path.to.x   = xDiff < 0 ? toBBox.x : toBBox.x  + toBBox.width;
        }
        else {
            path.from.y = path.from.y < path.to.y ? fromBBox.y + fromBBox.height : fromBBox.y;
            path.to.y   = path.from.y < path.to.y ? toBBox.y : toBBox.y  + toBBox.height;
        }
        var pathStr = Raphael.fullfill("M{from.x},{from.y}L{to.x},{to.y}", path);
        return this.path(pathStr);
    }
    
    function drawSources(height){
        var sources = this.data.sources,
            sl = sources.length,
            x = y = PADDING,
            paper = this.paper,
            width = Math.max(MAX_WIDTH);
        for (var i = 0; i < sl; i++) {
            sources[i].el = paper.node(x, y, width, height, sources[i].title);
            y += height + PADDING*2;
        }
    }
    
    function drawNodes(height){
        var nodes = this.data.nodes,
            nl = nodes.length,
            x = MAX_WIDTH + 100,
            y = PADDING,
            paper = this.paper,
            width = Math.max(MAX_WIDTH);
        for (var i = 0; i < nl; i++) {
            nodes[i].el = paper.node(x, y, width, height, nodes[i].url);
            y += height + PADDING*2;
        }
    }
    
    function drawEdges(){
        var paper = this.paper,
            nodes = this.data.allNodes;
        for ( var nodeId in nodes ) {
            var node = nodes[nodeId];
            for ( var id in node.output ) {
                if ( node.output.hasOwnProperty(id) ) {
                    var edge = paper.edge(node.el, node.output[id].node.el, node.output[id].weight);
                    edge.attr({
                        'stroke' : '#f00',
                        'stroke-width': 2,
                        'arrow-end': 'classic-midium-long'
                    });
                }
            }
        }
    }
    
    vis.prototype.draw = function(){
        this.paper.clear();
        var nodes = this.data.allNodes;
        for ( var nodeId in nodes ) {
            delete nodes[nodeId].el;
        }
        // draw sources
        drawSources.call(this, MAX_HEIGHT);
        drawNodes.call(this, MAX_HEIGHT);
        drawEdges.call(this);
    }
})(this, Raphael);