import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Person as PersonIcon,
    Build as ToolsIcon,
    Work as WorkIcon,
    Description as FileIcon,
    Verified as CertificateIcon,
    ChevronLeft as ChevronLeftIcon,
    Business as BusinessIcon,
    PostAdd as PostAddIcon,
    Assignment as AssignmentIcon,
    // Award as AwardIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = ({ isOpen, onClose, user }) => {
    const navigate = useNavigate();
    const { jobId } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { logout } = useAuth();

    const userMenuItems = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon />,
            path: '/dashboard'
        },
        {
            text: 'Profile',
            icon: <PersonIcon />,
            path: '/profile'
        },
        {
            text: 'Skills',
            icon: <ToolsIcon />,
            path: '/skills'
        },
        {
            text: 'Jobs',
            icon: <WorkIcon />,
            path: '/jobs'
        },
        {
            text: 'Applications',
            icon: <FileIcon />,
            path: '/applications'
        },
        {
            text: 'Certificates',
            icon: <CertificateIcon />,
            path: '/certificates'
        },
    ];

    const employerMenuItems = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon />,
            path: '/employer/dashboard'
        },
        {
            text: 'Profile',
            icon: <PersonIcon />,
            path: '/employer/profile'
        },
        {
            text: 'Post Job',
            icon: <PostAddIcon />,
            path: '/employer/jobs/new'
        },
        {
            text: 'Jobs',
            icon: <WorkIcon />,
            path: '/employer/jobs'
        },
        {
            text: 'Applications',
            icon: <AssignmentIcon />,
            path: '/employer/applications'
        },
        {
            text: 'Issue Certificate',
            // icon: <AwardIcon />,
            path: '/employer/certificates/issue'
        },
    ];

    const menuItems = user?.role === "employer" ? employerMenuItems : userMenuItems;

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) {
            onClose();
        }
    };

    const drawer = (
        <Box>
            <Toolbar>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold'
                        }}
                    >
                        {user?.role === "employer" ? user?.employerName?.charAt(0) : user?.name?.charAt(0)}

                    </Box>
                    <Box>
                        <Typography variant="h6" component="div">
                            {user?.role === "employer" ? user?.employerName : user?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user?.role === "employer" ? "Employer" : "User"}
                        </Typography>
                    </Box>
                </Box>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                                borderRadius: 1,
                                mx: 1,
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: 'primary.main',
                                    minWidth: 40,
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontWeight: 500,
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={isOpen && isMobile}
                onClose={onClose}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        bgcolor: 'background.default',
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        bgcolor: 'background.default',
                        borderRight: `1px solid ${theme.palette.divider}`,
                        top: 64,
                        height: 'calc(100% - 64px)',
                    },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Sidebar;