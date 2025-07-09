import { LayoutDashboard, User } from 'lucide-react'

export default function Header() {
    return (
        <div className="flex items-center justify-between px-10 py-3 border-b border-gray-200">
            <div className="flex items-center gap-4">
                <LayoutDashboard className="w-4 h-4 text-gray-700" />
                <h1 className="text-lg font-bold text-gray-900">Yönetici Paneli</h1>
            </div>
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
            </div>
        </div>
    )
} 