import apiClient from './api';
import { ApiResponse, Ad, AdStats } from './services';

/**
 * Post Ads API Client
 * All endpoints for managing marquee/header ads
 */

// ==================== POST ADS APIs ====================

/**
 * 4.1 Get All Post Ads
 * GET /api/ads
 * Supports search, status, and priority filtering
 */
export const getAds = async (params?: {
  search?: string;
  status?: string;
  priority?: string;
}): Promise<ApiResponse<Ad[]>> => {
  const response = await apiClient.get('/api/ads', { params });
  return response.data;
};

/**
 * 4.2 Get Ad Statistics
 * GET /api/ads/stats
 */
export const getAdStats = async (): Promise<ApiResponse<AdStats>> => {
  const response = await apiClient.get('/api/ads/stats');
  return response.data;
};

/**
 * 4.3 Create Post Ad
 * POST /api/ads
 */
export const createAd = async (data: {
  title: string;
  content: string;
  link?: string;
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  endDate: string;
  isActive?: boolean;
}): Promise<ApiResponse<Ad>> => {
  const response = await apiClient.post('/api/ads', data);
  return response.data;
};

/**
 * 4.4 Update Post Ad
 * PUT /api/ads/:id
 */
export const updateAd = async (
  id: string,
  data: Partial<{
    title: string;
    content: string;
    link: string;
    priority: 'high' | 'medium' | 'low';
    startDate: string;
    endDate: string;
    isActive: boolean;
  }>
): Promise<ApiResponse<Ad>> => {
  const response = await apiClient.put(`/api/ads/${id}`, data);
  return response.data;
};

/**
 * 4.5 Toggle Ad Status (Active/Inactive)
 * PUT /api/ads/:id/toggle
 */
export const toggleAdStatus = async (id: string): Promise<ApiResponse<Ad>> => {
  const response = await apiClient.put(`/api/ads/${id}/toggle`);
  return response.data;
};

/**
 * 4.6 Deactivate All Ads
 * PUT /api/ads/deactivate-all
 */
export const deactivateAllAds = async (): Promise<ApiResponse<{ count: number; message: string }>> => {
  const response = await apiClient.put('/api/ads/deactivate-all');
  return response.data;
};

/**
 * 4.7 Delete Post Ad
 * DELETE /api/ads/:id
 */
export const deleteAd = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.delete(`/api/ads/${id}`);
  return response.data;
};

