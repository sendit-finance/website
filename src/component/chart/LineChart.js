import { useState, useCallback } from 'react'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import { en } from 'date-fns/locale'

const chartConfig = {
  type: 'line',
  cubicInterpolationMode: 'default',
  data: {
    datasets: [
      {
        label: 'Value',
        data: [],
        borderColor: '#51FFAA',
        borderWidth: 3
      }
    ]
  },
  options: {
    elements: {
      line: {
        tension: 0.2
      }
    },
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day'
        },
        ticks: {
          source: 'auto'
        }
      }
    }
  }
}

const LineChart = ({ data }) => {
  const [chartInstance, setChartInstance] = useState(null)

  const chartContainer = useCallback(
    (node) => {
      if (node === null) return

      let chart
      if (!chartInstance) {
        chart = new Chart(node, chartConfig)
        setChartInstance(chart)
      } else {
        chart = chartInstance
      }

      if (data) {
        chart.data.datasets[0].data = data
        chart.update()
      }
    },
    [data.length]
  )

  return (
    <div className="relative">
      <canvas ref={chartContainer} className="h-full w-full" />
    </div>
  )
}

export default LineChart
