import React from "react";
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
  const renderField = (label, key, type, operators) => (
    <div style={{ marginBottom: "15px" }}>
      <TextField
        label={`${label} Operator`}
        select
        fullWidth
        size="small"
        value={filters[key].operator}
        onChange={(e) =>
          setFilters({
            ...filters,
            [key]: { ...filters[key], operator: e.target.value },
          })
        }
      >
        {operators.map((op) => (
          <MenuItem key={op.value} value={op.value}>
            {op.label}
          </MenuItem>
        ))}
      </TextField>

      {filters[key].operator === "between" ? (
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <TextField
            label="From"
            type={type}
            fullWidth
            size="small"
            value={filters[key].from}
            onChange={(e) =>
              setFilters({
                ...filters,
                [key]: { ...filters[key], from: e.target.value },
              })
            }
            InputLabelProps={type === "date" ? { shrink: true } : undefined}
          />
          <TextField
            label="To"
            type={type}
            fullWidth
            size="small"
            value={filters[key].to}
            onChange={(e) =>
              setFilters({
                ...filters,
                [key]: { ...filters[key], to: e.target.value },
              })
            }
            InputLabelProps={type === "date" ? { shrink: true } : undefined}
          />
        </div>
      ) : filters[key].operator === "isnull" ||
        filters[key].operator === "isnotnull" ? null : (
        <TextField
          label="Value"
          type={type}
          fullWidth
          size="small"
          style={{ marginTop: "8px" }}
          value={filters[key].value}
          onChange={(e) =>
            setFilters({
              ...filters,
              [key]: { ...filters[key], value: e.target.value },
            })
          }
          InputLabelProps={type === "date" ? { shrink: true } : undefined}
        />
      )}
    </div>
  );

  return (
    <Modal open={open} onClose={onClose}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          width: "650px",
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "15px 20px",
          borderRadius: "6px",
          outline: "none",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          variant="h6"
          style={{ marginBottom: "8px", fontWeight: "bold" }}
        >
          {modalTitle}
        </Typography>

        <Typography
          variant="body2"
          style={{ marginBottom: "15px", color: "#555" }}
        >
          {modalDesc}
        </Typography>

        {renderField("Sales Organization", "salesOrg", "text", stringOperators)}
        {renderField(
          "Shipping Point",
          "shippingPoint",
          "number",
          numericOperators
        )}
        {renderField("Delivery Date", "deliveryDate", "date", dateOperators)}
        {renderField(
          "Customer Number",
          "customerNumber",
          "number",
          numericOperators
        )}
        {renderField(
          "Delivery Document",
          "deliveryDocument",
          "number",
          numericOperators
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "15px",
          }}
        >
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={onRun}
          >
            Run
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
