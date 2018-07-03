var url = window.location.protocol + "//" + window.location.hostname;

var indexFields = [
  "Nickname",
  "First Name",
  "Last Name",
  "Primary Association"
  ]

var pathname = window.location.pathname;
console.log("Path: " + pathname);


$('document').ready(function(){
  
  
  function getContacts(index) {
    
    var options = {
      type: "GET",
      dataType: "json",
      url: url + "/json",
      index: index,
      success: getContactsSuccess,
      error: getContactsError
    }
    
    $.ajax(options);    
  }
  
  function getContactsSuccess(data) {
    var index = this.index;
    if (index < 1){
      makeIndexTable(data[0]);
      for (var i = 1; i < data.length; i++) {
        addContactToIndexTable(i, data[i]); 
      }
    } else {
      var contact = data[index];
      makeContactTable(contact, data[0]);
    }
  }
  
  function getContactsError(xhr, status, err) {
    console.log("ERROR");
    console.log(status);
    console.log(err);
  }
  
  function makeIndexTable(fields) {
    var tableHeader = "<tr><th class='id'>Id</th>"
    tableHeader += addIndexRow(fields, false);
    tableHeader += "</tr>"
    $( "#contacts-table" ).append(tableHeader);    
  }
  
  function addContactToIndexTable(index, contact) {
    var tableRow = "<tr><td class='id'><a href='/contact/" + index + "'>" + index + "</a></td>";
    tableRow += addIndexRow(contact, index)
    $( "#contacts-table" ).append(tableRow);
  }
  
  function addIndexRow(rowData, index) {
    var htmlString = "";
    var tag;
    if (index) {
      tag = "td";
    } else {
      tag = "th";
    }
    for (var i in indexFields) {
      if (rowData[indexFields[i]]) {
        htmlString += "<" + tag + ">" + rowData[indexFields[i]] + "</" + tag + ">";
      } else {
        htmlString += "<" + tag + "></" + tag + ">";
      }
      
    }
    return htmlString;
  }
  
  function makeContactTable(contact, fields) {
    var tableHTML = "";
    for (var i in fields) {
      tableHTML += "<tr><th>" + i + "</th><td>";
      if (contact[i]) {
       tableHTML += contact[i];
      }
      tableHTML += "</td></tr>";
    }
    $( "#contact-table" ).append(tableHTML);
  }
  
  if (pathname === "/"){
    getContacts(0);
  } else {
    var pathArray = pathname.split("/");
    var index = pathArray[pathArray.length - 1];
    getContacts(index);
  }
});