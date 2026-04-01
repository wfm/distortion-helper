import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DistortionCard from './DistortionCard.jsx';

const referenceDistortion = {
  id: 'all-or-nothing',
  name: 'All-or-Nothing Thinking',
  shortDescription: 'Seeing things in black and white.',
  example: '"I failed once, so I always fail."',
  reframeTechnique: 'Examine the Evidence',
};

const resultDistortion = {
  id: 'all-or-nothing',
  name: 'All-or-Nothing Thinking',
  explanation: 'You are framing this as a total failure.',
  severity: 'primary',
};

describe('DistortionCard', () => {
  it('renders the distortion name in reference mode', () => {
    render(<DistortionCard distortion={referenceDistortion} mode="reference" />);
    expect(screen.getByText('All-or-Nothing Thinking')).toBeInTheDocument();
  });

  it('renders shortDescription, example, and reframeTechnique in reference mode', () => {
    render(<DistortionCard distortion={referenceDistortion} mode="reference" />);
    expect(screen.getByText('Seeing things in black and white.')).toBeInTheDocument();
    expect(screen.getByText('"I failed once, so I always fail."')).toBeInTheDocument();
    expect(screen.getByText(/Examine the Evidence/)).toBeInTheDocument();
  });

  it('renders the distortion name in result mode', () => {
    render(<DistortionCard distortion={resultDistortion} mode="result" />);
    expect(screen.getByText('All-or-Nothing Thinking')).toBeInTheDocument();
  });

  it('renders explanation in result mode', () => {
    render(<DistortionCard distortion={resultDistortion} mode="result" />);
    expect(screen.getByText('You are framing this as a total failure.')).toBeInTheDocument();
  });

  it('renders a primary severity badge in result mode', () => {
    render(<DistortionCard distortion={resultDistortion} mode="result" />);
    expect(screen.getByText('primary')).toBeInTheDocument();
  });

  it('renders a secondary severity badge in result mode', () => {
    render(<DistortionCard distortion={{ ...resultDistortion, severity: 'secondary' }} mode="result" />);
    expect(screen.getByText('secondary')).toBeInTheDocument();
  });

  it('does not render severity badge in reference mode', () => {
    render(<DistortionCard distortion={referenceDistortion} mode="reference" />);
    expect(screen.queryByText('primary')).not.toBeInTheDocument();
    expect(screen.queryByText('secondary')).not.toBeInTheDocument();
  });
});
