import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {Link} from "react-router-dom";
import {useContext, useState} from "react";
import {logout} from "../utils/Utils";
import {ExitToApp, Person, Settings} from "@mui/icons-material";
import {UserContext} from "../RootLayout";
import {ListItemIcon} from "@mui/material";

const pages = [
    {to: '/', text: 'Main'},
    {to: '/projects/create', text: 'Create'},
];

const profileMenuItems = [
    { label: 'Profile', icon: <Person />, link: '/users/me' },
    // { label: 'Settings', icon: <Settings />, link: '/users/me/settings' },
    { label: 'Logout', icon: <ExitToApp />, onClick: logout }
];

function CustomNavigation() {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const { userData } = useContext(UserContext);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            textDecoration: 'none',
                            color: 'inherit'
                        }}
                    >
                        FigSter
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'compact', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Link key={page.text} to={page.to}>
                                <Button>
                                    {page.text}
                                </Button>
                            </Link>
                        ))}
                    </Box>
                    { userData ?
                        (
                            <>
                                <Box sx={{ flexGrow: 0 }}>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar alt="NN" src={userData.avatar} />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        {profileMenuItems.map((item, index) => (
                                            <MenuItem
                                                key={index}
                                                component={item.link ? Link : 'div'}
                                                to={item.link || undefined}
                                                onClick={async () => {
                                                    if (item.onClick) await item.onClick();
                                                    handleCloseUserMenu();
                                                }}
                                                style={{ textDecoration: 'none', color: 'inherit' }}
                                            >
                                                <ListItemIcon>
                                                    {item.icon}
                                                </ListItemIcon>
                                                <Typography>
                                                    {item.label}
                                                </Typography>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>
                            </>
                        ) : (
                            <Link to="/auth/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Button>
                                    Sign in
                                </Button>
                            </Link>
                        )
                    }
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default CustomNavigation;
