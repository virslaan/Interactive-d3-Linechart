'use strict'
/* implementation influenced by http://bl.ocks.org/benjchristensen/2580640 */

  // define dimensions of graph
  var m = [80, 80, 80, 80]; // margins
  var w = 1000 - m[1] - m[3];	// width
  var h = 400 - m[0] - m[2]; // height
  var displayName = ['open','executed'];
  var colors = ['green','orange'];
  var fieldSP = {'Status':['executed','executed'],'Field':['avgSave','avgPrice']};
  var fieldSD = {'Status':['executed','open'],'Field':['avgSave','avgDisReq']};
  var fieldTD = {'Status':['executed','open'],'Field':['total','avgDisReq']};
  var fieldTT = {'Status':['executed','open'],'Field':['total','total']};
  /*
   * sample data to plot over time
   * 		[Success, Failure]
   *		Start: the date that the earliest bid was created
   *		End: the date that the latest bid is created
   *		Step: 24 hours
   */
  var startTime = new Date(data[0].date);
  var endTime = new Date(data[data.length-1].date);
  var timeStep = 86400000;

  var getDisplayAttr = function (field1, field2){
    var unit = '', title = '';
    //Capitalize the first letter of the bid status
    title = title.concat(field1.charAt(0).toUpperCase() + field1.slice(1) + ': ');
    switch (field2) {
      case 'total' :
        unit = 'Bids';
        title = title.concat('Total #');
        break;
      case 'avgDisReq' :
        unit = 'Percentage %';
        title = title.concat('Average Discount Requested');
        break;
      case 'medDisReq' :
        unit = 'Percentage %';
        title = title.concat('Median Discount Requested');
        break;
      case 'avgBidAmt' :
        unit = 'Amount $';
        title = title.concat('Average Bid Amount');
        break;
      case 'medBidAmt' :
        unit = 'Amount $';
        title = title.concat('Median Bid Amount');
        break;
      case 'avgSave' :
        unit = 'Percentage %';
        title = title.concat('Average Saved');
        break;
      case 'avgAmtSave' :
        unit = 'Amount $';
        title = title.concat('Average Amount Saved');
        break;
      case 'medAmtSave' :
        unit = 'Amount $';
        title = title.concat('Median Amount Saved');
        break;
      case 'avgPrice' :
        unit = 'Price $';
        title = title.concat('Average Price');
        break;
      case 'medPrice' :
        unit = 'Price $';
        title = title.concat('Median Price');
        break;
      case 'medPrice' :
        unit = 'Price $';
        title = title.concat('Median Price');
        break;
      case 'medPrice' :
        unit = 'Price $';
        title = title.concat('Median Price');
        break;
      case 'avgAm' :
        unit = 'Amount $';
        title = title.concat('Average Bid Amount');
        break;
      case 'medAmt' :
        unit = 'Amount $';
        title = title.concat('Median Bid Amount');
        break;

    }
    return {'unit':unit, 'title':title};
  };


