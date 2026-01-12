const axios = require('axios')


const API_URL = 'http://localhost:3000'

jest.mock('axios')

describe('API Authentication', () => {
    beforeAll(async () => {
        axios.post(`${API_URL}/login`, {
            username: 'usertest',
            password: '1234567890',
        }, { withCredentials: true });
    });

    it('should be able to get tasks', async () => {
        try {
            await axios.get(`${API_URL}/tasks`, { withCredentials: true });
        } catch (error) {
            throw error;
        }
    });

    it('should be able to create new tasks', async () => {
        try {
            const formData = {
                title: 'Test title',
                details: 'Test task details',
                start_date: '2026-01-15 08:00',
                end_date: `2026-01-16 22:00`,
                status: 1
            };
            const response = await axios.post(`${API_URL}/tasks`, formData, { withCredentials: true });
        } catch (error) {
            throw error;
        }
    });

    it('should be able to update tasks', async () => {
        try {
            const formData = {
                status: 3
            };

            await axios.patch(`${API_URL}/tasks/${1}`, formData, { withCredentials: true });
        } catch (error) {
            throw error;
        }
    });

    it('should be able to delete tasks', async () => {
        try {
            await axios.delete(`${API_URL}/tasks/${1}`, { withCredentials: true });
        } catch (error) {
            throw error;
        }
    });
});

