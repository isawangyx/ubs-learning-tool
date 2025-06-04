import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SignUp } from './Signup';

test('renders Sign Up header', () => {
  render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>
  );

  const heading = screen.getByRole('heading', { name: /sign up/i });
  expect(heading).toBeInTheDocument();
});
