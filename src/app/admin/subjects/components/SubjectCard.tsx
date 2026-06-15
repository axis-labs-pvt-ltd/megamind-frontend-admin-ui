import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Module, Subject } from '@/types';
import { BookOpen, Edit, Film, FolderPlus, Plus, Trash2, Users } from 'lucide-react';
import Link from 'next/link';

interface SubjectCardProps {
  subject: Subject;
  index: number;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
  onAddModule: (subjectId: string) => void;
  onEditModule: (module: Module) => void;
  onDeleteModule: (id: string) => void;
}

export function SubjectCard({
  subject,
  index,
  onEditSubject,
  onDeleteSubject,
  onAddModule,
  onEditModule,
  onDeleteModule
}: SubjectCardProps) {
  return (
    <div 
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
                <h3 className="text-xl font-bold text-[var(--text-primary)]">{subject.name}</h3>
                <p className="text-[var(--text-secondary)]">{subject.description}</p>
              </div>
            </div>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                style={{ padding: 8 }}
                onClick={() => onEditSubject(subject)}
                className="hover:bg-blue-50"
              >
                  <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                style={{ padding: 8 }}
                onClick={() => onDeleteSubject(subject.id)}
                className="hover:bg-red-50 text-red-600"
              >
                    <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Modules */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-[var(--text-primary)]">Modules ({subject.modules.length})</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddModule(subject.id)}
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
                  className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors group/module"
                >
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{module.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{module.description}</p>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover/module:opacity-100 transition-opacity">
                    <Link
                      href={`/admin/modules/${module.id}`}
                      title="Manage videos"
                      style={{ display: 'inline-flex', alignItems: 'center', padding: 8, borderRadius: 6, color: 'var(--accent-blue)', textDecoration: 'none' }}
                      className="hover:bg-blue-50"
                    >
                      <Film className="h-3 w-3" />
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{ padding: 8 }}
                      onClick={() => onEditModule(module)}
                      className="hover:bg-blue-50"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{ padding: 8 }}
                      onClick={() => onDeleteModule(module.id)}
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
                <FolderPlus className="h-4 w-4 text-[var(--icon-secondary)]" />
                <span className="text-sm text-[var(--text-secondary)]">{subject.modules.length} modules</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-[var(--text-muted)]" />
                <span className="text-sm text-[var(--text-secondary)]">0 students</span>
              </div>
            </div>
            <Badge variant="primary" size="sm">Active</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