/**
 *  create a graph under the container:
 *  input:
 *  container: string, id of svg's parent
 *  field1,2: the fields that is to be displayed in the graph
 */
  var createGraph = function(container,field1, field2,rawData){
    var startTime = new Date(rawData[0].date);
    var endTime = new Date(rawData[rawData.length-1].date);
    var x = d3.time.scale().domain([startTime, endTime]).range([0, w]);
    x.tickFormat(d3.time.format("%Y-%m-%d"));
    // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
    var y1 = d3.scale.linear().domain([0, d3.max(rawData, function(d) { return d[field1[0]][field2[0]]; })]).range([h, 0]);
    var y2 = d3.scale.linear().domain([0, d3.max(rawData, function(d) { return d[field1[1]][field2[1]]; })]).range([h, 0]);
    // Get unit and title of the legend
    var attrLeft = getDisplayAttr(field1[0],field2[0]),
        attrRight = getDisplayAttr(field1[1],field2[1]);


    // unify the axis if the two line are the same field
    if (attrLeft.unit == attrRight.unit) {
      let max = d3.max(rawData);
      if (max[field1[0]][field2[0]] > max[field1[1]][field2[1]]) y2 = y1;
      else y1 = y2;
    }


    // create a line function that can convert rawData[] into x and y points
    var line1 = d3.svg.line()
      // assign the X function to plot our line as we wish
      .x(function(d,i) {
        // return the X coordinate where we want to plot this datapoint
        //console.log(i);
        return x(startTime.getTime() + (timeStep*i));
      })
      .y(function(d) {
        // return the Y coordinate where we want to plot this datapoint
        return y1(d[field1[0]][field2[0]]); // use the 1st index of data (for example, get 20 from [20,13])
      })

      var line2 = d3.svg.line()
        // assign the X function to plot our line
        .x(function(d,i) {
          // return the X coordinate where we want to plot this datapoint
          return x(startTime.getTime() + (timeStep*i));
        })
        .y(function(d) {
          // return the Y coordinate where we want to plot this datapoint
          return y2(d[field1[1]][field2[1]]); //
        })


      // Add an SVG element with the desired dimensions and margin.
      let graph = d3.select('#' + container).append("svg:svg")
           .attr("width", w + m[1] + m[3])
           .attr("height", h + m[0] + m[2])
           .append("svg:g")
           .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
           .attr('id',container + '-transform')

      // create xAxis
      var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(1);

      // Add the x-axis.
      graph.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis)

      // create left yAxis
      var yAxisLeft = d3.svg.axis().scale(y1).ticks(6).orient("left");
      var yAxisRight = d3.svg.axis().scale(y2).ticks(6).orient("right");
      // Add the y-axis to the both sides

      if (attrLeft.unit == attrRight.unit) {
        graph.append("svg:g")
             .attr("class", "y axis")
             .attr("transform", "translate(-10,0)")
             .attr("id","y_left")
             .call(yAxisLeft)
             .append("text")
               .attr("transform", "rotate(-90)")
               .attr("y", 6)
               .attr("dy", ".71em")
               .style("text-anchor", "start")
               .text(attrLeft.unit);
      }
      else {
        graph.append("svg:g")
             .attr("class", "y axis")
             .attr("transform", "translate(0,0)")
             .attr("id","y_left")
             .attr("stroke","green")
             .call(yAxisLeft)
             .append("text")
               .attr("transform", "rotate(-90)")
               .attr("y", 6)
               .attr("dy", ".71em")
               .style("text-anchor", "start")
               .text(attrLeft.unit);
        graph.append("svg:g")
             .attr("class", "y axis")
             .attr("transform", "translate("+w+",0)")
             .attr("id","y_right")
             .attr("stroke","orange")
             .call(yAxisRight)
             .append("text")
               .attr("transform", "rotate(-90)")
               .attr("y", 6)
               .attr("dy", ".71em")
               .style("text-anchor", "start")
               .text(attrRight.unit);
      }
      // add lines to the graphl
      // do this AFTER the axes above so that the line is above the tick-lines
      graph.append("svg:path").attr("d", line1(rawData)).attr("class", "data1");
      graph.append("svg:path").attr("d", line2(rawData)).attr("class", "data2");

    let hoverLineGroup = graph.append("svg:g")
                          .attr("class", "hover-line");
		// add the line to the group
    let hoverLine = hoverLineGroup.append("svg:line")
                              .attr("x1", 10).attr("x2", 10) // vertical line so same value on each
                              .attr("y1", 0).attr("y2", h)// top to bottom
                              .attr("id",container+'-hover');

		// hide it by default
	  hoverLine.classed("hide", true);
    $('#'+container).append("<button class='zoomBTN' style='display:none'>Zoom Out</button>");

    //bind select-time-range feature to the chart
    if(!container.includes('zoom')){
      var svg = d3.select("#" + container);

      function dragStart() {
      	console.log("dragStart");
        var hoverLineXOffset = m[3]+$("#" + container).offset().left;
        var hoverLineYOffset = m[0]+$("#" + container).offset().top;
        var mouseX = event.pageX - hoverLineXOffset;
        var mouseY = event.pageY - hoverLineYOffset;
        //debug("MouseOver graph [" + containerId + "] => x: " + mouseX + " y: " + mouseY + "  height: " + h + " event.clientY: " + event.clientY + " offsetY: " + event.offsetY + " pageY: " + event.pageY + " hoverLineYOffset: " + hoverLineYOffset)
        if(mouseX >= 0 && mouseX <= w && mouseY >= 0 && mouseY <= h) {
          selectDate.init(container,mouseX, mouseY);
        }
        selectDate.removePrevious();
      }

      function dragMove() {
      	console.log("dragMove");
        var hoverLineXOffset = m[3]+$("#" + container).offset().left;
        var hoverLineYOffset = m[0]+$("#" + container).offset().top;
        var mouseX = event.pageX - hoverLineXOffset;
        var mouseY = event.pageY - hoverLineYOffset;

    		if(mouseX >= 0 && mouseX <= w && mouseY >= 0 && mouseY <= h){
        	var p = d3.mouse(this);
          selectDate.update(mouseX, mouseY);
        }
      }
      function dragEnd() {
      	console.log("dragEnd",container);
        var hoverLineXOffset = m[3]+$("#" + container).offset().left;
        var hoverLineYOffset = m[0]+$("#" + container).offset().top;
        var mouseX = event.pageX - hoverLineXOffset;
        var mouseY = event.pageY - hoverLineYOffset;

    		if(mouseX >= 0 && mouseX <= w && mouseY >= 0 && mouseY <= h){
        	var finalAttributes = selectDate.getCurrentAttributes();
        	console.dir(finalAttributes);
        	if(finalAttributes.x2 - finalAttributes.x1 > 1){
        		console.log("range selected");
            //console.log(finalAttributes.x2,'-',finalAttributes.x1);
        		// range selected
        		d3.event.sourceEvent.preventDefault();
        		selectDate.focus(container);
        	}
          else {
        		console.log("single point");
            // single point selected
            $("#" + container).children(".zoomBTN").hide();
            selectDate.remove();
          }
        }
      }

      var dragBehavior = d3.behavior.drag()
          .on("drag", dragMove)
          .on("dragstart", dragStart)
          .on("dragend", dragEnd);

      svg.call(dragBehavior);
    }
  }
  var setValueLabelsToLatest = function(container,status,field,rawData) {
    displayValueLabelsForPositionX(container,w,status,field,rawData);
  }

  var getValueForPositionXFromData = function(xPosition, dataSeriesIndex, displayName, field, rawData) {
    var startTime = new Date(rawData[0].date);
    var endTime = new Date(rawData[rawData.length-1].date);
    var k = displayName[dataSeriesIndex];
    var f = field[dataSeriesIndex];
    var x = d3.time.scale().domain([startTime, endTime]).range([0, w]);
    //TODO: bind each field correctly to the legend
    var d = rawData;
    // get the date on x-axis for the current location
    var xValue = x.invert(xPosition);

    // Calculate the value from this date by determining the 'index'
    // within the data array that applies to this value
    var index = (xValue.getTime() - startTime) / timeStep;
    if(index >= d.length) {
      index = d.length-1;
    }
    // The date we're given is interpolated so we have to round off to get the nearest
    // index in the data array for the xValue we're given.
    // Once we have the index, we then retrieve the data from the d[] array
    index = Math.round(index);

    // bucketDate is the date rounded to the correct 'step' instead of interpolated
    var bucketDate = new Date(startTime.getTime() + timeStep * (index+1)); // index+1 as it is 0 based but we need 1-based for this math
    return {value: d[index][k][f], date: bucketDate};
  }


    /**
      * Display the data values at position X in the legend value labels.
      */
    var displayValueLabelsForPositionX = function(container, xPosition, status, field, rawData) {
      var dateToShow;
      var labelValueWidths = [];
      let graph = d3.select('#' + container);
      graph.selectAll("text.legend.value")
           .text(function(d, i) {
             var valuesForX = getValueForPositionXFromData(xPosition, i, status, field,rawData);
             dateToShow = valuesForX.date;
       	     return valuesForX.value;
           })
         	 .attr("x", function(d, i) {
             labelValueWidths[i] = this.getComputedTextLength();
           });
      // position label names
      var cumulativeWidth = 0;
      var labelNameEnd = [];
      graph.selectAll("text.legend.name")
       	   .attr("x", function(d, i) {
              // return it at the width of previous labels (where the last one ends)
              var returnX = cumulativeWidth;
              // increment cumulative to include this one + the value label at this index
              cumulativeWidth += this.getComputedTextLength()+4+labelValueWidths[i]+8;
              // store where this ends
              labelNameEnd[i] = returnX + this.getComputedTextLength()+5;
              return returnX;
            })

      // remove last bit of padding from cumulativeWidth
      cumulativeWidth = cumulativeWidth - 8;
      if(cumulativeWidth > w) {
        // decrease font-size to make fit
        legendFontSize = legendFontSize-1;
        //debug("making legend fit by decreasing font size to: " + legendFontSize)
        graph.selectAll("text.legend.name")
             .attr("font-size", legendFontSize);
        graph.selectAll("text.legend.value")
             .attr("font-size", legendFontSize);

        // recursively call until we get ourselves fitting
        displayValueLabelsForPositionX(container,xPosition,status,field,rawData);
        return;
      }

      // position label values
      graph.selectAll("text.legend.value")
           .attr("x", function(d, i) {
             return labelNameEnd[i];
           });
      // show the date
      graph.select('text.date-label').text(dateToShow.toDateString())
      // move the group of labels to the right side

      graph.selectAll("g.legend-group g")
           .attr("transform", "translate(" + (w-cumulativeWidth) +",0)");
    }

  var createLegend = function(container, status, field) {
    // Get unit and title of the legend
    $('#'+container).append("<input name='status' value='"+status+"'>");
    $('#'+container).append("<input name='field' value='"+field+"'>");
    var attrLeft = getDisplayAttr(status[0],field[0]),
        attrRight = getDisplayAttr(status[1],field[1]);
		// append a group to contain all lines
    let temp = [attrLeft.title,attrRight.title];
    let graph = d3.select('#' + container);
		var legendLabelGroup = graph.append("svg:g")
				                        .attr("class", "legend-group")
			                          .selectAll("g")
				                        .data(temp)
			                          .enter().append("g")
				                        .attr("class", "legend-labels");

		legendLabelGroup.append("svg:text")
				            .attr("class", "legend name")
				            .text(function(d, i) {
					                 return d;
				            })
				            .attr("y", function(d, i) {
                      return h+28;
				            })
                    .attr("fill", function(d, i) {
					          // return the color for this row
		                  return colors[i];
                    })
        /*
				.attr("font-size", legendFontSize)
				.attr("fill", function(d, i) {
					// return the color for this row
					return data.colors[i];
				})*/


		// put in placeholders with 0 width that we'll populate and resize dynamically
		legendLabelGroup.append("svg:text")
				            .attr("class", "legend value")
				            .attr("y", function(d, i) {
					            return h+28;
				            })
                    .attr("fill", function(d, i) {
					          // return the color for this row
					            return colors[i];
				            })

		// x values are not defined here since those get dynamically calculated when data is set in displayValueLabelsForPositionX()
  }

  var createDateLabel = function(container) {
		var date = new Date(); // placeholder just so we can calculate a valid width
		// create the date label to the left of the scaleButtons group
    let graph = d3.select('#' + container);
		var buttonGroup = graph.append("svg:g")
				                   .attr("class", "date-label-group")
			                     .append("svg:text")
				                   .attr("class", "date-label")
				                   .attr("text-anchor", "end") // set at end so we can position at far right edge and add text from right to left
				                   .attr("font-size", "10")
				                   .attr("y", -4)
				                   .attr("x", w)
				                   .text(date.toDateString());
	}
  var graphSP = 'graphSP';
  createGraph(graphSP,fieldSP['Status'],fieldSP['Field'],data);
  createDateLabel(graphSP + '-transform');
  createLegend(graphSP + '-transform',fieldSP['Status'],fieldSP['Field']);
  displayValueLabelsForPositionX(graphSP + '-transform',w,fieldSP['Status'],fieldSP['Field'],data);

  var graphSD = 'graphSD';
  createGraph(graphSD,fieldSD['Status'],fieldSD['Field'],data);
  createDateLabel(graphSD + '-transform');
  createLegend(graphSD + '-transform',fieldSD['Status'],fieldSD['Field']);
  displayValueLabelsForPositionX(graphSD + '-transform',w,fieldSD['Status'],fieldSD['Field'],data);

  var graphTD = 'graphTD';
  createGraph(graphTD,fieldTD['Status'],fieldTD['Field'],data);
  createDateLabel(graphTD + '-transform');
  createLegend(graphTD + '-transform',fieldTD['Status'],fieldTD['Field']);
  displayValueLabelsForPositionX(graphTD + '-transform',w,fieldTD['Status'],fieldTD['Field'],data);

  var graphTT = 'graphTT';
  createGraph(graphTT,fieldTT['Status'],fieldTT['Field'],data);
  createDateLabel(graphTT + '-transform');
  createLegend(graphTT + '-transform',fieldTT['Status'],fieldTT['Field']);
  displayValueLabelsForPositionX(graphTT + '-transform',w,fieldTT['Status'],fieldTT['Field'],data);
  /**
	 * Called when a user mouses over the graph
   */
	var handleMouseOverGraph = function(container,event,status,field, hoverLineOffset,rawData) {

    let graph = d3.select('#' + container);
		var mouseX = event.pageX - hoverLineOffset[0];
		var mouseY = event.pageY - hoverLineOffset[1];
		//debug("MouseOver graph [" + containerId + "] => x: " + mouseX + " y: " + mouseY + "  height: " + h + " event.clientY: " + event.clientY + " offsetY: " + event.offsetY + " pageY: " + event.pageY + " hoverLineYOffset: " + hoverLineYOffset)
		if(mouseX >= 0 && mouseX <= w && mouseY >= 0 && mouseY <= h) {
      let hoverLine = d3.select('#' + container + '-hover');
			// show the hover line
			hoverLine.classed("hide", false);

			// set position of hoverLine
			hoverLine.attr("x1", mouseX).attr("x2", mouseX);

			displayValueLabelsForPositionX(container,mouseX,status,field,rawData);

		} else {
			// proactively act as if we've left the area since we're out of the bounds we want
			handleMouseOutGraph(container,event,status,field,rawData);
		}
	}

  var handleMouseOutGraph = function(container,event,status,field,rawData) {
		// hide the hover-line
    let hoverLine = d3.select('#' + container + '-hover');
		hoverLine.classed("hide", true);

		setValueLabelsToLatest(container,status,field,rawData);

		//debug("MouseOut graph [" + containerId + "] => " + mouseX + ", " + mouseY)

	}


  $('#graphSP').mousemove(function(event) {
    var hoverLineXOffset = m[3]+$('#graphSP').offset().left;
    var hoverLineYOffset = m[0]+$('#graphSP').offset().top;
    var hoverLine = [hoverLineXOffset,hoverLineYOffset];
		handleMouseOverGraph('graphSP',event,fieldSP['Status'],fieldSP['Field'],hoverLine,data);
	})
  $('#graphSD').mousemove(function(event) {
    var hoverLineXOffset = m[3]+$('#graphSD').offset().left;
    var hoverLineYOffset = m[0]+$('#graphSD').offset().top;
    var hoverLine = [hoverLineXOffset,hoverLineYOffset];
		handleMouseOverGraph('graphSD',event,fieldSD['Status'],fieldSD['Field'],hoverLine,data);
	})
  $('#graphTD').mousemove(function(event) {
    var hoverLineXOffset = m[3]+$('#graphTD').offset().left;
    var hoverLineYOffset = m[0]+$('#graphTD').offset().top;
    var hoverLine = [hoverLineXOffset,hoverLineYOffset];
			handleMouseOverGraph('graphTD',event,fieldTD['Status'],fieldTD['Field'],hoverLine,data);
	})
  $('#graphTT').mousemove(function(event) {
    var hoverLineXOffset = m[3]+$('#graphTT').offset().left;
    var hoverLineYOffset = m[0]+$('#graphTT').offset().top;
    var hoverLine = [hoverLineXOffset,hoverLineYOffset];
		handleMouseOverGraph('graphTT',event,fieldTT['Status'],fieldTT['Field'],hoverLine,data);
	})

  //TODO: adding a drag event to drag select a time range
  //influence by https://gist.github.com/paradite/71869a0f30592ade5246

  /*
  * MARK: the object called seletDate, including sevaral variables and methods:
  * BEHAVIOR:
      1. Drag the mouse to select a duration in the chart, zoom out to the selected duration when dragEnd
      2. double click to return to the initial chart
  * VARIABLE:
  *   currentX
  *   currentY
  *   originX
  *   originY
  * METHOD:
      setElement: set the new rectangle to the element
      getCurrentAttributes: get the postion of the mouse
      init: set the duration from start date to end date
      update: update the line path according to the selected duration
  *
  */

  var selectDate = {
    element   : null,
    previousElement: null,
    currentX  : 0,
    currentY  : 0,
    originX   : 0,
    originY   : 0,
    setElement: function(elem) {
  		this.element = elem;
  	},
    getNewAttributes : function(){
      var x = this.currentX<this.originX?this.currentX:this.originX;
  		var y = this.currentY<this.originY?this.currentY:this.originY;
  		var width = Math.abs(this.currentX - this.originX);
  		return {
  	        x       : x + m[3],
  	        y       : m[0],
  	        width  	: width,
            height  : h
  		};
    },
    getCurrentAttributes  : function(){
      var x = +this.element.attr("x");
  		var y = +this.element.attr("y");
  		var width = +this.element.attr("width");
  		var height = +this.element.attr("height");
  		return {
  			x1  : x,
  	    y1	: m[0],
  	    x2  : x + width,
  	    y2  : height
  		};
    },
    init  : function(container,newX, newY){
      let graph = d3.select("#" + container);
      let svg = graph.select('svg');
      var rectElement = svg.append("svg:rect")
  		    .attr({
  		        rx      : 4,
  		        ry      : 4,
  		        x       : 0,
  		        y       : 0,
  		        width   : 0,
  		        height  : 0
  		    })
  		    .classed("selection", true);
  	  this.setElement(rectElement);
      rectElement.style("stroke", "#DE695B")
                .style("stroke-width", "2.5")
                .style("opacity", "0.4");
  		this.originX = newX;
  		this.originY = newY;
  		this.update(newX, newY);
    },
    update  : function(newX, newY){
      this.currentX = newX;
  		this.currentY = newY;
  		this.element.attr(this.getNewAttributes());
    },
    focus : function(container){
      this.element
            .style("stroke", "#DE695B")
            .style("stroke-width", "2.5")
            .style("opacity", "0.4");
      var x = d3.time.scale().domain([startTime, endTime]).range([0, w]);
      //var svg = d3.select("#graphTT-transform").transition();
      //var y1 = d3.scale.linear().domain([0, d3.max(data, function(d) { return d[fieldTT['Status'][0]][fieldTT['Field'][0]]; })]).range([h, 0]);
/*
      var line1 = d3.svg.line()
        // assign the X function to plot our line as we wish
        .x(function(d,i) {
          // return the X coordinate where we want to plot this datapoint
          //console.log('i:',i);
          return x(startTime.getTime() + (timeStep*i));
        })
        .y(function(d) {
          // return the Y coordinate where we want to plot this datapoint
          //console.log(d[fieldTT['Status'][0]][fieldTT['Field'][0]]);
          return y1(d[fieldTT['Status'][0]][fieldTT['Field'][0]]); // use the 1st index of data (for example, get 20 from [20,13])
        });

*/
      //var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(1);
      //var yAxisLeft = d3.svg.axis().scale(y1).ticks(6).orient("left");

      $("#" + container).children(".zoomBTN").show();

      this.previousElement = this.element;
    },
    remove: function() {
    	this.element.remove();
    	this.element = null;
    },
    removePrevious: function(){
      if(this.previousElement) {
    		this.previousElement.remove();
      }
    }
  }



  $(".zoomBTN").click(function(){

    //console.log(selectDate.getCurrentAttributes().x1,selectDate.getCurrentAttributes().x2);
    var x = d3.time.scale().domain([startTime, endTime]).range([0, w]);
    var hoverLineXOffset = m[3];
    var startPos = selectDate.getCurrentAttributes().x1 - hoverLineXOffset;
    var endPos = selectDate.getCurrentAttributes().x2 - hoverLineXOffset;

    //TODO: bind each field correctly to the legend
    var d = data;
    // get the date on x-axis for the current location
    var start = x.invert(startPos);
    var end = x.invert(endPos);
    // Calculate the value from this date by determining the 'index'
    // within the data array that applies to this value
    var indexL = (start.getTime() - startTime) / timeStep;
    var indexR = (end.getTime() - endTime) / timeStep;
    if(indexL >= d.length) {
      indexL = d.length-1;
    }
    if(indexR >= d.length) {
      indexR = d.length-1;
    }
    // The date we're given is interpolated so we have to round off to get the nearest
    // index in the data array for the xValue we're given.
    // Once we have the index, we then retrieve the data from the d[] array
    indexL = Math.round(indexL);
    indexR = Math.round(indexR);

    $(this).parent().next('.dGraph').remove();
    var parentID = $(this).parent().attr('id');
    $("<div id='" + parentID + "-zoom" + "' class='dGraph'></div>").insertAfter("#" + parentID);
    //var status = $(this).parent().children("input[name~='status']").val();
    var status = $("#" + parentID + " :input[name='status']").val().split(',');
    var field = $("#" + parentID + " :input[name='field']").val().split(',');
    var graphZoom = parentID + '-zoom';
    console.log('before')
    createGraph(graphZoom,status,field,data.slice(indexL,indexR));
    createDateLabel(graphZoom + '-transform');
    createLegend(graphZoom + '-transform',status,field);
    displayValueLabelsForPositionX(graphZoom + '-transform',w,status,field,data.slice(indexL,indexR));

    $('#'+graphZoom).mousemove(function(event) {
      var hoverLineXOffset = m[3]+$('#'+graphZoom).offset().left;
      var hoverLineYOffset = m[0]+$('#'+graphZoom).offset().top;
      var hoverLine = [hoverLineXOffset,hoverLineYOffset];
      handleMouseOverGraph(graphZoom,event,status,field,hoverLine,data.slice(indexL,indexR));
    });
    $('#' + graphZoom).append("<button class='delBTN'>Delete</button>")
    $('#' + graphZoom).on('click','.delBTN',function(event){
      $(this).parent().remove();
    });
    selectDate.remove();
    $("#" + parentID).children(".zoomBTN").hide();
  });
