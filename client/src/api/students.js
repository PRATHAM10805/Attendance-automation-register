import axios from 'axios';

const BASE = 'http://localhost:5000/api/students';

export const getStudents = () => axios.get(BASE);
export const addStudent = (data) => axios.post(BASE, data);
export const deleteStudent = (id) => axios.delete(`${BASE}/${id}`);
export const updateAttendance = (id, attendance) => axios.patch(`${BASE}/${id}/attendance`, { attendance });
export const updateMarks = (id, marks) => axios.patch(`${BASE}/${id}/marks`, { marks });
export const toggleLock = (id) => axios.patch(`${BASE}/${id}/lock`);
