import PropTypes from 'prop-types';

AuthenTitle.propTypes = {
    title: PropTypes.string.isRequired,
};

function AuthenTitle({ title }) {
    return (
        <div>
            <h1 className="text-center text-[55px] text-[#fcfcfc] font-italianno font-light mb-4 leading-[45px] cursor-default select-none">
                {title}
            </h1>
        </div>
    );
}

export default AuthenTitle;