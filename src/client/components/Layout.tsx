import {
  ReactElement,
  useEffect,
  useState,
  createContext,
  MouseEvent,
} from 'react';
import { useLazyQuery } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  CircularProgress,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { REFRESH_TOKEN } from '../graphql/auth';

interface LayoutProps {
  children: ReactElement;
}

interface UserType {
  id?: number;
  name?: string;
  role?: string;
}

export const AuthProvider = createContext<UserType>({});

const Layout = (props: LayoutProps) => {
  const [currentUser, setCurrentUser] = useState<UserType>({});
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [refreshToken, { loading, error, data }] = useLazyQuery(REFRESH_TOKEN);
  const router = useRouter();
  const ProgressWrapper = styled('div')`
    display: flex;
    justify-content: center;
    margin-top: 50vh;
  `;

  useEffect(() => {
    refreshToken();
  }, []);
  useEffect(() => {
    if (data) {
      setCurrentUser({
        id: data.refreshToken.id,
        name: data.refreshToken.name,
        role: data.refreshToken.role,
      });
      if (['/login', '/register'].includes(router.pathname)) {
        location.href = '/';
      }
    }
    if (error) {
      localStorage.removeItem('todo_token');
      router.push('/login');
    }
  }, [data, error]);

  function handleLogout() {
    localStorage.removeItem('todo_token');
    location.href = '/login';
  }

  function handleOpenUserMenu(event: MouseEvent<HTMLElement>) {
    setAnchorElUser(event.currentTarget);
  }

  function handleCloseUserMenu() {
    setAnchorElUser(null);
  }

  return (
    <AuthProvider.Provider value={currentUser}>
      <Box sx={{ flexGrow: 1 }}>
        {loading || (!data && !error) ? (
          <ProgressWrapper>
            <CircularProgress color="secondary" />
          </ProgressWrapper>
        ) : (
          <>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Expense
                </Typography>
                {currentUser && typeof currentUser.name === 'undefined' ? (
                  <>
                    <Link href="/login">
                      <Button color="inherit">Login</Button>
                    </Link>
                    <Link href="/register">
                      <Button color="inherit">Register</Button>
                    </Link>
                  </>
                ) : (
                  <Box sx={{ flexGrow: 0 }}>
                    {currentUser.role === 'admin' && (
                      <Link href="/user">
                        <Button color="inherit" sx={{ mr: 2 }}>
                          User
                        </Button>
                      </Link>
                    )}
                    <Link href="/todo">
                      <Button color="inherit" sx={{ mr: 2 }}>
                        Todo
                      </Button>
                    </Link>
                    <Tooltip title="Open settings">
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar alt={currentUser.name} />
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
                      <MenuItem onClick={handleLogout}>
                        <Typography textAlign="center">Logout</Typography>
                      </MenuItem>
                    </Menu>
                  </Box>
                )}
              </Toolbar>
            </AppBar>
            <Container maxWidth="lg">{props.children}</Container>
          </>
        )}
      </Box>
    </AuthProvider.Provider>
  );
};

export default Layout;
