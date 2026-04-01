import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnalysisResult from './AnalysisResult.jsx';

const DISCLAIMER =
  'This tool is for self-reflection only and is not a substitute for support from a qualified mental health professional.';

const result = {
  distortions: [
    {
      id: 'all-or-nothing',
      name: 'All-or-Nothing Thinking',
      explanation: 'You are viewing this as a complete failure.',
      severity: 'primary',
    },
    {
      id: 'overgeneralization',
      name: 'Overgeneralization',
      explanation: 'One event is being treated as a permanent pattern.',
      severity: 'secondary',
    },
  ],
  reframe: 'Try to look for evidence that contradicts this belief.',
  disclaimer: DISCLAIMER,
};

describe('AnalysisResult', () => {
  it('renders nothing when result is null', () => {
    const { container } = render(<AnalysisResult result={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders all detected distortion names', () => {
    render(<AnalysisResult result={result} />);
    expect(screen.getByText('All-or-Nothing Thinking')).toBeInTheDocument();
    expect(screen.getByText('Overgeneralization')).toBeInTheDocument();
  });

  it('renders the reframe text', () => {
    render(<AnalysisResult result={result} />);
    expect(
      screen.getByText('Try to look for evidence that contradicts this belief.')
    ).toBeInTheDocument();
  });

  it('renders the disclaimer', () => {
    render(<AnalysisResult result={result} />);
    expect(screen.getByText(DISCLAIMER)).toBeInTheDocument();
  });

  it('shows a no-distortions message when the array is empty', () => {
    render(<AnalysisResult result={{ ...result, distortions: [] }} />);
    expect(
      screen.getByText(/no strong cognitive distortions detected/i)
    ).toBeInTheDocument();
  });
});
