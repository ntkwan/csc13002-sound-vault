import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import {
    selectCurrentGlobalLoading,
    selectCurrentToken,
} from '@services/selectors';
import { Loading } from '@components/index';

function AuthenticationLayout() {
    const token = useSelector(selectCurrentToken);
    const isGlobalLoading = useSelector(selectCurrentGlobalLoading);
    return token ? (
        <Navigate to="/" from={{ from: location }} replace></Navigate>
    ) : (
        <main>{isGlobalLoading ? <Loading /> : <Outlet />}</main>
    );
}

export default AuthenticationLayout;
