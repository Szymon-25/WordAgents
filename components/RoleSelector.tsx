'use client';

import { Role } from '@/types';

interface RoleSelectorProps {
  selectedRole: Role;
  onRoleChange: (role: Role) => void;
}

export default function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Your Role:
      </label>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onRoleChange('master')}
          className={`
            px-6 py-4 rounded-lg border-2 font-semibold transition-all
            ${
              selectedRole === 'master'
                ? 'bg-purple-600 text-white border-purple-600 scale-105'
                : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
            }
          `}
        >
          <div className="text-2xl mb-1">🎭</div>
          <div>Spymaster</div>
          <div className="text-xs mt-1 opacity-75">See all colors</div>
        </button>

        <button
          type="button"
          onClick={() => onRoleChange('guesser')}
          className={`
            px-6 py-4 rounded-lg border-2 font-semibold transition-all
            ${
              selectedRole === 'guesser'
                ? 'bg-blue-600 text-white border-blue-600 scale-105'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
            }
          `}
        >
          <div className="text-2xl mb-1">🕵️</div>
          <div>Guesser</div>
          <div className="text-xs mt-1 opacity-75">Guess the words</div>
        </button>
      </div>
    </div>
  );
}
