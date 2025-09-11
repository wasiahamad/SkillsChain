import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#4f46e5',
            dark: '#4338ca',
            contrastText: '#fff',
        },
        secondary: {
            main: '#7c3aed',
            contrastText: '#fff',
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        },
        text: {
            primary: '#1f2937',
            secondary: '#4b5563',
        },
        divider: '#e5e7eb',
    },
    typography: {
        fontFamily: '"Inter", sans-serif',
        fontSize: 14,
        h6: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: '1px solid #e5e7eb',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    margin: '2px 8px',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: '#4f46e5',
                    minWidth: 40,
                },
            },
        },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    fontWeight: 500,
                },
            },
        },
    },
});

export default theme;