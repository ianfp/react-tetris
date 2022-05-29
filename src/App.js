import './App.css';
import React, {useEffect, useState} from "react";
import {Board} from "./Board";
import {pos} from "./Position";

/**
 * Length of an animation frame in milliseconds.
 *
 * We call animation frames "ticks" for short.
 */
const TICK_DURATION_MS = 100;

/**
 * The number of ticks it takes "gravity" to pull the current piece down one square.
 */
const GRAVITY_SPEED = 10;

/**
 * The top-level React component of the game.
 */
function App() {
    const height = 20;
    const width = 10;
    const [board, setBoard] = useState(Board.blank(height, width));
    const [gameOver, setGameOver] = useState(false);
    const appRef = React.createRef();

    /**
     * How many ticks remain until "gravity" pulls the current piece down one square.
     */
    let ticksUntilDrop = GRAVITY_SPEED;

    /**
     * How many ticks remain until the current piece is locked in place.
     */
    let ticksUntilFreeze = GRAVITY_SPEED;

    /**
     * The next move made by the player, if they have made one; otherwise null.
     *
     * This will be one of the bound functions in [keyMap] below.
     */
    let nextMove = null;

    const controls = {
        rotate: () => setBoard(board.rotateCurrentPiece()),
        down: () => moveCurrentPieceDown(),
        left: () => setBoard(board.moveCurrentPieceLeft()),
        right: () => setBoard(board.moveCurrentPieceRight()),
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
        if (!gameOver) {
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
        executeNextMove();
        dropOrFreezeCurrentPiece();
        checkForGameOver();
    }

    /**
     * Executes the next move selected by the player.
     */
    function executeNextMove() {
        if (nextMove) {
            nextMove();
            nextMove = null;
        }
    }

    function dropOrFreezeCurrentPiece() {
        if (board.canMoveDown()) {
            --ticksUntilDrop;
            if (ticksUntilDrop <= 0) {
                moveCurrentPieceDown();
            }
        } else {
            --ticksUntilFreeze;
            if (ticksUntilFreeze <= 0) {
                freezeCurrentPiece();
            }
        }
    }

    /**
     * Move the current piece down and reset the drop timer.
     *
     * We reset the drop timer regardless of whether the piece moves down
     * by "gravity" or the player moves it. In the latter case, failure to
     * reset the timer causes an occasional "double drop", which creates a
     * jarring experience for the player.
     */
    function moveCurrentPieceDown() {
        ticksUntilDrop = GRAVITY_SPEED;
        setBoard(board.moveCurrentPieceDown());
    }

    function freezeCurrentPiece() {
        ticksUntilFreeze = GRAVITY_SPEED;
        setBoard(board.freezeCurrentPiece().removeCompletedRows());
    }

    function handleKeyPress(keyEvent) {
        const selectedMove = determineNextMove(keyEvent.key);
        if (selectedMove) {
            nextMove = selectedMove;
            keyEvent.preventDefault();
        }
    }

    function determineNextMove(key) {
        return keyMap.hasOwnProperty(key) ? keyMap[key] : null;
    }

    function checkForGameOver() {
        setGameOver(board.isGameOver());
    }

    function restartGame() {
        setBoard(Board.blank(height, width));
        setGameOver(false);
    }

    return (
        <div
            className="App"
            tabIndex="0"
            ref={appRef}
            onKeyDown={event => handleKeyPress(event)}
        >
            <BoardComponent board={board}/>
            <ControlsComponent {...controls} />
            <GameOverComponent gameOver={gameOver} restartGame={restartGame}/>
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
            <button onClick={props.rotate} className="rotate">Rotate</button>
            <button onClick={props.left} className="left">Left</button>
            <button onClick={props.down} className="down">Down</button>
            <button onClick={props.right} className="right">Right</button>
        </div>
    );
}
