// backend/controllers/chatBotController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Expense = require('../models/Expense');

// Access your API key as an environment variable (recommended)
const genAI = new GoogleGenerativeAI('AIzaSyB2K9fINC79p6dEYtLE6T0-QZd9BluRM9E');

async function getExpensesByUser(userId) {
    try {
        console.log("Fetching expenses for user:", userId);
        const expenses = await Expense.find({ user: userId });
        console.log("Expenses found:", expenses);
        return expenses;
    } catch (error) {
        console.error('Error getting expenses:', error);
        throw error;
    }
}

async function generateChatResponse(userId, prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Updated model name

        // Get user's expenses
        const userExpenses = await getExpensesByUser(userId);

        // Format expenses for the prompt
        const expensesString = userExpenses.map(expense => {
            return `${expense.date.toISOString().split('T')[0]} - ${expense.category}: ${expense.name} - $${expense.cost}`;
        }).join('\n');

        // Create a personalized prompt
        const personalizedPrompt = `
      You are a helpful financial advisor.
      Here are the user's expenses:
      ${expensesString}

      Based on this information, please respond to the following user query:
      ${prompt}
    `;

        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(personalizedPrompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error('Error generating chat response:', error);
        throw error;
    }
}

module.exports = { generateChatResponse };
