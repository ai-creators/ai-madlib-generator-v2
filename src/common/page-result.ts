export interface PageResult<T> {
  page: number;
  size: number;
  timestamp: Date;
  data: T[];
}
