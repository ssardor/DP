import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pwwsuxwneevkcjthwpmm.supabase.co';
const supabaseKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3d3N1eHduZWV2a2NqdGh3cG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NzQ0MDIsImV4cCI6MjA1ODQ1MDQwMn0.1f18nsoZnwemM3_F8OckpJISPRaOzSm3TwZf4bZ4m2s';
export const supabase = createClient(supabaseUrl, supabaseKey);