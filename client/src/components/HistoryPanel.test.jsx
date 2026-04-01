import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HistoryPanel from './HistoryPanel.jsx';

const entries = [
  { id: 1, thought: 'I always mess everything up.', result: {} },
  { id: 2, thought: 'Nobody likes me.', result: {} },
];

describe('HistoryPanel', () => {
  it('renders the History heading', () => {
    render(<HistoryPanel entries={[]} onSelect={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByText(/History/)).toBeInTheDocument();
  });

  it('shows empty state when there are no entries', () => {
    render(<HistoryPanel entries={[]} onSelect={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByText('No history yet.')).toBeInTheDocument();
  });

  it('renders a button for each history entry', () => {
    render(<HistoryPanel entries={entries} onSelect={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByText('I always mess everything up.')).toBeInTheDocument();
    expect(screen.getByText('Nobody likes me.')).toBeInTheDocument();
  });

  it('calls onSelect with the entry when clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<HistoryPanel entries={entries} onSelect={onSelect} onClear={vi.fn()} />);
    await user.click(screen.getByText('I always mess everything up.'));
    expect(onSelect).toHaveBeenCalledWith(entries[0]);
  });

  it('calls onClear when the clear button is clicked', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<HistoryPanel entries={entries} onSelect={vi.fn()} onClear={onClear} />);
    await user.click(screen.getByText('Clear'));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('hides entries when the toggle is clicked', async () => {
    const user = userEvent.setup();
    render(<HistoryPanel entries={entries} onSelect={vi.fn()} onClear={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /History/ }));
    expect(screen.queryByText('I always mess everything up.')).not.toBeInTheDocument();
  });

  it('does not show the clear button when entries are empty', () => {
    render(<HistoryPanel entries={[]} onSelect={vi.fn()} onClear={vi.fn()} />);
    expect(screen.queryByText('Clear')).not.toBeInTheDocument();
  });
});
