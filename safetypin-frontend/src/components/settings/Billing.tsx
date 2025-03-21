import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import PageHeader from "../layout/PageHeader";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import GetAppIcon from "@mui/icons-material/GetApp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
}

interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex";
  last4: string;
  expiry: string;
  isDefault: boolean;
}

const Billing: React.FC = () => {
  // Mock data
  const currentPlan = {
    name: "Pro Plan",
    price: "$49.99/month",
    storage: "100 GB",
    transfer: "1 TB",
    servers: "10",
    nextBillingDate: "April 15, 2025",
    storageUsed: 65, // percentage
  };

  const [invoices] = useState<Invoice[]>([
    {
      id: "INV-001",
      date: "Mar 01, 2025",
      amount: 49.99,
      status: "paid",
    },
    {
      id: "INV-002",
      date: "Feb 01, 2025",
      amount: 49.99,
      status: "paid",
    },
    {
      id: "INV-003",
      date: "Jan 01, 2025",
      amount: 49.99,
      status: "paid",
    },
    {
      id: "INV-004",
      date: "Dec 01, 2024",
      amount: 49.99,
      status: "paid",
    },
  ]);

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm-001",
      type: "visa",
      last4: "4242",
      expiry: "04/27",
      isDefault: true,
    },
    {
      id: "pm-002",
      type: "mastercard",
      last4: "5555",
      expiry: "08/26",
      isDefault: false,
    },
  ]);

  // Dialog states
  const [openUpgradeDialog, setOpenUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("business");

  const handlePlanChange = (event: SelectChangeEvent) => {
    setSelectedPlan(event.target.value as string);
  };

  const handleClickUpgrade = () => {
    setOpenUpgradeDialog(true);
  };

  const handleCloseUpgrade = () => {
    setOpenUpgradeDialog(false);
  };

  const handleUpgrade = () => {
    console.log("Upgrade to:", selectedPlan);
    setOpenUpgradeDialog(false);
    // In a real app, this would upgrade the plan
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "error";
      default:
        return "default";
    }
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case "visa":
        return "Visa";
      case "mastercard":
        return "MasterCard";
      case "amex":
        return "Amex";
      default:
        return "Card";
    }
  };

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Billing & Subscription"
        breadcrumbs={[{ text: "Home", href: "/" }, { text: "Billing" }]}
        action={{
          text: "Upgrade Plan",
          icon: <AddIcon />,
          onClick: handleClickUpgrade,
        }}
      />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardHeader 
              title="Current Plan" 
              subheader="Details about your current subscription"
              avatar={<AccountBalanceWalletIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h5" color="primary">{currentPlan.name}</Typography>
                <Typography variant="h5">{currentPlan.price}</Typography>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">Storage</Typography>
                  <Typography variant="body1">{currentPlan.storage}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">Data Transfer</Typography>
                  <Typography variant="body1">{currentPlan.transfer}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">SFTP Servers</Typography>
                  <Typography variant="body1">{currentPlan.servers}</Typography>
                </Grid>
              </Grid>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Storage Usage
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={currentPlan.storageUsed} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      bgcolor: "secondary.light",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 5,
                        bgcolor: currentPlan.storageUsed > 90 ? "error.main" : 
                                currentPlan.storageUsed > 75 ? "warning.main" : "primary.main",
                      }
                    }}
                  />
                </Box>
                <Box minWidth={35}>
                  <Typography variant="body2" color="text.secondary">{`${Math.round(currentPlan.storageUsed)}%`}</Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
                Your next billing date is {currentPlan.nextBillingDate}
              </Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader 
              title="Payment Methods" 
              subheader="Manage your payment methods"
              avatar={<CreditCardIcon color="primary" />}
              action={
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                >
                  Add Method
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Stack spacing={2}>
                {paymentMethods.map((method) => (
                  <Box 
                    key={method.id}
                    sx={{ 
                      p: 2, 
                      border: 1, 
                      borderColor: "divider", 
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="body1" sx={{ mr: 1 }}>
                        {getCardIcon(method.type)}
                      </Typography>
                      <Typography variant="body1">
                        •••• {method.last4}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                        Expires {method.expiry}
                      </Typography>
                      {method.isDefault && (
                        <Chip 
                          label="Default" 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ ml: 2 }}
                        />
                      )}
                    </Box>
                    <Box>
                      <Button size="small">Edit</Button>
                      {!method.isDefault && (
                        <Button size="small" color="error">Remove</Button>
                      )}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader 
              title="Billing History" 
              subheader="View and download past invoices"
              avatar={<ReceiptIcon color="primary" />}
            />
            <Divider />
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell component="th" scope="row">
                        {invoice.id}
                      </TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell align="right">${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={invoice.status} 
                          size="small"
                          color={getStatusColor(invoice.status) as "success" | "warning" | "error" | "default"}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          startIcon={<GetAppIcon />}
                        >
                          PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider />
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Button
                startIcon={<VisibilityIcon />}
              >
                View All Invoices
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
      
      <Dialog open={openUpgradeDialog} onClose={handleCloseUpgrade}>
        <DialogTitle>Upgrade Your Plan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose a plan that best fits your needs. You can upgrade or downgrade at any time.
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="plan-select-label">Plan</InputLabel>
            <Select
              labelId="plan-select-label"
              value={selectedPlan}
              label="Plan"
              onChange={handlePlanChange}
            >
              <MenuItem value="starter">Starter Plan - $19.99/month</MenuItem>
              <MenuItem value="pro">Pro Plan - $49.99/month</MenuItem>
              <MenuItem value="business">Business Plan - $99.99/month</MenuItem>
              <MenuItem value="enterprise">Enterprise Plan - $199.99/month</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpgrade}>Cancel</Button>
          <Button onClick={handleUpgrade} variant="contained" color="primary">
            Upgrade
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Billing;