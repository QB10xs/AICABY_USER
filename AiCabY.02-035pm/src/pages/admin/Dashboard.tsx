import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface TrainingExample {
  id: number;
  user_input: string;
  ai_response: string;
  context?: Record<string, any>;
  created_at: string;
}

interface AdminRole {
  role: string;
}

const AdminDashboard: React.FC = () => {
  const [trainingData, setTrainingData] = useState<TrainingExample[]>([]);
  const [loading, setLoading] = useState(true);
  const [newExample, setNewExample] = useState({
    user_input: '',
    ai_response: '',
    context: {}
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    fetchTrainingData();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        navigate('/admin/login');
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (error || !data || (data as AdminRole).role !== 'ai_admin') {
        navigate('/admin/login');
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/admin/login');
    }
  };

  const fetchTrainingData = async () => {
    try {
      const { data, error } = await supabase
        .from('training_examples')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrainingData(data || []);
    } catch (error) {
      toast.error('Error fetching training data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExample = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('training_examples')
        .insert([newExample]);

      if (error) throw error;

      toast.success('Training example added successfully');
      setNewExample({ user_input: '', ai_response: '', context: {} });
      fetchTrainingData();
    } catch (error) {
      toast.error('Error adding training example');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExample = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this example?')) return;

    try {
      const { error } = await supabase
        .from('training_examples')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Training example deleted successfully');
      fetchTrainingData();
    } catch (error) {
      toast.error('Error deleting training example');
      console.error('Error:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">AI Training Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Add new training example form */}
        <div className="bg-white shadow sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Add New Training Example
            </h3>
            <form onSubmit={handleAddExample} className="mt-5 space-y-4">
              <div>
                <label htmlFor="user_input" className="block text-sm font-medium text-gray-700">
                  User Input
                </label>
                <textarea
                  id="user_input"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={newExample.user_input}
                  onChange={(e) => setNewExample({ ...newExample, user_input: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="ai_response" className="block text-sm font-medium text-gray-700">
                  AI Response
                </label>
                <textarea
                  id="ai_response"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={newExample.ai_response}
                  onChange={(e) => setNewExample({ ...newExample, ai_response: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? 'Adding...' : 'Add Example'}
              </button>
            </form>
          </div>
        </div>

        {/* Training examples list */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Training Examples
            </h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-4">
                {trainingData.map((example) => (
                  <div
                    key={example.id}
                    className="border border-gray-200 rounded-md p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-grow">
                        <div>
                          <span className="font-medium">User Input:</span>
                          <p className="mt-1 text-sm text-gray-600">{example.user_input}</p>
                        </div>
                        <div>
                          <span className="font-medium">AI Response:</span>
                          <p className="mt-1 text-sm text-gray-600">{example.ai_response}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          Created: {new Date(example.created_at).toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteExample(example.id)}
                        className="ml-4 text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 