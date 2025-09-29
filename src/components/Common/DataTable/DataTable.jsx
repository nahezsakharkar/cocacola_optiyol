import { DataGrid } from "@mui/x-data-grid";

function DataTable(props) {
  const { columns, rows, rowCount, toolbar, pageSize, onPageChange } = props;

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      rowCount={rowCount}
      pageSizeOptions={[pageSize ? pageSize : 5]}
      pageSize={pageSize ? pageSize : 5}
      disableRowSelectionOnClick
      onPaginationModelChange={(model) => {
        if (onPageChange) {
          onPageChange(model.page);
        }
      }}
      showToolbar={toolbar}
      sx={{
        // Main DataGrid background transparent
        backgroundColor: "transparent",

        // Make the Header Container transparent
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "transparent",
        },
        // Make individual Header cells transparent
        "& .MuiDataGrid-columnHeader": {
          backgroundColor: "transparent",
        },
        // Optional: Also make the cells transparent if you haven't already
        "& .MuiDataGrid-cell": {
          backgroundColor: "transparent",
        },

        // Existing styles for button colors
        ".MuiButtonBase-root span svg": {
          color: "#f02632",
        },
        ".MuiButtonBase-root svg": {
          color: "#f02632",
        },
        ".MuiButtonBase-root": {
          color: "#6f7580",
        },
        ".MuiButtonBase-root:hover": {
          color: "#f02632",
        },
      }}
    />
  );
}

export default DataTable;
