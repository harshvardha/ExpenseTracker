import axios from "axios";

const BACKEND_URL = 'https://expensetracker-acd41-default-rtdb.firebaseio.com/';

export const storeExpense = async (expenseData) => {
    const response = await axios.post(`${BACKEND_URL}/expenses.json`, expenseData);
    const id = response.data.name;
    return id;
}

export const fetchExpenses = async () => {
    const response = await axios.get(`${BACKEND_URL}/expenses.json`);
    const expenses = [];
    for (const key in response.data) {
        const expenseObJ = {
            id: key,
            amount: response.data[key].amount,
            date: response.data[key].date,
            description: response.data[key].description
        };
        expenses.push(expenseObJ);
    }
    return expenses;
}

export const updateExpenseBackend = (id, expenseData) => {
    return axios.put(`${BACKEND_URL}/expenses/${id}.json`, expenseData);
}

export const deleteExpenseBackend = (id) => {
    return axios.delete(`${BACKEND_URL}/expenses/${id}.json`)
}