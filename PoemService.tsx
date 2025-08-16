import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-5cd263ef`;

export interface Poem {
  id?: string;
  title_urdu: string;
  title_hindi: string;
  title_english: string;
  content_urdu: string;
  content_hindi: string;
  content_english: string;
  author_urdu: string;
  author_hindi: string;
  author_english: string;
  category?: string;
  scheduled_date?: string;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
  audio_url_urdu?: string;
  audio_url_hindi?: string;
  audio_url_english?: string;
  tags?: string[];
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface PoemResponse {
  success: boolean;
  poem?: Poem;
  poems?: Poem[];
  error?: string;
  details?: string;
  source?: string;
  pagination?: {
    current_page: number;
    total_poems: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export class PoemService {
  private static async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get today's poem
  static async getTodaysPoem(): Promise<Poem> {
    const data = await this.makeRequest('/poems/today');
    return data.poem;
  }

  // Get all poems with pagination
  static async getPoems(page = 1, limit = 10, category?: string): Promise<PoemResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (category) {
      params.append('category', category);
    }
    
    return await this.makeRequest(`/poems?${params.toString()}`);
  }

  // Get poem by ID
  static async getPoemById(id: string): Promise<Poem> {
    const data = await this.makeRequest(`/poems/${id}`);
    return data.poem;
  }

  // Create new poem
  static async createPoem(poem: Omit<Poem, 'id' | 'created_at' | 'updated_at'>): Promise<Poem> {
    const data = await this.makeRequest('/poems', {
      method: 'POST',
      body: JSON.stringify(poem),
    });
    return data.poem;
  }

  // Update poem
  static async updatePoem(id: string, poem: Partial<Poem>): Promise<Poem> {
    const data = await this.makeRequest(`/poems/${id}`, {
      method: 'PUT',
      body: JSON.stringify(poem),
    });
    return data.poem;
  }

  // Delete poem
  static async deletePoem(id: string): Promise<void> {
    await this.makeRequest(`/poems/${id}`, {
      method: 'DELETE',
    });
  }

  // Get categories
  static async getCategories(): Promise<{ name: string; count: number }[]> {
    const data = await this.makeRequest('/categories');
    return data.categories;
  }

  // Search poems
  static async searchPoems(query: string): Promise<Poem[]> {
    const params = new URLSearchParams({ q: query });
    const data = await this.makeRequest(`/search?${params.toString()}`);
    return data.results;
  }

  // Get random poem
  static async getRandomPoem(): Promise<Poem> {
    const data = await this.makeRequest('/poems/random');
    return data.poem;
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      const data = await this.makeRequest('/health');
      return data.status === 'healthy';
    } catch (error) {
      return false;
    }
  }
}