import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, filter } from 'rxjs';

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    originalname: string;
    size: number;
    url: string;
    path: string;
  };
}

export interface UploadProgress {
  progress: number;
  uploading: boolean;
  completed: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private readonly API_URL = '/api';
  private uploadProgressSubject = new BehaviorSubject<UploadProgress>({
    progress: 0,
    uploading: false,
    completed: false
  });

  public uploadProgress$ = this.uploadProgressSubject.asObservable();

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const req = new HttpRequest('POST', `${this.API_URL}/upload/image`, formData, {
      reportProgress: true
    });

    this.uploadProgressSubject.next({
      progress: 0,
      uploading: true,
      completed: false
    });

    return this.http.request<UploadResponse>(req).pipe(
      map((event: HttpEvent<UploadResponse>) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            const progress = Math.round(100 * event.loaded / event.total);
            this.uploadProgressSubject.next({
              progress,
              uploading: true,
              completed: false
            });
          }
          return null;
        } else if (event.type === HttpEventType.Response) {
          this.uploadProgressSubject.next({
            progress: 100,
            uploading: false,
            completed: true
          });
          return event.body!;
        }
        return null;
      }),
      filter((response): response is UploadResponse => response !== null)
    );
  }

  getUploadedImages(): Observable<any> {
    return this.http.get(`${this.API_URL}/upload/images`);
  }

  deleteImage(filename: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/upload/image/${filename}`);
  }

  resetProgress(): void {
    this.uploadProgressSubject.next({
      progress: 0,
      uploading: false,
      completed: false
    });
  }
}
