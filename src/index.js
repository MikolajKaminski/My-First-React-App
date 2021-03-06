import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
            style={props.winningSquare ? { borderColor: '#F00' } : null}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        let winningSquare = this.props.winner && this.props.winner.includes(i) ? true : false;
        return (
            <Square
                key={i.toString()}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                winningSquare = {winningSquare}
            />
        );
    }

    render() {
        let boardSquares = [];
        for(let row = 0; row < 3; row++){
            let boardRow = [];
            for(let col = 0; col < 3; col++){
                boardRow.push(this.renderSquare((row * 3) + col));
            }
            boardSquares.push(<div key={row.toString()} className="board-row">{boardRow}</div>);
        }

        return (
            <div>
                {boardSquares}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                chosenField: null
            }],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                chosenField: i
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';

            const chosenFieldX = (step.chosenField) % 3;
            const chosenFieldY = Math.trunc((step.chosenField) / 3);

            const colRow = move ?
                ' (' + (chosenFieldX + 1) + ', ' + (chosenFieldY + 1) + ')' :
                '';
            
            return (
                <li key={move}>
                    <button
                        onClick={() => this.jumpTo(move)}
                        style={this.state.stepNumber === move ? { fontWeight: 'bold' } : null}
                    >
                        {desc + colRow}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner is: ' + winner.winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
    
        return (
        <div className="game">
            <div className="game-board">
                <Board 
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                    winner={winner && winner.winningSquares}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ul>{moves}</ul>
            </div>
        </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    //All winning scenarios
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                winningSquares: lines[i]
            };
        }
    }
    return null;
  }
