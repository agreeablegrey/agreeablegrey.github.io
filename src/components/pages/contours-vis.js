import React from 'react';
import AlyeskaContourMap from '../d3/AlyeskaContourMap';
import Container from 'react-bootstrap/Container';

const ContoursVis = () => {
  return(
    <Container>
      <div className='row'>
        <h1>Hello World!</h1>
      </div>
      <div className='row no-gutters'>
        <div className="col" style={{border: "10px solid black"}}>
          <AlyeskaContourMap />
        </div>
      </div>
      <div className='row'>
        <h1>Goodbye World!</h1>
      </div>
    </Container>
  );
}

export default ContoursVis;