import { Observable } from 'rxjs';
import { ZipTaskProgress } from './zip-task-progress.interface';

export interface ZipTask {
  progress: Observable<ZipTaskProgress>;
  data: Observable<Blob>;
}