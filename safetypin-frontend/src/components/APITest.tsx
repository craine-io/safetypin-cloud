import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import apiService from '../services/api';

interface APIStatus {
  status: string;
  message: string;
  timestamp: string;
}

const APITest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<APIStatus | null>(null);
  const [customUrl, setCustomUrl] = useState<string>('');

  // Environment information
  const configuredApiUrl = apiService.getBaseUrl();
  const isDocker = process.env.REACT_APP_RUNTIME_ENV === 'docker';
  const mockDataEnabled = process.env.REACT_APP_USE_MOCK_DATA === 'true';

  const checkAPIStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      // Display the URL being called for debugging
      const apiUrl = `${configuredApiUrl}/api/status`;
      console.log('Attempting to connect to:', apiUrl);

      const status = await apiService.get<APIStatus>('/api/status');
      setApiStatus(status);
      console.log('API Status:', status);
    } catch (err: Error | unknown) {
      console.error('API connection error:', err);
      let errorMessage = 'Failed to connect to the API server.';

      // Extract more detailed error information
      if (err.message) {
        errorMessage += ` Error: ${err.message}`;
      }

      if (err.response) {
        errorMessage += ` Status: ${err.response.status}`;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const testCustomUrl = async () => {
    if (!customUrl) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Testing custom URL:', customUrl);
      // Use fetch directly instead of axios to avoid CORS issues
      const response = await fetch(`${customUrl}/health`);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Custom URL response:', data);

      setApiStatus({
        status: data.status || 'unknown',
        message: 'Connected to custom URL successfully',
        timestamp: data.timestamp || new Date().toISOString(),
      });
    } catch (err: Error | unknown) {
      console.error('Custom URL test error:', err);
      setError(`Failed to connect to custom URL: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAPIStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        API Connection Test
      </Typography>

      {/* Environment Information */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Environment Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Configured API URL:</strong> {configuredApiUrl}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Running in Docker:</strong> {isDocker ? 'Yes' : 'No'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Mock Data:</strong> {mockDataEnabled ? 'Enabled' : 'Disabled'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Node Environment:</strong> {process.env.NODE_ENV}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {loading && (
        <Box display="flex" alignItems="center" my={2}>
          <CircularProgress size={24} sx={{ mr: 2 }} />
          <Typography>Checking API connection...</Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      )}

      {apiStatus && !loading && !error && (
        <Alert severity="success" sx={{ my: 2 }}>
          <Typography variant="subtitle1">API Status: {apiStatus.status}</Typography>
          <Typography variant="body2">{apiStatus.message}</Typography>
          <Typography variant="caption">
            Last updated: {new Date(apiStatus.timestamp).toLocaleString()}
          </Typography>
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="contained" onClick={checkAPIStatus} disabled={loading}>
          Test Configured API
        </Button>

        <Button
          variant="outlined"
          onClick={() => window.open(`${configuredApiUrl}/health`, '_blank')}
        >
          Open API Directly
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Custom URL testing */}
      <Typography variant="h6" gutterBottom>
        Test Custom API URL
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        If the configured URL isn&apos;t working, try a direct URL to the backend service.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Custom API URL"
            placeholder="http://localhost:3000"
            value={customUrl}
            onChange={e => setCustomUrl(e.target.value)}
            size="small"
            helperText="Enter a complete URL with protocol (http://)"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="secondary"
            onClick={testCustomUrl}
            disabled={loading || !customUrl}
            fullWidth
            sx={{ height: '40px' }}
          >
            Test Custom URL
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Common Test URLs:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setCustomUrl('http://localhost:3000')}
          >
            localhost:3000
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setCustomUrl('http://127.0.0.1:3000')}
          >
            127.0.0.1:3000
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setCustomUrl('http://backend:3000')}
          >
            backend:3000
          </Button>
        </Box>

        {isDocker && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              In Docker development environment, the API is configured to use{' '}
              <strong>localhost:3000</strong> for docker-compose compatibility. If the API is not
              responding, ensure the backend container is running and ports are correctly mapped.
            </Typography>
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default APITest;
