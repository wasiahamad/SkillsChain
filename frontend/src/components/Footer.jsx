import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
    return (
        <Box component="footer" className="bg-gray-800 text-white py-8 mt-auto">
            <Box className="container mx-auto px-4">
                <Box className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Box>
                        <Typography variant="h6" className="mb-4">
                            SkillChain
                        </Typography>
                        <Typography variant="body2" className="text-gray-400">
                            Verifying skills with blockchain technology for a more trustworthy future.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" className="mb-4">
                            Quick Links
                        </Typography>
                        <Box className="flex flex-col space-y-2">
                            <Link href="#" color="inherit" className="text-gray-400 hover:text-white">
                                Home
                            </Link>
                            <Link href="#" color="inherit" className="text-gray-400 hover:text-white">
                                About
                            </Link>
                            <Link href="#" color="inherit" className="text-gray-400 hover:text-white">
                                Contact
                            </Link>
                            <Link href="#" color="inherit" className="text-gray-400 hover:text-white">
                                Privacy Policy
                            </Link>
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="h6" className="mb-4">
                            Contact Us
                        </Typography>
                        <Typography variant="body2" className="text-gray-400">
                            Email: info@skillchain.com
                        </Typography>
                        <Typography variant="body2" className="text-gray-400">
                            Phone: +1 (555) 123-4567
                        </Typography>
                    </Box>
                </Box>

                <Box className="border-t border-gray-700 mt-8 pt-6 text-center">
                    <Typography variant="body2" className="text-gray-400">
                        © {new Date().getFullYear()} SkillChain. All rights reserved.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Footer;