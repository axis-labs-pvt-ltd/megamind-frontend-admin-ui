// Client Component - Test Cover Image
'use client';

import { Input } from '@/components/ui/input';
import { CreateTestValues } from '@/lib/validations/test';
import { Image } from 'lucide-react';
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';

interface TestCoverImageProps {
  register: UseFormRegister<CreateTestValues>;
  setValue: UseFormSetValue<CreateTestValues>;
  errors: FieldErrors<CreateTestValues>;
  coverImage: string;
  title: string;
  description: string;
}

const suggestedCoverImages = [
    'https://images.pexels.com/photos/6238/mathematics-computation-math-numbers.jpg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

export function TestCoverImage({ register, setValue, errors, coverImage, title, description }: TestCoverImageProps) {
  return (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--text-secondary)]">
            Cover Image
        </label>
        <div className="space-y-4">
            <Input
            {...register('coverImage')}
            placeholder="Enter image URL or upload"
            icon={Image}
            error={errors.coverImage?.message}
            />
            
            {/* Image Preview */}
            {coverImage && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-[var(--border-primary)] animate-fade-in">
                <img
                src={coverImage}
                alt="Cover preview"
                className="w-full h-full object-cover"
                onError={() => setValue('coverImage', '')} // Reset on error
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-white font-semibold">{title || 'Test Title'}</h4>
                <p className="text-white/90 text-sm line-clamp-2">{description || 'Test description...'}</p>
                </div>
            </div>
            )}

            {/* Suggested Images */}
            <div>
            <p className="text-sm text-[var(--text-secondary)] mb-2">Suggested cover images:</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {suggestedCoverImages.map((imageUrl, index) => (
                <button
                    type="button"
                    key={index}
                    className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    coverImage === imageUrl ? 'border-blue-500' : 'border-[var(--border-primary)] hover:border-[var(--border-hover)]'
                    }`}
                    onClick={() => setValue('coverImage', imageUrl)}
                >
                    <img
                    src={imageUrl}
                    alt={`Suggested ${index + 1}`}
                    className="w-full h-full object-cover"
                    />
                </button>
                ))}
            </div>
            </div>
        </div>
    </div>
  );
}
