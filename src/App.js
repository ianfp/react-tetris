import './App.css';
import React from "react";
import {Board} from "./Board";
import {pos} from "./Position";

const TICK_DURATION_MS = 100; // length of animation frame in millis
const GRAVITY_SPEED = 10; // number of ticks per drop

function App() {
    const height = 20;
    const width = 10;
    return (
        <div className="App">
            <BoardComponent board={Board.blank(height, width)}/>
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
class BoardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: props.board,
        };
        this.boardRef = React.createRef();
        this.ticksUntilDrop = GRAVITY_SPEED;
        this.ticksUntilFreeze = GRAVITY_SPEED;

        /**
         * The next move make by the player, if they have made one; otherwise null.
         *
         * This will be one of the bound functions in [keyMap] below.
         */
        this.nextMove = null;

        /**
         * Mapping of key events to the bound methods that they trigger.
         */
        this.keyMap = {
            "ArrowUp": () => this.updateBoard(board => board.rotateCurrentPiece()),
            "ArrowDown": () => this.moveCurrentPieceDown(),
            "ArrowLeft": () => this.updateBoard(board => board.moveCurrentPieceLeft()),
            "ArrowRight": () => this.updateBoard(board => board.moveCurrentPieceRight()),
        };
    }

    render() {
        const rows = this.rows().map(rowNo => {
            const cells = this.cols().map(colNo => {
                const position = pos(colNo, rowNo);
                const color = this.state.board.getColorAt(position);
                return <div key={colNo} className={`cell ${color}`}/>
            });
            return <div key={rowNo} className="row">{cells}</div>
        });
        return (
            <main className="board"
                  ref={this.boardRef}
                  tabIndex="0"
                  onKeyDown={event => this.handleKeyPress(event)}>
                {rows}
            </main>
        );
    }

    rows() {
        return this.state.board.rows();
    }

    cols() {
        return this.state.board.cols();
    }

    componentDidMount() {
        this.timerId = setInterval(() => this.tick(), TICK_DURATION_MS);
        this.boardRef.current.focus(); // ensure the board receives keydown events
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    /**
     * A single animation frame of the game.
     */
    tick() {
        this.executeNextMove();
        this.dropOrFreezeCurrentPiece();
    }

    /**
     * Executes the next move selected by the player.
     */
    executeNextMove() {
        if (this.nextMove) {
            this.nextMove();
            this.nextMove = null;
        }
    }

    dropOrFreezeCurrentPiece() {
        if (this.state.board.canMoveDown()) {
            --this.ticksUntilDrop;
            if (this.ticksUntilDrop <= 0) {
                this.moveCurrentPieceDown();
            }
        } else {
            --this.ticksUntilFreeze;
            if (this.ticksUntilFreeze <= 0) {
                this.freezeCurrentPiece();
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
    moveCurrentPieceDown() {
        this.ticksUntilDrop = GRAVITY_SPEED;
        this.updateBoard(board => board.moveCurrentPieceDown());
    }

    updateBoard(func) {
        this.setState({board: func(this.state.board)});
    }

    freezeCurrentPiece() {
        this.ticksUntilFreeze = GRAVITY_SPEED;
        this.updateBoard(board => board.freezeCurrentPiece().removeCompletedRows());
    }

    handleKeyPress(keyEvent) {
        const nextMove = this.determineNextMove(keyEvent.key);
        if (nextMove) {
            this.nextMove = nextMove;
            keyEvent.preventDefault();
        }
    }

    determineNextMove(key) {
        return this.keyMap.hasOwnProperty(key) ? this.keyMap[key] : null;
    }
}
