import { NextRequest, NextResponse } from 'next/server'

// Mock bill items endpoint - Bu endpoint backend'de implement edilene kadar geçici çözüm
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.billIds || !Array.isArray(body.billIds) || body.billIds.length === 0) {
      return NextResponse.json(
        { error: 'billIds is required and must be a non-empty array' },
        { status: 400 }
      )
    }
    
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { error: 'title is required and must be a string' },
        { status: 400 }
      )
    }
    
    if (!body.amount || typeof body.amount !== 'number') {
      return NextResponse.json(
        { error: 'amount is required and must be a number' },
        { status: 400 }
      )
    }
    
    // Mock response - gerçek backend implement edilene kadar
    const mockResponse = {
      id: `bill-item-${Date.now()}`,
      billIds: body.billIds,
      title: body.title,
      amount: body.amount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    console.log('✅ Bill item created (mock):', mockResponse)
    
    return NextResponse.json(mockResponse, { status: 201 })
    
  } catch (error) {
    console.error('❌ Error creating bill item:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for retrieving bill items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const billIds = searchParams.getAll('billId')
    
    // Mock response
    const mockBillItems = [
      {
        id: 'bill-item-1',
        billIds: billIds.length > 0 ? billIds : ['bill-1', 'bill-2'],
        title: 'Sample Bill Item',
        amount: 1000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    
    return NextResponse.json(mockBillItems)
    
  } catch (error) {
    console.error('❌ Error fetching bill items:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}