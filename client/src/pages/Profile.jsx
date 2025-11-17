import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  Stack,
} from "@mui/material";

export default function Profile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [currentLogo, setCurrentLogo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch profile on load
  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/users/profile`, {
          headers: { Authorization: `${token}` },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch profile");
        }

        const userData = await res.json();
        setForm({
          name: userData.name,
          email: userData.email,
          password: "",
        });
        setCurrentLogo(userData.logoUrl);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchProfile();
  }, [navigate]);

  // Handle file
  function handleFileChange(e) {
    if (e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      setCurrentLogo(URL.createObjectURL(e.target.files[0]));
    }
  }

  // Handle text inputs
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Submit
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");

    try {
      let uploadedLogoUrl = null;

      // Upload new logo if selected
      if (logoFile) {
        const formData = new FormData();
        formData.append("file", logoFile);

        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Logo upload failed");

        const uploadData = await uploadRes.json();
        uploadedLogoUrl = uploadData.url;
      }

      // Prepare payload
      const updatePayload = {
        name: form.name,
        email: form.email,
      };

      if (uploadedLogoUrl) updatePayload.logoUrl = uploadedLogoUrl;
      if (form.password) updatePayload.password = form.password;

      // Update user
      const profileRes = await fetch(`${API_URL}/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });

      const profileData = await profileRes.json();
      if (!profileRes.ok)
        throw new Error(profileData.message || "Failed to update profile");

      setSuccess("Profile updated successfully!");
      if (uploadedLogoUrl) setCurrentLogo(uploadedLogoUrl);

      setForm((prev) => ({ ...prev, password: "" }));
      setLogoFile(null);
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
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 500 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Your Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ mb: 2, alignItems: "center" }}
          >
            <Avatar src={currentLogo} sx={{ width: 80, height: 80 }} />
            <Button variant="outlined" component="label">
              Upload New Logo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          </Stack>

          <TextField
            label="Name"
            name="name"
            value={form.name}
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
            label="New Password (optional)"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            helperText="Leave blank to keep your current password"
          />
          {/* //reconfirm password again if added */}

          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
