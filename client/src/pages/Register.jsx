import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config/api";
import {
  Box,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Button from "../components/base/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    organization: "",
    organizationRole: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input change with name restriction
  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "name") {
      // Only letters and spaces allowed for name
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setForm({ ...form, [name]: value });
        setError("");
      } else {
        setError("Only letters and spaces are allowed in the name.");
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  function handleConfirmPasswordChange(e) {
    setConfirmPassword(e.target.value);
    if (form.password !== e.target.value) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (form.name.trim() === "") {
      setError("Name is required");
      setLoading(false);
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(form.name)) {
      setError("Only letters and spaces are allowed in the name.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to register");

      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "grey.100",
        px: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Create an Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Organization name"
            name="organization"
            value={form.organization}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Role in Organization"
            name="organizationRole"
            value={form.organizationRole}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            fullWidth
            required
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword((show) => !show)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="mt-4"
            disabled={loading}
            loading={loading}
          >
            Register
          </Button>
        </form>

        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#1976d2", textDecoration: "none" }}
          >
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
