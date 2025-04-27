import * as React from "react";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridValueGetterParams,
  gridClasses
} from "@mui/x-data-grid";
import Router from 'next/router';
import Layout from "../../../../components/Layout";
import Button from "../../../../components/common/Button";
import Breadcrumbs from "../../../../components/common/Breadcrumbs";
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Slider, Stack } from "@mui/material";
import { CopyAll, Delete, Edit, VolumeDown, VolumeUp } from "@mui/icons-material";
import  ThemeService  from "../../../../services/theme.service";
import Theme from "../../../../models/theme/theme";
import DeleteAlert from "../../../../components/common/deleteAlert";
import ModalService from "../../../../components/lib/modalPopup/services/ModalService";
import ApiResponse from "../../../../models/ApiResponse";
let breadcrumbPaths = [{ name: "Home", path: "/" },{ name: "Content Management", path: "/playlist" }];

export default function DataTable() {
  const [theme, setTheme] = React.useState<Theme[]>([]);
  const [loader, setLoader] = React.useState<boolean>(false);


  React.useEffect(() => {
    fetchMyApi()
  }, [])

  async function fetchMyApi() {
    setLoader(true);
    var response = await ThemeService.getAllThemes();
    if (response.status == true) {
      setTheme(response.data);
    }
    setLoader(false);
  }

  const openModel = (component: any, props?: any) => {
    ModalService.open(component, props);
  };

  async function deleteTheme(id:any){
    //  openModel(DeleteAlert, {
    //     "onDelete": async () => {
    //       setLoader(true);
    //       var  response = await ThemeService.addTheme(theme);  
    //       if (response.status == true) {
    //         fetchMyApi();
    //       }
    //       setLoader(false);
    //     }
    // });
    if(id){
      setLoader(true);
      var  response = await ThemeService.deleteTheme(id);  
      if (response.status == true) {
        fetchMyApi();
      }
      setLoader(false);
    }
  };

  async function openThemeEditor(id:any,action:string){
    if(action == 'AddTheme'){
      Router.push({pathname:'/playlist/manage/addtheme'})
    }
    else if(action == 'EditTheme'){
      if(id){
        Router.push({pathname:'/playlist/manage/addtheme', query: { id: id }})
      }
    }
    else if(action == 'CopyTheme'){
      if(id){
        let copyTheme = theme.find( x=> x.id == id)
        if(copyTheme){
          copyTheme.themename = "Copy of " + copyTheme?.themename;
          copyTheme.themeData = JSON.parse(copyTheme?.themedata);
          setLoader(true);
          var response: ApiResponse;
          response = await ThemeService.addTheme(copyTheme);
          setLoader(false);  
          if (response.status == true) {
            var copyId = response.data.id;
            Router.push({pathname:'/playlist/manage/addtheme', query: { id: copyId }})
          }
        }
      }
    }
  };
 
  const columns: GridColDef[] = [
    {
      field: "id", headerName: "Thumbnail", width: 140, headerClassName: "hideRightSeparator",
      renderCell: (params: GridCellParams) => (
        <img
          className="w-[100px] aspect-video rounded-md"
          src={params.row.themethumbnail}
        ></img>
      ),
    },
    { 
      field: "themename", headerName: "Media Name", minWidth: 300, flex: 1,    headerClassName: "hideRightSeparator",
    },
    {
      field: "themetype", headerName: "Type", minWidth: 300, flex: 1, sortable: true, headerClassName: "hideRightSeparator",
    },
    {
      field: "volume", headerName: "", minWidth: 300, flex: 1, headerClassName: "hideRightSeparator",
      // valueGetter: (params: GridValueGetterParams) =>
      //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
      renderCell: (params: GridCellParams) =>
           <Box sx={{ width: 200, display: "flex", alignItems : 'center', gap: "10px", justifyContent : 'center' }}>
              <Edit sx={{ stroke: "#ffffff", strokeWidth: 1 }} type={"button"} onClick={() => openThemeEditor(params.row.id,'EditTheme') }/>
              <CopyAll sx={{ stroke: "#ffffff", strokeWidth: 1 }} type={"button"} onClick={() => openThemeEditor(params.row.id,'CopyTheme') }/>
              <Delete sx={{ stroke: "#ffffff", strokeWidth: 1 }} type={"button"} onClick={() => deleteTheme(params.row.id) }/>
          </Box>
    },
  ];
  
  const generateRows = (params: any) => {
    return params.map((data) => {
      return {
        themethumbnail: data.themethumbnail,
        themetype: data.themetype,
        id: data.id,
        themename: data.themename,
      };
    });
  };

  const rows = generateRows(theme);
  return (
    <Layout>
      <div className="flex justify-between items-center m-6">
        <div>
          <h2 className="text-xl font-bold">Theme Management</h2>
          <Breadcrumbs
            currentPage={"Theme Management"}
            routes={breadcrumbPaths}
          />
        </div>
        <Button onClick={() => openThemeEditor(0,'AddTheme') }>Add Theme</Button>
      </div>
      <DataGrid
        sx={{
            [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
              outline: 'none',
            },
            [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
              {
                outline: 'none',
              },
              '& .hideRightSeparator > .MuiDataGrid-columnSeparator': {
                display: 'none',
              },
          }}
        rows={rows}
        columns={columns}
        className={"m-6"}
        rowHeight={100}
        disableSelectionOnClick
        // initialState={{
        //   pagination: {
        //     paginationModel: { page: 0, pageSize: 5 },
        //   },
        // }}
        // pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </Layout>
  );
}
