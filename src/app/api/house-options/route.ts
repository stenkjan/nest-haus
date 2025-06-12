import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where = category ? { category, isActive: true } : { isActive: true }
    
    const options = await prisma.houseOption.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        category: true,
        value: true,
        name: true,
        description: true,
        basePrice: true,
        imageUrl: true,
        properties: true
      }
    })

    return NextResponse.json({
      success: true,
      data: options,
      timestamp: Date.now()
    })

  } catch (error) {
    console.error('Failed to fetch house options:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch house options',
        timestamp: Date.now()
      },
      { status: 500 }
    )
  }
} 