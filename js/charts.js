/**
 * AlignED Chart Rendering Module
 *
 * Loads benchmark data from per-eval JSON files and renders Chart.js charts
 * on the results page. Each evaluation has its own data file and model pool.
 * There is no composite score.
 *
 * Page detection uses document.body.dataset.page to determine which charts
 * to render. Only the results page has charts.
 */

/* ── Provider color mapping ── */
const PROVIDER_COLORS = {
  'Anthropic': '#D97757',
  'OpenAI':    '#10A37F',
  'Google':    '#4285F4',
  'Meta':      '#0668E1',
  'DeepSeek':  '#536DFE',
  'Mistral':   '#F97316'
};

/**
 * Returns the brand color for a given provider name.
 * Falls back to grey if the provider is unknown.
 *
 * @param {string} provider - Provider name (e.g. "Anthropic")
 * @returns {string} Hex color code
 */
function getProviderColor(provider) {
  return PROVIDER_COLORS[provider] || '#6B7280';
}

/* ── Data loaders ── */

/**
 * Fetches and parses the neuromyths scores JSON file.
 *
 * @returns {Promise<Array>} Array of neuromyth result objects
 */
async function loadNeuromythsData() {
  const response = await fetch('data/neuromyths_scores.json');
  const json = await response.json();
  return json.results;
}

/**
 * Fetches and parses the scenarios scores JSON file.
 *
 * @returns {Promise<Array>} Array of scenario result objects
 */
async function loadScenariosData() {
  const response = await fetch('data/scenarios_scores.json');
  const json = await response.json();
  return json.results;
}

/**
 * Fetches and parses the pedagogy scores JSON file.
 *
 * @returns {Promise<Array>} Array of pedagogy result objects
 */
async function loadPedagogyData() {
  const response = await fetch('data/pedagogy_scores.json');
  const json = await response.json();
  return json.results;
}

/**
 * Fetches and parses the ACARA comparative judgement scores JSON file.
 *
 * @returns {Promise<Array>} Array of ACARA CJ result objects
 */
async function loadAcaraData() {
  const response = await fetch('data/acara_scores.json');
  const json = await response.json();
  return json.results;
}

/**
 * Fetches and parses the ACARA standards-based grading scores JSON file.
 *
 * @returns {Promise<Array>} Array of ACARA SG result objects
 */
async function loadAcaraSgData() {
  const response = await fetch('data/acara_standards_grading_scores.json');
  const json = await response.json();
  return json.results;
}

/**
 * Fetches and parses the model metadata JSON file (release dates, costs, tokens).
 *
 * @returns {Promise<Array>} Array of model metadata objects
 */
async function loadModelMetadata() {
  const response = await fetch('data/model_metadata.json');
  const json = await response.json();
  return json.models;
}

/* ── Chart rendering functions ── */

/**
 * Renders a vertical bar chart showing all models for a given metric.
 * Used on the results page for detailed breakdowns.
 *
 * @param {string} canvasId - The id of the <canvas> element
 * @param {Array} data - Array of model objects
 * @param {string} metric - The field name to chart (e.g. "score_pct")
 * @param {string} label - Human-readable axis label
 * @param {Object} options - Optional overrides (e.g. { yMin: 0 })
 */
function renderAllModelsChart(canvasId, data, metric, label, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  /* Sort by the chosen metric descending */
  const sorted = [...data]
    .filter(m => m[metric] != null)
    .sort((a, b) => b[metric] - a[metric]);

  const labels = sorted.map(m => m.model);
  const values = sorted.map(m => m[metric]);
  const colors = sorted.map(m => getProviderColor(m.provider));

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderRadius: 4,
        barPercentage: 0.85
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) { return ctx.raw.toFixed(1) + '%'; }
          }
        }
      },
      scales: {
        y: {
          min: options.yMin != null ? options.yMin : 50,
          max: 100,
          grid: { color: '#E8E4DF' },
          ticks: {
            callback: function(v) { return v + '%'; },
            font: { size: 11 }
          }
        },
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 9 },
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  });
}

/**
 * Renders a grouped bar chart for ACARA CJ results showing accuracy
 * and reliability side by side for each model.
 *
 * @param {string} canvasId - The id of the <canvas> element
 * @param {Array} data - Array of ACARA CJ result objects
 */
function renderAcaraChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  /* Sort by accuracy descending */
  const sorted = [...data].sort((a, b) => b.accuracy - a.accuracy);

  const labels = sorted.map(m => m.model);
  const accuracyValues = sorted.map(m => m.accuracy);
  const reliabilityValues = sorted.map(m => m.reliability);
  const barColors = sorted.map(m => getProviderColor(m.provider));

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Accuracy',
          data: accuracyValues,
          backgroundColor: barColors,
          borderRadius: 4,
          barPercentage: 0.8
        },
        {
          label: 'Position-Swap Consistency',
          data: reliabilityValues,
          backgroundColor: barColors.map(c => c + '80'),
          borderRadius: 4,
          barPercentage: 0.8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { font: { size: 12 } }
        },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return ctx.dataset.label + ': ' + ctx.raw.toFixed(1) + '%';
            }
          }
        }
      },
      scales: {
        y: {
          min: 50,
          max: 100,
          grid: { color: '#E8E4DF' },
          ticks: {
            callback: function(v) { return v + '%'; },
            font: { size: 11 }
          }
        },
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 9 },
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  });
}

/**
 * Renders a grouped bar chart for ACARA Standards-Based Grading results.
 * Shows per-level accuracy (Above Satisfactory, Satisfactory, Below Satisfactory)
 * for each model, sorted by overall accuracy.
 *
 * @param {string} canvasId - The id of the <canvas> element
 * @param {Array} data - Array of ACARA SG result objects
 */
function renderAcaraSgChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  /* Sort by overall accuracy descending */
  const sorted = [...data].sort((a, b) => b.overall_accuracy - a.overall_accuracy);

  const labels = sorted.map(m => m.model);

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Above Satisfactory',
          data: sorted.map(m => m.above_sat_accuracy),
          backgroundColor: '#EF4444',
          borderRadius: 4,
          barPercentage: 0.8
        },
        {
          label: 'Satisfactory',
          data: sorted.map(m => m.sat_accuracy),
          backgroundColor: '#F59E0B',
          borderRadius: 4,
          barPercentage: 0.8
        },
        {
          label: 'Below Satisfactory',
          data: sorted.map(m => m.below_sat_accuracy),
          backgroundColor: '#10B981',
          borderRadius: 4,
          barPercentage: 0.8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { font: { size: 11 } }
        },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return ctx.dataset.label + ': ' + ctx.raw.toFixed(1) + '%';
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: { color: '#E8E4DF' },
          ticks: {
            callback: function(v) { return v + '%'; },
            font: { size: 11 }
          }
        },
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 9 },
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  });
}

/**
 * Renders a scatter/timeline chart showing model release dates on the X axis
 * and a score metric on the Y axis. Each point is colored by provider.
 *
 * @param {string} canvasId - The id of the <canvas> element
 * @param {Array} scoreData - Array of model objects with the score metric
 * @param {string} scoreField - The field name for the Y axis value
 * @param {string} yLabel - Human-readable Y axis label
 * @param {Array} metadataArr - Array of model metadata objects with release_date
 */
