import PropTypes from 'prop-types';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    selectCurrentAdmin,
    selectCurrentProfile,
    selectCurrentToken,
} from '@services/selectors';

Protected.propTypes = {
    roles: PropTypes.string,
};

function Protected({ roles }) {
    const token = useSelector(selectCurrentToken);
    const isAdmin = useSelector(selectCurrentAdmin);
    const { isVerified } = useSelector(selectCurrentProfile);
    if ((roles === 'guest' || roles.includes('user')) && isAdmin)
        return (
            <Navigate to="/admin/dashboard" from={{ from: location }} replace />
        );
    if (roles.includes('user') && !token)
        return <Navigate to="/" from={{ from: location }} replace />;
    if (roles === 'admin' && (!token || !isAdmin))
        return <Navigate to="/" from={{ from: location }} replace />;
    if (roles === 'artist' && !isVerified)
        return <Navigate to="/" from={{ from: location }} replace />;
    if (roles === 'user only' && isVerified)
        return <Navigate to="/" from={{ from: location }} replace />;
    return <Outlet />;
}

export default Protected;
