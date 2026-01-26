// src/navigation/types.ts
import { NavigatorScreenParams } from '@react-navigation/native';


// Root Stack (top level)
export type RootStackParamList = {
    Login: undefined;
    CompleteProfile: undefined;
    Main: NavigatorScreenParams<AdminDrawerParamList> | undefined;
  };
  
// Drawer screens
export type AdminDrawerParamList = {
    Dashboard: undefined;
    Students: undefined;
    Teachers: undefined;
    Attendance: undefined;
    Exams: undefined;
    Fees: undefined;
    Settings: undefined;
    // add more as needed
  };