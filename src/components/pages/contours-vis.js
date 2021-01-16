import React, {useState} from 'react';
import AlyeskaContourMap from '../d3/AlyeskaContourMap';
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
      'large (25m - 1540m interval: 35m)',
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
      </div>
      <div className='row'>
        <div className='col'>
            <p className='text-center mt-3'>An interactive contour map of Mount Alyeska and surrounding areas. Work in progress.</p>
        </div>
      </div>
    </Container>
  );
}

export default ContoursVis;