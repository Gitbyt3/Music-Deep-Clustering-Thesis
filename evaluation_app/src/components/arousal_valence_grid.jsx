import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Axis2D = ({ onSelectPoint, width = 400, height = 400 }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const canvasRef = useRef(null);
  
  // Constants for padding and axis positioning
  const PADDING = 30; // Increased padding to accommodate axis labels
  const GRID_STEP = 0.2;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate drawable area
    const drawWidth = width - PADDING * 2;
    const drawHeight = height - PADDING * 2;
    const centerX = PADDING + drawWidth / 2;
    const centerY = PADDING + drawHeight / 2;
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Vertical grid lines (Valence)
    for (let x = -1; x <= 1; x += GRID_STEP) {
      const px = centerX + (x * drawWidth / 2);
      ctx.beginPath();
      ctx.moveTo(px, PADDING);
      ctx.lineTo(px, PADDING + drawHeight);
      ctx.stroke();
    }
    
    // Horizontal grid lines (Arousal)
    for (let y = -1; y <= 1; y += GRID_STEP) {
      const py = centerY - (y * drawHeight / 2);
      ctx.beginPath();
      ctx.moveTo(PADDING, py);
      ctx.lineTo(PADDING + drawWidth, py);
      ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // X axis (Valence)
    ctx.beginPath();
    ctx.moveTo(PADDING, centerY);
    ctx.lineTo(PADDING + drawWidth, centerY);
    ctx.stroke();
    
    // Y axis (Arousal)
    ctx.beginPath();
    ctx.moveTo(centerX, PADDING);
    ctx.lineTo(centerX, PADDING + drawHeight);
    ctx.stroke();
    
    // Draw axis labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    
    // X axis labels (Valence)
    for (let x = -1; x <= 1; x += GRID_STEP) {
      if (x === 0) continue;
      const px = centerX + (x * drawWidth / 2);
      ctx.textAlign = 'center';
      ctx.fillText(x.toFixed(1), px, centerY + 15);
    }
    
    // Y axis labels (Arousal)
    for (let y = -1; y <= 1; y += GRID_STEP) {
      if (y === 0) continue;
      const py = centerY - (y * drawHeight / 2);
      ctx.textAlign = 'right';
      ctx.fillText(y.toFixed(1), centerX - 10, py + 4);
    }
    
    // Origin label
    ctx.textAlign = 'right';
    ctx.fillText('0', centerX - 10, centerY + 15);
    
    // Draw axis titles
    ctx.font = 'bold 14px Arial';
    
    // X axis title (Valence)
    ctx.textAlign = 'center';
    ctx.fillText('Arousal', width / 2, height - 5);
    
    // Y axis title (Arousal)
    ctx.save();
    ctx.translate(10, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Valence', 0, 0);
    ctx.restore();
    
    // Draw selected point if exists
    if (selectedPoint) {
      const { x, y } = selectedPoint;
      const px = centerX + (x * drawWidth / 2);
      const py = centerY - (y * drawHeight / 2);
      
      // Draw point
      ctx.fillStyle = '#ff4757';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw coordinates text
      ctx.fillStyle = '#ff4757';
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`(${x.toFixed(2)}, ${y.toFixed(2)})`, px + 10, py - 10);
    }
  }, [selectedPoint, width, height]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Get click position relative to canvas
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate drawable area
    const drawWidth = width - PADDING * 2;
    const drawHeight = height - PADDING * 2;
    const centerX = PADDING + drawWidth / 2;
    const centerY = PADDING + drawHeight / 2;
    
    // Only process clicks within the drawable area
    if (x < PADDING || x > width - PADDING || y < PADDING || y > height - PADDING) {
      return;
    }
    
    // Convert to coordinate system (-1 to 1 on both axes)
    const coordX = ((x - centerX) / (drawWidth / 2)).toFixed(2);
    const coordY = ((centerY - y) / (drawHeight / 2)).toFixed(2);
    
    const point = {
      valence: Math.min(1, Math.max(-1, parseFloat(coordX))), // x-axis is Valence
      arousal: Math.min(1, Math.max(-1, parseFloat(coordY)))  // y-axis is Arousal
    };
    
    setSelectedPoint({ x: point.valence, y: point.arousal });
    if (onSelectPoint) {
      onSelectPoint(point); // Now returns {valence, arousal} instead of {x, y}
    }
  };

  return (
    <Container>
      <Canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        onClick={handleCanvasClick}
      />
      <Instructions>
        Click anywhere on the grid to select a point.
        {selectedPoint && (
          <SelectedValue>
            Selected: Valence={selectedPoint.x.toFixed(2)}, Arousal={selectedPoint.y.toFixed(2)}
          </SelectedValue>
        )}
      </Instructions>
    </Container>
  );
};

// Styled components (same as before)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
`;

const Canvas = styled.canvas`
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: crosshair;
  background-color: #f9f9f9;
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Instructions = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #555;
`;

const SelectedValue = styled.div`
  margin-top: 5px;
  font-weight: bold;
  color: #ff4757;
`;

export default Axis2D;