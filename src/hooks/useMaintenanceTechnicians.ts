import { useState, useEffect } from 'react'
import { staffService } from '@/services/staff.service'
import { Staff } from '@/services/types/staff.types'
import { ApiResponse } from '@/services/core/types'

export interface TechnicianOption {
  value: string
  label: string
}

export function useMaintenanceTechnicians() {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTechnicians = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Fetching maintenance technicians...')
      
      // Check if we have auth token
      const token = localStorage.getItem('auth_token')
      console.log('Auth token exists:', !!token)
      console.log('Token length:', token ? token.length : 0)
      
      if (!token) {
        console.log('No auth token found, user might not be logged in')
        setError('Giriş yapmanız gerekiyor')
        return
      }
      
      // Use the same endpoint as CreateTicketModal for consistency
      const response = await fetch('/api/proxy/admin/staff/maintenance/on-duty', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('API Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('API Response data:', data)
        console.log('Response structure:', JSON.stringify(data, null, 2))
        
        // Handle the response structure like CreateTicketModal does
        const staffArray = data.data || []
        console.log('Staff array:', staffArray)
        
        const technicianOptions: TechnicianOption[] = staffArray.map((staff: any) => ({
          value: staff.id,
          label: `${staff.firstName} ${staff.lastName}`
        }))
        
        console.log('Staff data:', staffArray)
        setData(staffArray)
      } else {
        console.log('API call failed with status:', response.status)
        const errorText = await response.text()
        console.log('Error response:', errorText)
        setError('Teknisyenler alınamadı')
      }
    } catch (err) {
      console.error('Failed to fetch maintenance technicians:', err)
      setError('Teknisyenler alınırken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTechnicians()
  }, [])

  return {
    data,
    isLoading,
    error,
    refetch: fetchTechnicians
  }
}