export interface JobAnalysis {
  id: string;
  title: string;
  company: string;
  status: 'applied' | 'interviewing' | 'offer' | 'rejected' | 'backlog';
  priority?: 'First' | 'Second' | 'Third';
  score?: number;
  match_score?: number;
  salary_score?: number;
  growth_score?: number;
  stress_score?: number;
  location_score?: number;
  added_at: string;
  url?: string;
  filePath: string;
}

export interface Idea {
    id: string;
    title: string;
    tags: string[];
    content: string;
    filePath: string;
    date: string;
}

export interface ReadingItem {
    url: string;
    title: string;
    status: string;
    summary?: string;
    filePath: string; 
}

export interface Recipe {
    id: string;
    name: string;
    name_en?: string;
    type?: string;
    icon?: string;
    status: string;
    tags: string[];
    prep_time?: string;
    cook_time?: string;
    servings?: string;
    ingredients: string[];
    instructions: string[];
    notes?: string[];
    source?: {
        credit?: string;
        date_added?: string;
    };
    filePath: string;
}

export interface ActivityItem {
    id: string;
    type: 'job' | 'idea' | 'recipe';
    title: string;
    date: string;
    url?: string;
    action: string;
}
