export default interface ApiResponse {
  statusNumber: number;
  isSuccess: boolean;
  errorMessages?: Array<string>;
  result: any;
}

//example
interface apiResponse {
  data?: {
    statusCode?: number;
    isSuccess?: boolean;
    errorMessages?: Array<string>;
    result: { [key: string]: string };
  };
  error?: any;
}
