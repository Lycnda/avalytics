function oddvals(title,data)
         {
         	odd_val = '<li> <div class="timeline-badge"><i class="fa fa-circle-thin"></i> </div> <div class="timeline-panel"> <div class="timeline-heading"> <h4 class="timeline-title"> ' 
			+ title + ' </h4>  </div> <div class="timeline-body"> <b>' + 
         	data + ' </b> </div>  </div> </li>';

         	return odd_val;
         };


 function evenvals(title,data)
 {
 		even_val = '<li class="timeline-inverted">'  +
                             '<div class="timeline-badge warning"><i class="fa fa-check"></i>' +
                            '</div>' +
                            '<div class="timeline-panel">' +
                                '<div class="timeline-heading">' +
                                    '<h4 class="timeline-title">' + title + '</h4>' +
                                '</div>' +
                                '<div class="timeline-body"> <b>' +
                                    data +
                                '</b> </div>' +
                            '</div>' +
                        '</li>';


        return even_val;
 };


//Google visualisation table
function drawTable2(dataSet,table_div)
{

		google.charts.load('current', {'packages':['table']});
      	google.charts.setOnLoadCallback(drawTable);

	      function drawTable() {
	        var data = new google.visualization.DataTable();
	        data.addColumn('string', 'Page');
	        data.addColumn('string', 'Page Views');
	        data.addColumn('string', 'Average View Time (mins)');
	        data.addColumn('string', 'Bounce Rate (%)');
	        data.addColumn('string', 'Exit Rate (%)');
	        data.addRows(dataSet);

	        var table = new google.visualization.Table(document.getElementById(table_div));

	        table.draw(data, {width: '100%', height: '100%'});
	      }


      };


