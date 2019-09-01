import React, { Component } from 'react';
import classes from './TicTac.module.css';

const tictac =
[
             
        [ 
            { cssClasses: [classes.TdCorner], divClasses: [], value:''},
            { cssClasses: [classes.TdTop], divClasses: [], value: '' },
            { cssClasses: [classes.TdCorner], divClasses: [], value: ''}
        ],
        
        [
            { cssClasses: [classes.TdLeft], divClasses: [], value: ''},
            { cssClasses: [classes.TdTop], divClasses: [], value: ''},
            { cssClasses: [classes.TdRight], divClasses: [], value: ''}
        ],
        [                    
            { cssClasses: [classes.TdCorner], divClasses: [], value: ''},
            { cssClasses: [classes.TdBottom], divClasses: [], value: ''},
            { cssClasses: [classes.TdCorner], divClasses: [], value: ''}                    
        ]
]

class TicTac extends Component{

    state ={
        tictac : JSON.parse(JSON.stringify(tictac)),
        isCircle: true,
        isGameFinished: false,
    }

    reset = () => {        
        this.setState({tictac : JSON.parse(JSON.stringify(tictac))});
        this.setState({isGameFinished: false});
    }

    onCellClick = (rowId, colId) => {
        if(this.state.tictac[rowId][colId].divClasses.length || this.state.isGameFinished)
            return;

        const tictac = JSON.parse(JSON.stringify(this.state.tictac));        

        let divClasses = [...tictac[rowId][colId].divClasses];

        if(this.state.isCircle){
            divClasses.push(classes.Circle);
            tictac[rowId][colId].value = 'O';
        }else{
            divClasses.push(classes.Cross);
            tictac[rowId][colId].value = 'X';
        }
        
        tictac[rowId][colId].divClasses = divClasses;


        const newTicTac = this.checkWinner(rowId, colId, JSON.parse(JSON.stringify(tictac)), tictac[rowId][colId].value);
        this.setState({tictac: newTicTac});
        this.setState((prevState) => {
            return {isCircle: !prevState.isCircle}
        })
    }

    /* Recursive function to find winner */
    traverseTicTac = (tictac, rowId, colId, op, searchValue) => {
                
        if(op === 'colPlus1' || op === 'rowMinus1colPlus1' || op === 'rowcolPlus1') {
            colId = colId + 1;
        }

        if(op === 'rowPlus1' || op === 'rowPlus1colMinus1' || op === 'rowcolPlus1') {                    
            rowId = rowId + 1;            
        }

        if(op === 'colMinus1' || op === 'rowcolMinus1' || op === 'rowPlus1colMinus1') {
            colId = colId - 1;
        }

        if(op === 'rowMinus1' || op === 'rowcolMinus1' || op === 'rowMinus1colPlus1') {
            rowId = rowId - 1;            
        }

        if(rowId > 2 || rowId < 0 || colId > 2 || colId < 0){            
            return [];
        }
            
        if(tictac[rowId][colId].value !== searchValue || tictac[rowId][colId].value === ''){             
            return [];
        } 

        if(tictac[rowId][colId].value === searchValue) {            
            return this.traverseTicTac(tictac, rowId, colId, op, searchValue)
                       .concat([{
                            rowId: rowId,
                            colId: colId
                       }]);
        }
    };  


    checkWinner = (rowId, colId, tictac, searchValue) => {    

        let cellsToBeHighlighted = [];    
        const currentCell = [{
                                rowId: rowId,
                                colId: colId
                            }]
        /** Travel in 8 direction to find winner */             
        const traverseVert = this.traverseTicTac(tictac, rowId, colId, 'rowMinus1', searchValue)
            .concat(this.traverseTicTac(tictac, rowId, colId, 'rowPlus1', searchValue)).concat(currentCell);
        const traverseHor = this.traverseTicTac(tictac, rowId, colId, 'colMinus1', searchValue)
            .concat(this.traverseTicTac(tictac, rowId, colId, 'colPlus1', searchValue)).concat(currentCell);      
        const traverseDiagLeftRight = this.traverseTicTac(tictac, rowId, colId, 'rowcolMinus1', searchValue)
            .concat(this.traverseTicTac(tictac, rowId, colId, 'rowcolPlus1', searchValue)).concat(currentCell);
        const traverseDiagRightLeft  = this.traverseTicTac(tictac, rowId, colId, 'rowMinus1colPlus1', searchValue)
            .concat(this.traverseTicTac(tictac, rowId, colId, 'rowPlus1colMinus1', searchValue)).concat(currentCell);

        cellsToBeHighlighted = traverseVert.length === 3 ?  cellsToBeHighlighted.concat(traverseVert) :  cellsToBeHighlighted;
        cellsToBeHighlighted = traverseHor.length === 3  ?  cellsToBeHighlighted.concat(traverseHor) :  cellsToBeHighlighted;
        cellsToBeHighlighted = traverseDiagLeftRight.length === 3 ?  cellsToBeHighlighted.concat(traverseDiagLeftRight) :  cellsToBeHighlighted;                   
        cellsToBeHighlighted = traverseDiagRightLeft.length === 3 ?  cellsToBeHighlighted.concat(traverseDiagRightLeft) :  cellsToBeHighlighted;     

        let newTicTac = cellsToBeHighlighted.length ? this.highlightWinner(cellsToBeHighlighted, JSON.parse(JSON.stringify(tictac))) : tictac;    
                            
        return newTicTac;    
    }

    highlightWinner = (cellsToHighlight, tictac) => {
        let divClasses = null;
        let winner = '';

        for(const cell of cellsToHighlight){
            divClasses = [...tictac[cell.rowId][cell.colId].divClasses]
            winner = tictac[cell.rowId][cell.colId].value;
            if(winner === 'X'){
                divClasses.pop(classes.Cross);
                divClasses.push(classes.CrossSuccess);
            }else{
                divClasses.pop(classes.Circle);
                divClasses.push(classes.CircleSuccess);
            }
            tictac[cell.rowId][cell.colId].divClasses = divClasses;       
        } 

        winner === 'X' ? this.setState({winnerClass: classes.CrossSuccess}) : this.setState({ winnerClass: classes.CircleSuccess});
        this.setState({isGameFinished: true});
        return tictac;
    }

    render() {  
        let winMessage = null;
        if(this.state.isGameFinished){
            winMessage = <div className={classes.WinnerMessage}><div className={this.state.winnerClass}></div> WINNER!!!</div>
        }
        
        return (
           <React.Fragment>
            {winMessage}
            <table className={classes.Table}>
                <tbody>
                    {this.state.tictac.map((_, rowId) => {                    
                        return <tr key={rowId}>
                            {
                            this.state.tictac[rowId].map((_, colId) => {                             
                                return <td className={this.state.tictac[rowId][colId].cssClasses.join(' ')} key={colId}>
                                        <div className={this.state.tictac[rowId][colId].divClasses.concat(classes.Cell).join(' ')}
                                            onClick={() => this.onCellClick(rowId ,colId)}/>
                                        </td>
                                })
                            }
                        </tr>
                    })  
                    }
                </tbody>  
            </table>  
            <br/><br/>            
            <p><button className={classes.Button} onClick={this.reset}>Reset</button></p>
          </React.Fragment> 
        );
    }
}

export default TicTac;