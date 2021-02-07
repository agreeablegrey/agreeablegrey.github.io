import React, {useState} from 'react';
import AlyeskaContourMap from '../d3/AlyeskaContourMap';
import AlyeskaContourLegend from '../d3/AlyeskaContourLegend';
import Container from 'react-bootstrap/Container';
import RadioButtonsVertical from '../RadioButtons';

const ContoursVis = () => {
  const contourRadioVals = {
    values: [
    'mixed',
    'large',
    'small'
    ],
    labels: [
      'mixed - (combined large and small intervals)',
      'large (25m - 1575m interval: 50m)',
      'small (0m - 20m interval: 5m)'
    ]
  }

  const [radioValue, setRadioValue] = useState('mixed');
  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
  };

  return(
    <Container>
      <div className='row no-gutters'>
        <div className='col'>
          <h1 className='text-center'>Alyeska Contour Map</h1>
        </div>
      </div>
      <div className='row no-gutters'>
        <div className='col' style={{border: '10px solid black'}}>
          <AlyeskaContourMap contourSetting={radioValue}/>
        </div>
      </div>
      <div className='row no-gutters' style={{border: '10px solid black'}} >
        <div className='col'>
            <p>Contour Interval</p>
            <RadioButtonsVertical 
              onValueChange={handleRadioChange}
              checkedVal={radioValue}
              radioVals={contourRadioVals.values}
              radioLabels={contourRadioVals.labels}
            />
        </div>
        <div className='col'>
            <p>Line Intervals</p>
            <AlyeskaContourLegend />
        </div>
      </div>
      <div className='row'>
        <div className='col'>
            <p className='text-center mt-3'>An interactive contour map of Mount Alyeska and surrounding areas. Work in progress.</p>
        </div>
      </div>
      <div className='row'>
        <div className='col'>
            <h2 className='text-center mt-3'>Approach</h2>
            <p>
              I wanted to try using the <a href="https://github.com/d3/d3-contour">contour</a> API provided in D3.js.
              From my visits to Alaska, I thought the area around Mount Alyeska would be interesting to represent on a contour map since 
              there is a big difference in elevation between the mud flats of Turnagain Arm and the surrounding Chugach Mountains.
            </p>
            <p>
              I downloaded the Digital Terrain Model (DTM) IFSAR data available at <a href="https://elevation.alaska.gov/">elevation.alaska.gov</a> for the area around Mount Alyeska.
              Using the <a href="https://rasterio.readthedocs.io/en/latest/intro.html">rasterio</a> Python library I converted the values in the DTM .tif file to JSON and downscaled the elevation data from each datapoint 
              representing an area of 5 meters to representing an area of 15 meters.
            </p>
        </div>
      </div>
    </Container>
  );
}

export default ContoursVis;