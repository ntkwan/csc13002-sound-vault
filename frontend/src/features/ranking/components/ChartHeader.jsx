function ChartHeader() {
    return (
        <div className="mx-auto mb-20 flex max-w-7xl items-center gap-8 pt-28">
            <p className="hidden flex-1 font-bold xl:flex">
                SoundVault Chart is a dynamic music ranking chart based on the
                number of listeners. It tracks the most popular songs across
                various genres, reflecting real-time listening habits and trends
            </p>
            <div className="flex flex-col">
                <h1 className="heading-stroke font-italianno text-9xl">
                    SoundVault Chart
                </h1>
                <p className="-ml-4 -mt-6 text-end text-lg font-medium">
                    Chart dated May 19, 2024
                </p>
            </div>
        </div>
    );
}

export default ChartHeader;
