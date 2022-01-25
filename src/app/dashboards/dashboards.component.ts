import { Component, OnInit } from '@angular/core';
import { DashboardsService } from '../dashboards.service';
import io from 'socket.io-client';
import {Chart, registerables} from 'chart.js';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.css']
})
export class DashboardsComponent implements OnInit {
  partOne = 'Rainbow Six viewer =>  ';
  partTwo = 'Line Chart of Game Comparison';
  viewerCount: any;
  socket: any;
  lineChart: any = [];
  viewerCountFar: any = [];
  viewerCountAssassin: any = [];
  viewerCountRainbow: any = [];
  viewerCountTime: any = [];
  counter: number = 0;

  // --------- socket service --------- 
  // constructor(private service: DashboardsService) {  }
  // ----------------------------------

  constructor() {
    this.socket = io.connect('https://ubisoftbackend.herokuapp.com', { transports : ['websocket'] });
    Chart.register(...registerables);
  }

  ngOnInit() : void { 
    // --------- HTTP request ---------
    // ----- HTTP request was added for testing at the beginning ----- 
    // this.refreshViewcount();
    // --------------------------------

    // ------------ Socket ------------
    // Using socket-io-client v2.4.0 instead of v4.4.1 resolve the connect issue
    this.socket.on('connect', () =>{
      console.log('Connected!');
    });

    this.socket.on('disconnect', () =>{
      console.log('Disconnected!');
    });

    this.socket.emit('Stream_viewer');
    
    setInterval(()=>{
      // emit to "Stream_viewer" every 10s to trigger the backend to  
      // emit back new twitch streamer viewer count
      this.socket.emit('Stream_viewer');
    }, 10000);

    this.socket.on('Stream_viewer', (data: any) =>{
      console.log(data);
      this.viewerCount = data["Rainbow Six Siege"];

      // display 10 newest data compare only
      if (this.counter < 10){
        this.addCharLabel(this.lineChart, data["time"]);
        this.addCharData(this.lineChart, data["Far Cry 5"], 0);
        this.addCharData(this.lineChart, data["Assassin's Creed Odyssey"], 1);
        this.addCharData(this.lineChart, data["Rainbow Six Siege"], 2);
        this.counter ++;
      }
      else{
        this.updateChartLabel(this.lineChart, data["time"]);
        this.updateChartData(this.lineChart, data["Far Cry 5"], 0);
        this.updateChartData(this.lineChart, data["Assassin's Creed Odyssey"], 1);
        this.updateChartData(this.lineChart, data["Rainbow Six Siege"], 2);
        this.counter ++;
      }

    });

    this.socket.on("connect_error", (err: any) => {
      console.log(`connect_error due to ${err.message}`);
    });
    // ----------------------------------

    // --------- Socket service --------- 
    // this.service.connect('connect');
    // this.service.disconnect('disconnect');

    // setInterval(()=>{
    //   this.service.emitNotification('Stream_viewer')
    // }, 10000);

    // this.service.listen('server_response').subscribe((data: any) =>
    //   this.viewerCount = data
    // )
    // ----------------------------------

    // ----------- Line chart -----------
    this.lineChart = new Chart('canvas', {
      type: 'line',
      data: {
          labels: [],
          datasets: [
            {
              label: "Far Cry 5",
              data: [],
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgb(75, 192, 192)',
              borderWidth: 1
            },
            
            {
            label: "Assassin's Creed Odyssey",
            data: [],
            borderColor: 'rgb(192, 75, 87)',
            backgroundColor: 'rgb(192, 75, 87)',
            borderWidth: 1
            },
            
            {
            label: "Rainbow Six Siege",
            data: [],
            borderColor: 'rgb(75, 83, 192)',
            backgroundColor:'rgb(75, 83, 192)',
            borderWidth: 1
            }
        ]
      }
    });
  };

  // Updating line chart methods
  addCharData(lineChart: any, data: any, dataSetIndex: number){
    lineChart.data.datasets[dataSetIndex].data.push(data);
    lineChart.update();
  }

  updateChartData(lineChart: any, data: any, dataSetIndex: number){
    lineChart.data.datasets[dataSetIndex].data.shift();
    lineChart.data.datasets[dataSetIndex].data.push(data);
    lineChart.update();
  }

  addCharLabel(lineChart: any, data: any){
    lineChart.data.labels.push(data);
    lineChart.update();
  }

  updateChartLabel(lineChart: any, data: any){
    lineChart.data.labels.shift();
    lineChart.data.labels.push(data);
    lineChart.update();
  }
  // --------- HTTP request ---------
  // refreshViewcount(){
  //   this.service.getViewerCount("Far Cry 5").subscribe(data =>{
  //     this.viewerCount = data["viewer_count"]
  //     // console.log(data)
  //   });
  // }
  // --------------------------------

}
