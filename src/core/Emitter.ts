import { ParameterType } from '../validators';
import { logError } from '../utils';

interface InterceptorParams {
  name: string;
  handler: Function;
  parameters: ParameterType[]
}

const enum InterceptorEnum {
  AfterOn = 'afterOn',
  BeforeEmit = 'beforeEmit',
  AfterEmit = 'afterEmit',
  Done = 'done'
}

interface Interceptor {
  name: string;
  [InterceptorEnum.AfterOn]?(params: InterceptorParams): InterceptorParams | void;
  [InterceptorEnum.BeforeEmit]?(params: any[]): void;
  [InterceptorEnum.AfterEmit]?(params: any[]): void;
  [key: string]: any;
}

type TransformValueToArray<T extends object> = {
  [K in keyof T]: T[K][];
};

abstract class Emitter {
  protected eventMap = new Map<string, Function>();
  protected interceptors: Interceptor[] = [];
  protected interceptorObj: TransformValueToArray<Omit<Interceptor, 'name'>> = {};

  constructor(
    protected parameters: ParameterType[] = []
  ) {
  }

  protected validateParameters(params: any[]): boolean {
    return true;
  }

  protected getParameters(params: any[]): any[] | void {
    const {
      parameters,
      validateParameters
    } = this;
    params = params.slice(0, parameters.length);
    if (validateParameters(params)) {
      return params;
    }
  }

  protected runInterceptor(type: InterceptorEnum, ...params: any[]): void {
    const { interceptorObj } = this;
    const interceptorList = interceptorObj[type];
    interceptorList.forEach((fn): void => {
      fn(...params);
    });
  }

  public intercept(newInterceptor: Interceptor): void {
    const {
      interceptors,
      interceptorObj
    } = this;
    interceptors.push(newInterceptor);
    Object.keys(newInterceptor)
      .forEach((key): void => {
        if (!interceptorObj[key]) {
          interceptorObj[key] = [];
        }
        interceptorObj[key].push(newInterceptor[key]);
      });
  }

  public on(name: string, handler: Function): void {
    this.eventMap.set(name, handler);
  }

  public off(name: string): void {
    this.eventMap.delete(name);
  }

  public once(): void { }

  public emit(...params: any[]): void {
    const {
      getParameters,
      runInterceptor,
      run
    } = this;
    runInterceptor(InterceptorEnum.BeforeEmit, params);
    const newParams = getParameters(params);
    if (!newParams) return;
    run(newParams);
    runInterceptor(InterceptorEnum.AfterEmit, newParams);
  }

  /**
   * Child emitter should implement this method that how to run every handler.
   * @param params
   */
  abstract run(params: any[]): void
}

export {
  InterceptorEnum,
  Emitter
};
