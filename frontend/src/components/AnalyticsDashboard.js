import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import '../App.css';

Chart.register(ArcElement, Tooltip, Legend);

const AnalyticsDashboard = ({ expenses }) => {
  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + Number(expense.amount);
    return acc;
  }, {});

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: '₹ Spent',
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#E7E9ED',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="analytics-container">
      <h3 className="analytics-title">📊 Expense Analytics</h3>
      <div className="chart-wrapper">
        <Pie data={data} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
