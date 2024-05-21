import { useLayoutEffect, useContext, useState } from "react";
import { View, StyleSheet } from "react-native";

import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import { ExpensesContext } from "../context/ExpensesContext";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import { storeExpense, updateExpenseBackend, deleteExpenseBackend } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

const ManageExpenses = ({ route, navigation }) => {
    const { deleteExpense, addExpense, updateExpense, expensesState } = useContext(ExpensesContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState();

    const expenseId = route.params?.expenseId;
    const isEditing = !!expenseId;

    const selectedExpense = expensesState.find(expense => expense.id === expenseId);

    const deleteExpenseHandler = async () => {
        setIsSubmitting(true);
        try {
            await deleteExpenseBackend(expenseId);
            deleteExpense(expenseId);
            navigation.goBack();
        } catch (error) {
            setError('Could not delete expense - please try again later.');
            setIsSubmitting(false);
        }
    }

    const cancelHandler = () => {
        navigation.goBack();
    }

    const confirmHandler = async (expenseData) => {
        setIsSubmitting(true);
        try {
            if (isEditing) {
                updateExpense(expenseId, expenseData);
                await updateExpenseBackend(expenseId, expenseData);
            } else {
                const id = await storeExpense(expenseData);
                addExpense({ ...expenseData, id: id });
            }
            navigation.goBack();
        } catch (error) {
            setError('Could not save data - please try again later!');
            setIsSubmitting(false);
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Edit Expense' : 'Add Expense'
        });
    }, []);

    const errorHandler = () => {
        setError(null);
    }

    if (error && !isSubmitting) {
        return <ErrorOverlay message={error} onConfirm={errorHandler} />
    }

    if (isSubmitting) {
        return <LoadingOverlay />
    }

    return (
        <View style={styles.container}>
            <ExpenseForm
                onCancel={cancelHandler}
                submitButtonLabel={isEditing ? 'Update' : 'Add'}
                onSubmit={confirmHandler}
                defaultValues={selectedExpense}
            />
            {isEditing &&
                <View style={styles.deleteContainer}>
                    <IconButton
                        icon="trash"
                        size={36}
                        color={GlobalStyles.colors.error500}
                        onPress={deleteExpenseHandler}
                    />
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary800
    },
    deleteContainer: {
        marginTop: 16,
        paddingTop: 8,
        borderTopWidth: 2,
        borderTopColor: GlobalStyles.colors.primary200,
        alignItems: 'center'
    }
})

export default ManageExpenses;