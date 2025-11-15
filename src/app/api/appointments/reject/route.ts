import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const inquiryId = searchParams.get('id');
    const token = searchParams.get('token');

    console.log('❌ Appointment rejection request:', { inquiryId, hasToken: !!token });

    // Validate parameters
    if (!inquiryId || !token) {
      return NextResponse.redirect(
        new URL('/admin/customer-inquiries?error=missing_parameters', request.url)
      );
    }

    // Find and verify inquiry
    const inquiry = await prisma.customerInquiry.findUnique({
      where: { id: inquiryId },
    });

    if (!inquiry) {
      console.error('❌ Inquiry not found:', inquiryId);
      return NextResponse.redirect(
        new URL('/admin/customer-inquiries?error=inquiry_not_found', request.url)
      );
    }

    // Verify token
    if (inquiry.confirmationToken !== token) {
      console.error('❌ Invalid confirmation token');
      return NextResponse.redirect(
        new URL('/admin/customer-inquiries?error=invalid_token', request.url)
      );
    }

    // Check if already cancelled
    if (inquiry.appointmentStatus === 'CANCELLED') {
      console.log('⚠️ Appointment already cancelled');
      return NextResponse.redirect(
        new URL('/admin/customer-inquiries?message=already_cancelled', request.url)
      );
    }

    // Update inquiry status to CANCELLED
    await prisma.customerInquiry.update({
      where: { id: inquiryId },
      data: {
        appointmentStatus: 'CANCELLED',
        confirmationToken: null, // Clear token after use
        adminNotes: inquiry.adminNotes
          ? `${inquiry.adminNotes}\n\nTermin abgelehnt: ${new Date().toLocaleString('de-DE')}`
          : `Termin abgelehnt: ${new Date().toLocaleString('de-DE')}`,
      },
    });

    console.log('✅ Appointment status updated to CANCELLED');

    // TODO: Optionally send rejection email to customer with alternative time slots
    // This can be implemented later if needed

    // Redirect to admin panel with success message
    return NextResponse.redirect(
      new URL(
        `/admin/customer-inquiries?message=appointment_rejected&id=${inquiryId}`,
        request.url
      )
    );
  } catch (error) {
    console.error('❌ Error rejecting appointment:', error);
    return NextResponse.redirect(
      new URL('/admin/customer-inquiries?error=server_error', request.url)
    );
  }
}

