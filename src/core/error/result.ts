export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export const Success = <T>(data: T): Result<T, any> => ({ success: true, data });
export const Failure = <E>(error: E): Result<any, E> => ({ success: false, error });

export class EngineComputationException extends Error {
  engineName: string;
  constructor(message: string, engineName: string) {
    super(message);
    this.name = 'EngineComputationException';
    this.engineName = engineName;
  }
}
