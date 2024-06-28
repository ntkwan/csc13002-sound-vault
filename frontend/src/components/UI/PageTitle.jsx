function PageTitle({ title, className }) {
    return (
        <h1 className={`page-title text-[120px] heading-stroke font-italianno ${className}`}>
            {title}
        </h1>
    );
}

export default PageTitle;