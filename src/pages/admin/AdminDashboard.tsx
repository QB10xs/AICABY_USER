import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface TrainingExample {
  id: string;
  input: string;
  output: string;
  created_at: string;
}

interface AdminRole {
  role: string;
}

const AdminDashboard: React.FC = () => {
  const [trainingData, setTrainingData] = useState<TrainingExample[]>([]);
  const [loading, setLoading] = useState(true);
  const [newInput, setNewInput] = useState('');
  const [newOutput, setNewOutput] = useState('');
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
    } catch (error: any) {
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
        .insert([{ input: newInput, output: newOutput }]);

      if (error) throw error;

      toast.success('Training example added successfully');
      setNewInput('');
      setNewOutput('');
      fetchTrainingData();
    } catch (error: any) {
      toast.error('Error adding training example');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExample = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this example?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('training_examples')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Training example deleted successfully');
      fetchTrainingData();
    } catch (error: any) {
      toast.error('Error deleting training example');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      navigate('/admin/login');
    }
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
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Add New Training Example</h2>
            <form onSubmit={handleAddExample} className="space-y-4">
              <div>
                <label htmlFor="input" className="block text-sm font-medium text-gray-700">
                  Input
                </label>
                <textarea
                  id="input"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={newInput}
                  onChange={(e) => setNewInput(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="output" className="block text-sm font-medium text-gray-700">
                  Output
                </label>
                <textarea
                  id="output"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={newOutput}
                  onChange={(e) => setNewOutput(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Adding...' : 'Add Example'}
              </button>
            </form>
          </div>

          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Training Examples</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-4">
                {trainingData.map((example) => (
                  <div key={example.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-grow">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">Input:</h3>
                          <p className="mt-1 text-sm text-gray-900">{example.input}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">Output:</h3>
                          <p className="mt-1 text-sm text-gray-900">{example.output}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteExample(example.id)}
                        className="ml-4 text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Added: {new Date(example.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 