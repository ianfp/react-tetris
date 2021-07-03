import './App.css';
import React from "react";

const TICK_DURATION_MS = 100; // length of animation frame in millis
const GRAVITY_SPEED = 10; // number of ticks per drop
const COLORS = [
    "red",
    "orange",
    "yellow",
    "green",
    "cyan",
    "blue",
    "indigo"
];

function App() {
    const height = 20;
    const width = 10;
    return (
        <div className="App">
            <Board height={height} width={width}/>
        </div>
    );
}

export default App;

class Piece {
    constructor(x, y, color) {
        this.position = pos(x, y);
        this.color = color;
    }

    isAt(position) {
        return this.position.x === position.x && this.position.y === position.y;
    }

    moveDown() {
        return new Piece(this.position.x, this.position.y + 1, this.color);
    }

    moveLeft() {
        return new Piece(this.position.x - 1, this.position.y, this.color);
    }

    moveRight() {
        return new Piece(this.position.x + 1, this.position.y, this.color);
    }
}

function pos(x, y) {
    return {x: x, y: y};
}

function pickRandomColor() {
    const index = getRandomInt(COLORS.length);
    return COLORS[index];
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPiece: this.nextPiece(),
            completedPieces: [],
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
            "ArrowUp": this.rotateCurrentPiece.bind(this),
            "ArrowDown": this.zoomCurrentPieceDown.bind(this),
            "ArrowLeft": this.moveCurrentPieceLeft.bind(this),
            "ArrowRight": this.moveCurrentPieceRight.bind(this),
        };
    }

    nextPiece() {
        return new Piece(Math.floor(this.props.width / 2), 0, pickRandomColor());
    }

    render() {
        const rows = this.mapRows(rowNo => {
            const cells = this.mapCols(colNo => {
                const position = pos(colNo, rowNo);
                const color = this.getColorAt(position);
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

    getColorAt(position) {
        const piece = this.allPieces().find(current => current.isAt(position));
        return piece ? piece.color : "none";
    }

    allPieces() {
        return this.state.completedPieces.concat([this.state.currentPiece]);
    }

    mapRows(fn) {
        return repeat(this.props.height, (_, rowNo) => fn(rowNo));
    }

    mapCols(fn) {
        return repeat(this.props.width, (_, colNo) => fn(colNo));
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
        if (this.canMoveDown(this.state.currentPiece)) {
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

    moveCurrentPieceDown() {
        this.ticksUntilDrop = GRAVITY_SPEED;
        this.setState({currentPiece: this.state.currentPiece.moveDown()});
    }

    freezeCurrentPiece() {
        this.ticksUntilFreeze = GRAVITY_SPEED;
        this.setState({
            completedPieces: this.state.completedPieces.concat([this.state.currentPiece]),
            currentPiece: this.nextPiece()
        });
    }

    canMoveDown(piece) {
        const moved = piece.moveDown();
        return this.isObstructed(moved.position);
    }

    canMoveLeft(piece) {
        const moved = piece.moveLeft();
        return this.isObstructed(moved.position);
    }

    canMoveRight(piece) {
        const moved = piece.moveRight();
        return this.isObstructed(moved.position);
    }

    isObstructed(position) {
        const obstructed = (
            this.isOutOfBounds(position)
            || this.isOccupied(position)
        );
        return !obstructed;
    }

    isOutOfBounds(position) {
        return (
            position.x < 0
            || position.x >= this.props.width
            || position.y < 0
            || position.y >= this.props.height
        );
    }

    isOccupied(position) {
        return this.state.completedPieces.some(piece => piece.isAt(position));
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

    rotateCurrentPiece() {
        // implement this once we have pieces with different shapes
    }

    zoomCurrentPieceDown() {
        if (this.canMoveDown(this.state.currentPiece)) {
            this.moveCurrentPieceDown();
        }
    }

    moveCurrentPieceLeft() {
        if (this.canMoveLeft(this.state.currentPiece)) {
            this.setState({currentPiece: this.state.currentPiece.moveLeft()});
        }
    }

    moveCurrentPieceRight() {
        if (this.canMoveRight(this.state.currentPiece)) {
            this.setState({currentPiece: this.state.currentPiece.moveRight()});
        }
    }
}

function repeat(count, mapFn) {
    return Array.from({length: count}, mapFn);
}
