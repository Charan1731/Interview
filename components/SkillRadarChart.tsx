"use client";

import React, { useState } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface SkillDataItem {
  name: string;
  score: number;
}

interface SkillRadarChartProps {
  skillData: SkillDataItem[];
  previousSkillData?: SkillDataItem[];
}

const SkillRadarChart = ({ skillData, previousSkillData }: SkillRadarChartProps) => {
  const [showComparison, setShowComparison] = useState(false);
  
  // Only show comparison if we have previous skill data and the toggle is on
  const shouldShowComparison = showComparison && previousSkillData && previousSkillData.length > 0;
  
  // Format the data for the radar chart
  const chartData: ChartData<'radar'> = {
    labels: skillData.map(item => item.name),
    datasets: [
      {
        label: 'Current Skills',
        data: skillData.map(item => item.score),
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
        borderColor: 'rgba(124, 58, 237, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(124, 58, 237, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(124, 58, 237, 1)',
      },
      ...(shouldShowComparison ? [
        {
          label: 'Previous Skills',
          data: skillData.map(item => {
            // Find matching skill in previous data
            const prevSkill = previousSkillData.find(prev => prev.name === item.name);
            return prevSkill ? prevSkill.score : 0;
          }),
          backgroundColor: 'rgba(252, 211, 77, 0.1)', // Amber/yellow color
          borderColor: 'rgba(252, 211, 77, 0.6)',
          borderWidth: 2,
          borderDash: [5, 5],
          pointBackgroundColor: 'rgba(252, 211, 77, 0.8)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(252, 211, 77, 1)',
        }
      ] : []),
    ],
  };

  // Chart options
  const chartOptions: ChartOptions<'radar'> = {
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          display: false,
          stepSize: 20,
        },
        pointLabels: {
          font: {
            size: 11, 
          },
          color: 'rgba(255, 255, 255, 0.7)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        display: shouldShowComparison,
        position: 'bottom',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11,
          },
          boxWidth: 15,
          padding: 10,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.r}/100`;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-full flex flex-col">
      {previousSkillData && previousSkillData.length > 0 && (
        <div className="flex justify-center mb-2">
          <button 
            onClick={() => setShowComparison(!showComparison)}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              showComparison 
                ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' 
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
            }`}
          >
            {showComparison ? 'Hide Comparison' : 'Show Progress'}
          </button>
        </div>
      )}
      <div className="flex-1">
        <Radar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default SkillRadarChart; 