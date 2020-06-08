import Button from "@material-ui/core/Button";
import NativeSelect from "@material-ui/core/NativeSelect";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import MaterialTable from "material-table";
import React, {useEffect,  useState}from "react";
import Resources from "./resources";
import FeedbackHelp from "../feedback";
import tableIcons from '../design/icons'

const useStyles = makeStyles(theme => ({}));

export default function ActivityDesign(props) {
  const {handleToolActivity,type,courseInformation, activities, handleActivities, parentIndex, template,lessonIndex, handleSelectResourcesActivities } = props;
 
  useEffect(()=>{
    console.log("courseInformation-activity-design",courseInformation, type,lessonIndex,parentIndex)
     if(courseInformation.length!=0){
      if(type=='lesson'){
        setState(prevState=>{
          return {...prevState, data: courseInformation[parentIndex].lessons[lessonIndex].activities}
        })
      }else{
        setState(prevState=>{
          return {...prevState, data:courseInformation[parentIndex].activities}
        })
      }   
    } 
  },[])

  const classes = useStyles();
 
  const spiralTasks = { 1: "Activity", 3: "Quiz" };
  const ConsistentTasks = { 1: "Activity", 2: "Problem", 3: "Quiz" };
  const ToyBoxTasks = { 1: "Activity", 2: "Problem", 3: "Quiz", 4: "Forum" };
  const noTemplateTasks = { 1: "Activity", 3: "Quiz", 4: "Forum" };
  const typeActivies =
    template === "spiral"
      ? spiralTasks
      : template === "consistent"
      ? ConsistentTasks
      : template === "toyBox"
      ? ToyBoxTasks
      : noTemplateTasks;

  function selectOptions() {
    let rows = [];
    for (let [key, value] of Object.entries(typeActivies)) {
      // console.log(`${key}: ${value}`);
      rows.push(
        <React.Fragment>
          <option value={key}>{value}</option>
        </React.Fragment>
      );
    }

    return rows;
  }
  const [state, setState] = React.useState({
    columns: [
      {
        title: "Task Title",
        field: "activity",
        editComponent: props => (
          <TextField
            type="text"
            error={
              !props.value &&
              props.rowData.validateInput &&
              props.rowData.submitted
                ? props.rowData.error
                : false
            }
            helperText={
              !props.value &&
              props.rowData.validateInput &&
              props.rowData.submitted
                ? "Requiredaaa"
                : ""
            }
            value={props.value ? props.value : ""}
            onChange={e => {
              if (props.rowData.validateInput) {
                props.rowData.validateInput = false;
              }

              props.onChange(e.target.value);
            }}
          />
        )
      },
      {
        title: "Type",
        field: "type",
        lookup: typeActivies,

        editComponent: props => {
          return (
            <NativeSelect
              value={props.value ? props.value : ""}
              onChange={e => {
                if (props.rowData.validateInput) {
                  props.rowData.validateInput = false;
                }

                props.onChange(e.target.value);
              }}
              name="name"
              inputProps={{
                id: "name-native-error"
              }}
            >
              {selectOptions()}
            </NativeSelect>
          );
        }
      },
      { title: "Graded", field: "graded", type: "boolean" },
      { title: "Peer Reviewed", field: "preeReview", type: "boolean" },
      { title: "in group", field: "group", type: "number" },
      { title: "Part of course's project", field: "project", type: "boolean", hidden: false },
    ],
    data: activities
  });

 const [newtools, setnewtools]=useState(
  [
    { checked: false, key: "audio", label: "Audios" },
    { checked: false, key: "games", label: "Games", items: [] },
    { checked: false, key: "images", label: "Images" },
    { checked: false, key: "presentation", label: "Presentation", items: []},
    { checked: false, key: "supplemantary",label: "Supplementary Text", items: []},
    { checked: false, key: "videos", label: "Videos" }
  ]
 )
  const handleSelectResources = (activityIndex, resources) => {  
    let prev = [...state.data];
    prev[activityIndex].tools = resources;
    handleActivities(parentIndex, prev);
  };

  return (
    <React.Fragment>
      <MaterialTable
        icons={tableIcons}
        title="Tasks list"
        options={{ search: false }}
        columns={state.columns}
        data={state.data}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                console.log("NewDataActivityDesign",newData)
                newData.submitted = true;
                if (!newData.activity) {
                  newData.error = true;
                  newData.label = "required";
                  newData.helperText = "Name is required.";
                  newData.validateInput = true;
                  reject();
                  return;
                }
                resolve();
                setState(prevState => {
                  const data = [...prevState.data];
                  newData.tools=newtools;
                  data.push(newData);
                  if(type==='lesson'){
                    
                    handleSelectResourcesActivities(parentIndex, data, lessonIndex)
                  }else{
                    handleActivities(parentIndex, data);
                  }
                  
                  return { ...prevState, data };
                });
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                newData.submitted = true;
                if (!newData.activity) {
                  newData.error = true;
                  newData.label = "required";
                  newData.helperText = "Name is required.";
                  newData.validateInput = true;
                  reject();
                  return;
                }
                resolve();
                if (oldData) {
                  setState(prevState => {
                    const data = [...prevState.data];
                    data[data.indexOf(oldData)] = newData;
                    if(type=='lesson'){
                      handleSelectResourcesActivities(parentIndex, data, lessonIndex)
                    }else{
                      handleActivities(parentIndex, data);
                    }
                    return { ...prevState, data };
                  });
                }
              }, 600);
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                setState(prevState => {
                  const data = [...prevState.data];
                  data.splice(data.indexOf(oldData), 1);
                  if(type=='lesson'){
                    handleSelectResourcesActivities(parentIndex, data, lessonIndex)
                  }else{
                    handleActivities(parentIndex, data);
                  }
                  return { ...prevState, data };
                });
              }, 600);
            })
        }}
        detailPanel={
          template !== "without"
            ? [
                {
                  tooltip: "Show task resources",
                  render: rowData => {
                    return (
                      <Resources
                        handleToolActivity={handleToolActivity}
                        type="subActivity"
                        courseInformation={courseInformation}
                        tools={state.data}
                        key={"act"}
                        handleSelectResources={handleSelectResources}
                        parentIndex={parentIndex}
                        activityIndex={rowData}
                      />
                    );
                  }
                }
              ]
            : null
        }
        localization={{
          pagination: {
            // labelDisplayedRows: '{from}-{to} of {count}'
          },
          toolbar: {
            // nRowsSelected: '{0} row(s) selected'
          },
          header: {
            actions: "" //removed title of action column
          },
          body: {
            emptyDataSourceMessage: "No tasks"
          }
        }}
      />


      <FeedbackHelp
        validation={{
          error: false,
          errorMsg: "",
          errorType: "",
          a11y: null
        }}
        tipMsg="instructions"
        describedBy={"i05-helper-text"}
      />
    </React.Fragment>
  );
}