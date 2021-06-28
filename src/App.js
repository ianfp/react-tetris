import './App.css';
import React from "react";

const TICK_DURATION_MS = 100; // length of animation frame in millis
const GRAVITY_SPEED = 2; // number of ticks per drop
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
        this.ticksUntilDrop = GRAVITY_SPEED;
        this.ticksUntilFreeze = GRAVITY_SPEED;
    }

    nextPiece() {
        return new Piece(Math.floor(this.props.width / 2), 0, pickRandomColor());
    }

    render() {
        const rows = this.mapRows(rowNo => {
            const cells = this.mapCols(colNo => {
                const position = pos(colNo, rowNo);
                const color = this.getColorAt(position);
                return <div key={colNo} className={`cell ${color}`} />
            });
            return <div key={rowNo} className="row">{cells}</div>
        });
        return (
            <div className="board">
                {rows}
            </div>
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
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    tick() {
        this.moveCurrentPieceDown();
        this.freezeCurrentPiece();
    }

    moveCurrentPieceDown() {
        --this.ticksUntilDrop;
        if (this.ticksUntilDrop <= 0) {
            this.ticksUntilDrop = GRAVITY_SPEED;
            if (this.canMoveDown(this.state.currentPiece)) {
                this.setState({currentPiece: this.state.currentPiece.moveDown()});
            } else {
                --this.ticksUntilFreeze;
            }
        }
    }

    freezeCurrentPiece() {
        if (this.ticksUntilFreeze <= 0) {
            this.ticksUntilFreeze = GRAVITY_SPEED;
            this.setState({
                completedPieces: this.state.completedPieces.concat([this.state.currentPiece]),
                currentPiece: this.nextPiece()
            });
        }
    }

    canMoveDown(piece) {
        const moved = piece.moveDown();
        const obstructed = (
            this.isOutOfBounds(moved.position)
            || this.isOccupied(moved.position)
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
}

function repeat(count, mapFn) {
    return Array.from({length: count}, mapFn);
}
