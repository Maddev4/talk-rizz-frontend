import { create } from 'zustand';
import { persist, StorageValue } from 'zustand/middleware';
import storage from '../storage';
import { Category, CategoryState } from '../utils/types';

const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: [],
      selectedCategories: [],
      setCategories: (categories: Category[]) => set({ categories }),
      setSelectedCategories: (selectedCategories: Category[]) => set({ selectedCategories }),
      activeCategory: null,
      setActiveCategory: (activeCategory: Category) => set({ activeCategory })
    }),
    {
      name: 'category-storage',
      storage: {
        getItem: async (key: string) => {
          const value = await storage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (key: string, value: StorageValue<CategoryState>) => {
          return await storage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key: string) => {
          await storage.removeItem(key);
        }
      }
    }
  )
);

export default useCategoryStore;