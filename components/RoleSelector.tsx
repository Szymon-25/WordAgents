'use client';

import { Role } from '@/types';

interface RoleSelectorProps {
  selectedRole: Role;
  onRoleChange: (role: Role) => void;
}

export default function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-600 justify-center flex">
        Select role
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onRoleChange('master')}
          className={`
            px-3 py-3 rounded-md border font-medium text-xs transition-all
            ${
              selectedRole === 'master'
          ? 'bg-[#6611aa] text-white border-[#6611aa]'
          : 'bg-white text-gray-700 border-gray-300 hover:border-[#6611aa]'
            }
          `}
        >
          <div className="font-semibold">Spymaster</div>
          <div className="text-[10px] mt-1 opacity-70">See all colors</div>
        </button>

        <button
          type="button"
          onClick={() => onRoleChange('guesser')}
          className={`
            px-3 py-3 rounded-md border font-medium text-xs transition-all
            ${
              selectedRole === 'guesser'
          ? 'bg-[#4e0ac1] text-white border-[#4e0ac1]'
          : 'bg-white text-gray-700 border-gray-300 hover:border-[#4e0ac1]'
            }
          `}
        >
          <div className="font-semibold">Guesser</div>
          <div className="text-[10px] mt-1 opacity-70">Guess the words</div>
        </button>
      </div>
    </div>
  );
}
