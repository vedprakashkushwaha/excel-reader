import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx' 
import { ReaderService } from '../reader.service';
@Component({
  selector: 'app-excel-reader',
  templateUrl: './excel-reader.component.html',
  styleUrls: ['./excel-reader.component.scss']
})
export class ExcelReaderComponent implements OnInit {
  constructor(private readerService: ReaderService) { }
  ngOnInit(): void {
    this.records = [];
    this.fetchedData = [];
    this.pageNo = 0;
  }
  title = 'reader-front-end';
  file:  any;
  arrayBuffer: any;
  fileList: any;
  records: any;
  fetchedData: any;
  pageSize = 10;
  pageNo = 0;
  readFile(event: any){    
    this.file= event.target.files[0];     
    const fileReader = new FileReader();    
    fileReader.readAsArrayBuffer(this.file);     
    fileReader.onload = (e) => {    
      this.records = []
      this.arrayBuffer = fileReader.result;    
      const data = new Uint8Array(this.arrayBuffer);    
      const arr = new Array();    
      for(let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
      const bstr = arr.join("");    
      const workbook = XLSX.read(bstr, {type:"binary"});    
      const first_sheet_name = workbook.SheetNames[0];    
      const worksheet = workbook.Sheets[first_sheet_name];    
      this.records = XLSX.utils.sheet_to_json(worksheet,{raw:true}); 
      console.log(this.records)   
    }    
  }
  
  loadData(){
    this.readerService.loadData({data: this.records}).subscribe((data)=>{
      alert(data.msg)
    });
  }
  fetchData(){
    this.readerService.getRecords(this.pageSize, this.pageNo).subscribe((data)=>{
      this.fetchedData = data;
      if(!this.fetchedData.data.length){
        alert('unable to get data')
      }
    });
  }

  nextPage(){
    if(this.fetchedData.data.length === 10){
      this.pageNo++;
      this.fetchData();
    }
  }

  previousPage(){
    if(this.pageNo){
      this.pageNo--;
      this.fetchData();
    }
  }

}
