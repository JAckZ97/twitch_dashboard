import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class DashboardsService {
  // --------- HTTP request ---------
  // constructor(private http: HttpClient) { }
  // getViewerCount(gameName: string): Observable<any>{
  //   return this.http.get<any>(`http://127.0.0.1:5000/name/${gameName}`)
  // }
  // --------------------------------

  // I was trying separate the logic from the component into service
  // But I am not sure if it is due to the version socketio-client or my code
  // listen() and emitNotification() methods could not pass
  // Due to time strength, I put the logic into component first
  socket: any;
  readonly url: string = "ws://127.0.0.1:5000"
  public data$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() {
    this.socket = io(this.url, { transports : ['websocket'] });
  }

  listen = (eventName: string) => {
    this.socket.on(eventName, (data:any) =>{
      this.data$.next(data);
    });
    
    return this.data$.asObservable();
  };

  emitNotification(eventName: string){
    this.socket.emit(eventName);
  }

  connect(eventName: string){
    this.socket.on('connect');
    console.log('Connected!');
  }

  disconnect(eventName: string){
    this.socket.on('disconnect');
    console.log('Disconnected!');
  }

  error(eventName: string, err: any){
    this.socket.on('connect_error', err);
    console.log(`connect_error due to ${err.message}`)
  }

}
