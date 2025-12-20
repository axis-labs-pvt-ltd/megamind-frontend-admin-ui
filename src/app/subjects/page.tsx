'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockSubjects } from '@/lib/mock-data';
import { Module, Subject } from '@/types';
import { BookOpen, Edit, FolderPlus, Plus, Search, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

export default function SubjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  // Unused state removed: selectedSubjectId

  // Form state
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    description: '',
    color: '#3b82f6'
  });

  const [moduleForm, setModuleForm] = useState({
    name: '',
    description: '',
    subjectId: ''
  });

  const filteredSubjects = mockSubjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetSubjectForm = () => {
    setSubjectForm({
      name: '',
      description: '',
      color: '#3b82f6'
    });
    setEditingSubject(null);
  };

  const resetModuleForm = () => {
    setModuleForm({
      name: '',
      description: '',
      subjectId: ''
    });
    setEditingModule(null);
  };

  const handleCreateSubject = () => {
    console.log('Creating subject:', subjectForm);
    setShowCreateForm(false);
    resetSubjectForm();
  };

  const handleCreateModule = () => {
    console.log('Creating module:', moduleForm);
    setShowModuleForm(false);
    resetModuleForm();
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setSubjectForm({
      name: subject.name,
      description: subject.description,
      color: '#3b82f6'
    });
    setShowCreateForm(true);
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setModuleForm({
      name: module.name,
      description: module.description,
      subjectId: module.subjectId
    });
    setShowModuleForm(true);
  };

  const colors = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subject Management</h2>
          <p className="text-gray-600">Organize your curriculum with subjects and modules</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowModuleForm(true)}
            className="hover:bg-green-50 hover:border-green-200 hover:text-green-700"
          >
             <FolderPlus className="mr-2 h-4 w-4" />
            Add Module
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
             <Plus className="mr-2 h-4 w-4" />
            Create Subject
          </Button>
        </div>
      </div>

      {/* Create/Edit Subject Form */}
      {showCreateForm && (
        <Card className="p-6 border-2 border-blue-200 bg-blue-50/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingSubject ? 'Edit Subject' : 'Create New Subject'}
            </h3>
            <Button
              variant="ghost"
              onClick={() => {
                setShowCreateForm(false);
                resetSubjectForm();
              }}
            >
              Cancel
            </Button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="e.g., Mathematics, Physics, Computer Science"
                value={subjectForm.name}
                onChange={(value) => setSubjectForm({ ...subjectForm, name: value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        subjectForm.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSubjectForm({ ...subjectForm, color })}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                value={subjectForm.description}
                onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                placeholder="Describe what this subject covers..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  resetSubjectForm();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateSubject}
                disabled={!subjectForm.name}
              >
                {editingSubject ? 'Update Subject' : 'Create Subject'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Create/Edit Module Form */}
      {showModuleForm && (
        <Card className="p-6 border-2 border-green-200 bg-green-50/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingModule ? 'Edit Module' : 'Create New Module'}
            </h3>
            <Button
              variant="ghost"
              onClick={() => {
                setShowModuleForm(false);
                resetModuleForm();
              }}
            >
              Cancel
            </Button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="e.g., Algebra, Calculus, Data Structures"
                value={moduleForm.name}
                onChange={(value) => setModuleForm({ ...moduleForm, name: value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={moduleForm.subjectId}
                  onChange={(e) => setModuleForm({ ...moduleForm, subjectId: e.target.value })}
                >
                  <option value="">Select Subject</option>
                  {mockSubjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                value={moduleForm.description}
                onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                placeholder="Describe what this module covers..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowModuleForm(false);
                  resetModuleForm();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateModule}
                disabled={!moduleForm.name || !moduleForm.subjectId}
              >
                {editingModule ? 'Update Module' : 'Create Module'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Search */}
      <div className="flex items-center space-x-4">
        <Input
          type="search"
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(value) => setSearchTerm(value)}
          icon={Search}
          className="flex-1 max-w-md"
        />
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSubjects.map((subject, index) => (
          <div 
            key={subject.id} 
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-200 group h-full">
              <div className="space-y-4">
                {/* Subject Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{subject.name}</h3>
                      <p className="text-gray-600">{subject.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{ padding: 8 }}
                      onClick={() => handleEditSubject(subject)}
                      className="hover:bg-blue-50"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{ padding: 8 }}
                      onClick={() => console.log('Delete subject:', subject.id)}
                      className="hover:bg-red-50 text-red-600"
                    >
                         <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Modules */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Modules ({subject.modules.length})</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setModuleForm({ ...moduleForm, subjectId: subject.id });
                        setShowModuleForm(true);
                      }}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                       <Plus className="mr-2 h-3 w-3" />
                      Add Module
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {subject.modules.map((module) => (
                      <div
                        key={module.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group/module"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{module.name}</p>
                          <p className="text-sm text-gray-600">{module.description}</p>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover/module:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            style={{ padding: 8 }}
                            onClick={() => handleEditModule(module)}
                            className="hover:bg-blue-50"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            style={{ padding: 8 }}
                            onClick={() => console.log('Delete module:', module.id)}
                            className="hover:bg-red-50 text-red-600"
                          >
                             <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {subject.modules.length === 0 && (
                      <p className="text-gray-500 text-sm italic">No modules yet. Add your first module!</p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <FolderPlus className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{subject.modules.length} modules</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">0 students</span>
                    </div>
                  </div>
                  <Badge variant="primary" size="sm">Active</Badge>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No subjects found matching your criteria.</p>
          <Button
            variant="primary"
            onClick={() => setShowCreateForm(true)}
          >
             <Plus className="mr-2 h-4 w-4" />
            Create Your First Subject
          </Button>
        </div>
      )}
    </div>
  );
}
