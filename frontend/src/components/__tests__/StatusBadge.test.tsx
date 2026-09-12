import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusBadge } from '../StatusBadge';

describe('StatusBadge', () => {
  it('renders status correctly', () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders study group correctly', () => {
    render(<StatusBadge studyGroup="treatment" />);
    expect(screen.getByText('treatment')).toBeInTheDocument();
  });

  it('renders gender correctly', () => {
    render(<StatusBadge gender="F" />);
    expect(screen.getByText('F')).toBeInTheDocument();
  });
});
