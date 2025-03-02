import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

class SupabaseService {
  private static instance: SupabaseService;
  private supabaseClient: SupabaseClient;
  private supabaseAdminClient: SupabaseClient;

  private constructor() {
    this.supabaseClient = createClient(
      env.supabaseUrl,
      env.supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          detectSessionInUrl: true,
          autoRefreshToken: true,
          storageKey: 'supabase.auth.token',
        },
      }
    );

    this.supabaseAdminClient = createClient(
      env.supabaseUrl,
      env.supabaseServiceRoleKey,
      {
        auth: {
          persistSession: false,
          detectSessionInUrl: false,
          autoRefreshToken: true,
          storageKey: 'supabase.admin.token',
        },
      }
    );

    // Add error handling for initialization
    this.supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      } else if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.email);
      }
    });
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  public getClient(): SupabaseClient {
    return this.supabaseClient;
  }

  public getAdminClient(): SupabaseClient {
    return this.supabaseAdminClient;
  }

  // Helper function to verify if a user has admin access
  public async verifyAdminAccess(userId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabaseClient
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data?.role === 'ai_admin';
    } catch (error) {
      console.error('Error verifying admin access:', error);
      return false;
    }
  }

  // Helper function to get admin user details
  public async getAdminUser(userId: string) {
    try {
      const { data, error } = await this.supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting admin user:', error);
      return null;
    }
  }

  // Helper function to create a new admin user
  public async createAdminUser(email: string, password: string) {
    try {
      const { data: user, error: createError } = await this.supabaseAdminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (createError) throw createError;

      // Add admin role
      const { error: roleError } = await this.supabaseClient
        .from('user_roles')
        .insert([{ user_id: user.user.id, role: 'ai_admin' }]);

      if (roleError) {
        // Rollback user creation if role assignment fails
        await this.supabaseAdminClient.auth.admin.deleteUser(user.user.id);
        throw roleError;
      }

      return user;
    } catch (error) {
      console.error('Error creating admin user:', error);
      throw error;
    }
  }

  // Helper function to enable 2FA for a user
  public async enable2FA(userId: string) {
    try {
      const { data, error } = await this.supabaseAdminClient.auth.admin.updateUserById(userId, {
        app_metadata: { requires_2fa: true },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      throw error;
    }
  }
}

// Export singleton instance
const supabaseService = SupabaseService.getInstance();
export const supabase = supabaseService.getClient();
export const supabaseAdmin = supabaseService.getAdminClient();
export const {
  verifyAdminAccess,
  getAdminUser,
  createAdminUser,
  enable2FA,
} = supabaseService; 