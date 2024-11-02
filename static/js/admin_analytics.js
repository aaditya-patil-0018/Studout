'use strict';

const CHART_COLORS = {
    primary: '#2563eb',
    primaryLight: 'rgba(37, 99, 235, 0.1)',
    success: 'rgba(34, 197, 94, 0.8)',
    danger: 'rgba(239, 68, 68, 0.8)',
    border: '#757575',
    gridLine: 'rgba(0, 0, 0, 0.1)'
};

const CHART_CONFIG = {
    userGrowth: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [500, 800, 1000, 1200, 1500, 1234]
    },
    recommendations: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [120, 150, 180, 210, 240, 270]
    },
    userActivity: {
        labels: ['Active', 'Suspended'],
        data: [85, 15]
    }
};

const setSpacerHeight = () => {
    const elements = {
        navbar: document.getElementById('navbar'),
        spacer: document.getElementById('spacer')
    };

    if (elements.navbar && elements.spacer) {
        elements.spacer.style.height = `${elements.navbar.offsetHeight}px`;
    }
};

// Chart creation functions
const createUserGrowthChart = () => {
    const ctx = document.getElementById('userGrowthChart')?.getContext('2d');
    if (!ctx) return;

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: CHART_CONFIG.userGrowth.labels,
            datasets: [{
                label: 'Total Users',
                data: CHART_CONFIG.userGrowth.data,
                borderColor: CHART_COLORS.primary,
                backgroundColor: CHART_COLORS.primaryLight,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: CHART_COLORS.gridLine }
                },
                x: { grid: { display: false } }
            }
        }
    });
};

const createRecommendationChart = () => {
    const ctx = document.getElementById('recommendationChart')?.getContext('2d');
    if (!ctx) return;

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: CHART_CONFIG.recommendations.labels,
            datasets: [{
                label: 'Recommendations',
                data: CHART_CONFIG.recommendations.data,
                backgroundColor: CHART_COLORS.primaryLight,
                borderColor: CHART_COLORS.border,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: CHART_COLORS.gridLine }
                },
                x: { grid: { display: false } }
            }
        }
    });
};

const createUserActivityChart = () => {
    const ctx = document.getElementById('userActivityChart')?.getContext('2d');
    if (!ctx) return;

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: CHART_CONFIG.userActivity.labels,
            datasets: [{
                data: CHART_CONFIG.userActivity.data,
                backgroundColor: [CHART_COLORS.success, CHART_COLORS.danger]
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } }
        }
    });
};

const handleTimePeriodChange = (e) => {
    // Here ftch new data based on the selected time period
    console.log('Selected time period:', e.target.value);
    // TODO: Implement data fetching and chart updating logic
};

document.addEventListener('DOMContentLoaded', () => {
    setSpacerHeight();
    createUserGrowthChart();
    createRecommendationChart();
    createUserActivityChart();

    window.addEventListener('resize', setSpacerHeight);
    document.getElementById('timePeriod')?.addEventListener('change', handleTimePeriodChange);
});
