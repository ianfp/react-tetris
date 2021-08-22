import './App.css';
import React, {useEffect, useState} from "react";
import {Board} from "./Board";
import {pos} from "./Position";

const TICK_DURATION_MS = 100; // length of animation frame in millis
const GRAVITY_SPEED = 10; // number of ticks per drop

/**
 * The top-level React component of the game.
 */
function App() {
    const height = 20;
    const width = 10;
    const [board, setBoard] = useState(Board.blank(height, width));
    const [gameOver, setGameOver] = useState(false);
    const appRef = React.createRef();

    let ticksUntilDrop = GRAVITY_SPEED;
    let ticksUntilFreeze = GRAVITY_SPEED;

    /**
     * The next move made by the player, if they have made one; otherwise null.
     *
     * This will be one of the bound functions in [keyMap] below.
     */
    let nextMove = null;

    /**
     * Mapping of key events to the bound methods that they trigger.
     */
    const keyMap = {
        "ArrowUp": () => setBoard(board.rotateCurrentPiece()),
        "ArrowDown": () => moveCurrentPieceDown(),
        "ArrowLeft": () => setBoard(board.moveCurrentPieceLeft()),
        "ArrowRight": () => setBoard(board.moveCurrentPieceRight()),
    };

    useEffect(() => {
        if (!gameOver) {
            const timerId = setInterval(tick, TICK_DURATION_MS);
            return () => clearInterval(timerId);
        }
    });

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
