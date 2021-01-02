import React, { useRef, useEffect } from 'react';
import {select, selectAll} from 'd3-selection';
import * as d3 from'd3';
import {interpolateHsvLong} from 'd3-hsv';
import {zoom} from 'd3-zoom';
import '../../css/d3-styles.css'
import * as elevationData from '../../datasets/alyeska-elevation.json';

const features = [
  {x: 128.5, y: 85.25, name: 'Baumann Bump', description: '1006m'},
  {x: 148, y: 68.5, name: 'Mount Alyeska', description: '1200m'},
  {x: 154.25, y: 89, name: 'Hibbs Peak', description: '1348m'},
  {x: 107, y: 216.5, name: 'Pyramid Peak', description: '1002m'},
  {x: 161.75, y: 149.75, name: 'Bramble Knoll', description: '988m'},
  {x: 198, y: 93, name: 'HighBrush Peak', description: '1423m'},
  {x: 210, y: 159, name: 'Blueberry Hill', description: '1275m'},
  {x: 167.5, y: 37.5, name: 'Notch Mountain', description: '91m'},
  {x: 52, y: 38, name: 'Gentoo Peak', description: '1278m'},
  {x: 39.5, y: 70, name: 'Chinstrap Peak', description: '1102m'},
  {x: 24.5, y: 84, name: 'Crested Peak', description: '1075m'},
];

const labels = [
  {x: 55, y: 140, rotation: 25, label: 'Turnagain Arm'},
  {x: 92, y: 80, rotation: -55, label: 'Girdwood'},
];

const range = (begin,end,step=1) => {
  if (step > end) { return Array(); }
  const array_size = Math.ceil((end - begin) / step);
  return Array(array_size).fill(begin).map((num, i) => num + (i * step));
}

let _alyeska_projection = null;

const getThresholds = (contourSetting) => {
  const large_thresholds = range(25,1600,35);
  const small_thresholds = range(0,25,5);

  if (contourSetting === 'mixed') {
    return small_thresholds.concat(large_thresholds);
  }
  else if (contourSetting === 'small') {
    return small_thresholds;
  }
  else {
    return large_thresholds;
  }

};

const getContours = () => {
  const rows = elevationData.rows;
  const cols = elevationData.cols;
  return d3.contours().size([cols, rows]);
};

const getData = () => {
  return elevationData.values;
};

const getColorFunc = () => {
  const interpolateTerrain = (threshold) => {
    const hsvcolor = interpolateHsvLong('#035406', '#ffe0db');
    return threshold === 0 ? '#7da0ad' : hsvcolor(threshold);
  };
  return d3.scaleSequential(interpolateTerrain).domain(d3.extent(getData()));
}; 

const handleMouseOver = (event,d, svg) => {
  const tooltip = select('.tooltip')
    .style("opacity", 0);
  
  const mouse = d3.pointer(event, svg.node());
  tooltip.html(
    `<p>${d.name} - ${d.description}</p>`
  )
  .style("left", (mouse[0] + 25) + "px")
  .style("top", (mouse[1] - 10) + "px")
  .style("opacity", 0.9);
};

const handleMouseOut = () => {
  const tooltip = select('.tooltip')
    .style("opacity", 0);
  
  tooltip.style("opacity", 0);
}

const updateContours = (ref,contourSetting) => {
  const thresholds = getThresholds(contourSetting);

  const svg = select(ref.current);
  const g = svg.select('g');
  const path = d3.geoPath()
    .projection(_alyeska_projection);
  
  const data = getData();
  const contours = getContours();
  const color = getColorFunc();

  selectAll("path").remove();
  selectAll("circle").remove();
  selectAll("text").remove();

  for (const threshold of thresholds) {
    g.append('path')
      .attr('d', path(contours.contour(data, threshold)))
      .attr('fill', color(threshold))
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .style('stroke-dasharray', () => {return (threshold < 20) ? ('3, 3') : null})
  }

  if (contourSetting !== 'small') {
    g.selectAll('features')
    .data(features)
    .enter()
    .append('circle')
    .attr('cx', (d) => { return _alyeska_projection([d.x,d.y])[0]; })
    .attr('cy', (d) => { return _alyeska_projection([d.x,d.y])[1]; })
    .attr('r', '7px')
    .attr('fill', 'red')
    .on('mouseover', (event,d) => {handleMouseOver(event,d,svg)} )
    .on('mouseout', handleMouseOut);
  }

  g.selectAll('text')
    .data(labels)
    .enter()
    .append('text')
    .attr('transform', (d) => {return `translate(${_alyeska_projection([d.x,d.y])[0]},${_alyeska_projection([d.x,d.y])[1]})rotate(${d.rotation})`})
    .attr('letter-spacing', 3)
    .text((d) => { return d.label; });

};

const createMap = async(ref) => {
  const margin = {top: 0, right: 0, bottom: 0, left: 0};
  const svgWidth = 1000;
  const svgHeight = 1300;
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.bottom - margin.top;
  const svg = select(ref.current)
    .attr('viewBox', '0 0 ' + width + ' ' + height );
  
  const data = getData();
  const thresholds = getThresholds('mixed');
  const contours = getContours();
  const color = getColorFunc();

  _alyeska_projection = d3.geoIdentity()
    .fitWidth(width, contours(data)[0]);

  const g = svg.append('g');

  const path = d3.geoPath()
    .projection(_alyeska_projection);

  const zoomed = ({transform}) => {
    g.attr('transform', transform);
  }

  for (const threshold of thresholds) {
    g.append('path')
      .attr('d', path(contours.contour(data, threshold)))
      .attr('fill', color(threshold))
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('class', `threshold-${threshold}`)
      .style('stroke-dasharray', () => {return (threshold < 20) ? ('3, 3') : null})
  }

  g.selectAll('features')
    .data(features)
    .enter()
    .append('circle')
    .attr('cx', (d) => { return _alyeska_projection([d.x,d.y])[0]; })
    .attr('cy', (d) => { return _alyeska_projection([d.x,d.y])[1]; })
    .attr('r', '7px')
    .attr('fill', 'red')
    .on('mouseover', (event,d) => {handleMouseOver(event,d,svg)} )
    .on('mouseout', handleMouseOut);

  g.selectAll('text')
    .data(labels)
    .enter()
    .append('text')
    .attr('transform', (d) => {return `translate(${_alyeska_projection([d.x,d.y])[0]},${_alyeska_projection([d.x,d.y])[1]})rotate(${d.rotation})`})
    .attr('letter-spacing', 3)
    .text((d) => { return d.label; });

  svg.call(zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([1, 3])
    .translateExtent([[0, 0], [width, height]])
    .on('zoom', zoomed));

}

const AlyeskaContourMap = ({contourSetting}) => {
  const svgRef = useRef();

  useEffect(() => {
      updateContours(svgRef,contourSetting);
  }, [contourSetting]);

  useEffect(() => {
    createMap(svgRef);
  }, []);

  return (
    <div>
      <div className='tooltip'></div>
      <svg ref={svgRef} />
    </div>
    )
}

export default AlyeskaContourMap;