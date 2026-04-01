import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThoughtInput from './ThoughtInput.jsx';

describe('ThoughtInput', () => {
  it('renders a textarea and submit button', () => {
    render(<ThoughtInput onSubmit={vi.fn()} loading={false} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Analyze' })).toBeInTheDocument();
  });

  it('submit button is disabled when textarea is empty', () => {
    render(<ThoughtInput onSubmit={vi.fn()} loading={false} />);
    expect(screen.getByRole('button', { name: 'Analyze' })).toBeDisabled();
  });

  it('submit button is enabled once the user types', async () => {
    const user = userEvent.setup();
    render(<ThoughtInput onSubmit={vi.fn()} loading={false} />);
    await user.type(screen.getByRole('textbox'), 'I always fail');
    expect(screen.getByRole('button', { name: 'Analyze' })).toBeEnabled();
  });

  it('calls onSubmit with the trimmed thought on submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ThoughtInput onSubmit={onSubmit} loading={false} />);
    await user.type(screen.getByRole('textbox'), '  I always fail  ');
    await user.click(screen.getByRole('button', { name: 'Analyze' }));
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledWith('I always fail');
  });

  it('does not call onSubmit when thought is only whitespace', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ThoughtInput onSubmit={onSubmit} loading={false} />);
    await user.type(screen.getByRole('textbox'), '   ');
    await user.click(screen.getByRole('button', { name: 'Analyze' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('disables textarea and button when loading', () => {
    render(<ThoughtInput onSubmit={vi.fn()} loading={true} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows "Analyzing…" label when loading', () => {
    render(<ThoughtInput onSubmit={vi.fn()} loading={true} />);
    expect(screen.getByRole('button', { name: 'Analyzing…' })).toBeInTheDocument();
  });
});
