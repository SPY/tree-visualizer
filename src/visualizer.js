(function(window, Raphael){
    var MAX_HEIGHT = 30,
        MAX_WIDTH = 220,
        BORDER_RADIUS = 5,
        PADDING = 10,
        FONT_SIZE = 14,
        MIN_EDGE_WIDTH = 2,
        MAX_EDGE_WIDTH = 10,
        STROKE_WIDTH = 3;
        
    var EDGE_COLORS = {
        'self': '#ddd',
        'direct': '#fe0',
        'normal': '#f80',
        'none': '#2d3',
        'se': '#e12'
    }
    
    var vis = window.Visualizer = function(canvas, data){
        this.paper = Raphael(canvas, 960, 350);
        processData.call(this, data);
    }
    
    function processData(data){
        //convert json to javascript obect with relations 
        this.data = $.extend(true, {}, data);
        var edges = this.data.edges,
            sources = this.data.sources,
            nodes = this.data.nodes,
            allNodes = this.data.allNodes = {};
        for ( var i = 0, sl = sources.length; i < sl; i++ ) {
            var id = sources[i].id;
            allNodes[id] = sources[i];
            sources[i].count = 0;
            sources[i].output = {};
            for ( var ii = 0, el = edges.length; ii < el; ii++ ) {
                if ( edges[ii].from == id ) {
                    sources[i].count += edges[ii].count;
                    sources[i].output[edges[ii].to] = {
                        node: null,
                        weight: edges[ii].count
                    }
                }
            }
        }
        for ( var i = 0, nl = nodes.length; i < nl; i++ ) {
            var id = nodes[i].id;
            allNodes[id] = nodes[i];
            nodes[i].inCount = nodes[i].outCount = 0;
            nodes[i].output = {};
            nodes[i].input = {};
            for ( var ii = 0, el = edges.length; ii < el; ii++ ) {
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
        this.maxWeight = 0;
        this.maxLength = 0;
        for ( var nodeId in allNodes ) {
            var node = allNodes[nodeId];
            if ( (node.url || node.title).length > this.maxLength ) {
                this.maxLength = (node.url || node.title).length;
            }
            for ( var k in node.input ) {
                if ( node.input.hasOwnProperty(k) && !node.input[k].node ) {
                    node.input[k].node = allNodes[k];
                }
            }
            for ( var k in node.output ) {
                if ( node.output.hasOwnProperty(k) && !node.output[k].node ) {
                    node.output[k].node = allNodes[k];
                    
                    if ( node.output[k].weight > this.maxWeight ) {
                        this.maxWeight = node.output[k].weight;
                    }
                }
            }
        }
    }
    
    Raphael.fn.node = function(x, y, width, height, text){
        var st = this.set(),
            rect = this.rect(x, y, width, height, BORDER_RADIUS),
            text = this.text(x + width/2, y + height/2, text);
        st.push(rect, text);
        rect.attr({
            'stroke': '#3f72bf',
            'stroke-linecap': 'round',
            'stroke-width': STROKE_WIDTH
        });
        text.attr('font-size', FONT_SIZE);
        return st;
    }
    
    var edgeTypes = {
        simple: function(from, to){
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
                    },
                    string: "M{from.x},{from.y}L{to.x},{to.y}"
                },
                xDiff = fromBBox.x - toBBox.x,
                yDiff = fromBBox.y - toBBox.y;
            if ( Math.abs(xDiff) > Math.max(fromBBox.width, toBBox.width) ) {
                path.from.x = xDiff < 0 ? fromBBox.x + fromBBox.width + STROKE_WIDTH - 1 : fromBBox.x - STROKE_WIDTH + 1;
                path.to.x   = xDiff < 0 ? toBBox.x - STROKE_WIDTH + 1 : toBBox.x  + toBBox.width + STROKE_WIDTH - 1;
            }
            else {
                path.from.y = path.from.y < path.to.y ? fromBBox.y + fromBBox.height : fromBBox.y;
                path.to.y   = path.from.y < path.to.y ? toBBox.y : toBBox.y  + toBBox.height;
            }
            return path;
        }
    };
    
    Raphael.fn.edge = function(from, to, weight, color){
        var path = edgeTypes.simple(from, to),
            pathStr = Raphael.fullfill(path.string, path),
            el = this.path(pathStr);
        el.attr({
            'stroke-width': weight,
            'stroke': color,
            'arrow-end': 'classic'
        });
        return el;
    }
    
    function drawSources(height){
        var sources = this.data.sources,
            sl = sources.length,
            x = y = PADDING,
            paper = this.paper,
            maxWidth = 0;
        for ( var i = 0; i < sl; i++ ) {
            var width = Math.min(MAX_WIDTH, sources[i].title.length*(FONT_SIZE/2+1) + FONT_SIZE);
            if ( width > maxWidth ) {
                maxWidth = width;
            }
        }
        var yDiff = Math.max(PADDING, ~~(paper.height - height - 2*PADDING)/(sl - 1));
        for ( var i = 0; i < sl; i++ ) {
            var width = Math.min(MAX_WIDTH, sources[i].title.length*(FONT_SIZE/2+1) + FONT_SIZE);
            sources[i].el = paper.node(x + (maxWidth - width)/2, y, width, height, sources[i].title);
            y += yDiff;
        }
    }
    
    function getTreeDepth(count){
        return count >= 0 ? Math.ceil((Math.sqrt(1 + 8*count) - 1)/2) : 0;
    }
    
    function getKeysCount(hash) {
        var count = 0;
        for ( var k in hash ) {
            if ( hash.hasOwnProperty(k) ) {
                count++;
            }
        }
        return count;
    }
    
    function buildTree(nodes){
        var tree = [],
            nodes = nodes.slice(0),
            depth = getTreeDepth(nodes.length);
        nodes.sort(function(node1, node2){
            var keysCount1 = getKeysCount(node1.input),
                keysCount2 = getKeysCount(node2.input);
            if ( keysCount1 != keysCount2 ) {
                return keysCount2 - keysCount1;
            }
            return node2.inCount - node1.inCount;
        });
        for ( var i = 1; i <= depth; i++ ) {
            tree.push(nodes.splice(0, i));
        }
        return tree;
    }
    
    function drawNodes(height){
        var nodes = this.data.nodes,
            nl = nodes.length,
            x = MAX_WIDTH,
            paper = this.paper,
            maxWidth = 0,
            tree = buildTree(nodes),
            yDiff = tree.length ? Math.max(height, (paper.height - height)/(tree[tree.length - 1].length - 1) - PADDING) : height + PADDING*2;
        for( var i = 0, l = tree.length; i < l; i++ ) {
            var slice = tree[i],
                sl = slice.length,
                y = (paper.height - yDiff*(sl - 1) - height - PADDING)/2 + PADDING;
            for ( var j = 0; j < sl; j++ ) {
                var width = slice[j].width = Math.min(MAX_WIDTH, slice[j].url.length*FONT_SIZE/2 + FONT_SIZE);
                if ( width > maxWidth ) {
                    maxWidth = width;
                }
            }
            for( var j = 0; j < sl; j++ ) {
                slice[j].el = paper.node(x + (maxWidth - slice[j].width)/2, y, slice[j].width, height, slice[j].url);
                y += yDiff;
            }
            x += maxWidth;
        }
    }
    
    function drawEdges(){
        var paper = this.paper,
            nodes = this.data.allNodes;
        for ( var nodeId in nodes ) {
            var node = nodes[nodeId];
            for ( var id in node.output ) {
                if ( node.output.hasOwnProperty(id) ) {
                    var weight = this.getEdgeWeight(node.output[id].weight),
                        edge = paper.edge(node.el, node.output[id].node.el, weight, EDGE_COLORS[node.type || (id == node.id ? 'self' : 'none' )]);
                }
            }
        }
    }
    
    vis.prototype.getEdgeWeight = function(weigth){
        if ( !this.maxWeight ) {
            return MIN_EDGE_WIDTH;
        }
        var rate = Math.round(weigth / this.maxWeight * MAX_EDGE_WIDTH);
        return Math.max(MIN_EDGE_WIDTH, rate);
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