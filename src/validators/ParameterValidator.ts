interface ValidateResult {}

interface ParameterValidator {
  name: string;
  validator?(value: any): ValidateResult;
}

type ParameterType = ParameterValidator | string;

export {
  ValidateResult,
  ParameterValidator,
  ParameterType
};
