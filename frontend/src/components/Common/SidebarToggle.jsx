import React from 'react';
import { Fab, useScrollTrigger, Zoom } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

const SidebarToggle = ({ onClick, isOpen }) => {
    const trigger = useScrollTrigger({
        threshold: 100,
        disableHysteresis: true,
    });

    return (
        <Zoom in={trigger}>
            <Fab
                color="primary"
                aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
                onClick={onClick}
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    left: 20,
                    zIndex: 1000,
                    display: { md: 'none' },
                }}
            >
                <MenuIcon />
            </Fab>
        </Zoom>
    );
};

export default SidebarToggle;