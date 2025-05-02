'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Search, MoreHorizontal, Plus, Calendar, CheckCircle, Clock, Folder, FolderOpen, List, LayoutGrid } from 'lucide-react';
import { format, isFuture, differenceInDays } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ChatBot } from '../components/ChatBot';
import Image from 'next/image';
import { ProjectForm } from '../components/ProjectForm';
import { BACKEND_API_URL } from '@/app/lib/env';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date;
  status: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function ProjectsPage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchProjects();
    }
  }, [isLoaded, isSignedIn]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');

      const data = await response.json();

      // Convert date strings to Date objects
      const projectsWithDates = data.map((project: any) => ({
        ...project,
        dueDate: new Date(project.dueDate),
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
      }));

      setProjects(projectsWithDates);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (data: Partial<Project>) => {
    try {
      setIsButtonLoading(true);

      const response = await fetch(`${BACKEND_API_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const newProject = await response.json();

      // Convert date strings to Date objects
      const projectWithDates = {
        ...newProject,
        dueDate: new Date(newProject.dueDate),
        createdAt: new Date(newProject.createdAt),
        updatedAt: new Date(newProject.updatedAt),
      };

      setProjects(prev => [projectWithDates, ...prev]);
      setIsFormOpen(false);
      toast.success('Project created successfully');
    } catch (err) {
      console.error('Error creating project:', err);
      toast.error('Failed to create project');
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
    try {
      // Optimistic update for immediate UI feedback
      setProjects(prev => prev.map(project =>
        project.id === id ? { ...project, ...updates, updatedAt: new Date() } as Project : project
      ));

      // Send update to API
      const response = await fetch(`${BACKEND_API_URL}/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      const updatedProject = await response.json();

      // Update with server response to ensure consistency
      setProjects(prev => prev.map(project =>
        project.id === id ? {
          ...updatedProject,
          dueDate: new Date(updatedProject.dueDate),
          createdAt: new Date(updatedProject.createdAt),
          updatedAt: new Date(updatedProject.updatedAt),
        } as Project : project
      ));

      toast.success('Project updated successfully');
    } catch (err) {
      console.error('Error updating project:', err);
      toast.error('Failed to update project');

      // Revert the optimistic update on error by refetching
      fetchProjects();
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      // Optimistic update - remove from UI first
      setProjects(prev => prev.filter(project => project.id !== id));

      // Send delete request to API
      const response = await fetch(`${BACKEND_API_URL}/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      toast.success('Project deleted successfully');
    } catch (err) {
      console.error('Error deleting project:', err);
      toast.error('Failed to delete project');

      // Revert the optimistic update on error by refetching
      fetchProjects();
    }
  };

  // Filter projects based on search
  const filteredProjects = searchQuery
    ? projects.filter(project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : projects;

  // Project click handler
  const handleProjectClick = (projectId: string) => {
    setIsButtonLoading(true);
    // Simulate loading time before navigation
    setTimeout(() => {
      router.push(`/projects/${projectId}`);
    }, 400);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return (
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'PLANNING':
        return (
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium flex items-center">
            <FolderOpen className="w-3 h-3 mr-1" />
            Planning
          </span>
        );
      default:
        return null;
    }
  };

  const getDueDateStatus = (dueDate: Date) => {
    if (!isFuture(dueDate)) {
      return (
        <span className="text-red-600 dark:text-red-400 text-sm flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          Overdue
        </span>
      );
    }

    const daysLeft = differenceInDays(dueDate, new Date());
    if (daysLeft <= 3) {
      return (
        <span className="text-amber-600 dark:text-amber-400 text-sm flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          Due soon ({daysLeft} {daysLeft === 1 ? 'day' : 'days'})
        </span>
      );
    }

    return (
      <span className="text-gray-600 dark:text-gray-400 text-sm">
        Due {format(dueDate, 'MMM d, yyyy')}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-40"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10">
      {/* Header and controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track all your ongoing projects</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search input */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="absolute right-3 top-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                aria-label="Search projects"
              >
                <Search size={20} />
              </button>
            )}
          </div>

          {/* View mode toggle */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 flex items-center ${viewMode === 'grid'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              title="Grid View"
            >
              <LayoutGrid size={18} className="mr-1" />
              <span className="text-sm hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 flex items-center ${viewMode === 'list'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              title="List View"
            >
              <List size={18} className="mr-1" />
              <span className="text-sm hidden sm:inline">List</span>
            </button>
          </div>

          <button
            onClick={() => {
              setActiveProject(null);
              setIsFormOpen(true);
            }}
            disabled={isButtonLoading}
            className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={18} className="mr-1" />
            New Project
          </button>
        </div>
      </div>

      {/* Projects Views */}
      {filteredProjects.length === 0 ? (
        <div className="py-10 text-center">
          <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No projects yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by creating your first project</p>
          <button
            onClick={() => {
              setActiveProject(null);
              setIsFormOpen(true);
            }}
            className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <Plus size={18} className="mr-1" />
            New Project
          </button>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project.id)}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow p-4 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                    <div className="flex space-x-2">
                      {getStatusBadge(project.status)}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveProject(project);
                          setIsFormOpen(true);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>

                  {project.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                  )}

                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <Calendar size={14} className="text-gray-400 mr-1" />
                      {getDueDateStatus(project.dueDate)}
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: {format(project.updatedAt, 'MMM d')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-750">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer" onClick={() => handleProjectClick(project.id)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{project.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{project.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {format(project.dueDate, 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveProject(project);
                            setIsFormOpen(true);
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Project Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {activeProject ? 'Edit Project' : 'Create New Project'}
            </h3>
            <ProjectForm
              project={activeProject || undefined}
              onSubmit={(data) => {
                if (activeProject) {
                  handleUpdateProject(activeProject.id, data);
                } else {
                  handleCreateProject(data);
                }
                setIsFormOpen(false);
              }}
              onCancel={() => setIsFormOpen(false)}
              isLoading={isButtonLoading}
            />
          </div>
        </div>
      )}

      {/* Add ChatBot */}
      <ChatBot
        userName={user?.firstName || user?.username || 'User'}
        onCreateTask={(title) => {
          // Implementation for task creation from chatbot
        }}
        onCreateProject={(title) => {
          // Open the project form with prefilled title
          setActiveProject(null);
          setIsFormOpen(true);
          // Store the title in localStorage for the form to use
          if (typeof window !== 'undefined') {
            localStorage.setItem('chatbot_project_title', title);
          }
        }}
      />
    </div>
  );
} 