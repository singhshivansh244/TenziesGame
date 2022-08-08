import React from 'react'
import Dice from './components/Dice'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

export default function App() {

    // state for randDice numbers
    const [diceNumbers, setDiceNumbers] = React.useState(allNewDice());

    //state for win game
    const [tenzies, setTenzies] = React.useState(false);

    //state for held all dice
    const [heldButNotSame, setHeldButNotSame] = React.useState(false);

    //state for counting dice rolled
    const [rollCount, setRollCount] = React.useState(0);

    //state for best Roll
    const [bestTime, setBestTime] = React.useState(JSON.parse(localStorage.getItem('bestRoll')) || 1000);

    // for getting won condition
    React.useEffect(() => {
        // checking all values and all held 
        const allHeld = diceNumbers.every(die => die.isHeld);
        const firstValue = diceNumbers[0].value;
        const allSameValue = diceNumbers.every(die => die.value === firstValue);

        // if all are held and all are same
        if (allHeld && allSameValue) setTenzies(true)

        //if all are held but not all are same 
        if (allHeld && !allSameValue) setHeldButNotSame(true);
    }, [diceNumbers])

    // for handling best roll count on scoreBoard
    React.useEffect(() => {
        console.log('here I want To go');
        if (bestTime > rollCount && tenzies) {
            console.log('here I am');
            localStorage.setItem('bestRoll', JSON.stringify(rollCount))
            setBestTime(JSON.parse(localStorage.getItem('bestRoll')));
        }
    }, [tenzies, bestTime, rollCount])

    //helper function to return new dice state
    function generatorNewDie() {
        return {
            id: nanoid(),
            value: Math.ceil(Math.random() * 6),
            isHeld: false
        }
    }
    // random array number generator function
    function allNewDice() {
        const randNum = [];
        for (let i = 0; i < 10; i++) {
            randNum.push({
                id: nanoid(),
                value: Math.ceil(Math.random() * 6),
                isHeld: false
            });
        }
        return randNum;
    }


    //handle's rolling dice
    const handleRoll = () => {
        // increamenting number of rolls 
        setRollCount(prevCount => prevCount + 1)
        setDiceNumbers((oldDice) => oldDice.map(die => {
            return die.isHeld ?
                die :
                generatorNewDie()
        }))
    }

    //individual dice held logic
    const handleDiceClick = (id) => {
        setDiceNumbers(oldDice => oldDice.map(die => {
            return die.id === id ?
                { ...die, isHeld: true } :
                die
        }))
    }


    const handleReset = () => {
        setRollCount(0);
        setTenzies(false);
        setHeldButNotSame(false);
        setDiceNumbers(allNewDice);
    }

    const diceEle = diceNumbers.map((index) => <Dice key={index.id} value={index.value} isHeld={index.isHeld} handleDiceClick={() => handleDiceClick(index.id)} />)
    return (
        <main>
            <div className='scoreBoard'>
                <h3 className='best--roll'>Best Roll: {bestTime}</h3>
                <h3>Rolls taken: {rollCount}</h3>
            </div>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className='dice-container'>
                {diceEle}
            </div>
            {heldButNotSame ? <div className='main'>
                <h2 className='warning--text'>Not same numbers selected!! Please start New Game.</h2>
            </div> : tenzies &&
            <div className='main'>
                <h2 className='won--text'>You Won. Hurray!! Please start New Game.</h2>
            </div>
            }
            {heldButNotSame && <button className='reset-btn' onClick={handleReset}>New Game</button>}
            {tenzies && <button className='reset-btn' onClick={handleReset}>New Game</button>}
            {tenzies && <Confetti />}
            {!tenzies && !heldButNotSame && <button className='roll-btn' onClick={handleRoll}>Roll</button>}
        </main>
    )
}