import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import InfoIcon from '@mui/icons-material/Info';
import ShieldIcon from '@mui/icons-material/Shield';
import StarIcon from '@mui/icons-material/Star';
import StorageIcon from '@mui/icons-material/Storage';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';

import PageHeader from '../layout/PageHeader';
// AppEdition is imported by other components that use this feature flag
// import { AppEdition } from "../../config/features";

const BillingOSS: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <PageHeader
        title="SafetyPin Cloud: OSS Edition"
        breadcrumbs={[{ text: 'Home', href: '/' }, { text: 'OSS Edition' }]}
      />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              You are using the Open Source (OSS) Edition of SafetyPin Cloud
            </Typography>
            <Typography variant="body2">
              SafetyPin Cloud: OSS Edition is distributed under the AGPL v3.0 license for
              non-commercial use. For commercial use, a separate license is required.
            </Typography>
          </Alert>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="OSS Edition Features"
              subheader="All features included in the open source version"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Core Features
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary="Unlimited SFTP servers" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary="Unlimited storage" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary="SFTP to S3 connectivity" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary="User management" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary="Basic security features" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary="File transfer monitoring" />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Self-Hosting Requirements
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <StorageIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="AWS Account"
                          secondary="For S3 storage and Transfer Family"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CloudDownloadIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="PostgreSQL Database"
                          secondary="For application data storage"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <ShieldIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="SSL Certificate"
                          secondary="For secure connections"
                        />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  SafetyPin OSS is an open-source project that makes secure SFTP file transfers
                  accessible to everyone. It&apos;s free to use for non-commercial purposes under
                  the AGPL v3.0 license.
                </Typography>
                <Typography variant="body1" gutterBottom>
                  For commercial use, please consider purchasing a commercial license to support the
                  ongoing development of SafetyPin.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card>
              <CardHeader
                title="Commercial Editions"
                subheader="For business and enterprise use"
                avatar={<BusinessIcon color="primary" />}
              />
              <Divider />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Benefits of Commercial Editions
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <StarIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Commercial use licensing" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <StarIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Technical support" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <StarIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Advanced security features" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <StarIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Multi-tenant capabilities" />
                    </ListItem>
                  </List>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  component={Link}
                  href="https://safetypin.cloud/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 2 }}
                >
                  Learn About Commercial Options
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                title="Support The Project"
                subheader="Help SafetyPin Cloud: OSS Edition grow"
                avatar={<FavoriteBorderIcon color="error" />}
              />
              <Divider />
              <CardContent>
                <Typography variant="body2" paragraph>
                  SafetyPin Cloud: OSS Edition is maintained by a dedicated team of developers. Your
                  support helps us continue improving the project.
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    component={Link}
                    href="https://github.com/craine-io/safetypin-cloud"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mb: 1 }}
                  >
                    Star on GitHub
                  </Button>

                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    component={Link}
                    href="https://github.com/craine-io/safetypin-oss/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Report Issues
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BillingOSS;
