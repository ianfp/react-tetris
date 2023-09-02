import './App.css';
import React, {useEffect, useState} from "react";
import {Board} from "./Board";
import {pos} from "./Position";
import {Game} from "./Game";

/**
 * Length of an animation frame in milliseconds.
 *
 * We call animation frames "ticks" for short.
 */
const TICK_DURATION_MS = 100;

/**
 * The top-level React component of the game.
 */
function App() {
    const height = 20;
    const width = 10;
    const [game, setGame] = useState(new Game(Board.blank(height, width)));
    const appRef = React.createRef();

    /**
     * The next move made by the player, if they have made one; otherwise null.
     *
     * This will be one of the bound functions in [keyMap] below.
     */
    let nextMove = null;

    const controls = {
        rotate: () => game.rotateCurrentPiece(),
        down: () => game.moveCurrentPieceDown(),
        left: () => game.moveCurrentPieceLeft(),
        right: () => game.moveCurrentPieceRight(),
    }

    /**
     * Mapping of key events to the bound methods that they trigger.
     */
    const keyMap = {
        "ArrowUp": controls.rotate,
        "ArrowDown": controls.down,
        "ArrowLeft": controls.left,
        "ArrowRight": controls.right,
    };

    /**
     * Call the tick() function on every animation frame.
     */
    useEffect(() => {
        if (!game.isOver()) {
            const timerId = setInterval(tick, TICK_DURATION_MS);
            return () => clearInterval(timerId);
        }
    });

    /**
     * Focus on the app DOM element so the keyboard shortcuts work
     * without the user having to click on the game.
     */
    useEffect(() => {
        appRef.current.focus()
    });

    /**
     * A single animation frame of the game.
     */
    function tick() {
        const updatedGame = executeNextMove()
            .dropOrFreezeCurrentPiece();
        setGame(updatedGame);
    }

    /**
     * Executes the next move selected by the player.
     *
     * @return {Game} the possibly updated game state
     */
    function executeNextMove() {
        let updatedGame = game;
        if (nextMove) {
            updatedGame = nextMove();
            nextMove = null;
        }
        return updatedGame;
    }

    function handleKeyPress(keyEvent) {
        const selectedMove = determineNextMove(keyEvent.key);
        if (selectedMove) {
            setNextMove(selectedMove);
            keyEvent.preventDefault();
        }
    }

    function setNextMove(selected) {
        nextMove = selected;
    }

    function determineNextMove(key) {
        return keyMap.hasOwnProperty(key) ? keyMap[key] : null;
    }

    function restartGame() {
        setGame(game.restart());
    }

    return (
        <div
            className="App"
            tabIndex="0"
            ref={appRef}
            onKeyDown={event => handleKeyPress(event)}
        >
            <BoardComponent board={game.board}/>
            <ControlsComponent {...controls} setNextMove={setNextMove}/>
            <ScoreComponent score={game.getScore()} level={game.getLevelNo()}/>
            <GameOverComponent gameOver={game.isOver()} restartGame={restartGame}/>
        </div>
    );
}

export default App;

/**
 * The game board on which the piece appear and stack up.
 *
 * The origin (0, 0) is the top-left square of the game board;
 * x increases to the right, and y increases as you move *down*.
 */
function BoardComponent(props) {
    const rows = props.board.rows().map(rowNo => {
        const cells = props.board.cols().map(colNo => {
            const position = pos(colNo, rowNo);
            const color = props.board.getColorAt(position);
            return <div key={colNo} className={`cell ${color}`}/>
        });
        return <div key={rowNo} className="row">{cells}</div>
    });

    return (
        <main className="board">
            {rows}
        </main>
    );
}

/**
 * Displays if the game is over.
 */
function GameOverComponent(props) {
    return props.gameOver ? (
        <div className="game-over">
            Game over!
            <button onClick={props.restartGame}>
                Start over
            </button>
        </div>
    ) : (
        <div className="game-over"/>
    );
}

function ControlsComponent(props) {
    return (
        <div className="controls">
            <button onClick={() => props.setNextMove(props.rotate)} className="rotate">Rotate</button>
            <button onClick={() => props.setNextMove(props.left)} className="left">Left</button>
            <button onClick={() => props.setNextMove(props.down)} className="down">Down</button>
            <button onClick={() => props.setNextMove(props.right)} className="right">Right</button>
        </div>
    );
}

function ScoreComponent(props) {
    return (
        <>
            <div className="score">
                Score: {props.score}
            </div>
            <div className="level">
                Level: {props.level}
            </div>
        </>
    );
}
