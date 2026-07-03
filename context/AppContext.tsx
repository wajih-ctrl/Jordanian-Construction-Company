'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Project, Record, RequiredAction, ProgrammeImpact, CostImpact } from '@/lib/types';
import {
  generateMockUsers,
  generateMockProjects,
  generateMockRecords,
  generateMockActions,
  generateMockProgrammeImpacts,
  generateMockCostImpacts,
} from '@/lib/mock-data';

const reviveRecord = (record: Record): Record => ({
  ...record,
  dateReceived: new Date(record.dateReceived),
  eventDate: record.eventDate ? new Date(record.eventDate) : undefined,
  instructionDate: record.instructionDate ? new Date(record.instructionDate) : undefined,
  responseDueDate: record.responseDueDate ? new Date(record.responseDueDate) : undefined,
  closureDate: record.closureDate ? new Date(record.closureDate) : undefined,
  actionDueDate: record.actionDueDate ? new Date(record.actionDueDate) : undefined,
  createdAt: new Date(record.createdAt),
  updatedAt: new Date(record.updatedAt),
  attachments: record.attachments.map((attachment) => ({
    ...attachment,
    uploadedAt: new Date(attachment.uploadedAt),
  })),
  comments: record.comments.map((comment) => ({
    ...comment,
    createdAt: new Date(comment.createdAt),
  })),
  actionHistory: record.actionHistory.map((history) => ({
    ...history,
    timestamp: new Date(history.timestamp),
  })),
});

interface AppContextType {
  // Auth
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;

  // Data
  users: User[];
  projects: Project[];
  records: Record[];
  actions: RequiredAction[];
  programmeImpacts: ProgrammeImpact[];
  costImpacts: CostImpact[];

  // Selected Project
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;

  // Project Mutations
  addProject: (project: Project) => void;

  // User Mutations
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;

  // Records Mutations
  updateRecord: (record: Record) => void;
  addRecord: (record: Record) => void;
  deleteRecord: (id: string) => void;
  getRecordById: (id: string) => Record | undefined;

  // UI State
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [actions, setActions] = useState<RequiredAction[]>([]);
  const [programmeImpacts, setProgrammeImpacts] = useState<ProgrammeImpact[]>([]);
  const [costImpacts, setCostImpacts] = useState<CostImpact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUsersJson = typeof window !== 'undefined' ? window.localStorage.getItem('jordanianCompanyUsers') : null;
    const savedProjectsJson = typeof window !== 'undefined' ? window.localStorage.getItem('jordanianCompanyProjects') : null;
    const savedRecordsJson = typeof window !== 'undefined' ? window.localStorage.getItem('jordanianCompanyRecords') : null;
    const mockUsers = savedUsersJson ? (JSON.parse(savedUsersJson) as User[]) : generateMockUsers();
    const mockProjects = savedProjectsJson
      ? (JSON.parse(savedProjectsJson) as Project[]).map((project) => ({
          ...project,
          startDate: new Date(project.startDate),
          endDate: new Date(project.endDate),
          lastActivity: new Date(project.lastActivity),
        }))
      : generateMockProjects();
    const mockRecords = savedRecordsJson ? (JSON.parse(savedRecordsJson) as Record[]).map(reviveRecord) : generateMockRecords();
    const mockActions = generateMockActions(mockRecords);
    const mockProgrammeImpacts = generateMockProgrammeImpacts(mockRecords);
    const mockCostImpacts = generateMockCostImpacts(mockRecords);

    const savedUserId = typeof window !== 'undefined' ? window.localStorage.getItem('jordanianCompanyUserId') : null;
    const savedProjectId = typeof window !== 'undefined' ? window.localStorage.getItem('jordanianCompanyProjectId') : null;
    const savedUser = savedUserId ? mockUsers.find((user) => user.id === savedUserId) : null;
    const savedProject = savedProjectId ? mockProjects.find((project) => project.id === savedProjectId) : null;

