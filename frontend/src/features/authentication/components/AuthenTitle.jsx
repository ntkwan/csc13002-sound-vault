import PropTypes from 'prop-types';

AuthenTitle.propTypes = {
    title: PropTypes.string.isRequired,
};

function AuthenTitle({ title }) {
    return (
        <div>
            <h1 className="mb-4 cursor-default select-none text-center font-italianno text-[55px] font-light leading-[45px] text-[#fcfcfc]">
                {title}
            </h1>
        </div>
    );
}

export default AuthenTitle;
