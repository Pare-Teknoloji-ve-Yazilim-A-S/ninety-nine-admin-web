'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
import { authService } from '@/services/auth.service'
import billingService from '@/services/billing.service'

export default function TestAuthPage() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password123')
  const [token, setToken] = useState('')
  const [loginStatus, setLoginStatus] = useState('')
  const [billItemsStatus, setBillItemsStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if token exists in localStorage
    const existingToken = localStorage.getItem('auth_token')
    if (existingToken) {
      setToken(existingToken)
    }
  }, [])

  const handleLogin = async () => {
    setIsLoading(true)
    setLoginStatus('Giriş yapılıyor...')
    
    try {
      const response = await authService.login({
        email,
        password
      })
      
      if (response.accessToken) {
        setToken(response.accessToken || '')
        setLoginStatus(`✅ Giriş başarılı! Token: ${response.accessToken?.substring(0, 20)}...`)
      } else {
        setLoginStatus(`❌ Giriş başarısız: Bilinmeyen hata`)
      }
    } catch (error) {
      setLoginStatus(`❌ Giriş hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testBillItems = async () => {
    setBillItemsStatus('Bill items test ediliyor...')
    
    try {
      const response = await billingService.getBillItems()
      
      if (Array.isArray(response)) {
        setBillItemsStatus(`✅ Bill items başarılı! ${response.length} item bulundu`)
      } else {
        setBillItemsStatus(`❌ Bill items başarısız: Beklenmeyen response formatı`)
      }
    } catch (error) {
      setBillItemsStatus(`❌ Bill items hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
    }
  }

  const testDirectAPI = async () => {
    setBillItemsStatus('Direct API test ediliyor...')
    
    try {
      const billItemId = 'test-bill-item-id' // Test için örnek ID
      const response = await fetch(`/api/proxy/api/v1/bill-items/${billItemId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setBillItemsStatus(`✅ Direct API başarılı! Status: ${response.status}`)
      } else {
        setBillItemsStatus(`❌ Direct API başarısız: ${response.status} - ${data.message || data.error || 'Bilinmeyen hata'}`)
      }
    } catch (error) {
      setBillItemsStatus(`❌ Direct API hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
    }
  }

  const clearToken = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    setToken('')
    setLoginStatus('Token temizlendi')
    setBillItemsStatus('')
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Authentication Test</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Login Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <Button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? 'Giriş yapılıyor...' : 'Login Test'}
          </Button>
          
          <div className="text-sm text-gray-600">
            {loginStatus}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Token Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm">
              <strong>Current Token:</strong> {token ? `${token.substring(0, 30)}...` : 'Token yok'}
            </div>
            <Button onClick={clearToken} variant="outline" size="sm">
              Clear Token
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testBillItems} disabled={!token}>
              Test Bill Items (Service)
            </Button>
            <Button onClick={testDirectAPI} disabled={!token}>
              Test Direct API
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            {billItemsStatus}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}