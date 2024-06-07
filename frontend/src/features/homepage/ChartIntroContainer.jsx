function ChartIntroContainer() {
	const songs = {
		src: "./src/assets/img/song/",
		data: [
			{
				ext: 'jpg',
				name: "Chúng ta của hiện tại",
				artist: "Sơn Tùng MTP"
			},
			{
				ext: 'png',
				name: "Nếu lúc đó",
				artist: "tlinh"
			},
			{
				ext: 'png',
				name: "Lover",
				artist: "Taylor Swift"
			},
			{
				ext: 'png',
				name: "Hit me up",
				artist: "Binz"
			}
		]
	};

	const { src, data } = songs;

	return (
		<div>
			{/* Intro chart */}
			<div className="flex-[1] grid grid-rows-2 grid-cols-[auto_auto] gap-20 relative  text-sm">
				{data.map((song, index) => {
					const { ext, name, artist } = song;
					// song container
					return (
						<div key={index} className="song__container relative w-[200px] h-[210px]">
							<div className="song__frame absolute top-5 w-[90%] h-full border-l-[1px] border-b-[1px] border-white
                              before:content-[''] before:absolute before:bg-white before:top-0 before:left-0 before:w-3 before:h-px
                            	after:content-[''] after:absolute after:bg-white after:bottom-0 after:right-0 after:w-px after:h-10">
							</div>
							<div className="song__info absolute flex flex-col left-5 w-44 h-[110%] space-y-1">
								<img className="w-full aspect-square" src={`${src}${name}.${ext}`} alt="" />
								<span className="w-[155px] whitespace-nowrap overflow-hidden text-ellipsis">{name}</span>
								<div className="flex items-center space-x-2">
									<img src="src/assets/img/artist-icon.svg" alt="song icon" />
									<span className="w-[135px] whitespace-nowrap overflow-hidden text-ellipsis">{artist}</span>
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	);
}

export default ChartIntroContainer;