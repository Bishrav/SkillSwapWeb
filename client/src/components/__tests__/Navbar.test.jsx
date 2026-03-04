import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../Navbar';

// Mock ThemeToggle because it might depend on context we haven't set up fully here
vi.mock('../ThemeToggle', () => ({
    default: () => <div data-testid="theme-toggle">ThemeToggle</div>
}));

describe('Navbar Component', () => {
    const setAuthMock = vi.fn();

    const renderNavbar = () => {
        return render(
            <BrowserRouter>
                <Navbar setAuth={setAuthMock} />
            </BrowserRouter>
        );
    };

    it('renders logo and basic links', () => {
        renderNavbar();
        expect(screen.getByText('SkillSwap')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('toggles mobile menu when clicked', () => {
        renderNavbar();
        const menuButton = screen.getByRole('button', { name: /open main menu/i });
        fireEvent.click(menuButton);

        // Mobile menu items should now be visible
        // Since we are using Lucide icons and hidden/block classes, 
        // they might always be in DOM depending on implementation.
        // But the mobile menu div is conditional: {isOpen && (...)}
        expect(screen.getByText('Post Skill')).toBeInTheDocument();
    });

    it('calls setAuth and removes token on logout', () => {
        // Mock localStorage
        const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

        renderNavbar();

        // Find logout button (there might be two, desktop and mobile)
        const logoutButtons = screen.getAllByText(/Logout/i);
        fireEvent.click(logoutButtons[0]);

        expect(removeItemSpy).toHaveBeenCalledWith('token');
        expect(setAuthMock).toHaveBeenCalledWith(false);
    });
});
