import './App.css';
import React from "react";

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
}

function pos(x, y) {
    return {x: x, y: y};
}


class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pieces: [
                new Piece(3, 4, "red"),
                new Piece(6, 9, "green"),
            ],
        };
    }

    render() {
        console.log('props', this.props);
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
        const piece = this.state.pieces.find(current => current.isAt(position));
        return piece ? piece.color : "none";
    }

    mapRows(fn) {
        return repeat(this.props.height, (_, rowNo) => fn(rowNo));
    }

    mapCols(fn) {
        return repeat(this.props.width, (_, colNo) => fn(colNo));
    }
}

function repeat(count, mapFn) {
    return Array.from({length: count}, mapFn);
}