    setUsers(mockUsers);
    setProjects(mockProjects);
    setRecords(mockRecords);
    setActions(mockActions);
    setProgrammeImpacts(mockProgrammeImpacts);
    setCostImpacts(mockCostImpacts);
    setCurrentUser(savedUser || null);
    setSelectedProject(savedProject || mockProjects[0]);
    setLoading(false);
  }, []);

  const persistUsers = (nextUsers: User[]) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('jordanianCompanyUsers', JSON.stringify(nextUsers));
  };

  const persistProjects = (nextProjects: Project[]) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('jordanianCompanyProjects', JSON.stringify(nextProjects));
  };

  const persistRecords = (nextRecords: Record[]) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('jordanianCompanyRecords', JSON.stringify(nextRecords));
  };

  const addUser = (user: User) => {
    setUsers((prev) => {
      const next = [...prev, user];
      persistUsers(next);
      return next;
    });
  };

  const updateUser = (updatedUser: User) => {
    setUsers((prev) => {
      const next = prev.map((user) => (user.id === updatedUser.id ? updatedUser : user));
      persistUsers(next);
      return next;
    });
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => {
      const next = prev.filter((user) => user.id !== id);
      persistUsers(next);
      return next;
    });
  };

  const handleSetCurrentUser = (user: User | null) => {
    setCurrentUser(user);
    if (typeof window === 'undefined') return;
    if (user) {
      window.localStorage.setItem('jordanianCompanyUserId', user.id);
    } else {
      window.localStorage.removeItem('jordanianCompanyUserId');
    }
  };

  const handleSetSelectedProject = (project: Project | null) => {
    setSelectedProject(project);
    if (typeof window === 'undefined') return;
    if (project) {
      window.localStorage.setItem('jordanianCompanyProjectId', project.id);
    } else {
      window.localStorage.removeItem('jordanianCompanyProjectId');
    }
  };

  const addProject = (project: Project) => {
    setProjects((prev) => {
      const next = [...prev, project];
      persistProjects(next);
      return next;
    });
    handleSetSelectedProject(project);
  };

  const logout = () => {
    handleSetCurrentUser(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('jordanianCompanyProjectId');
    }
  };

  const updateRecord = (updatedRecord: Record) => {
    setRecords((prev) => {
      const next = prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r));
      persistRecords(next);
      return next;
    });
  };

  const addRecord = (newRecord: Record) => {
    setRecords((prev) => {
      const next = [...prev, newRecord];
      persistRecords(next);
      setActions(generateMockActions(next));
      setProgrammeImpacts(generateMockProgrammeImpacts(next));
      setCostImpacts(generateMockCostImpacts(next));
      return next;
    });
    setProjects((prev) => {
      const next = prev.map((project) =>
        project.id === newRecord.projectId
          ? {
              ...project,
              totalRecords: project.totalRecords + 1,
              costImpactRecords: project.costImpactRecords + (newRecord.hasCostImpact ? 1 : 0),
              programmeImpactRecords: project.programmeImpactRecords + (newRecord.hasProgrammeImpact ? 1 : 0),
              claimRiskItems: project.claimRiskItems + (newRecord.hasClaimRisk ? 1 : 0),
              lastActivity: new Date(),
            }
          : project
      );
      persistProjects(next);
      return next;
    });
  };

  const deleteRecord = (id: string) => {
    setRecords((prev) => {
      const next = prev.filter((r) => r.id !== id);
      persistRecords(next);
      setActions(generateMockActions(next));
      setProgrammeImpacts(generateMockProgrammeImpacts(next));
      setCostImpacts(generateMockCostImpacts(next));
      return next;
    });
  };

  const getRecordById = (id: string) => {
    const exactMatch = records.find((r) => r.id === id);
    if (exactMatch) return exactMatch;

    const match = /^rec-(\d+)$/.exec(id);
    if (match) {
      const paddedId = `rec-${match[1].padStart(4, '0')}`;
      return records.find((r) => r.id === paddedId);
    }

    return undefined;
  };

  const value: AppContextType = {
    currentUser,
    setCurrentUser: handleSetCurrentUser,
    logout,
    users,
    projects,
    records,
    actions,
    programmeImpacts,
    costImpacts,
    selectedProject,
    setSelectedProject: handleSetSelectedProject,
    addProject,
    addUser,
    updateUser,
    deleteUser,
    updateRecord,
    addRecord,
    deleteRecord,
    getRecordById,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
