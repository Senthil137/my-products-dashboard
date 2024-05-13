import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Paper from '@mui/material/Paper';
import { PieChartCompProps, Product, ChartData as CategoryData } from '../utils/types';
import * as endpointsURL from  '../utils/endPoints';
import axios from 'axios';

type CategoryCount = Record<string, number>
const PieChartComponent = (props: PieChartCompProps) => {
  const [chartData, setChartData] = useState<CategoryData[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount>({});

  useEffect(() => {
    axios.get(endpointsURL.getProducts)
      .then(response => {
        const counts: Record<string, number> = {};
        response.data.products.forEach((product: Product) => {
          const category = product.category;
          counts[category] = (counts[category] || 0) + 1;
          setCategoryCounts(counts) // get all products and calculate products cound based on the category 
        });
      })
      .catch(error => console.error('Error:', error));
  }, [])

  useEffect(() => {
    if (props.categories.length) {
      const data = props.categories.map(category => {
        return { name: category, y: categoryCounts[category] || 0}
      })
      /**
       * display products count category wise
       * Dispay all categories even if no products exist in the category
       * */
      setChartData(data)
    }
  }, [props.categories, categoryCounts]);

  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      height: 950
    },
    title: {
      text: 'Product Categories'
    },
    series: [
      {
        type: 'pie',
        data: chartData,
        dataLabels: {
          padding: 0,
          style: {
            fontSize: '8px'
          }
        },
      }, 
    ]
  };

  return (
    <Paper>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Paper>
  );
};

export default PieChartComponent;
