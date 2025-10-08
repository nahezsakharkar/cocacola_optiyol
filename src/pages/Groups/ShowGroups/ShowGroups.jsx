import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import DataTable from "../../../components/Common/DataTable/DataTable";
import schedule from "../../../services/scheduleService";
import OurModal from "../../../components/Common/OurModal/OurModal";
import auth from "../../../services/authService";
import "../../../custom/css/custom.css";
import RunOutboundDeliveriesModal from "../../../components/Groups/ShowGroups/RunOutboundDeliveriesModal";

function ShowGroups() {
  const navigate = useNavigate();
  const [groupList, setGroupList] = useState([]);
  const [row, setRow] = useState([]);
  const [operation, setOperation] = useState("");
  const [modalTitle, setModalTitle] = useState();
  const [modalDesc, setModalDesc] = useState();

  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState({});

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [specialRunOpen, setSpecialRunOpen] = useState(false);

  const [filters, setFilters] = useState({
    salesOrg: { operator: "equals", value: "" },
    shippingPoint: { operator: "equals", value: "" },
    deliveryDate: { operator: "equals", value: "" },
    customerNumber: { operator: "equals", value: "" },
    deliveryDocument: { operator: "equals", value: "" },
  });

  const stringOperators = [
    { label: "Equals", value: "equals" },
    { label: "Not Equals", value: "notequals" },
    { label: "Like", value: "like" },
    { label: "Not Like", value: "notlike" },
    { label: "In", value: "in" },
    { label: "Not In", value: "notin" },
    { label: "Is Null", value: "isnull" },
    { label: "Is Not Null", value: "isnotnull" },
  ];

  const dateOperators = [
    { label: "Equals", value: "equals" },
    { label: "Not Equals", value: "notequals" },
    { label: "Before", value: "lt" },
    { label: "Before or Equal", value: "le" },
    { label: "After", value: "gt" },
    { label: "After or Equal", value: "ge" },
    { label: "Between", value: "between" },
  ];

  const numericOperators = [
    { label: "Equals", value: "equals" },
    { label: "Not Equals", value: "notequals" },
    { label: "Less Than", value: "lt" },
    { label: "Less or Equal", value: "le" },
    { label: "Greater Than", value: "gt" },
    { label: "Greater or Equal", value: "ge" },
    { label: "Between", value: "between" },
  ];

  async function getAdmin() {
    const data = await auth.getCurrentUserDetails();
    setAdmin(data.payload);
    getGroupsData("Active,Disabled");
  }

  async function getGroupsData(queryParams) {
    const data = await schedule.getGroupsByScheduleStatus(queryParams);
    setGroupList(data.payload);
    setIsLoading(false);
  }

  useEffect(() => {
    getAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = (thisRow, thisOperation) => {
    setRow(thisRow);
    setOperation(thisOperation);

    if (thisOperation === "delete") {
      setModalTitle("Delete " + thisRow.groupname + " Job Group?");
      setModalDesc(
        "Do you really wish to Remove " +
          thisRow.groupname +
          " from the System? This Group's data will be lost."
      );
      handleOpen();
    } else if (thisOperation === "run") {
      if (thisRow.id === 1) {
        setModalTitle("Run " + thisRow.groupname + " Job Group?");
        setModalDesc(
          "Fill filters and run " + thisRow.groupname + " Job Group."
        );
        setSpecialRunOpen(true);
      } else {
        setModalTitle("Start " + thisRow.groupname + " Job Group?");
        setModalDesc(
          "Do you really wish to Start " + thisRow.groupname + " Job Group?"
        );
        handleOpen();
      }
    }
  };

  const handleOperation = () => {
    if (operation === "delete") {
      handleDelete();
    } else if (operation === "run") {
      handleRun();
      getGroupsData("Active,Disabled");
    }
  };

  async function handleDelete() {
    const data = await schedule.deleteGroup(row.id);
    if (data.message === "group deleted") {
      toast.success("Schedule was Deleted Successfully");
      getGroupsData("Active,Disabled");
    } else {
      toast.error("There was some Error while deleting a Schedule");
    }
    setOpen(false);
  }

  function handleRun() {
    toast.success("Schedule was Started Successfully");
    setOpen(false);
    schedule.schedulerStart(row.id);
    getGroupsData("Active,Disabled");
  }

  const handleSpecialRun = (appliedFilters) => {
    const payload = [];

    // Helper to format "yyyy-MM-dd" → "ddMMyyyy"
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const [year, month, day] = dateStr.split("-");
      return `${day}${month}${year}`;
    };

    Object.keys(appliedFilters).forEach((key) => {
      const filter = appliedFilters[key];
      const field = key;

      if (!filter.operator) return; // skip empty filters

      if (filter.operator === "between") {
        let from = filter.from;
        let to = filter.to;

        // Format date fields only
        if (field.toLowerCase().includes("date")) {
          from = formatDate(from);
          to = formatDate(to);
        }

        payload.push({
          field,
          op: filter.operator,
          value: `${from}-${to}`,
        });
      } else if (
        filter.operator !== "isnull" &&
        filter.operator !== "isnotnull"
      ) {
        let value = filter.value;

        if (field.toLowerCase().includes("date")) {
          value = formatDate(value);
        }

        payload.push({
          field,
          op: filter.operator,
          value,
        });
      } else {
        payload.push({
          field,
          op: filter.operator,
        });
      }
    });

    console.log("Special Run Payload:", payload);
    setSpecialRunOpen(false);
    schedule.schedulerStartOutbound(payload);
    toast.success("Special Run Started Successfully");
    getGroupsData("Active,Disabled");
  };

  const columns = [
    { field: "id", headerName: "Id", flex: 0.2, width: 80 },
    {
      field: "groupnameStatus",
      headerName: "Job Group",
      flex: 0.8,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            {params.row.groupname && <span>{params.row.groupname}</span>}
            {params.row.runningstatus === "Running" && (
              <span style={{ color: "gray" }}>Running...</span>
            )}
          </div>
        );
      },
    },
    { field: "scheduled", headerName: "Schedule", flex: 0.5 },
    { field: "scheduledstatus", headerName: "Status", flex: 0.5 },
    { field: "companyid", headerName: "Company Id", flex: 0.4 },
    {
      field: "action",
      headerName: "Action",
      flex: 1.5,
      width: 500,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <button
              type="button"
              className="btn btn-dark btn-icon-text btn-sm"
              onClick={() =>
                navigate("/ShowGroups/EditGroups/EditGroup", {
                  state: { groupId: params.row.id },
                })
              }
            >
              {admin.admintype === "Admin" ? "Edit" : "View"}
              <i className="mdi mdi-file-check btn-icon-append"></i>
            </button>

            {admin.admintype === "Admin" && (
              <button
                type="button"
                className="btn btn-secondary btn-icon-text btn-sm"
              >
                Disable
                <i className="fa fa-ban btn-icon-append"></i>
              </button>
            )}

            <Tooltip
              title={
                params.row.runningstatus === "Running"
                  ? "Schedule is already running."
                  : ""
              }
              placement="top"
              arrow
            >
              <span>
                <button
                  type="button"
                  disabled={params.row.runningstatus === "Running"}
                  className="btn btn-warning btn-icon-text btn-sm"
                  onClick={() => openModal(params.row, "run")}
                >
                  Run
                  <i className="fa fa-flash btn-icon-append"></i>
                </button>
              </span>
            </Tooltip>

            {admin.admintype === "Admin" && (
              <button
                type="button"
                className="btn btn-danger btn-icon-text btn-sm"
                onClick={() => openModal(params.row, "delete")}
              >
                Delete
                <i className="ti-trash btn-icon-append"></i>
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const rows = groupList;

  return (
    <div className="data existingGroups">
      <div className="title">
        <h1 className="Heading">Jobs Group</h1>
        <button
          onClick={() => navigate("/AddNewGroup/AddGroup")}
          type="button"
          className="btn btn-outline-secondary btn-icon-text"
        >
          Add New Group
          <i className="mdi mdi-file-check btn-icon-append"></i>
        </button>
      </div>
      <div className="body">
        {isLoading && (
          <Stack sx={{ width: "100%", color: "#f02632" }} spacing={2}>
            <LinearProgress color="inherit" />
          </Stack>
        )}
        <DataTable pageSize={15} columns={columns} rows={rows} toolbar />

        <OurModal
          open={open}
          setOpen={setOpen}
          handleOpen={handleOpen}
          handleClose={handleClose}
          handleYes={handleOperation}
          title={modalTitle}
          description={modalDesc}
        />

        {/* Special Run Modal */}
        <RunOutboundDeliveriesModal
          open={specialRunOpen}
          onClose={() => setSpecialRunOpen(false)}
          onRun={handleSpecialRun}
          modalTitle={modalTitle}
          modalDesc={modalDesc}
          filters={filters}
          setFilters={setFilters}
          stringOperators={stringOperators}
          dateOperators={dateOperators}
          numericOperators={numericOperators}
        />
      </div>
    </div>
  );
}

export default ShowGroups;