function renderTimelineChart(canvasId, scoreData, scoreField, yLabel, metadataArr) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  /* Build a lookup from model name to metadata */
  const metaMap = {};
  metadataArr.forEach(m => { metaMap[m.model] = m; });

  /* Build scatter data points: x = release date as timestamp, y = score */
  const points = [];
  scoreData.forEach(m => {
    const meta = metaMap[m.model];
    if (!meta || !meta.release_date || m[scoreField] == null) return;

    /* Parse YYYY-MM to a date (use 15th of month as midpoint) */
    const parts = meta.release_date.split('-');
    const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 15);

    points.push({
      x: dateObj.getTime(),
      y: m[scoreField],
      model: m.model,
      provider: m.provider,
      color: getProviderColor(m.provider)
    });
  });

  /* Sort by date for readability */
  points.sort((a, b) => a.x - b.x);

  new Chart(canvas, {
    type: 'scatter',
    data: {
      datasets: [{
        data: points.map(p => ({ x: p.x, y: p.y })),
        backgroundColor: points.map(p => p.color),
        borderColor: points.map(p => p.color),
        pointRadius: 7,
        pointHoverRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: function(items) {
              const idx = items[0].dataIndex;
              return points[idx].model;
            },
            label: function(ctx) {
              const idx = ctx.dataIndex;
              const d = new Date(points[idx].x);
              const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
              return [
                points[idx].provider,
                monthNames[d.getMonth()] + ' ' + d.getFullYear(),
                'Score: ' + points[idx].y.toFixed(1) + '%'
              ];
            }
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'quarter',
            displayFormats: { quarter: 'MMM yyyy' }
          },
          title: { display: true, text: 'Release Date', font: { size: 12 } },
          grid: { color: '#E8E4DF' }
        },
        y: {
          min: 50,
          max: 95,
          title: { display: true, text: yLabel, font: { size: 12 } },
          grid: { color: '#E8E4DF' },
          ticks: {
            callback: function(v) { return v + '%'; },
            font: { size: 11 }
          }
        }
      }
    }
  });
}

/**
 * Renders a horizontal bar chart showing token usage per model.
 * Highlights the difference between thinking and standard models.
 *
 * @param {string} canvasId - The id of the <canvas> element
 * @param {Array} metadataArr - Array of model metadata objects with survey_scenario_tokens
 */
function renderTokenChart(canvasId, metadataArr) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  /* Filter to models with token data, sort by total tokens descending */
  const withTokens = metadataArr
    .filter(m => m.survey_scenario_tokens != null)
    .sort((a, b) => b.survey_scenario_tokens - a.survey_scenario_tokens);

  const labels = withTokens.map(m => m.model);
  const values = withTokens.map(m => m.survey_scenario_tokens);
  const colors = withTokens.map(m => getProviderColor(m.provider));

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Total Tokens (Survey + Scenarios)',
        data: values,
        backgroundColor: colors,
        borderColor: colors.map(c => c + 'CC'),
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 20,
        categoryPercentage: 0.8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return ctx.raw.toLocaleString() + ' tokens';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: '#E8E4DF' },
          ticks: {
            callback: function(v) { return (v / 1000).toFixed(0) + 'k'; },
            font: { size: 11 }
          },
          title: { display: true, text: 'Total Tokens', font: { size: 12 } }
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 10 } }
        }
      }
    }
  });
}

/* ── Page initialisation ── */
document.addEventListener('DOMContentLoaded', async function() {
  /* Only render charts on the results page */
  const page = document.body.dataset.page;
  if (page !== 'results') return;

  try {
    /* Load all per-eval data files in parallel */
    const [neuromythsData, scenariosData, pedagogyData, acaraData, acaraSgData, metadata] =
      await Promise.all([
        loadNeuromythsData(),
        loadScenariosData(),
        loadPedagogyData(),
        loadAcaraData(),
        loadAcaraSgData(),
        loadModelMetadata()
      ]);

    /* Neuromyth identification (31 models) */
    renderAllModelsChart('neuromythsChart', neuromythsData, 'score_pct', 'Neuromyth Identification');

    /* Diagnostic reasoning (30 models) */
    renderAllModelsChart('scenariosChart', scenariosData, 'score_pct', 'Diagnostic Reasoning');

    /* Teacher certification knowledge (23 models) */
    renderAllModelsChart('cdpkChart', pedagogyData, 'pedagogy_cdpk_pct', 'General Pedagogical Knowledge');
    renderAllModelsChart('sendChart', pedagogyData, 'pedagogy_send_pct', 'Inclusive Education');

    /* ACARA comparative judgement (12 models) */
    renderAcaraChart('acaraChart', acaraData);

    /* ACARA standards-based grading pilot (7 models) */
    renderAcaraSgChart('acaraSgChart', acaraSgData);

    /* Token usage chart */
    renderTokenChart('tokenChart', metadata);

    /* Timeline chart using pedagogy total score */
    renderTimelineChart(
      'timelineChart',
      pedagogyData,
      'pedagogy_total_pct',
      'Teacher Certification Knowledge (%)',
      metadata
    );
  } catch (error) {
    console.error('Failed to load chart data:', error);
  }
});
