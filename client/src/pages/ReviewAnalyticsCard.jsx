import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  // Button,
  CircularProgress,
  Stack,
  Alert,
  Divider,
  // useTheme,
  // alpha,
} from "@mui/material";
import Button from "../components/base/Button";
import {
  AutoAwesome, // Replaces Sparkles
  BarChart, // Replaces BarChart3
  ErrorOutline, // Replaces AlertCircle
  Refresh,
} from "@mui/icons-material";
import { API_URL } from "../config/api";

// 1. MUI Compatible Simple Markdown Renderer
const MuiMarkdown = ({ content }) => {
  if (!content) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {content.split("\n").map((line, i) => {
        // Headers (###)
        if (line.startsWith("###")) {
          return (
            <Typography
              key={i}
              variant="subtitle2"
              fontWeight={700}
              color="primary.main"
              sx={{
                mt: 2,
                textTransform: "uppercase",
                letterSpacing: 1,
                borderBottom: "1px solid",
                borderColor: "divider",
                pb: 0.5,
              }}
            >
              {line.replace("###", "")}
            </Typography>
          );
        }
        // Highlighted text (**)
        if (line.startsWith("**")) {
          return (
            <Box
              key={i}
              sx={{
                bgcolor: "primary.50",
                color: "primary.dark",
                p: 1,
                borderRadius: 1,
                textAlign: "center",
                fontFamily: "monospace",
                fontWeight: 600,
                my: 1,
              }}
            >
              {line.replace(/\*\*/g, "")}
            </Box>
          );
        }
        // Lists (1. or *)
        if (line.trim().startsWith("1.") || line.trim().startsWith("*")) {
          return (
            <Box key={i} sx={{ display: "flex", gap: 1.5, ml: 1 }}>
              <Typography color="primary.main" fontWeight="bold">
                •
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {line
                  .replace(/^[0-9]\.|^\*/, "")
                  .replace(/\*\*/g, "")
                  .trim()}
              </Typography>
            </Box>
          );
        }
        // Empty lines
        if (line.trim() === "") return null;

        // Standard Paragraphs
        return (
          <Typography
            key={i}
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            {line}
          </Typography>
        );
      })}
    </Box>
  );
};

export default function ReviewAnalyticsCard() {
  // const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const generateAnalysis = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const token = localStorage.getItem("token");

      // Using fetch to match your project consistency
      const response = await fetch(`${API_URL}/public/analyze-reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to connect to AI service.");
      }

      if (data && data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        maxWidth: 700,
        mx: "auto", // Centers the card if inside a grid
      }}
    >
      {/* Header Area */}
      <Box
        sx={{
          p: 2.5,
          bgcolor: "grey.50",
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <BarChart color="primary" />
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            Review Intelligence
          </Typography>
        </Stack>

        {!analysis && !loading && (
          <Button
            variant="primary"
            size="sm"
            onClick={generateAnalysis}
            icon={<AutoAwesome />}
            className="rounded-lg shadow-none"
          >
            Analyze
          </Button>
        )}
      </Box>

      {/* Content Area */}
      <CardContent sx={{ p: 3 }}>
        {/* 1. Initial State */}
        {!analysis && !loading && !error && (
          <Typography
            variant="body2"
            color="text.disabled"
            align="center"
            sx={{ py: 3 }}
          >
            Click analyze to generate a statistical snapshot of your latest
            reviews.
          </Typography>
        )}

        {/* 2. Loading State */}
        {loading && (
          <Stack alignItems="center" justifyContent="center" spacing={2} py={4}>
            <CircularProgress size={32} />
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
            >
              Crunching numbers...
            </Typography>
          </Stack>
        )}

        {/* 3. Error State */}
        {error && (
          <Alert
            severity="error"
            icon={<ErrorOutline fontSize="inherit" />}
            action={
              <Button variant="ghost" size="sm" onClick={generateAnalysis}>
                Try Again
              </Button>
            }
            sx={{ borderRadius: 2 }}
          >
            <Typography variant="subtitle2" fontWeight="bold">
              Analysis Failed
            </Typography>
            <Typography variant="caption" display="block">
              {error}
            </Typography>
          </Alert>
        )}

        {/* 4. Result View */}
        {analysis && (
          <Box sx={{ animation: "fadeIn 0.5s ease-in" }}>
            <MuiMarkdown content={analysis} />

            <Box
              sx={{
                mt: 3,
                pt: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                size="sm"
                icon={<Refresh />}
                onClick={generateAnalysis}
                variant="ghost"
                className="text-gray-500"
              >
                Refresh Data
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
