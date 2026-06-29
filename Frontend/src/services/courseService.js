import api from './api';

export const getCourses = async (params) => {
    const response = await api.get('/courses', { params: { ...params, size: 9999 } });
    return response.data;
};

export const getCourseDetail = async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
};

export const createCourse = async (payload) => {
    const response = await api.post('/courses', payload);
    return response.data;
};

export const updateCourse = async (id, payload) => {
    const response = await api.put(`/courses/${id}`, payload);
    return response.data;
};

export const deleteCourse = async (id) => {
    await api.delete(`/courses/${id}`);
};

export const updatePrerequisites = async (id, prerequisiteIds) => {
    const response = await api.put(`/courses/${id}/prerequisites`, prerequisiteIds);
    return response.data;
};

export const uploadResource = async (courseId, title, resourceType, linkUrl, file = null) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('resourceType', resourceType);
    if (file) {
        formData.append('file', file);
    }
    if (linkUrl) {
        formData.append('linkUrl', linkUrl);
    }
    const response = await api.post(`/courses/${courseId}/resources`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteResource = async (id) => {
    await api.delete(`/resources/${id}`);
};
