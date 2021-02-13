import React, { useRef, useEffect } from 'react';
import {select, selectAll} from 'd3-selection';
import * as d3 from'd3';
import {interpolateHsvLong} from 'd3-hsv';
import {zoom} from 'd3-zoom';
import { getRange } from '../../utils';
import '../../css/d3-styles.css'
import * as elevationData from '../../datasets/alyeska-elevation.json';

const features = [
  {x: 128.5, y: 85.25, name: 'Baumann Bump', description: '1006m'},
  {x: 148, y: 68.5, name: 'Mount Alyeska', description: '1200m'},
  {x: 154.25, y: 89, name: 'Hibbs Peak', description: '1348m'},
  {x: 107, y: 216.5, name: 'Pyramid Peak', description: '1002m'},
  {x: 161.75, y: 149.75, name: 'Bramble Knoll', description: '988m'},
  {x: 198, y: 93, name: 'HighBrush Peak', description: '1423m'},
  {x: 167.5, y: 37.5, name: 'Notch Mountain', description: '941m'},
  {x: 52, y: 38, name: 'Gentoo Peak', description: '1278m'},
  {x: 39.5, y: 70, name: 'Chinstrap Peak', description: '1102m'},
  {x: 24.5, y: 84, name: 'Crested Peak', description: '1075m'},
];

const humanFeatures = [
  {x: 92, y: 80,  name: 'Girdwood', description: 'Small community ~40 miles southeast of Anchorage'},
  {x: 213, y: 253,  name: 'Portage', description: 'Town destroyed in 1964 Alaskan earthquake'},
  {x: 215, y: 265,  name: 'Alaska Wildlife Conservation Center', description: 'Wildlife sanctuary'},
];

const labels = [
  {x: 55, y: 140, rotation: 25, label: 'Turnagain Arm'},
];

let _alyeska_projection = null;
const _svgWidth = 1000;
const _svgHeight = 1300;
const _intervalTypeSep = 25;

