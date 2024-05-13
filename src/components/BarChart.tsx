import React, { useState, useEffect, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Select, MenuItem, FormControl, InputLabel, Button, OutlinedInput, SelectChangeEvent, Backdrop, CircularProgress, Snackbar, SnackbarCloseReason } from '@mui/material';
import { Clear } from '@mui/icons-material';
import axios from 'axios';
import styled from 'styled-components';
import PieChartComponent from './PieChart';
import { handleErrors } from '../utils/utilityFunctions';
import { Category, ChartData, Product } from '../utils/types';
import * as endpointsURL from '../utils/endPoints';

const Container = styled.div`
display: flex;
justifyContent: space-between;
`
const FormContainer = styled.div`
padding-left: 10px;
width: 30%;
`
const ChartContainer = styled.div`
padding-left: 10px;
width: 65%;
`
const StyledButton = styled(Button)`
&.MuiButton-root {
margin-top: 20px;
text-transform: none;
}
`

const ChartComponent: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [pieChartData, setPieChartData] = useState<Category[]>([]);
  const [runButtonDisabled, setRunButtonDisabled] = useState<Boolean>(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(endpointsURL.getCategories);
        setCategories(response.data);
      } catch (error) {
        const errMessage = handleErrors(error as Error)
        setError(errMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setPieChartData(categories);
  }, [categories])

  useEffect(() => {
    if (selectedCategory) {
      setRunButtonDisabled(false);
      const fetchData = async () => {
        try {
          const response = await axios.get(endpointsURL.getSelectedCategoryProduts(selectedCategory));
          setProducts(response.data.products);
        } catch (error) {
          const errMessage = handleErrors(error as Error)
          setError(errMessage);
          setOpen(true);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else setRunButtonDisabled(true);
  }, [selectedCategory]);

  const selecedProductChartData = useMemo(() => {
    return products?.filter((product) => selectedProducts.includes(product.id))
  }, [selectedProducts, products])

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory((prevState) => {
      if (event.target.value !== prevState) {
        setRunButtonDisabled(false)
      }
      return event.target.value as string;
    });
    setSelectedProducts([]);
  };

  const handleProductChange = (event: SelectChangeEvent<typeof selectedProducts>) => {
    setSelectedProducts((prevState) => {
      if (event.target.value.toString() !== prevState.toString()) {
        setRunButtonDisabled(false)
      }
      return event.target.value as typeof selectedProducts
    });
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleClearButton = () => {
    setSelectedCategory('');
    setSelectedProducts([]);
    setChartData([])
  }

  const handleClearProducts = () => {
    setSelectedProducts((prevState) => {
      if (prevState.length !== 0) {
        setRunButtonDisabled(false)
      }
      return [];
    });
  }

  const handleGenerateChart = () => {
    setLoading(true)
    setRunButtonDisabled(true);
    const data = selectedProducts.length ? selecedProductChartData : products;
    const formChartData = data.map(product => ({ name: product.title, y: product.price }));
    setTimeout(() => {
      setChartData(formChartData);
      setLoading(false)
    }, 3000);  // display loader for 3 seconds then set chart data
  };

  const options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Products in selected Category'
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: 'Price'
      },
    },
    series: [{
      name: 'Price',
      data: chartData,
      dataLabels: {
        enabled: true,
        crop: false,
        format: "${y}",
        overflow: 'none',
        style: {
          fontSize: '10px',
        },
      }
    }]
  };
  return (
    <Container>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} message={error} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} />
      <Backdrop open={loading} style={{ color: '#fff', zIndex: 100 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <FormContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Filters</h2>
          <StyledButton onClick={handleClearButton}> Clear </StyledButton>
        </div>
        <FormControl style={{ marginTop: '1em' }} fullWidth>
          <InputLabel>Category</InputLabel>
          <Select value={selectedCategory} onChange={handleCategoryChange} input={<OutlinedInput notched label="Category" endAdornment={<Clear fontSize="small" style={{ paddingRight: '10px', cursor: 'pointer' }} onClick={handleClearButton} />} />}>
            {categories.map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{ marginTop: '1em' }} fullWidth>
          <InputLabel>Products</InputLabel>
          <Select multiple value={selectedProducts} onChange={handleProductChange} displayEmpty input={<OutlinedInput notched label="Products" endAdornment={<Clear fontSize="small" style={{ paddingRight: '10px', cursor: 'pointer' }} onClick={handleClearProducts} />} />} disabled={Boolean(!selectedCategory)}>
            {products.map(product => (
              <MenuItem key={product.id} value={product.id}>{product.title}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <StyledButton variant="contained" onClick={handleGenerateChart} disabled={Boolean(runButtonDisabled)}>
          Run Report
        </StyledButton>
      </FormContainer>
      <ChartContainer>
        {chartData.length > 0 ? <HighchartsReact highcharts={Highcharts} options={options} /> : <PieChartComponent categories={pieChartData} />}
      </ChartContainer>
    </Container>
  );
};
export default ChartComponent;