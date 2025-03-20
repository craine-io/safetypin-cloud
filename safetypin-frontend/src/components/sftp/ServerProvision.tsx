import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Switch,
  InputAdornment,
  MenuItem,
  Divider,
  Alert,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import PageHeader from "../layout/PageHeader";

// Icons
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyIcon from "@mui/icons-material/Key";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DnsIcon from "@mui/icons-material/Dns";
import TimerIcon from "@mui/icons-material/Timer";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LockIcon from "@mui/icons-material/Lock";

// Step components
const SecuritySettings = () => {
  const [ips, setIps] = useState<string[]>([""]);
  const [sshKeyOption, setSshKeyOption] = useState<string>("generate");

  const addIpField = () => {
    setIps([...ips, ""]);
  };

  const removeIpField = (index: number) => {
    const newIps = [...ips];
    newIps.splice(index, 1);
    setIps(newIps);
  };

  const handleIpChange = (index: number, value: string) => {
    const newIps = [...ips];
    newIps[index] = value;
    setIps(newIps);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Security Settings
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="medium" mb={1}>
            SSH Key
          </Typography>
          <Box mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="SSH Key Option"
                  value={sshKeyOption}
                  onChange={(e) => setSshKeyOption(e.target.value)}
                >
                  <MenuItem value="generate">Generate a new SSH key pair</MenuItem>
                  <MenuItem value="upload">Upload an existing SSH public key</MenuItem>
                </TextField>
              </Grid>
              
              {sshKeyOption === "upload" ? (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    component="label"
                    fullWidth
                  >
                    Upload SSH Public Key
                    <input type="file" hidden />
                  </Button>
                  <Typography variant="caption" color="text.secondary" mt={1} display="block">
                    Supported formats: .pub files
                  </Typography>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    We'll generate a secure SSH key pair for you. You'll be able to download the private key after server creation.
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="medium" mb={1}>
            IP Whitelist
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Only connections from these IP addresses will be allowed
          </Typography>
          
          {ips.map((ip, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2}>
              <TextField
                fullWidth
                label={`Allowed IP Address ${index + 1}`}
                placeholder="e.g., 192.168.1.1 or 10.0.0.0/24"
                value={ip}
                onChange={(e) => handleIpChange(index, e.target.value)}
                size="small"
              />
              <IconButton
                color="error"
                onClick={() => removeIpField(index)}
                disabled={ips.length === 1}
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          
          <Button
            startIcon={<AddIcon />}
            onClick={addIpField}
            size="small"
            sx={{ mt: 1 }}
          >
            Add Another IP
          </Button>
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Enable strict host key checking"
          />
        </Grid>
      </Grid>
    </>
  );
};

const ServerConfig = () => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Server Configuration
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Server Name"
            placeholder="e.g., Client-DataPipeline"
            helperText="A descriptive name to identify this connection"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Storage Size"
            defaultValue="5"
            helperText="Maximum storage capacity for this server"
          >
            <MenuItem value="1">1 GB</MenuItem>
            <MenuItem value="5">5 GB</MenuItem>
            <MenuItem value="10">10 GB</MenuItem>
            <MenuItem value="25">25 GB</MenuItem>
            <MenuItem value="50">50 GB</MenuItem>
            <MenuItem value="100">100 GB</MenuItem>
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Username"
            defaultValue="sftp-user"
            helperText="SFTP username for this connection"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Region"
            defaultValue="us-east-1"
            helperText="Where to deploy this SFTP server"
          >
            <MenuItem value="us-east-1">US East (N. Virginia)</MenuItem>
            <MenuItem value="us-west-1">US West (N. California)</MenuItem>
            <MenuItem value="eu-west-1">EU (Ireland)</MenuItem>
            <MenuItem value="ap-northeast-1">Asia Pacific (Tokyo)</MenuItem>
          </TextField>
        </Grid>
      </Grid>
    </>
  );
};

const LifecycleSettings = () => {
  const [expiryType, setExpiryType] = useState<string>("duration");
  
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Lifecycle Settings
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Connection Expiry"
            value={expiryType}
            onChange={(e) => setExpiryType(e.target.value)}
          >
            <MenuItem value="duration">Time-based (automatic expiry)</MenuItem>
            <MenuItem value="manual">Manual shutdown</MenuItem>
          </TextField>
        </Grid>
        
        {expiryType === "duration" && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration"
                defaultValue="24"
                InputProps={{
                  endAdornment: <InputAdornment position="end">hours</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="After Expiry"
                defaultValue="destroy"
              >
                <MenuItem value="destroy">Destroy server and data</MenuItem>
                <MenuItem value="preserve">Preserve data for 7 days</MenuItem>
                <MenuItem value="archive">Archive data to cold storage</MenuItem>
              </TextField>
            </Grid>
          </>
        )}
        
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Auto-terminate on file transfer completion"
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch />}
            label="Send notification when connection expires"
          />
        </Grid>
      </Grid>
    </>
  );
};

const Review = () => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Review and Create
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Please review your SFTP connection settings before creating the server.
      </Alert>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <DnsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Server Configuration
                </Typography>
              </Box>
              <Typography variant="body2">Server Name: Client-DataPipeline</Typography>
              <Typography variant="body2">Storage: 5 GB</Typography>
              <Typography variant="body2">Username: sftp-user</Typography>
              <Typography variant="body2">Region: US East (N. Virginia)</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <LockIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Security Settings
                </Typography>
              </Box>
              <Typography variant="body2">SSH Key: Generate new key pair</Typography>
              <Typography variant="body2">Whitelisted IPs: 192.168.1.1</Typography>
              <Typography variant="body2">Strict Host Key Checking: Enabled</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TimerIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Lifecycle Settings
                </Typography>
              </Box>
              <Typography variant="body2">Expiry: 24 hours</Typography>
              <Typography variant="body2">After Expiry: Destroy server and data</Typography>
              <Typography variant="body2">Auto-terminate on completion: Yes</Typography>
              <Typography variant="body2">Expiry Notification: No</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <NetworkCheckIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Estimated Costs
                </Typography>
              </Box>
              <Typography variant="body2">Server: $0.10/hour × 24 hours = $2.40</Typography>
              <Typography variant="body2">Storage: 5 GB × $0.10/GB = $0.50</Typography>
              <Typography variant="body2">Data Transfer: $0.00 (Up to 1 GB free)</Typography>
              <Typography variant="body2" fontWeight="bold" mt={1}>
                Total Estimated Cost: $2.90
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

// Success dialog component
interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
  serverDetails: {
    host: string;
    port: number;
    username: string;
  };
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ open, onClose, serverDetails }) => {
  const handleCopyHost = () => {
    navigator.clipboard.writeText(`${serverDetails.host}`);
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(
      `sftp -P ${serverDetails.port} ${serverDetails.username}@${serverDetails.host}`
    );
  };

  const downloadKey = () => {
    // In a real app, this would download the private key file
    console.log("Downloading private key");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} />
          SFTP Server Created Successfully!
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your secure SFTP server has been created and is ready to use. Here are your connection details:
        </DialogContentText>
        
        <Box mt={3}>
          <Typography variant="subtitle2" gutterBottom>
            Connection Details
          </Typography>
          <Box sx={{ bgcolor: "grey.100", p: 2, borderRadius: 1, mb: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Host:</Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" fontFamily="monospace" mr={1}>
                  {serverDetails.host}
                </Typography>
                <IconButton size="small" onClick={handleCopyHost}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Port:</Typography>
              <Typography variant="body2" fontFamily="monospace">
                {serverDetails.port}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="body2">Username:</Typography>
              <Typography variant="body2" fontFamily="monospace">
                {serverDetails.username}
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="subtitle2" gutterBottom>
            SSH Key
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<KeyIcon />}
            onClick={downloadKey}
            sx={{ mb: 3 }}
          >
            Download Private Key
          </Button>
          
          <Typography variant="subtitle2" gutterBottom>
            SFTP Command
          </Typography>
          <Box sx={{ bgcolor: "grey.100", p: 2, borderRadius: 1, mb: 3, position: "relative" }}>
            <Typography variant="body2" fontFamily="monospace">
              sftp -P {serverDetails.port} {serverDetails.username}@{serverDetails.host}
            </Typography>
            <IconButton
              size="small"
              sx={{ position: "absolute", top: 8, right: 8 }}
              onClick={handleCopyCommand}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Alert severity="warning">
            This server will automatically terminate after 24 hours. Make sure to complete your file transfers before then.
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={onClose}>
          Go to Server Dashboard
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main component
const ServerProvision: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [creatingServer, setCreatingServer] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  
  const steps = [
    { label: "Server Configuration", component: <ServerConfig /> },
    { label: "Security Settings", component: <SecuritySettings /> },
    { label: "Lifecycle Settings", component: <LifecycleSettings /> },
    { label: "Review", component: <Review /> },
  ];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Final step - create server
      setCreatingServer(true);
      
      // Simulate server creation
      setTimeout(() => {
        setCreatingServer(false);
        setSuccessDialogOpen(true);
      }, 3000);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const mockServerDetails = {
    host: "sftp-abc123.safetypin.cloud",
    port: 2222,
    username: "sftp-user",
  };

  return (
    <Container maxWidth="md">
      <PageHeader
        title="Create SFTP Server"
        breadcrumbs={[
          { text: "Home", href: "/" },
          { text: "Servers", href: "/servers" },
          { text: "New Server" },
        ]}
      />
      
      <Card>
        <CardHeader
          title="Create a New Secure SFTP Server"
          subheader="Configure a temporary, secure SFTP server for file transfers"
        />
        <Divider />
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((step) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {creatingServer ? (
            <Box sx={{ my: 5, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Creating Your SFTP Server
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                This may take a minute or two. Please don't close this window.
              </Typography>
              <LinearProgress sx={{ mt: 3, mb: 4 }} />
              <Box sx={{ mt: 2 }}>
                <Chip
                  icon={<DnsIcon />}
                  label="Provisioning server infrastructure..."
                  color="primary"
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
                <Chip
                  icon={<LockIcon />}
                  label="Setting up security rules..."
                  color="primary"
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
                <Chip
                  icon={<KeyIcon />}
                  label="Generating SSH keys..."
                  color="primary"
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
              </Box>
            </Box>
          ) : (
            steps[activeStep].component
          )}
          
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              disabled={activeStep === 0 || creatingServer}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={creatingServer}
            >
              {activeStep === steps.length - 1 ? "Create Server" : "Next"}
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      <SuccessDialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        serverDetails={mockServerDetails}
      />
    </Container>
  );
};

export default ServerProvision;