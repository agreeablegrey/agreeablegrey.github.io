import React, { useRef, useEffect } from 'react';
import {select} from 'd3-selection';

const _svgWidth = 7;
const _svgHeight = 3;

const createLegend = async (ref) => {
  const width = _svgWidth;
  const height = _svgHeight;
  const svg = select(ref.current)
    .attr('viewBox', '0 0 ' + width + ' ' + height);
  
  
  const line = svg.append("g");


  line.append('line')
    .style("stroke", "black")
    .attr('stroke-width', 0.25)
    .attr("x1", 0)
    .attr("y1", 0.3)
    .attr("x2", 3)
    .attr("y2", 0.3);
  
  line.append('text')
    .attr("x", 3.5)
    .attr("y", "0.48px")
    .text('50 meters')
    .style("font-size", "0.5px");
  
  line.append('line')
    .style("stroke", "black")
    .attr('stroke-width', 0.25)
    .style('stroke-dasharray', ('0.25, 0.25') )
    .attr("x1", 0)
    .attr("y1", 2)
    .attr("x2", 3)
    .attr("y2", 2);
  
  line.append('text')
    .attr("x", 3.5)
    .attr("y", "2.19px")
    .text('5 meters')
    .style("font-size", "0.5px");

};

const AlyeskaContourLegend = () => {
  const svgRef = useRef();

  useEffect(() => {
    createLegend(svgRef);
  }, []);

  return <svg ref={svgRef} />
}

export default AlyeskaContourLegend;