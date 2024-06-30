import PropTypes from 'prop-types';

PageTitle.propTypes = {
    title: PropTypes.string.isRequired,
    className: PropTypes.string,
};

function PageTitle({ title, className }) {
    return (
        <h1
            className={`page-title heading-stroke font-italianno text-[120px] ${className}`}
        >
            {title}
        </h1>
    );
}

export default PageTitle;
