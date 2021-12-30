  import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect'
import { shallow, mount } from 'enzyme';
import React from 'react';
import Join from '../join/index'

describe('Player page', () => {
    it('renders without crashing', () => {
      const { getByText } = render(<Join/>); 
      expect(getByText('Join Rescue Orion')).toBeInTheDocument();
      expect(getByText('Lobby Code')).toBeInTheDocument();
      expect(getByText('Crew Name')).toBeInTheDocument();
    });

    it('should display error message when Lobby Code and Crew Name are empty', () => {
        const { getByText } = render(<Join/>); 
        fireEvent.click(screen.getByText('Join'));
        expect(getByText('Lobby code and crew name must not be empty.')).toBeInTheDocument();
    });
});