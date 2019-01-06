import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { CrmWebapiServiceService, IContactRecord } from '../crm-webapi-service.service';

const initialSelection = [];
const allowMultiSelect = true;

@Component({
  selector: 'app-editable-table',
  templateUrl: './editable-table.component.html',
  styleUrls: ['./editable-table.component.css']
})
export class EditableTableComponent implements OnInit {
  displayedColumns: string[] = ['select', 'fullname', 'emailaddress1', 'telephone1', 'statecode', 'actionsColumn'];

  dataSource = null;
  selection = new SelectionModel<IContactRecord>(allowMultiSelect, initialSelection);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //initialise crm-webapi-service before DOM is ngOnInit
  constructor(private _crmwebapiservice: CrmWebapiServiceService) { }

  ngOnInit() {
    console.log("Retrieving contacts...");
    this._crmwebapiservice.getContacts().subscribe(
      data => {
        console.log("data retrieved:\n" + data);
        this.dataSource = new MatTableDataSource<IContactRecord>(data.value);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        // Show edit button for row during page load
        this.dataSource.data.forEach(row => row.editing = false);
      },
      error => console.log(error));

    /*
    this.createCRMdata();
    */
  }

  createCRMdata() {
    var req = new XMLHttpRequest()
    req.open("POST", encodeURI("https://fellow4.crm8.dynamics.com" + "/api/data/v9.1/accounts"), true);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.onreadystatechange = function () {
      if (this.readyState == 4 /* complete */) {
        req.onreadystatechange = null;
        if (this.status == 204) {
          var accountUri = this.getResponseHeader("OData-EntityId");
          console.log("Created account with URI: " + accountUri)
        }
        else {
          var error = JSON.parse(this.response).error;
          console.log(error.message);
        }
      }
    };
    req.send(JSON.stringify({ name: "Sample account" }));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  fireDelete() {

    console.log("Deleting selected records...");
    this.selection.selected.forEach(row => this.dataSource.data.splice(this.dataSource.data.indexOf(row), 1));

    this.selection.selected.forEach(

      row => {
        debugger;
        this._crmwebapiservice.deleteContacts("contacts", row.contactid).subscribe(
          data => {
            console.log("data deleted:\n" + data);
          },
          error => alert(error)
        )
      }
    );

    //refresh

    //Not working will need to look later
    //this.myMatTable.renderRows();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    //since the selected rows have been deleted clear all the selections
    this.selection.clear();
  }
  startEdit(row) {
    //since the editing has started change icon from "Edit" to "Check" and "Cancel"
    row.editing = true;
  }
  cancelOrDelete(row) {
    //since the editing has finished change icon from "Check" and "Cancel" to "Edit"
    row.editing = false;
  }
  saveEdit(row) {
    debugger
    // overwrite the data with new from the user inputs
    row.fullname = row.editedfullname;
    row.emailaddress1=row.editedemailaddress1;
    row.telephone1=row.editedtelephone1;

    // Clear the temporary variables
    row.editedfullname="";
    row.editedemailaddress1="";
    row.editedtelephone1="";
    //since the editing has finished change icon from "Check" and "Cancel" to "Edit"
    row.editing = false;
    this._crmwebapiservice.updateContacts("contacts", row).subscribe(
      data => {
        console.log("data updated:\n" + data);
      },
      error => alert(error)
    )
  }
  createNew(){
    debugger
    // Set empty values
    this.dataSource.data.push({"fullname": "",
    "emailaddress1": "",
    "telephone1": ""});

    // Sort the table by 'fullname' so that newly created blank data comes at the top
    this.sort.active = 'fullname'; // Use a column which can't be empty (i.e. which is mandatory) for sorting otherwise you'll get bizarre results
    this.sort.direction = 'asc';
    this.sort.sortChange.emit(); // Fire the event which is otherwise done by mouseclick
    this.dataSource.sort=this.sort;
    this.paginator.firstPage(); // Go to first page 
    this.applyFilter(""); // Clear filters if any
    //Enable the editing of the newly added row (which is pushed as last row in the datasource);
    this.dataSource.data[this.dataSource.data.length-1].editing=true;   
  }
}
