import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={props.style}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        key = {i}
        onClick={() => this.props.onClick(i)}
        style={this.props.winner.includes(i) ? {backgroundColor : "lightGreen"} : {}}
      />
    );
  }

  render() {

    var emptyBoard = Array(3).fill(Array(3).fill(null));
    var gameBoard = emptyBoard.map((rows,rowNum)=> {
      var row= rows.map((empty,squareID) => this.renderSquare(rowNum*3+squareID));
      return (
        <div key={rowNum} className="board-row">
          {row}
        </div>
      );
    });     
    return (
      <div>
        {gameBoard}
      </div>
    );
  }
}

class Game extends React.Component {
  reset(){
    const starter = Math.floor(Math.random()*2);
    const computer = Math.floor(Math.random()*2);
    this.setState ({
      history: [{
        squares: Array(9).fill(null),
        location: {
          x: null,
          y:null
        }
      }],
      stepNumber: 0,
      computer : computer,
      starter: starter,
      whoIsNext: starter,      
      moveRegOrder: true,
      winner: [],
    },this.firstMoveAi);

  }

  constructor(props) {
    const starter = Math.floor(Math.random()*2); // 0 is O, 1 is X
    const computer = Math.floor(Math.random()*2);
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: {
          x: null,
          y:null
        }
      }],
      stepNumber: 0,
      computer : computer,
      starter: starter,
      whoIsNext: starter,      
      moveRegOrder: true,
      winner: [],
    };
   
  }

  computerAi (){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    var emptySquares =[];
    squares.forEach((square,id)=>{if (!square) emptySquares.push(id)})
    var chosenSquare = Math.floor(Math.random()*emptySquares.length);

    function findEmpty (squares, type){
      if(type === "squares"){

      } else if (type === "lines"){

      }
    }
    function canILose(squares){

    }





    return emptySquares[chosenSquare];
  }

  makeMove (i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    var x = i%3+1;
    var y =  Math.floor((i)/3+1);

    if (calculateWinner(squares)[0]|| squares[i]|| this.state.stepNumber === 9)  //cautious. didnt work earlier. add else if broken
      return;
    

    squares[i] = this.state.whoIsNext ? 'X' : 'O';
    let winner = calculateWinner(squares);
    this.setState({
      history: history.concat([{
        squares: squares,
        location: {
          x: x,
          y: y
        }
      }]),
      stepNumber: history.length,
      whoIsNext: 1-this.state.whoIsNext,
      winner: winner,
    }, () => {if (this.state.whoIsNext === this.state.computer) this.makeMove(this.computerAi())});
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

  
    if (calculateWinner(squares)[0]|| squares[i]  || this.state.whoIsNext === this.state.computer  ) {
     
    } else {
      this.makeMove(i);
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      whoIsNext: (step % 2) === 0 ? this.state.starter : !this.state.starter,
      winner: calculateWinner(this.state.history[step].squares),
    });
  }

  firstMoveAi(){
    if (this.state.whoIsNext === this.state.computer)
      this.makeMove(this.computerAi())
  }

  componentDidMount(){
    this.firstMoveAi();
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)[0];
    


    const descriptions = history.map((step, move) => {
      const desc = calculateWinner(this.state.history[move].squares)[0] ? "Game Over" : move ?
        'Go to move #' + move + " (" + step.location.x + "," + step.location.y + ")":
        'Go to game start';
        
      return desc;
    });
      
    const moves = history.map((step, preMove) => {
      var move = this.state.moveRegOrder ? preMove : history.length-preMove-1;
      return (
        <li key={move}>
          <button style={{fontWeight: this.state.stepNumber===move ? "bold": "normal"}} onClick={(e) => this.jumpTo(move)}>
            {descriptions[move]}</button>
        </li>
      );
    });



    let status;
    if (winner) {
      status = 'Winner: ' + winner[0];
    } else {
      if (this.state.stepNumber === 0 || this.state.stepNumber === 1){
        status = "You are " + (this.state.starter === this.state.computer ? "second" : "first") + " as " + (!this.state.computer ? 'X' : 'O');
      }else {
      status = this.state.stepNumber === 9 ? 'It\'s a tie!' : 'Next player: ' + (this.state.whoIsNext ? 'X' : 'O');
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner = {this.state.winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ul><button onClick={()=>{this.reset();}}>New Game</button></ul>
          <ul><button onClick={()=>{this.setState({moveRegOrder : !this.state.moveRegOrder});}}> Reverse Moves </button></ul>
          <ol>{moves}</ol>
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
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a],a,b,c];
      
    }
  }
  return [];
}


