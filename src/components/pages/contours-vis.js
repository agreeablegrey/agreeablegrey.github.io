import React, {useState} from 'react';
import AlyeskaContourMap from '../d3/AlyeskaContourMap';
import Container from 'react-bootstrap/Container';
import RadioButtonsVertical from '../RadioButtons';

const ContoursVis = () => {
  const contourRadioVals = [
    'mixed',
    'large',
    'small'
  ]

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
            <p>Contours</p>
            <RadioButtonsVertical onValueChange={handleRadioChange} checkedVal={radioValue} radioVals={contourRadioVals}/>
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