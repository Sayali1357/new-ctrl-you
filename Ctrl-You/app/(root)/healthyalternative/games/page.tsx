'use client';

import { useState, FC, useEffect, useCallback } from 'react';

// --- Sudoku Game Component ---
const SudokuGame: FC = () => {
    const [initialGrid, setInitialGrid] = useState<number[][]>([]);
    const [solutionGrid, setSolutionGrid] = useState<number[][]>([]);
    const [grid, setGrid] = useState<number[][]>([]);
    const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
    const [isSolved, setIsSolved] = useState(false);
    const [time, setTime] = useState(0);
    const [bestTime, setBestTime] = useState<number | null>(null);
    const [submissionResult, setSubmissionResult] = useState<'none' | 'correct' | 'incorrect' | 'incomplete'>('none');

    const startNewGame = useCallback(() => {
        const { puzzle, solution } = generateSudoku();
        setInitialGrid(puzzle.map(row => row.slice()));
        setGrid(puzzle.map(row => row.slice()));
        setSolutionGrid(solution);
        setSelectedCell(null);
        setIsSolved(false);
        setTime(0);
        setSubmissionResult('none');
    }, []);

    useEffect(() => {startNewGame();}, [startNewGame]);
    useEffect(() => {
        if (isSolved) return;
        const timer = setInterval(() => {setTime(prevTime => prevTime + 1);}, 1000);
        return () => clearInterval(timer);
    }, [isSolved]);

    const checkSolution = useCallback((currentGrid: number[][]) => {
        return currentGrid.every((row, r) => row.every((cell, c) => cell === solutionGrid[r][c]));
    }, [solutionGrid]);

    const handleCellClick = (row: number, col: number) => {
        if (initialGrid[row][col] === 0) setSelectedCell({ row, col });
    };

    const handleNumberInput = useCallback((num: number) => {
        if (!selectedCell || isSolved) return;
        const newGrid = grid.map(row => row.slice());
        newGrid[selectedCell.row][selectedCell.col] = num;
        setGrid(newGrid);
        setSubmissionResult('none');
    }, [selectedCell, isSolved, grid]);

    // --- UPDATED KEYBOARD HANDLING LOGIC ---
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isSolved) return;

            // If no cell is selected, start at (0,0) on arrow key press
            if (!selectedCell) {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                    event.preventDefault();
                    setSelectedCell({ row: 0, col: 0 });
                }
                return;
            }

            // Handle Arrow Key Navigation
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.preventDefault(); // Prevent page scrolling
                let { row, col } = selectedCell;
                switch (event.key) {
                    case 'ArrowUp':
                        row = Math.max(0, row - 1);
                        break;
                    case 'ArrowDown':
                        row = Math.min(8, row + 1);
                        break;
                    case 'ArrowLeft':
                        col = Math.max(0, col - 1);
                        break;
                    case 'ArrowRight':
                        col = Math.min(8, col + 1);
                        break;
                }
                setSelectedCell({ row, col });
                return;
            }

            // Handle Number and Delete Input (only for user-editable cells)
            if (initialGrid.length > 0 && initialGrid[selectedCell.row][selectedCell.col] === 0) {
                if (event.key >= '1' && event.key <= '9') {
                    handleNumberInput(parseInt(event.key, 10));
                } else if (event.key === 'Backspace' || event.key === 'Delete') {
                    handleNumberInput(0);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedCell, isSolved, handleNumberInput, initialGrid]); // Added initialGrid to dependency array

    const handleSubmit = () => {
        if (isSolved) return;
        if (grid.flat().includes(0)) {
            setSubmissionResult('incomplete');
            return;
        }
        if (checkSolution(grid)) {
            setSubmissionResult('correct');
            setIsSolved(true);
            if (bestTime === null || time < bestTime) setBestTime(time);
        } else {
            setSubmissionResult('incorrect');
        }
    };

    if (grid.length === 0) return <div className="text-white">Loading...</div>;

    const renderSubmissionMessage = () => {
        switch (submissionResult) {
            case 'correct': return <div className="h-16 mb-4 p-4 flex items-center justify-center bg-green-900/50 border border-green-500 rounded-lg animate-fadeIn"><h3 className="text-xl font-bold text-green-300">Congratulations! You solved it in {formatTime(time)}!</h3></div>;
            case 'incorrect': return <div className="h-16 mb-4 p-4 flex items-center justify-center bg-red-900/50 border border-red-500 rounded-lg animate-fadeIn"><p className="text-red-300">Not quite! Keep looking for mistakes.</p></div>;
            case 'incomplete': return <div className="h-16 mb-4 p-4 flex items-center justify-center bg-yellow-900/50 border border-yellow-500 rounded-lg animate-fadeIn"><p className="text-yellow-300">The puzzle isnt finished yet. Keep going!</p></div>;
            default: return <div className="h-16 mb-4"></div>;
        }
    };
    
    return (
        <div className="w-full max-w-2xl text-center animate-fadeIn bg-gradient-to-br from-slate-800 via-slate-900 to-black p-6 rounded-2xl shadow-2xl border border-slate-700">
            <h2 className="text-4xl font-bold mb-2 text-indigo-300">Sudoku Challenge</h2>
            <div className="flex justify-between items-center max-w-lg mx-auto mb-4 px-2 text-lg text-gray-300 font-medium">
                <span>Time: {formatTime(time)}</span>
                <span>Best Time: {bestTime !== null ? formatTime(bestTime) : '--:--'}</span>
            </div>
            {renderSubmissionMessage()}
            <div className="grid grid-cols-9 grid-rows-9 gap-1 w-full max-w-lg aspect-square bg-gray-700 p-2 rounded-lg shadow-2xl border-4 border-gray-600 mx-auto">
                {grid.map((row, rIndex) =>
                    row.map((num, cIndex) => {
                        const isInitial = initialGrid[rIndex][cIndex] !== 0;
                        const isSelected = selectedCell?.row === rIndex && selectedCell?.col === cIndex;
                        const isWrong = submissionResult === 'incorrect' && num !== 0 && num !== solutionGrid[rIndex][cIndex];
                        const borderStyle = `${(rIndex + 1) % 3 === 0 && rIndex !== 8 ? 'border-b-4' : ''} ${(cIndex + 1) % 3 === 0 && cIndex !== 8 ? 'border-r-4' : ''} border-gray-600`;
                        let cellClasses = `flex items-center justify-center text-3xl font-semibold rounded-sm transition-colors duration-200 ${borderStyle}`;
                        if (isInitial) cellClasses += ' bg-gray-800 text-gray-400';
                        else {
                            cellClasses += ' cursor-pointer';
                            if (isSelected) cellClasses += ' bg-indigo-800';
                            else cellClasses += ' bg-gray-800 hover:bg-gray-700';
                            if (isWrong) cellClasses += ' text-red-500';
                            else cellClasses += ' text-indigo-300';
                        }
                        return <div key={`${rIndex}-${cIndex}`} className={cellClasses} onClick={() => handleCellClick(rIndex, cIndex)}>{num > 0 ? num : ''}</div>;
                    })
                )}
            </div>
            <div className="mt-4 grid grid-cols-9 gap-2 max-w-lg mx-auto">
                {Array.from({ length: 9 }, (_, i) => i + 1).map(num => (
                    <button key={num} onClick={() => handleNumberInput(num)} disabled={isSolved} className="bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-indigo-600 transition-all duration-200 transform hover:scale-110 shadow-lg text-2xl disabled:opacity-50 disabled:hover:bg-gray-700">{num}</button>
                ))}
            </div>
            <div className="mt-6 flex justify-center items-center gap-4">
                 <button onClick={startNewGame} className="bg-green-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg">New Game</button>
                 <button onClick={handleSubmit} disabled={isSolved} className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">Submit</button>
            </div>
        </div>
    );
};


// --- Main Page Component ---
export default function SudokuPage() {
    return (
        <main className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-gradient-radial from-indigo-900/40 via-slate-900 to-slate-900 animate-spin-slow"></div>
             <div className="relative z-10">
                <SudokuGame />
             </div>
        </main>
    );
}

// Helper functions for Sudoku generation
const generateSudoku = () => {
    const solution = [
        [5,3,4,6,7,8,9,1,2], [6,7,2,1,9,5,3,4,8], [1,9,8,3,4,2,5,6,7],
        [8,5,9,7,6,1,4,2,3], [4,2,6,8,5,3,7,9,1], [7,1,3,9,2,4,8,5,6],
        [9,6,1,5,3,7,2,8,4], [2,8,7,4,1,9,6,3,5], [3,4,5,2,8,6,1,7,9]
    ];
    const puzzle = solution.map(row => row.slice());
    // Remove cells to create the puzzle
    for(let i = 0; i < 45; i++) {
        let row = Math.floor(Math.random() * 9), col = Math.floor(Math.random() * 9);
        while (puzzle[row][col] === 0) { // Ensure we don't try to remove an already empty cell
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
        }
        puzzle[row][col] = 0;
    }
    return { puzzle, solution };
};
const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};