function timelineData(data,user)
{
		var path_data = data[user][5];
		

		path_data = path_data.replace(/["\'\[\]\"]/g,"");
		path_data = JSON.stringify(path_data);
		path_data = path_data.replace(/["\'\[\]\"]/g,"");
		var path_data_arr = path_data.split(",");

		complete_timeline = "";
		for(i=0; i < path_data_arr.length; i++)
		{
			if( (i%2) == 0)
			{
					complete_timeline = complete_timeline + oddvals('',path_data_arr[i]);
			}
			else
			{
					complete_timeline = complete_timeline + evenvals('',path_data_arr[i]);
			}
		}

		// console.log(complete_timeline);

		document.getElementById("the_clickpath_timeline").innerHTML = complete_timeline;

}

function firstRowPanels(sess_data,user_value_num)
{

	start_date_time_val = sess_data[user_value_num][1] + " " + sess_data[user_value_num][2];
    end_date_time_val = sess_data[user_value_num][3] + " " + sess_data[user_value_num][4];
    duration_val = sess_data[user_value_num][8];
    clicks_val = sess_data[user_value_num][9];
    first_page_val = "<h3>" + sess_data[user_value_num][6] + "</h3>";
    last_page_val = "<h3>" + sess_data[user_value_num][7] + "</h3>";

    document.getElementById("start_date_time").innerHTML = start_date_time_val;
    document.getElementById("end_date_time").innerHTML = end_date_time_val;
    document.getElementById("duration").innerHTML = duration_val;
    document.getElementById("clicks").innerHTML = clicks_val;
    document.getElementById("first_page").innerHTML = first_page_val;
    document.getElementById("last_page").innerHTML = last_page_val;
    
}

function firstRowPanelsSessionSummary(sess_data)
{

	
    // first_page_val = "<h3>" + sess_data[user_value_num][6] + "</h3>";
    // last_page_val = "<h3>" + sess_data[user_value_num][7] + "</h3>";

    document.getElementById("date_time").innerHTML = sess_data[2];
    document.getElementById("clicks").innerHTML = sess_data[1];
    document.getElementById("duration").innerHTML = sess_data[3] + " mins";
    document.getElementById("num_users").innerHTML = sess_data[4];

    
}

function plotBarChart(div_id,title_words)
{
		// var w = 600;                        //width
		// var h = 500;                        //height
		var w = (window.outerWidth/1);
		var h = (window.outerHeight/1.5);
		var padding = {top: 40, right: 40, bottom: 40, left:40};
		var dataset;
		//Set up stack method
		var stack = d3.layout.stack();

	                                                                              
			 dataset = jsonstr;

			//Data, stacked
			stack(dataset);

			var color_hash = {
				    0 : ["Clicks","#1f77b4"],
					1 : ["Duration in mins","#2ca02c"],
					2 : ["Users","#BA55D3"]

			};


			//Set up scales
			var xScale = d3.time.scale()
				.domain([new Date(dataset[0][0].time),d3.time.day.offset(new Date(dataset[0][dataset[0].length-1].time),8)])
				.rangeRound([0, w-padding.left-padding.right]);

			var yScale = d3.scale.linear()
				.domain([0,				
					d3.max(dataset, function(d) {
						return d3.max(d, function(d) {
							return d.y0 + d.y;
						});
					})
				])
				.range([h-padding.bottom-padding.top,0]);

			var xAxis1 = d3.svg.axis()
						   .scale(xScale)
						   .orient("bottom")
						   .ticks(d3.time.days,1);

			var yAxis1 = d3.svg.axis()
						   .scale(yScale)
						   .orient("left")
						   .ticks(10);



			//Easy colors accessible via a 10-step ordinal scale
			var colors = d3.scale.category10();

			//Create SVG element
			var svg = d3.select(div_id)
						.append("svg")
						.attr("width", w)
						.attr("height", h);


			// Add a group for each row of data
			var groups = svg.selectAll("g")
				.data(dataset)
				.enter()
				.append("g")
				.attr("class","rgroups")
				.attr("transform","translate("+ padding.left + "," + (h - padding.bottom) +")")
				.style("fill", function(d, i) {
					return color_hash[dataset.indexOf(d)][1];
				});

			// Add a rect for each data value
			var rects = groups.selectAll("rect")
				.data(function(d) { return d; })
				.enter()
				.append("rect")
				.attr("width", 2)
				.style("fill-opacity",1e-6);


			rects.transition()
			     .duration(function(d,i){
			    	 return 500 * i;
			     })
			     .ease("linear")
			    .attr("x", function(d) {
					return xScale(new Date(d.time));
				})
				.attr("y", function(d) {
					return -(- yScale(d.y0) - yScale(d.y) + (h - padding.top - padding.bottom)*2);
				})
				.attr("height", function(d) {
					return -yScale(d.y) + (h - padding.top - padding.bottom);
				})
				.attr("width", 15)
				.style("fill-opacity",1);

				svg.append("g")
					.attr("class","x axis")
					.attr("transform","translate(40," + (h - padding.bottom) + ")")
					.call(xAxis1);


				svg.append("g")
					.attr("class","y axis")
					.attr("transform","translate(" + padding.left + "," + padding.top + ")")
					.call(yAxis1);

				// adding legend

				var legend = svg.append("g")
								.attr("class","legend")
								.attr("x", w - padding.right - 65)
								.attr("y", 25)
								.attr("height", 100)
								.attr("width",100);

				// legend.selectAll("g").data(dataset)
				// 	  .enter()
				// 	  .append('g')
				// 	  .each(function(d,i){
				// 	  	var g = d3.select(this);
				// 	  	g.append("rect")
				// 	  		.attr("x", w - padding.right - 65)
				// 	  		.attr("y", i*25 + 10)
				// 	  		.attr("width", 10)
				// 	  		.attr("height",10)
				// 	  		.style("fill",color_hash[String(i)][1]);

				// 	  	g.append("text")
				// 	  	 .attr("x", w - padding.right - 50)
				// 	  	 .attr("y", i*25 + 20)
				// 	  	 .attr("height",30)
				// 	  	 .attr("width",100)
				// 	  	 .style("fill",color_hash[String(i)][1])
				// 	  	 .text(color_hash[String(i)][0]);
				// 	  });

				svg.append("text")
				.attr("transform","rotate(-90)")
				.attr("y", 0 - 5)
				.attr("x", 0-(h/2))
				.attr("dy","1em")
				.text("Number of " + title_words + " per hour");

			svg.append("text")
			   .attr("class","xtext")
			   .attr("x",w/2 - padding.left)
			   .attr("y",h - 5)
			   .attr("text-anchor","middle")
			   .text("Days");

			svg.append("text")
	        .attr("class","title")
	        .attr("x", (w / 2))             
	        .attr("y", 20)
	        .attr("text-anchor", "middle")  
	        .style("font-size", "16px") 
	        .style("text-decoration", "underline")  
	        .text("Number of Clicks per day");

			//On click, update with new data			
			d3.selectAll(".m")
				.on("click", function() {
					var date = this.getAttribute("value");
					

					var str;
					var all_date_data =[];
                   	var sum_stats = [];
					if(date == "04-07-2018"){
						dataset = fourjul;
						all_date_data = four_july;
                        sum_stats = summary_stats[1];
					}else if(date == "03-07-2018"){
						dataset = threejuly;
						all_date_data = three_july;
                        sum_stats = summary_stats[2];
					}else if(date == "02-07-2018"){
						dataset = twojuly;
						all_date_data = two_july;
                        sum_stats = summary_stats[3];
					}else if(date == "01-07-2018"){
						dataset = onejuly;
						all_date_data = one_july;
                        sum_stats = summary_stats[4];
					}
  
                   firstRowPanelsSessionSummary(sum_stats);


					// var str;
					// if(date == "2014-02-19"){
					// 	dataset = nineteen;
					// }else if(date == "2014-02-20"){
					// 	dataset = twenty;
					// }else if(date == "2014-02-21"){
					// 	dataset = twentyone;
					// }else if(date == "2014-02-22"){
					// 	dataset = twentytwo;
					// }else{
					// 	dataset = twentythrees;
					// }


						stack(dataset);

						xScale.domain([new Date(0, 0, 0,dataset[0][0].time,0, 0, 0),new Date(0, 0, 0,dataset[0][dataset[0].length-1].time,0, 0, 0)])
						.rangeRound([0, w-padding.left-padding.right]);

						yScale.domain([0,				
										d3.max(dataset, function(d) {
											return d3.max(d, function(d) {
												return d.y0 + d.y;
											});
										})
									])
									.range([h-padding.bottom-padding.top,0]);

						xAxis1.scale(xScale)
						     .ticks(d3.time.hour,2)
						     .tickFormat(d3.time.format("%H"));

						yAxis1.scale(yScale)
						     .orient("left")
						     .ticks(10);

						 groups = svg.selectAll(".rgroups")
		                    .data(dataset);

		                    groups.enter().append("g")
		                    .attr("class","rgroups")
		                    .attr("transform","translate("+ padding.left + "," + (h - padding.bottom) +")")
		                    .style("fill",function(d,i){
		                        return color(i);
		                    });


		                    rect = groups.selectAll("rect")
		                    .data(function(d){return d;});

		                    rect.enter()
		                      .append("rect")
		                      .attr("x",w)
		                      .attr("width",1)
		                      .style("fill-opacity",1e-6);

		                rect.transition()
		                    .duration(1000)
		                    .ease("linear")
		                    .attr("x",function(d){
		                        return xScale(new Date(0, 0, 0,d.time,0, 0, 0));
		                    })
		                    .attr("y",function(d){
		                        return -(- yScale(d.y0) - yScale(d.y) + (h - padding.top - padding.bottom)*2);
		                    })
		                    .attr("height",function(d){
		                        return -yScale(d.y) + (h - padding.top - padding.bottom);
		                    })
		                    .attr("width",15)
		                    .style("fill-opacity",1);

		                rect.exit()
					       .transition()
					       .duration(1000)
					       .ease("circle")
					       .attr("x",w)
					       .remove();

		                groups.exit()
					       .transition()
					       .duration(1000)
					       .ease("circle")
					       .attr("x",w)
					       .remove();


						svg.select(".x.axis")
						   .transition()
						   .duration(1000)
						   .ease("circle")
						   .call(xAxis1);

						svg.select(".y.axis")
						   .transition()
						   .duration(1000)
						   .ease("circle")
						   .call(yAxis1);

						svg.select(".xtext")
						   .text("Hours");

						svg.select(".title")
				        .text("Number of " + title_words + " per hour on " + date + ".");

				         plotBarChartDuration("#mbarsduration","Duration",date);
                         plotBarChartUsers("#mbarsusers","Users",date);
							
				});
}


function plotBarChartUsers(div_id,title_words,date)
{
	document.getElementById("mbarsusers").innerHTML = "";
     // var w = 600;                        //width
     // var h = 500;                        //height
     var w = (window.outerWidth/1);
     var h = (window.outerHeight/1.5);
     var padding = {top: 40, right: 40, bottom: 40, left:40};
     var dataset;
     //Set up stack method
     var stack = d3.layout.stack();

                                                                                  
         dataset = jsonstr;

         //Data, stacked
         stack(dataset);

         var color_hash = {
                 0 : ["Clicks","#1f77b4"],
                 1 : ["Duration in mins","#2ca02c"],
                 2 : ["Users","#BA55D3"]

         };


         //Set up scales
         var xScale = d3.time.scale()
             .domain([new Date(dataset[0][0].time),d3.time.day.offset(new Date(dataset[0][dataset[0].length-1].time),8)])
             .rangeRound([0, w-padding.left-padding.right]);

         var yScale = d3.scale.linear()
             .domain([0,             
                 d3.max(dataset, function(d) {
                     return d3.max(d, function(d) {
                         return d.y0 + d.y;
                     });
                 })
             ])
             .range([h-padding.bottom-padding.top,0]);

         var xAxisd = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom")
                        .ticks(d3.time.days,1);

         var yAxisd = d3.svg.axis()
                        .scale(yScale)
                        .orient("left")
                        .ticks(10);



         //Easy colors accessible via a 10-step ordinal scale
         var colors = d3.scale.category10();

         //Create SVG element
         var svg2 = d3.select(div_id)
                     .append("svg")
                     .attr("width", w)
                     .attr("height", h);


         // Add a group for each row of data
         var groups = svg2.selectAll("g")
             .data(dataset)
             .enter()
             .append("g")
             .attr("class","rgroups")
             .attr("transform","translate("+ padding.left + "," + (h - padding.bottom) +")")
             .style("fill", function(d, i) {
                 return color_hash[dataset.indexOf(d)][1];
             });

         // Add a rect for each data value
         var rects = groups.selectAll("rect")
             .data(function(d) { return d; })
             .enter()
             .append("rect")
             .attr("width", 2)
             .style("fill-opacity",1e-6);


         rects.transition()
              .duration(function(d,i){
                  return 500 * i;
              })
              .ease("linear")
             .attr("x", function(d) {
                 return xScale(new Date(d.time));
             })
             .attr("y", function(d) {
                 return -(- yScale(d.y0) - yScale(d.y) + (h - padding.top - padding.bottom)*2);
             })
             .attr("height", function(d) {
                 return -yScale(d.y) + (h - padding.top - padding.bottom);
             })
             .attr("width", 15)
             .style("fill-opacity",1);

             svg2.append("g")
                 .attr("class","x axis")
                 .attr("transform","translate(40," + (h - padding.bottom) + ")")
                 .call(xAxisd);


             svg2.append("g")
                 .attr("class","y axis")
                 .attr("transform","translate(" + padding.left + "," + padding.top + ")")
                 .call(yAxisd);

             // adding legend

             var legend = svg2.append("g")
                             .attr("class","legend")
                             .attr("x", w - padding.right - 65)
                             .attr("y", 25)
                             .attr("height", 100)
                             .attr("width",100);

             // legend.selectAll("g").data(dataset)
             //    .enter()
             //    .append('g')
             //    .each(function(d,i){
             //      var g = d3.select(this);
             //      g.append("rect")
             //          .attr("x", w - padding.right - 65)
             //          .attr("y", i*25 + 10)
             //          .attr("width", 10)
             //          .attr("height",10)
             //          .style("fill",color_hash[String(i)][1]);

             //      g.append("text")
             //       .attr("x", w - padding.right - 50)
             //       .attr("y", i*25 + 20)
             //       .attr("height",30)
             //       .attr("width",100)
             //       .style("fill",color_hash[String(i)][1])
             //       .text(color_hash[String(i)][0]);
             //    });

             svg2.append("text")
             .attr("transform","rotate(-90)")
             .attr("y", 0 - 5)
             .attr("x", 0-(h/2))
             .attr("dy","1em")
             .text("Number of " + title_words + " per hour");

         svg2.append("text")
            .attr("class","xtext")
            .attr("x",w/2 - padding.left)
            .attr("y",h - 5)
            .attr("text-anchor","middle")
            .text("Days");

         svg2.append("text")
         .attr("class","title")
         .attr("x", (w / 2))             
         .attr("y", 20)
         .attr("text-anchor", "middle")  
         .style("font-size", "16px") 
         .style("text-decoration", "underline")  
         .text("Number per day.");

         //On click, update with new data            

                 //var date = this.getAttribute("value");
                

                 var str;
                 var all_date_data =[];
                     var sum_stats = [];
                 if(date == "04-07-2018"){
                     dataset = fourjulusers;
                     all_date_data = four_july;
                        sum_stats = summary_stats[1];
                 }else if(date == "03-07-2018"){
                     dataset = threejulyusers;
                     all_date_data = three_july;
                        sum_stats = summary_stats[2];
                 }else if(date == "02-07-2018"){
                     dataset = twojulyusers;
                     all_date_data = two_july;
                        sum_stats = summary_stats[3];
                 }else if(date == "01-07-2018"){
                     dataset = onejulyusers;
                     all_date_data = one_july;
                        sum_stats = summary_stats[4];
                 }
  
                   firstRowPanelsSessionSummary(sum_stats);


                     stack(dataset);

                     xScale.domain([new Date(0, 0, 0,dataset[0][0].time,0, 0, 0),new Date(0, 0, 0,dataset[0][dataset[0].length-1].time,0, 0, 0)])
                     .rangeRound([0, w-padding.left-padding.right]);

                     yScale.domain([0,               
                                     d3.max(dataset, function(d) {
                                         return d3.max(d, function(d) {
                                             return d.y0 + d.y;
                                         });
                                     })
                                 ])
                                 .range([h-padding.bottom-padding.top,0]);

                     xAxisd.scale(xScale)
                          .ticks(d3.time.hour,2)
                          .tickFormat(d3.time.format("%H"));

                     yAxisd.scale(yScale)
                          .orient("left")
                          .ticks(10);

                      groups = svg2.selectAll(".rgroups")
                         .data(dataset);

                         groups.enter().append("g")
                         .attr("class","rgroups")
                         .attr("transform","translate("+ padding.left + "," + (h - padding.bottom) +")")
                         .style("fill",function(d,i){
                             return color(i);
                         });


                         rect = groups.selectAll("rect")
                         .data(function(d){return d;});

                         rect.enter()
                           .append("rect")
                           .attr("x",w)
                           .attr("width",1)
                           .style("fill-opacity",1e-6);

                     rect.transition()
                         .duration(1000)
                         .ease("linear")
                         .attr("x",function(d){
                             return xScale(new Date(0, 0, 0,d.time,0, 0, 0));
                         })
                         .attr("y",function(d){
                             return -(- yScale(d.y0) - yScale(d.y) + (h - padding.top - padding.bottom)*2);
                         })
                         .attr("height",function(d){
                             return -yScale(d.y) + (h - padding.top - padding.bottom);
                         })
                         .attr("width",15)
                         .style("fill-opacity",1);

                     rect.exit()
                        .transition()
                        .duration(1000)
                        .ease("circle")
                        .attr("x",w)
                        .remove();

                     groups.exit()
                        .transition()
                        .duration(1000)
                        .ease("circle")
                        .attr("x",w)
                        .remove();


                     svg2.select(".x.axis")
                        .transition()
                        .duration(1000)
                        .ease("circle")
                        .call(xAxisd);

                     svg2.select(".y.axis")
                        .transition()
                        .duration(1000)
                        .ease("circle")
                        .call(yAxisd);

                     svg2.select(".xtext")
                        .text("Hours");

                     svg2.select(".title")
                     .text("Number of " + title_words + " per hour on " + date + ".");
 
}

function plotBarChartDuration(div_id,title_words,date)
{
		document.getElementById("mbarsduration").innerHTML = "";
        // var w = 600;                        //width
        // var h = 500;                        //height
        var w = (window.outerWidth/1);
        var h = (window.outerHeight/1.5);
        var padding = {top: 40, right: 40, bottom: 40, left:40};
        var dataset;
        //Set up stack method
        var stack = d3.layout.stack();

                                                                                  
            dataset = jsonstr;

            //Data, stacked
            stack(dataset);

            var color_hash = {
                    0 : ["Clicks","#1f77b4"],
                    1 : ["Duration in mins","#2ca02c"],
                    2 : ["Users","#BA55D3"]

            };


            //Set up scales
            var xScale = d3.time.scale()
                .domain([new Date(dataset[0][0].time),d3.time.day.offset(new Date(dataset[0][dataset[0].length-1].time),8)])
                .rangeRound([0, w-padding.left-padding.right]);

            var yScale = d3.scale.linear()
                .domain([0,             
                    d3.max(dataset, function(d) {
                        return d3.max(d, function(d) {
                            return d.y0 + d.y;
                        });
                    })
                ])
                .range([h-padding.bottom-padding.top,0]);

            var xAxis3 = d3.svg.axis()
                           .scale(xScale)
                           .orient("bottom")
                           .ticks(d3.time.days,1);

            var yAxis3 = d3.svg.axis()
                           .scale(yScale)
                           .orient("left")
                           .ticks(10);



            //Easy colors accessible via a 10-step ordinal scale
            var colors = d3.scale.category10();

            //Create SVG element
            var svg1 = d3.select(div_id)
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);


            // Add a group for each row of data
            var groups = svg1.selectAll("g")
                .data(dataset)
                .enter()
                .append("g")
                .attr("class","rgroups")
                .attr("transform","translate("+ padding.left + "," + (h - padding.bottom) +")")
                .style("fill", function(d, i) {
                    return color_hash[dataset.indexOf(d)][1];
                });

            // Add a rect for each data value
            var rects = groups.selectAll("rect")
                .data(function(d) { return d; })
                .enter()
                .append("rect")
                .attr("width", 2)
                .style("fill-opacity",1e-6);


            rects.transition()
                 .duration(function(d,i){
                     return 500 * i;
                 })
                 .ease("linear")
                .attr("x", function(d) {
                    return xScale(new Date(d.time));
                })
                .attr("y", function(d) {
                    return -(- yScale(d.y0) - yScale(d.y) + (h - padding.top - padding.bottom)*2);
                })
                .attr("height", function(d) {
                    return -yScale(d.y) + (h - padding.top - padding.bottom);
                })
                .attr("width", 15)
                .style("fill-opacity",1);

                svg1.append("g")
                    .attr("class","x axis")
                    .attr("transform","translate(40," + (h - padding.bottom) + ")")
                    .call(xAxis3);


                svg1.append("g")
                    .attr("class","y axis")
                    .attr("transform","translate(" + padding.left + "," + padding.top + ")")
                    .call(yAxis3);

                // adding legend

                var legend = svg1.append("g")
                                .attr("class","legend")
                                .attr("x", w - padding.right - 65)
                                .attr("y", 25)
                                .attr("height", 100)
                                .attr("width",100);

                // legend.selectAll("g").data(dataset)
                //    .enter()
                //    .append('g')
                //    .each(function(d,i){
                //      var g = d3.select(this);
                //      g.append("rect")
                //          .attr("x", w - padding.right - 65)
                //          .attr("y", i*25 + 10)
                //          .attr("width", 10)
                //          .attr("height",10)
                //          .style("fill",color_hash[String(i)][1]);

                //      g.append("text")
                //       .attr("x", w - padding.right - 50)
                //       .attr("y", i*25 + 20)
                //       .attr("height",30)
                //       .attr("width",100)
                //       .style("fill",color_hash[String(i)][1])
                //       .text(color_hash[String(i)][0]);
                //    });

                svg1.append("text")
                .attr("transform","rotate(-90)")
                .attr("y", 0 - 5)
                .attr("x", 0-(h/2))
                .attr("dy","1em")
                .text("Number of " + title_words + " per hour");

            svg1.append("text")
               .attr("class","xtext")
               .attr("x",w/2 - padding.left)
               .attr("y",h - 5)
               .attr("text-anchor","middle")
               .text("Days");

            svg1.append("text")
            .attr("class","title")
            .attr("x", (w / 2))             
            .attr("y", 20)
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("Number per day.");

            //On click, update with new data            
        
                    // var date = this.getAttribute("value");

                    var str;
                    var all_date_data =[];
                    var sum_stats = [];
                    if(date == "04-07-2018"){
                        dataset = fourjulduration;
                        all_date_data = four_july;
                        sum_stats = summary_stats[1];
                    }else if(date == "03-07-2018"){
                        dataset = threejulyduration;
                        all_date_data = three_july;
                        sum_stats = summary_stats[2];
                    }else if(date == "02-07-2018"){
                        dataset = twojulyduration;
                        all_date_data = two_july;
                        sum_stats = summary_stats[3];
                    }else if(date == "01-07-2018"){
                        dataset = onejulyduration;
                        all_date_data = one_july;
                        sum_stats = summary_stats[4];
                    }
  
                   firstRowPanelsSessionSummary(sum_stats);


                    // var str;
                    // if(date == "2014-02-19"){
                    //  dataset = nineteen;
                    // }else if(date == "2014-02-20"){
                    //  dataset = twenty;
                    // }else if(date == "2014-02-21"){
                    //  dataset = twentyone;
                    // }else if(date == "2014-02-22"){
                    //  dataset = twentytwo;
                    // }else{
                    //  dataset = twentythrees;
                    // }


                        stack(dataset);

                        xScale.domain([new Date(0, 0, 0,dataset[0][0].time,0, 0, 0),new Date(0, 0, 0,dataset[0][dataset[0].length-1].time,0, 0, 0)])
                        .rangeRound([0, w-padding.left-padding.right]);

                        yScale.domain([0,               
                                        d3.max(dataset, function(d) {
                                            return d3.max(d, function(d) {
                                                return d.y0 + d.y;
                                            });
                                        })
                                    ])
                                    .range([h-padding.bottom-padding.top,0]);

                        xAxis3.scale(xScale)
                             .ticks(d3.time.hour,2)
                             .tickFormat(d3.time.format("%H"));

                        yAxis3.scale(yScale)
                             .orient("left")
                             .ticks(10);

                         groups = svg1.selectAll(".rgroups")
                            .data(dataset);

                            groups.enter().append("g")
                            .attr("class","rgroups")
                            .attr("transform","translate("+ padding.left + "," + (h - padding.bottom) +")")
                            .style("fill",function(d,i){
                                return color(i);
                            });


                            rect = groups.selectAll("rect")
                            .data(function(d){return d;});

                            rect.enter()
                              .append("rect")
                              .attr("x",w)
                              .attr("width",1)
                              .style("fill-opacity",1e-6);

                        rect.transition()
                            .duration(1000)
                            .ease("linear")
                            .attr("x",function(d){
                                return xScale(new Date(0, 0, 0,d.time,0, 0, 0));
                            })
                            .attr("y",function(d){
                                return -(- yScale(d.y0) - yScale(d.y) + (h - padding.top - padding.bottom)*2);
                            })
                            .attr("height",function(d){
                                return -yScale(d.y) + (h - padding.top - padding.bottom);
                            })
                            .attr("width",15)
                            .style("fill-opacity",1);

                        rect.exit()
                           .transition()
                           .duration(1000)
                           .ease("circle")
                           .attr("x",w)
                           .remove();

                        groups.exit()
                           .transition()
                           .duration(1000)
                           .ease("circle")
                           .attr("x",w)
                           .remove();


                        svg1.select(".x.axis")
                           .transition()
                           .duration(1000)
                           .ease("circle")
                           .call(xAxis3);

                        svg1.select(".y.axis")
                           .transition()
                           .duration(1000)
                           .ease("circle")
                           .call(yAxis3);

                        svg1.select(".xtext")
                           .text("Hours");

                        svg1.select(".title")
                        .text(title_words + " (mins) " + date + ".");
                            
         

}




