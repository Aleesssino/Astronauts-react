import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  type MaterialReactTableProps,
  type MRT_Cell,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  ThemeProvider,
  Tooltip,
  createTheme,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Astronaut as AstronautModel } from "../models/astronaut";
import * as AstronautApi from "../network/crud";

export default function AstronautsTable() {
  const [astronautsData, setAstronautsData] = useState<AstronautModel[]>([]);
  // fetch astronauts
  async function loadAstronauts() {
    try {
      const astronautsData = await AstronautApi.fetchAstronauts();
      setAstronautsData(astronautsData);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  useEffect(() => {
    loadAstronauts();
  }, []);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const handleCreateNewRow = async (values: AstronautModel) => {
    try {
      /*const createdAstronaut = await AstronautApi.createAstronaut(values);
      setAstronautsData((prevAstronautsData) => [
        ...prevAstronautsData,
        createdAstronaut,
      ]);*/
    astronautsData.push(values);
    setAstronautsData([...astronautsData]);
    }
      catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const handleSaveRowEdits: MaterialReactTableProps<AstronautModel>["onEditingRowSave"] =
    async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
        try {
          // Update the astronaut data in the API
          await AstronautApi.updateAstronaut(row.original._id, values);

          // Update the local astronautsData state
          const updatedAstronautsData = astronautsData.map((astronaut) => {
            if (astronaut._id === row.original._id) {
              return { ...astronaut, ...values };
            }
            return astronaut;
          });
          setAstronautsData(updatedAstronautsData);

          exitEditingMode(); // Required to exit editing mode and close the modal
        } catch (error) {
          console.error("Error updating astronaut:", error);
          // Handle the error accordingly (e.g., display an error message)
        }
      }
    };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    async (row: MRT_Row<AstronautModel>) => {
      if (
        // eslint-disable-next-line no-restricted-globals
        confirm(`Are you sure you want to delete ${row.getValue("name")}`)
      ) {
        try {
          await AstronautApi.deleteAstronaut(row.original._id);
          const updatedAstronautsData = astronautsData.filter(
            (astronaut) => astronaut._id !== row.original._id
          );
          setAstronautsData(updatedAstronautsData);
        } catch (error) {
          console.error(error);
          alert(error);
        }
      }
    },
    [astronautsData]
  );

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<AstronautModel>
    ): MRT_ColumnDef<AstronautModel>["muiTableBodyCellEditTextFieldProps"] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "age"
              ? validateAge(+event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo<MRT_ColumnDef<AstronautModel>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "age",
        header: "Age",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "nationality",
        header: "nationality",
        size: 150,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      /*{
        accessorKey: 'dateOfBirth',
        header: 'dateOfBirth',
        size: 150,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          //type: 'number',
        }),
      },*/
      {
        accessorKey: "spaceAgency",
        header: "agency",
        size: 150,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "missionsCompleted",
        header: "mission#",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "skills",
        header: "skills",
        size: 200,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
    ],
    [getCommonEditTextFieldProps]
  );

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container>
          <MaterialReactTable
            displayColumnDefOptions={{
              "mrt-row-actions": {
                muiTableHeadCellProps: {
                  align: "center",
                },
                size: 120,
              },
            }}
            columns={columns}
            data={astronautsData}
            editingMode="modal" //default
            enableColumnOrdering
            enableEditing
            onEditingRowSave={handleSaveRowEdits}
            onEditingRowCancel={handleCancelRowEdits}
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <Tooltip arrow placement="left" title="Edit">
                  <IconButton onClick={() => table.setEditingRow(row)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="right" title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteRow(row)}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            renderTopToolbarCustomActions={() => (
              <Button
                color="primary"
                onClick={() => setCreateModalOpen(true)}
                variant="contained"
              >
                Create New Astronaut
              </Button>
            )}
          />
        </Container>
      </ThemeProvider>
      <CreateNewAstronautModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        //fix this
        onSubmit={() => setCreateModalOpen(false)}
        onAstronautSaved={handleCreateNewRow}
      />
    </>
  );
}

interface CreateModalProps {
  columns: MRT_ColumnDef<AstronautModel>[];
  onClose: () => void;
  onSubmit: (values: AstronautModel) => void;
  astronautTOEdit?: AstronautModel;
  onAstronautSaved: (astronaut: AstronautModel) => void;
  open: boolean;
}

export const CreateNewAstronautModal = ({
  open,
  columns,
  onClose,
  astronautTOEdit,
  onAstronautSaved,
}: CreateModalProps) => {
  const [values, setValues] = useState<any>(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {} as any)
  );

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const handleSubmit = async (input: AstronautApi.AstronautInput) => {
    try {
      let astronautResponse: AstronautModel;
      if (astronautTOEdit) {
        astronautResponse = await AstronautApi.updateAstronaut(
          astronautTOEdit._id,
          values
        );
      } else {

        astronautResponse = await AstronautApi.createAstronaut(values);

      }
    
      onAstronautSaved(astronautResponse);

      onClose();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog open={open}>
        <DialogTitle textAlign="center">Create New Astronaut</DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <Stack
              sx={{
                width: "100%",
                minWidth: { xs: "300px", sm: "360px", md: "400px" },
                gap: "1.5rem",
              }}
            >
              {columns.map((column) => (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
              ))}
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: "1.25rem" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            color="primary"
            onClick={() => handleSubmit(values)}
            variant="contained"
          >
            Create New Astronaut
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

const validateRequired = (value: string) => !!value.length;

const validateAge = (age: number) => age >= 18 && age <= 50;
