import { createContext, useReducer } from "react";

const ExpensesContext = createContext({
    expenses: [],
    addExpense: ({ description, amount, date }) => { },
    setExpenses: (expenses) => { },
    deleteExpense: (id) => { },
    updateExpense: (id, { description, amount, date }) => { }
});

const expenseReducer = (state, action) => {
    switch (action.type) {
        case 'ADD':
            return [action.payload, ...state];
        case 'SET':
            const inverted = action.payload.reverse();
            return inverted;
        case 'UPDATE':
            const updatableExpenseIndex = state.findIndex(expense => expense.id === action.payload.id);
            const updatableExpense = state[updatableExpenseIndex];
            const updatedItem = { ...updatableExpense, ...action.payload.data };
            const updatedExpenses = [...state];
            updatedExpenses[updatableExpenseIndex] = updatedItem;
            return updatedExpenses;
        case 'DELETE':
            return state.filter(expense => expense.id !== action.payload.id);
        default:
            return state;
    }
}

const ExpensesContextProvider = ({ children }) => {
    const [expensesState, dispatch] = useReducer(expenseReducer, []);

    const addExpense = (expenseData) => {
        dispatch({ type: 'ADD', payload: expenseData });
    }

    const setExpenses = (expenses) => {
        dispatch({ type: 'SET', payload: expenses })
    }

    const deleteExpense = (id) => {
        dispatch({ type: 'DELETE', payload: { id: id } });
    }

    const updateExpense = (id, expenseData) => {
        dispatch({ type: 'UPDATE', payload: { id: id, data: expenseData } });
    }

    return (
        <ExpensesContext.Provider
            value={{
                expensesState,
                addExpense,
                setExpenses,
                deleteExpense,
                updateExpense
            }}
        >
            {children}
        </ExpensesContext.Provider>
    )
}

export { ExpensesContext, ExpensesContextProvider };