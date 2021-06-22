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
}

function pos(x, y) {
    return {x: x, y: y};
}


class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pieces: [
                new Piece(3, 4),
            ],
        };
    }

    render() {
        console.log('props', this.props);
        const rows = repeat(this.props.height, (elem, index) => <Row key={index} width={this.props.width}/>);
        return (
            <div className="board">
                {rows}
            </div>
        );
    }
}

function Row(props) {
    const cells = repeat(props.width, (elem, index) => <div key={index} className="cell"/> );
    return (
        <div className="row">{cells}</div>
    );
}

function repeat(count, mapFn) {
    return Array.from({length: count}, mapFn);
}
