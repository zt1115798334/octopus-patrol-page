/**
 * Common enums matching the backend API
 */

export enum DeleteState {
  UN_DELETE = 'UN_DELETE',
  DELETE = 'DELETE',
}

export enum EnabledState {
  OFF = 'OFF',
  ON = 'ON',
}

export enum Operate {
  SAVE = 'SAVE',
  FIND = 'FIND',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  SEND = 'SEND',
  SIGN_IN = 'SIGN_IN',
}

export enum SortType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum AiVendor {
  OPENAI = 'OPENAI',
  DEEPSEEK = 'DEEPSEEK',
  ZHIPU = 'ZHIPU',
  TONGYI = 'TONGYI',
  CUSTOM = 'CUSTOM',
}

export enum PlanLevel {
  FREE = 'FREE',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum PlatformCode {
  XHS = 'XHS',
  XIE_HE = 'XIE_HE',
}

export enum BasedType {
  APP = 'APP',
  WEB = 'WEB',
}

export enum TimeUnits {
  DAYS = 'DAYS',
  HOURS = 'HOURS',
  MINUTES = 'MINUTES',
  SECONDS = 'SECONDS',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
  TRACE = 'TRACE',
  ALL = 'ALL',
}

export enum VisitStatsType {
  PV = 'PV',
  IP = 'IP',
  SAVE = 'SAVE',
  FIND = 'FIND',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  SEND = 'SEND',
  SIGN_IN = 'SIGN_IN',
}
