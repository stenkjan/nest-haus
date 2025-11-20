/**
 * Geographic Locations API
 * 
 * Returns session counts by country and city
 * For Wix-style interactive map component
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getIPFilterClause } from '@/lib/analytics-filter';

export async function GET(_request: NextRequest) {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // Get sessions with geographic data
    const sessions = await prisma.userSession.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        },
        country: {
          not: null
        },
        ...getIPFilterClause()
      },
      select: {
        country: true,
        city: true,
        latitude: true,
        longitude: true
      }
    });

    // Count by country
    const countryMap = new Map<string, { count: number; name: string }>();
    
    // Count by city
    const cityMap = new Map<string, {
      city: string;
      country: string;
      count: number;
      lat: number;
      lng: number;
    }>();

    sessions.forEach(session => {
      if (session.country) {
        const countryData = countryMap.get(session.country);
        if (countryData) {
          countryData.count++;
        } else {
          countryMap.set(session.country, {
            count: 1,
            name: getCountryName(session.country)
          });
        }

        if (session.city && session.latitude && session.longitude) {
          const cityKey = `${session.city}-${session.country}`;
          const cityData = cityMap.get(cityKey);
          if (cityData) {
            cityData.count++;
          } else {
            cityMap.set(cityKey, {
              city: session.city,
              country: session.country,
              count: 1,
              lat: session.latitude,
              lng: session.longitude
            });
          }
        }
      }
    });

    const totalSessions = sessions.length;

    // Format country data
    const byCountry = Array.from(countryMap.entries())
      .map(([code, data]) => ({
        code,
        name: data.name,
        count: data.count,
        percentage: totalSessions > 0 ? Math.round((data.count / totalSessions) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    // Format city data (top 20 cities)
    const topCities = Array.from(cityMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return NextResponse.json({
      success: true,
      data: {
        byCountry,
        topCities,
        totalSessions,
        countriesCount: countryMap.size,
        citiesCount: cityMap.size
      },
      metadata: {
        period: '30 days',
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Failed to fetch geographic locations:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch geographic locations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Get full country name from ISO code
 */
function getCountryName(code: string): string {
  const countries: Record<string, string> = {
    'DE': 'Germany',
    'AT': 'Austria',
    'CH': 'Switzerland',
    'FR': 'France',
    'IT': 'Italy',
    'NL': 'Netherlands',
    'BE': 'Belgium',
    'PL': 'Poland',
    'CZ': 'Czech Republic',
    'SK': 'Slovakia',
    'HU': 'Hungary',
    'SI': 'Slovenia',
    'HR': 'Croatia',
    'LU': 'Luxembourg',
    'LI': 'Liechtenstein',
    'US': 'United States',
    'GB': 'United Kingdom',
    'ES': 'Spain',
    'PT': 'Portugal',
    'DK': 'Denmark',
    'SE': 'Sweden',
    'NO': 'Norway',
    'FI': 'Finland',
    'IE': 'Ireland'
  };

  return countries[code] || code;
}

