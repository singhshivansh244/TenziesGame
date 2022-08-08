import React from 'react'

export default function Dice(props) {
    return (
        <div className={props.isHeld ? "die-held die-face" : "die-face"} onClick={props.handleDiceClick}>
            <h2 className="die-num">{props.value}</h2>
        </div>
    )
}