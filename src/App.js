import './App.css';
import React from "react";

const TICK_DURATION_MS = 100; // length of animation frame in millis
const GRAVITY_SPEED = 10; // number of ticks per drop

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


class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPiece: new Piece(0, 0, "yellow"),
            completedPieces: [
                new Piece(3, 4, "red"),
                new Piece(6, 9, "green"),
            ],
        };
        this.ticksUntilDrop = GRAVITY_SPEED;
    }

    render() {
        const rows = this.mapRows(rowNo => {
            const cells = this.mapCols(colNo => {
                const position = pos(colNo, rowNo);
                const color = this.getColorAt(position);
                return <div className={`cell ${color}`} />
            });
            return <div className="row">{cells}</div>
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
        --this.ticksUntilDrop;
        if (this.ticksUntilDrop === 0) {
            this.ticksUntilDrop = GRAVITY_SPEED;
            this.setState({currentPiece: this.state.currentPiece.moveDown()});
        }
    }
}

function repeat(count, mapFn) {
    return Array.from({length: count}, mapFn);
}
