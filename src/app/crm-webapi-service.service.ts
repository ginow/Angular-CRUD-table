import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

interface XrmContext {
  getClientUrl(): string;
}
interface ICRMresponse {
  odatacontext: string;
  value: IContactRecord[];
}

export interface IContactRecord {
  odataetag: string;
  fullname: string;
  emailaddress1: string;
  telephone1: string;
  statecode: string;
  contactid: string;
  ownerid: string;
}

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0"
  })
};

@Injectable({
  providedIn: 'root'
})
export class CrmWebapiServiceService {

  private _url: string;
  constructor(private http: HttpClient) { }
  getContacts(): Observable<ICRMresponse> {
    console.log("Inside getContacts()");
    this._url = this.getUrl();
    console.log("GET url: " + this._url);
    return this.http.get<ICRMresponse>(this._url).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  deleteContacts(entityPluralName, id): Observable<{}> {
    console.log("Inside deleteContacts()");
    this._url = this.deleteUrl(entityPluralName, id);
    console.log("delete url: " + this._url);
    return this.http.delete(this._url,httpOptions).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  getUrl() {
    if (window.parent != null && window.parent['Xrm'] != null) {
      var x = window.parent["Xrm"]["Page"]["context"] as XrmContext;
      if (x != null) {
        console.log("Window parent Xrm object exists");
        return x.getClientUrl() + "/api/data/v9.1/contacts" + "?$select=fullname,ownerid,emailaddress1,telephone1,statecode,contactid";
      }
    }
    // fallback for development environment
    console.log("Falling back for development environment.");
    return "/assets/testData/crmTestData.json";
  }
  deleteUrl(entityPluralName, id) {
    if (window.parent != null && window.parent['Xrm'] != null) {
      var x = window.parent["Xrm"]["Page"]["context"] as XrmContext;
      if (x != null) {
        console.log("Window parent Xrm object exists");
        id = id.replace('{', '').replace('}', '');
        return x.getClientUrl() + "/api/data/v9.1/" + entityPluralName + "(" + id + ")";
      }
    }
    // fallback for development environment
    console.log("Falling back for development environment.");
    return null;
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

}
