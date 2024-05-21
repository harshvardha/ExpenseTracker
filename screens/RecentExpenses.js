import { useContext, useEffect, useState } from "react";

import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { ExpensesContext } from "../context/ExpensesContext";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

const RecentExpenses = () => {
    const { expensesState, setExpenses } = useContext(ExpensesContext);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        const getExpenses = async () => {
            setIsFetching(true);
            try {
                const expenses = await fetchExpenses();
                setExpenses(expenses);
            } catch (error) {
                setError('Could not fetch expenses!')
            }
            setIsFetching(false);
        }

        getExpenses();
    }, []);

    const errorHandler = () => {
        setError(null);
    }

    if (error && !isFetching) {
        return <ErrorOverlay message={error} onConfirm={errorHandler} />
    }

    if (isFetching) {
        return <LoadingOverlay />
    }

    const recentExpenses = expensesState.filter(expense => {
        const today = new Date();
        const date7DaysAgo = getDateMinusDays(today, 7);
        return expense.date >= date7DaysAgo && expense.date <= today;
    });

    return (
        <ExpensesOutput
            expensesPeriod="Last 7 days"
            expenses={recentExpenses}
            fallbackText="No expenses registered for the last 7 days."
        />
    )
}

export default RecentExpenses;