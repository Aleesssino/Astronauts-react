import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  type MaterialReactTableProps,
  type MRT_Cell,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';
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
//  MenuItem,
  Stack,
  TextField,
  ThemeProvider,
  Tooltip,
  createTheme
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Astronaut as AstronautModel } from "../models/astronaut";
import * as AstronautApi from "../network/crud"


export default function AstronautsTable() {
        const [astronautsData, setAstronautsData] = useState<AstronautModel[]>([]);
      /*  useEffect(() => {
          async function loadAstronauts() {
            try {
              const astronautsData = await AstronautApi.fetchAstronauts();
              setAstronautsData(astronautsData);
            } catch (error) {
              console.error(error);
              alert(error);
            }
          }
          loadAstronauts();
        }, []);
      */
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
  const [tableData, setTableData] = useState<AstronautModel[]>(() => astronautsData);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});
// lets try 

  const handleCreateNewRow = async (values: AstronautModel) => {
    try {
      const createdAstronaut = await AstronautApi.createAstronaut(values);
      setAstronautsData((prevAstronautsData) => [...prevAstronautsData, createdAstronaut]);
      
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };
  
  

  const handleSaveRowEdits: MaterialReactTableProps<AstronautModel>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
        //tableData[row.index] = values;
        //send/receive api updates here, then refetch or update local table data for re-render
        //setTableData([...tableData]);
        //mozno vyjde #######################################################
      
        //setAstronautsData([...astronautsData]);
       //onSubmit={updateAstronaut(row.index, values)};
        //exitEditingMode(); //required to exit editing mode and close modal

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
          console.error('Error updating astronaut:', error);
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
        //dopis toooottttooo
        // eslint-disable-next-line no-restricted-globals
        confirm(`Are you sure you want to delete ${row.getValue('name')}`)
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
    [astronautsData],
  );

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<AstronautModel>,
    ): MRT_ColumnDef<AstronautModel>['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === 'email'
              ? validateEmail(event.target.value)
              : cell.column.id === 'age'
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
    [validationErrors],
  );

  const columns = useMemo<MRT_ColumnDef<AstronautModel>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'age',
        header: 'Age',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'nationality',
        header: 'nationality',
        size: 150,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          //type: 'email',
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
        accessorKey: 'spaceAgency',
        header: 'agency',
        size: 150,
        muiTableBodyCellEditTextFieldProps: ({cell}) => ({
            ...getCommonEditTextFieldProps(cell),
        //este som vynechal:
        /* accessorKey: 'state',
        header: 'State',
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: states.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem> */
        }),
        },
        {
        accessorKey: 'missionsCompleted',
        header: 'mission#',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        },
        {
        accessorKey: 'skills',
        header: 'skills',
        size: 200,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        },
      
    ],
    [getCommonEditTextFieldProps],
  );

  const darkTheme = createTheme({
    palette:{
      mode: "dark",
    },
   });

   

  

  return (
    <>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <Container>
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
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
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit/>
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
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
        onSubmit={handleCreateNewRow} 
        onAstronautSaved = {() =>
          setCreateModalOpen(false)
        } 
      
        />
      
    </>
  );
};

interface CreateModalProps {
  columns: MRT_ColumnDef<AstronautModel>[];
  onClose: () => void;
  onSubmit: (values: AstronautModel) => void;
  astronautTOEdit?: AstronautModel;
  onAstronautSaved: (astronaut: AstronautModel) => void,
  //onDeleteAstronautClicked: (astronaut: AstronautModel) => void,
  open: boolean;
}

//example of creating a mui dialog modal for creating new rows
export const CreateNewAstronautModal = ({
  open,
  columns,
  onClose,
  onSubmit,
  astronautTOEdit,
  onAstronautSaved
}: CreateModalProps) => {
  const [values, setValues] = useState<any>(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {} as any),
  );

  const darkTheme = createTheme({
    palette:{
      mode: "dark",
    },
   });

   const handleSubmit = async (input: AstronautApi.AstronautInput) => {
    try {
      let astronautResponse: AstronautModel;
      if (astronautTOEdit) {
        astronautResponse = await AstronautApi.updateAstronaut(astronautTOEdit._id, values);
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
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
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
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={() => handleSubmit(values)} variant="contained">
          Create New Astronaut
        </Button>
      </DialogActions>     
    </Dialog>
    </ThemeProvider>
    
  );
};

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
const validateAge = (age: number) => age >= 18 && age <= 50;


