import { ParameterType } from '../validators';
import {
  Emitter
} from './Emitter';

class SyncEmitter extends Emitter {
  constructor(
    parameters: ParameterType[] = []
  ) {
    super(parameters);
  }

  run(...params: any[]): void {
    const {
      eventMap
    } = this;
    eventMap.forEach((handler): void => {
      handler(...params);
    });
  }
}

export {
  SyncEmitter
};
