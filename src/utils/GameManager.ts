const BOARD_DATA_KEY = 'memoMathBoardData';

export const saveBoardData = (
    boardData: {
        id: number,
        number: number,
        letter: string,
    }[]): void => {
        try {
            const serializedData = JSON.stringify(boardData);
            localStorage.setItem(BOARD_DATA_KEY, serializedData);
            console.log('Board data saved to Local Storage');
        } catch (error) {
            console.error('Error saving board data to Local Storage:', error);
        }
    };

export const loadBoardData = (): {
    id: number,
    number: number,
    letter: string,
}[] | null => {
    try {
        const serializedData = localStorage.getItem(BOARD_DATA_KEY);
        if (serializedData === null) {
            return null;
        }
        const parsedData = JSON.parse(serializedData) as { id: number; number:number; letter: string; }[];
        console.log('Board data loaded from Local Storage');
        return parsedData;
    } catch (error) {
        console.error('Error loading board data from Local Storage:', error);
        return null;
    }
};

export const clearBoardData = (): void => {
    localStorage.removeItem(BOARD_DATA_KEY);
    console.log('Board data cleared from local Storage');
}
