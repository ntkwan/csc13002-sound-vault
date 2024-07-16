import PropTypes from 'prop-types';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentAdmin, selectCurrentToken } from '@services/selectors';

Protected.propTypes = {
    roles: PropTypes.string,
};

function Protected({ roles }) {
    const token = useSelector(selectCurrentToken);
    const isAdmin = useSelector(selectCurrentAdmin);
    if ((roles === 'guess' || roles === 'user') && isAdmin)
        return <Navigate to="/admin/user" from={{ from: location }} replace />;
    if (roles === 'user' && !token)
        return <Navigate to="/" from={{ from: location }} replace />;
    if (roles === 'admin' && (!token || !isAdmin))
        return <Navigate to="/" from={{ from: location }} replace />;
    return <Outlet />;
}

export default Protected;
