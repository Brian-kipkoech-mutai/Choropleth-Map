import * as d3 from 'd3'
import * as topojson from 'topojson';

import { useEffect, useRef } from 'react';


  


 const Ui=()=>{

  const svgRef=useRef()
  const USA_MAPDATA='https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
  const EDUCCATIONDATA ='https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
  const  w=960
  const h= 600
  useEffect(()=>{
    // data fetching
    Promise.all([d3.json(USA_MAPDATA),d3.json(EDUCCATIONDATA)])
            .then(data=>ready(data[0],data[1]))
            .catch(err=>console.log(err))

     // function  for  data mapping
    function ready(mapData,educationData){
      const mappedEducationData=new Map();
      const mappedStateCode=new Map();
      const mappedCountyName= new Map();
        
       educationData.forEach(element => {
          mappedEducationData.set(element.fips,element.bachelorsOrHigher)
          mappedStateCode.set(element.fips,element.state)
          mappedCountyName.set(element.fips,element.area_name)
        
       });
       const min=d3.min( mappedEducationData.values());
       const max=d3.max( mappedEducationData.values());

       const colorScale  = d3.scaleThreshold()
                     .domain(d3.range(min ,max ,(max-min)/8))
                     .range(d3.schemeGreens[9])
 console.log(mappedCountyName.size);
       // USA map rendaring logic
      const  svg= d3.select(svgRef.current)
                    .attr('viewBox', `0 0 ${w} ${h}`)

                    console.log('data',(topojson.feature(mapData,mapData.objects.counties).features).length);
 
              svg
                 .append('g')
                 .selectAll('path')
                 .data(topojson.feature(mapData,mapData.objects.counties).features)
                 .enter()
                 .append('path')
                 .attr('class',"county")
                 .attr('d', d3.geoPath())
                 .attr('data-fips',d=>{
                  
                  console.log('Processing county with ID:', d.id);
                  return d.id;
                 })
                 .attr('data-education',d=>mappedEducationData.get(d.id)?mappedEducationData.get(d.id):0)
                 .attr('fill',d=>colorScale(mappedEducationData.get(d.id)))
    
                 .on('mouseover',(event,d)=>{
                    const countyName=mappedCountyName.get(d.id)?mappedCountyName.get(d.id):0;
                    const stateCode=mappedStateCode.get(d.id)?mappedStateCode.get(d.id):0;
                    const countyEduccationalData=mappedEducationData.get(d.id)?mappedEducationData.get(d.id):0;
                  d3.select('#tooltip')
                    .style('opacity',1)
                    .attr('data-education',countyEduccationalData)
                    .html(`${countyName}, ${stateCode}: ${countyEduccationalData}%`)
                    .style('left',`${event.pageX+20}px`)
                    .style('top',`${event.pageY-50}px`)
                 })
                 .on('mouseleave',()=>{
                  d3.select('#tooltip')
                    .style('opacity',0)
                 })

          // rendaring the states borders     
          svg.append('path')
             .datum(topojson.mesh(mapData,mapData.objects.states,(a,b)=>a !==b))
             .attr('d',d3.geoPath())
             .attr( 'fill','none')
             .attr('stroke','white')

            
      //  color legend
    
  const legendScale = d3.scaleLinear()
        .domain([min, max])
        .range([600, 860]);

  const legendAxis = d3.axisBottom(legendScale)
      .tickSize(13)
      .tickValues(colorScale.domain())
      .tickFormat(d=>`${Math.round(d)}%`);

  const g=svg.append('g')
  .attr('transform', 'translate(0,50)') 
  .attr('id','legend');
   
  
  g.selectAll('rect')
    .data(colorScale.range().map(element => {
    const d = colorScale.invertExtent(element);
    if (d[0] == null) d[0] = legendScale.domain()[0];
    if (d[1] == null) d[0] = legendScale.domain()[1];

    return d;
    }))
    .enter()
    .append('rect')
    .attr('height', 8)
    .attr('x', d => legendScale(d[0]))
    .attr('width', d => (d[0] && d[1]) ? legendScale(d[1]) - legendScale(d[0]):legendScale(null))
    .attr('fill',d=> colorScale(d[0]))

    g.call(legendAxis)
     .select('.domain').remove();

     
  
   
              
         
          
    }
  },

  
  [])
  return(

    <div className='ui'>

 <div className="viewbox">
   <div className="title" id="title">
      <h1>United States Educational Attainment</h1>
        <div className="subtitle" id="description">Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)</div>
   </div>
    
   <svg ref={svgRef}></svg>
  
   <div id="tooltip">
    </div>
  </div>  
    </div>
  )
 }

 export default Ui;