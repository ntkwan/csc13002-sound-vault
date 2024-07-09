import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '@services/selectors';

function Protected() {
    const token = useSelector(selectCurrentToken);
    return token ? (
        <Outlet />
    ) : (
        <Navigate to="/" from={{ from: location }} replace></Navigate>
    );
}

export default Protected;
