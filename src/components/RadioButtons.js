import React from 'react';

const RadioButtonsVertical = ({onValueChange, checkedVal, radioVals, radioLabels}) => {
    const radioButtons = radioVals.map((val,i) => {
        return (
            <div key={val}>
                <input
                    type="radio"
                    id={val}
                    value={val}
                    checked={checkedVal === val}
                    onChange={onValueChange}
                />
                <label htmlFor={val}>{radioLabels[i]}</label>
            </div>
        );
    });

    return (
        <div>
            {radioButtons}
        </div>
    )
};

export default RadioButtonsVertical;