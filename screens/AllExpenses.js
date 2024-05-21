import { useContext } from "react";

import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { ExpensesContext } from "../context/ExpensesContext";

const AllExpenses = () => {
    const { expensesState } = useContext(ExpensesContext);

    return (
        <ExpensesOutput
            expensesPeriod="Total"
            expenses={expensesState}
            fallbackText="No registered expenses found."
        />
    )
}

export default AllExpenses