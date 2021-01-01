import React from 'react';

const RadioButtonsVertical = ({onValueChange, checkedVal, radioVals}) => {
    const radioButtons = radioVals.map((val) => {
        return (
            <div key={val}>
                <input
                    type="radio"
                    id={val}
                    value={val}
                    checked={checkedVal === val}
                    onChange={onValueChange}
                />
                <label htmlFor={val}>{val}</label>
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