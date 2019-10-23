import Breadcrumb from "./breadcrumb";

declare class Event {
  private constructor();

  public static getStacktrace(
    error: any,
    errorFramesToSkip?: number,
    generatedFramesToSkip?: number,
  ): Stackframe[];

  public app: App;
  public device: Device;
  public request: Request;

  public errors: Error[];
  public breadcrumbs: Breadcrumb[];

  public severity: "info" | "warning" | "error";

  public readonly originalError: any;

  public apiKey?: string;
  public context?: string;
  public groupingHash?: string;

  // user
  public getUser(): { id?: string; name?: string; email?: string };
  public setUser(id: string, name?: string, email?: string): void;
  public clearUser(): void;

  // metadata
  public addMetadata(section: string, values: { [key: string]: any }): void;
  public addMetadata(section: string, key: string, value: any): void;
  public getMetadata(section: string, key?: string): any;
  public clearMetadata(section: string, key?: string): void;
}

interface HandledState {
  severity: string;
  unhandled: boolean;
  severityReason: {
    type: string;
    [key: string]: any;
  };
}

interface Stackframe {
  file: string;
  method?: string;
  lineNumber?: number;
  columnNumber?: number;
  code?: object;
  inProject?: boolean;
}

interface Error {
  class: string;
  message: string;
  stacktrace: Stackframe[];
}

interface Device {
  runtimeVersions: {
    [key: string]: any;
  };
  [key: string]: any;
}

interface App {
  version?: string;
  releaseStage?: string;
  type?: string;
  [key: string]: any;
}

interface Request {
  url?: string;
  [key: string]: any;
}

export default Event;
