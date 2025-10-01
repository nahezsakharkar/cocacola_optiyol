import React, { useEffect, useState } from "react";
import { Modal, Typography, TextField, MenuItem, Button } from "@mui/material";

export default function RunOutboundDeliveriesModal({
  open,
  onClose,
  onRun,
  modalTitle,
  modalDesc,
  filters,
  setFilters,
  stringOperators,
  dateOperators,
  numericOperators,
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters); // Reset local filters when modal opens
  }, [open, filters]);

  const resetFilters = () => {
    const reset = {};
    for (let key in filters) {
      reset[key] = { operator: "", value: "", from: "", to: "" };
    }
    setLocalFilters(reset);
    setFilters(reset);
  };

  const handleRun = () => {
    setFilters(localFilters); // Apply filters
    resetFilters(); // Reset fields
    onRun();
  };

  const handleClose = () => {
    resetFilters(); // Reset fields
    onClose();
  };

  const renderField = (label, key, type, operators) => {
    const field = localFilters[key] || { operator: "", value: "", from: "", to: "" };

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "15px",
          flexWrap: "wrap",
        }}
      >
        {/* Label */}
        <Typography style={{ minWidth: "150px" }}>{label}</Typography>

        {/* Operator */}
        <TextField
          select
          size="small"
          value={field.operator}
          onChange={(e) =>
            setLocalFilters({
              ...localFilters,
              [key]: { ...field, operator: e.target.value },
            })
          }
          style={{ width: "150px" }} // Fixed operator width
        >
          {operators.map((op) => (
            <MenuItem key={op.value} value={op.value}>
              {op.label}
            </MenuItem>
          ))}
        </TextField>

        {/* Values */}
        {field.operator === "between" ? (
          <>
            <TextField
              label="From"
              type={type}
              size="small"
              value={field.from}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  [key]: { ...field, from: e.target.value },
                })
              }
              InputLabelProps={type === "date" ? { shrink: true } : undefined}
              style={{ flex: "1 1 auto", minWidth: "120px" }} // Dynamic width
            />
            <TextField
              label="To"
              type={type}
              size="small"
              value={field.to}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  [key]: { ...field, to: e.target.value },
                })
              }
              InputLabelProps={type === "date" ? { shrink: true } : undefined}
              style={{ flex: "1 1 auto", minWidth: "120px" }} // Dynamic width
            />
          </>
        ) : field.operator === "isnull" || field.operator === "isnotnull" ? null : (
          <TextField
            label="Value"
            type={type}
            size="small"
            value={field.value}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                [key]: { ...field, value: e.target.value },
              })
            }
            InputLabelProps={type === "date" ? { shrink: true } : undefined}
            style={{ flex: "1 1 auto", minWidth: "120px" }} // Dynamic width
          />
        )}
      </div>
    );
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          minWidth: "400px",
          maxWidth: "90%",
          padding: "15px 20px",
          borderRadius: "6px",
          outline: "none",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        <Typography variant="h6" style={{ marginBottom: "8px", fontWeight: "bold" }}>
          {modalTitle}
        </Typography>

        <Typography variant="body2" style={{ marginBottom: "15px", color: "#555" }}>
          {modalDesc}
        </Typography>

        {renderField("Sales Organization", "salesOrg", "text", stringOperators)}
        {renderField("Shipping Point", "shippingPoint", "number", numericOperators)}
        {renderField("Delivery Date", "deliveryDate", "date", dateOperators)}
        {renderField("Customer Number", "customerNumber", "number", numericOperators)}
        {renderField("Delivery Document", "deliveryDocument", "number", numericOperators)}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "15px",
            flexWrap: "wrap",
          }}
        >
          <Button variant="contained" color="success" size="small" onClick={handleRun}>
            Run
          </Button>
          <Button variant="outlined" color="error" size="small" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
