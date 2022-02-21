import React from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

function Spinner() {

    return (
        <div className='spinnerLoader'>
        <BeatLoader
        color={'gray'}
      />
      </div>
    )
}

export default Spinner;