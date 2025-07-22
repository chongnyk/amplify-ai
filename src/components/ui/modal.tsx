// src/components/ui/Modal.tsx
import React from "react";

export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <button style={closeButtonStyle} onClick={onClose} aria-label="Close">
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

// CSS-in-JS styles
const backdropStyle: React.CSSProperties = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  background: "#000",
  borderRadius: "8px",
  boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
  padding: "2rem",
  position: "relative",
  display: "inline-block",
};

const closeButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "8px",
  right: "12px",
  background: "none",
  border: "none",
  fontSize: "1.5rem",
  cursor: "pointer",
};