import React from 'react';
import AlyeskaContourMap from '../d3/AlyeskaContourMap';
import Container from 'react-bootstrap/Container';

const ContoursVis = () => {
  return(
    <Container>
      <div className='row no-gutters'>
        <div className='col'>
          <h1 className='text-center'>Alyeska Contour Map</h1>
        </div>
      </div>
      <div className='row no-gutters'>
        <div className='col' style={{border: '10px solid black'}}>
          <AlyeskaContourMap />
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