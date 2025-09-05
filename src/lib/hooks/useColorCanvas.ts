import { useRef, useState, useEffect, useCallback } from "react";

interface UseColorCanvasProps {
  targetColorHex: string;
  mixedColorHex: string;
  targetColor?: string | null;
}

export const useColorCanvas = ({
  targetColorHex,
  mixedColorHex,
  targetColor,
}: UseColorCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 68 });

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Draw the color boxes on canvas
  const drawColorBoxes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    const x = 0;
    const y = 0;
    const width = canvasSize.width;
    const height = canvasSize.height;

    // Draw shadow
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(x + 6, y + 6, width, height);

    // Draw main container with target color
    ctx.fillStyle = targetColorHex;
    ctx.fillRect(x, y, width, height);

    // Draw border
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    // Draw mixed color on right half
    if (targetColor) {
      const rightHalfX = x + width / 2;
      ctx.fillStyle = mixedColorHex;
      ctx.fillRect(rightHalfX, y, width / 2, height);

      // Draw vertical line separator
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rightHalfX, y);
      ctx.lineTo(rightHalfX, y + height);
      ctx.stroke();
    } else {
      // Draw loading state
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(x, y, width, height);

      // Draw loading spinner
      const centerX = width / 2;
      const centerY = height / 2;
      const spinnerRadius = 12;

      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(centerX - 20, centerY, spinnerRadius, 0, Math.PI * 1.5);
      ctx.stroke();

      // Draw loading text
      ctx.fillStyle = "#000000";
      ctx.font = '14px "Sintony", sans-serif';
      ctx.textAlign = "center";
      ctx.fillText("Loading...", centerX + 20, centerY + 5);
    }
  }, [canvasSize, targetColorHex, mixedColorHex, targetColor]);

  // Redraw canvas when dependencies change
  useEffect(() => {
    drawColorBoxes();
  }, [drawColorBoxes]);

  return {
    canvasRef,
    canvasSize,
  };
};