const getThresholds = (contourSetting) => {
  const largeThresholds = getRange(_intervalTypeSep,1575,50);
  const smallThresholds = getRange(0,_intervalTypeSep,5);

  if (contourSetting === 'mixed') {
    return smallThresholds.concat(largeThresholds);
  }
  else if (contourSetting === 'small') {
    return smallThresholds;
  }
  else {
    return largeThresholds;
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

const getColorFunc = (contourSetting) => {
  const interpolateTerrain = (threshold) => {
    const hsvcolor = interpolateHsvLong('#035406', '#ffe0db');
    if (contourSetting === 'large') {
      return hsvcolor(threshold);
    }
    else if (contourSetting === 'small') {
      return threshold === 0 ? '#7da0ad' : threshold >= .01 ? '#8a8686' : hsvcolor(threshold);
    }
    else {
      return threshold === 0 ? '#7da0ad' : hsvcolor(threshold);
    }
  };
  return d3.scaleSequential(interpolateTerrain).domain(d3.extent(getData()));
};

const handleMouseOver = (event,d, svg,threshold=-1) => {
  const tooltip = select('.tooltip')
    .style("opacity", 0);
  
  const mouse = d3.pointer(event, svg.node());
  let html = '';

  if (threshold !== -1) {
    html = `<p>${threshold}m`;
    select(`.threshold-${threshold}`)
      .attr('stroke', '#c70808')
      .attr('stroke-width',3);

  }
  else {
    html = `<p>${d.name} - ${d.description}</p>`;
  }

  tooltip.html(html)
  .style("left", `${mouse[0] + 25}px`)
  .style("top", `${mouse[1] - 10}px`)
  .style("opacity", 0.9);
};

const handleMouseOut = (event,d,threshold=-1) => {
  const tooltip = select('.tooltip')
    .style("opacity", 0);

  if (threshold !== -1) {
    select(`.threshold-${threshold}`)
      .attr('stroke', 'black')
      .attr('stroke-width',1);
  }
};

const updateContours = (ref,contourSetting) => {
  const thresholds = getThresholds(contourSetting);

  const svg = select(ref.current);
  const g = svg.select('g');
  const path = d3.geoPath()
    .projection(_alyeska_projection);
  
  const data = getData();
  const contours = getContours();
  const color = getColorFunc(contourSetting);

  selectAll("path").remove();
  selectAll("circle").remove();
  selectAll("label-text").remove();

  for (const threshold of thresholds) {
    g.append('path')
      .attr('d', path(contours.contour(data, threshold)))
      .attr('fill', color(threshold))
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .style('stroke-dasharray', () => {return (threshold < _intervalTypeSep) ? ('3, 3') : null})
      .attr('class', `threshold-${threshold}`)
      .on('mouseover', (event,d) => {handleMouseOver(event,d,svg,threshold)})
      .on('mouseout', (event,d) => { handleMouseOut(event,d,threshold)});
  }

  if (contourSetting !== 'small') {
    addFeatures(svg,g);
  }
  else {
    addHumanFeatures(svg,g);
  }

  g.selectAll('label-text')
    .data(labels)
    .enter()
    .append('text')
    .attr('transform', (d) => {return `translate(${_alyeska_projection([d.x,d.y])[0]},${_alyeska_projection([d.x,d.y])[1]})rotate(${d.rotation})`})
    .attr('letter-spacing', 3)
    .text((d) => { return d.label; });

};

const addElevationFeatures = (svg,g) => {
  const triangle = d3.symbol(d3.symbolTriangle, 100);

  g.selectAll('features')
    .data(features)
    .enter()
    .append('path')
    .attr('d', triangle)
    .attr('fill', 'red')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('transform', function(d) {
      return `translate(${_alyeska_projection([d.x,d.y])[0]},${_alyeska_projection([d.x,d.y])[1]})`;
    })
    .on('mouseover', (event,d) => {handleMouseOver(event,d,svg)} )
    .on('mouseout', handleMouseOut);
};

const addFeatures = (svg,g) => {  
    addElevationFeatures(svg,g)
    addHumanFeatures(svg,g);
};

const addHumanFeatures = (svg,g) => {

  const star = d3.symbol(d3.symbolStar, 250);

  g.selectAll('humanFeatures')
  .data(humanFeatures)
  .enter()
  .append('path')
  .attr('d', star)
  .attr('fill', 'yellow')
  .attr('stroke', 'black')
  .attr('stroke-width', 2)
  .attr('transform', function(d) {
    return `translate(${_alyeska_projection([d.x,d.y])[0]},${_alyeska_projection([d.x,d.y])[1]})`;
  })
  .on('mouseover', (event,d) => {handleMouseOver(event,d,svg)} )
  .on('mouseout', handleMouseOut);

}

const createMap = async(ref, contourSetting) => {
  const margin = {top: 0, right: 0, bottom: 0, left: 0};
  const svgWidth = _svgWidth;
  const svgHeight = _svgHeight;
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.bottom - margin.top;
  const svg = select(ref.current)
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('class','d3-svg');
  
  const data = getData();
  const thresholds = getThresholds(contourSetting);
  const contours = getContours();
  const color = getColorFunc(contourSetting);

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
      .style('stroke-dasharray', () => {return (threshold < _intervalTypeSep) ? ('3, 3') : null})
      .on('mouseover', (event,d) => {handleMouseOver(event,d,svg,threshold)})
      .on('mouseout', (event,d) => { handleMouseOut(event,d,threshold)});
  }

  addFeatures(svg,g);

  g.selectAll('label-text')
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
    createMap(svgRef, contourSetting);
  }, []);

  return (
    <div>
      <div className='tooltip'></div>
      <svg ref={svgRef} />
    </div>
    )
}

export default AlyeskaContourMap;