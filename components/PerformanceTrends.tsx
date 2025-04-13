"use client";

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PerformanceTrendsProps {
  feedbacks: Array<{
    totalScore: number;
    createdAt: string;
    categoryScores: Array<{
      name: string;
      score: number;
    }>;
  }>;
}

const PerformanceTrends = ({ feedbacks }: PerformanceTrendsProps) => {
  // Sort feedbacks by date
  const sortedFeedbacks = [...feedbacks].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Format dates for x-axis
  const labels = sortedFeedbacks.map(feedback => 
    new Date(feedback.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );

  // Get total scores for main line
  const totalScores = sortedFeedbacks.map(feedback => feedback.totalScore);

  // Get average category scores
  const categories = [
    'Communication Skills',
    'Technical Knowledge',
    'Problem-Solving',
    'Cultural & Role Fit',
    'Confidence & Clarity'
  ];

  // Generate data for chart
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Overall',
        data: totalScores,
        borderColor: 'rgba(153, 148, 249, 1)', // primary-300
        backgroundColor: 'rgba(153, 148, 249, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: 'rgba(153, 148, 249, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      ...categories.map((category, index) => {
        // Get colors based on index
        const colors = [
          { color: 'rgba(124, 58, 237, 0.7)', hoverColor: 'rgba(124, 58, 237, 1)' },
          { color: 'rgba(252, 211, 77, 0.7)', hoverColor: 'rgba(252, 211, 77, 1)' },
          { color: 'rgba(239, 68, 68, 0.7)', hoverColor: 'rgba(239, 68, 68, 1)' },
          { color: 'rgba(52, 211, 153, 0.7)', hoverColor: 'rgba(52, 211, 153, 1)' },
          { color: 'rgba(59, 130, 246, 0.7)', hoverColor: 'rgba(59, 130, 246, 1)' },
        ];
        
        const categoryData = sortedFeedbacks.map(feedback => {
          const categoryScore = feedback.categoryScores.find(cs => cs.name === category);
          return categoryScore ? categoryScore.score : 0;
        });

        return {
          label: category,
          data: categoryData,
          borderColor: colors[index % colors.length].color,
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.2,
          pointRadius: 3,
          pointBackgroundColor: colors[index % colors.length].color,
          pointBorderColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          fill: false,
          hidden: true, // Start with all category lines hidden
        };
      }),
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          usePointStyle: true,
          boxWidth: 6,
          padding: 15,
        },
        onClick: function(e, legendItem, legend) {
          const index = legendItem.datasetIndex;
          if (index !== undefined) {
            const meta = legend.chart.getDatasetMeta(index);
            meta.hidden = meta.hidden === undefined || meta.hidden === false 
              ? true 
              : false;
            legend.chart.update();
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}/100`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 10
          }
        }
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 10
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.3
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  const noDataContent = (
    <div className="flex flex-col items-center justify-center h-full py-10">
      <div className="w-16 h-16 mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500">
          <path d="M3 3v18h18"></path>
          <path d="m19 9-5 5-4-4-3 3"></path>
        </svg>
      </div>
      <p className="text-neutral-400 text-center">
        Complete at least two interviews to see performance trends
      </p>
    </div>
  );

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Performance Trends</h3>
        <div className="text-xs text-neutral-400">
          Click legend items to show/hide categories
        </div>
      </div>

      {sortedFeedbacks.length < 2 ? noDataContent : (
        <div className="h-[300px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default PerformanceTrends; 