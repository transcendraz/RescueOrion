import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect'

import React from 'react';
import Landing from '../Landing';

describe('landing page', () => {
  it('should render landing page', () => {
    const { getByText } = render(<Landing />);
    expect(getByText('Welcome to Rescue Orion')).toBeInTheDocument();
    expect(getByText('Admin')).toBeInTheDocument();
    expect(getByText('Player')).toBeInTheDocument();
  });
})