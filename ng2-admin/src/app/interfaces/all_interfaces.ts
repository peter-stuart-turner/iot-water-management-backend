import { GeneralSettings } from '../interfaces/generalSettings';
/*
Roles
*/
export interface UserRole_IF{
  role: string;
  roleCode: number;
}
/*
  Profiles
*/
export interface AdminProfile_IF {
  uid: string;
  role: string;
  email: string;
  user_name: string;
  first_name: string;
  last_name: string;
  clients: Array<ClientProfile_IF>;
  general_settings: MainSettingsAdmin_IF;
}
export interface TechnicianProfile_IF {
  uid: string;
  role: string;
  email: string;
  user_name: string;
  first_name: string;
  last_name: string;
  clients: Array<ClientProfile_IF>;
  general_settings: MainSettingsTechnician_IF;
}
export interface ClientProfile_IF {
  uid: string;
  role: string;
  email: string;
  user_name: string;
  first_name: string;
  last_name: string;
  systems: any;
  general_settings: MainSettingsClient_IF;
}
/*
  General Settings
*/
export interface MainSettingsAdmin_IF {
  troubleshooting?: boolean;
}
export interface MainSettingsTechnician_IF {
  troubleshooting?: boolean;
}
export interface MainSettingsClient_IF {
  familySharing: boolean;
  familyName: string;
}
/*
  Systems
*/
export interface System_IF {
  GSID: string;
  active: boolean;
  system_model: string;
  realTimeData?: any;
}
