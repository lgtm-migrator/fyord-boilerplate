export enum StatePaths {
  Root = '',
  UserAge = 'userAge'
}

export type State = {
  userAge: number
};

export const InitialState = {
  userAge: 30
} as State;
