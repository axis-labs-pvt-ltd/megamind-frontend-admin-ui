import api from './api';

export interface Test {
  id: string;
  title: string;
  description: string;
  type: 'static' | 'dynamic';
  timeLimit: number;
  passingScore: number;
  questions: string[]; // IDs
}

export const testService = {
  getAllTests: async (): Promise<Test[]> => {
    const response = await api.get<Test[]>('/tests');
    return response.data;
  },

  getTestById: async (id: string): Promise<Test> => {
    const response = await api.get<Test>(`/tests/${id}`);
    return response.data;
  },

  createTest: async (data: Partial<Test>): Promise<Test> => {
    const response = await api.post<Test>('/tests', data);
    return response.data;
  },

  updateTest: async (id: string, data: Partial<Test>): Promise<Test> => {
    const response = await api.patch<Test>(`/tests/${id}`, data);
    return response.data;
  },

  deleteTest: async (id: string): Promise<void> => {
    await api.delete(`/tests/${id}`);
  },
};
