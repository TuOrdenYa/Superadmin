import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';

// PUT - Update user or reset password
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { full_name, role, location_id, is_active, reset_password } = body;

    if (reset_password) {
      // Reset password
      const newPassword = Math.random().toString(36).slice(-8);
      const passwordHash = await bcrypt.hash(newPassword, 10);

      await query(
        'UPDATE users SET password_hash = $1 WHERE id = $2',
        [passwordHash, parseInt(id)]
      );

      return NextResponse.json({
        ok: true,
        message: 'Password reset successfully',
        password: newPassword, // Only shown once!
      });
    } else {
      // Update user info
      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (full_name !== undefined) {
        updates.push(`full_name = $${paramCount++}`);
        values.push(full_name.trim());
      }
      if (role !== undefined) {
        updates.push(`role = $${paramCount++}`);
        values.push(role);
      }
      if (location_id !== undefined) {
        updates.push(`location_id = $${paramCount++}`);
        values.push(location_id ? parseInt(location_id) : null);
      }
      if (is_active !== undefined) {
        updates.push(`is_active = $${paramCount++}`);
        values.push(is_active);
      }

      if (updates.length === 0) {
        return NextResponse.json(
          { ok: false, error: 'No fields to update' },
          { status: 400 }
        );
      }

      values.push(parseInt(id));
      const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;

      const result = await query(sql, values);

      if (result.rows.length === 0) {
        return NextResponse.json(
          { ok: false, error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        ok: true,
        user: result.rows[0],
      });
    }
  } catch (error) {
    console.error('[admin/users/[id] PUT] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - Deactivate user (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await query(
      'UPDATE users SET is_active = false WHERE id = $1 RETURNING id',
      [parseInt(id)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'User deactivated successfully',
    });
  } catch (error) {
    console.error('[admin/users/[id] DELETE] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to deactivate user' },
      { status: 500 }
    );
  }
}
