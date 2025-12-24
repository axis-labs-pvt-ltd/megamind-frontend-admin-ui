'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockSubjects } from '@/lib/mock-data';
import { Module, Subject } from '@/types';
import { BookOpen, FolderPlus, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { ModuleForm } from './components/ModuleForm';
import { SubjectCard } from './components/SubjectCard';
import { SubjectForm } from './components/SubjectForm';

export default function SubjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [selectedSubjectIdForModule, setSelectedSubjectIdForModule] = useState<string>('');

  const filteredSubjects = mockSubjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSubject = (data: Partial<Subject>) => {
    console.log('Creating subject:', data);
    setShowCreateForm(false);
    setEditingSubject(null);
  };

  const handleCreateModule = (data: Partial<Module>) => {
    console.log('Creating module:', data);
    setShowModuleForm(false);
    setEditingModule(null);
    setSelectedSubjectIdForModule('');
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setShowCreateForm(true);
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setShowModuleForm(true);
  };

  const handleDeleteSubject = (id: string) => {
    console.log('Delete subject:', id);
  };

  const handleDeleteModule = (id: string) => {
    console.log('Delete module:', id);
  };

  const handleAddModule = (subjectId?: string) => {
    if (subjectId) {
      setSelectedSubjectIdForModule(subjectId);
    }
    setShowModuleForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Subject Management</h2>
          <p className="text-[var(--text-secondary)]">Organize your curriculum with subjects and modules</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => handleAddModule()}
            className="hover:bg-green-50 hover:border-green-200 hover:text-green-700 w-full sm:w-auto"
          >
             <FolderPlus className="mr-2 h-4 w-4" />
            Add Module
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setEditingSubject(null);
              setShowCreateForm(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full sm:w-auto"
          >
             <Plus className="mr-2 h-4 w-4" />
            Create Subject
          </Button>
        </div>
      </div>

      {/* Forms */}
      <SubjectForm 
        isOpen={showCreateForm}
        onClose={() => {
          setShowCreateForm(false);
          setEditingSubject(null);
        }}
        onSubmit={handleCreateSubject}
        initialData={editingSubject}
      />

      <ModuleForm 
        isOpen={showModuleForm}
        onClose={() => {
          setShowModuleForm(false);
          setEditingModule(null);
          setSelectedSubjectIdForModule('');
        }}
        onSubmit={handleCreateModule}
        initialData={editingModule}
        subjects={mockSubjects}
        initialSubjectId={selectedSubjectIdForModule}
      />

      {/* Search */}
      <div className="flex items-center space-x-4">
        <Input
          type="search"
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
          className="flex-1 max-w-md"
        />
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSubjects.map((subject, index) => (
          <SubjectCard 
            key={subject.id}
            subject={subject}
            index={index}
            onEditSubject={handleEditSubject}
            onDeleteSubject={handleDeleteSubject}
            onAddModule={handleAddModule}
            onEditModule={handleEditModule}
            onDeleteModule={handleDeleteModule}
          />
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
